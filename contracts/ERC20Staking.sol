// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract ERC20Staking {
    using SafeERC20 for IERC20;

    IERC20 public immutable token;
    uint public immutable rewardsPerHour = 1000;
    uint public totalStaked = 0;

    constructor (IERC20 token_) {
        token = token_;
    }// 

    function totalRewards() external view returns (uint) {
        return _totalRewards();
    }
    function _totalRewards() internal view returns (uint) {
        return token.balanceOf(address(this)) - totalStaked;
    }

    mapping(address => uint) public balanceOf;
    mapping(address => uint) public lastUpdated;

    event Deposit(address address_, uint amount_);

    function deposit(uint amount_) external {
        _compound();
        token.safeTransferFrom(msg.sender, address(this), amount_);
        balanceOf[msg.sender] += amount_;
        lastUpdated[msg.sender] = block.timestamp;
        totalStaked += amount_;
        emit Deposit(msg.sender, amount_);
    }

    function rewards(address address_) external view returns (uint) {
        return _rewards(address_);
    }
    function _rewards(address address_) internal view returns (uint) {
        uint timeDiff = block.timestamp - lastUpdated[address_];
        return (timeDiff * balanceOf[address_] * rewardsPerHour) / 3600;
    }

    mapping(address => uint) public claimed;

    event Claim(address address_, uint amount_);

    function claim() external {
        uint amount = _rewards(msg.sender);
        token.safeTransfer(msg.sender, amount);
        claimed[msg.sender] += amount;
        lastUpdated[msg.sender] = block.timestamp;
    }

    event Compound(address address_, uint amount_);

    function compound() external {
        _compound();
    }

    function _compound() internal {
        uint amount = _rewards(msg.sender);
        claimed[msg.sender] += amount;
        balanceOf[msg.sender] += amount;
        totalStaked += amount;
        lastUpdated[msg.sender] = block.timestamp;
        emit Compound(msg.sender, amount);
    }

    event Withdraw(address address_, uint amount_);

    function withdraw(uint amount_) external {
        require(balanceOf[msg.sender] >= amount_, "Insufficient funds");
        _compound();
        token.safeTransfer(msg.sender, amount_);
        balanceOf[msg.sender] -= amount_;
        totalStaked -= amount_;
        emit Withdraw(msg.sender, amount_);
    }
}