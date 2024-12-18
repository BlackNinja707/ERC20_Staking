const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("ERC20Staking Contract", function () {
  let staking, token;
  let owner, signer, account0;
  let amount, reward;
  const initialRewards = ethers.parseEther("80000000"); // 80 million tokens

  beforeEach(async function () {
    // Get signers
    [owner, signer, account0] = await ethers.getSigners();
    console.log('----------owner----------', account0.address)
    // Deploy the actual ERC20 Token contract
    const Token = await ethers.getContractFactory("Token"); // Replace this with your real ERC20 contract
    token = await Token.deploy("StakingToken", "ST", initialRewards);
    await token.waitForDeployment();
    const tokenAddress = await token.getAddress();
    // console.log("---------tokenAddress---------",tokenAddress);

    // Deploy the ERC20Staking contract
    const Staking = await ethers.getContractFactory("ERC20Staking");
    staking = await Staking.deploy(tokenAddress);
    await staking.waitForDeployment();
    stakingAddress = await staking.getAddress(); 
    // console.log("----------stakingAddress-----------",stakingAddress);

    // Transfer the initial rewards to the staking contract
    await token.transfer(stakingAddress, initialRewards);

    // Define staking amount
    amount = ethers.parseEther("1000"); // 1,000 tokens
    reward = ethers.parseEther("10"); // 10 tokens reward (for testing)
    
    // Approve tokens for staking
    await token.approve(stakingAddress, amount);
  });

  it("should have a token", async function () {
    // console.log("---------tokenAddress---------",await token.getAddress());
    expect(await staking.token()).to.eq(await token.getAddress());
  });

  it("should have 0 staked", async function () {
    expect(await staking.totalStaked()).to.eq(0);
  });

  it("should have 80,000,000 rewards", async function () {
    expect(await staking.totalRewards()).to.eq(initialRewards);
  });

  it("should have 0.01% rewards per hour", async function () {
    expect(await staking.rewardsPerHour()).to.eq(1000);
  });

  it("should transfer deposit amount", async function () {
    await expect(staking.deposit(amount)).to.changeTokenBalances(token, 
      [signer, staking], 
      [amount-1, amount]
    );
  });

  // it("should increment balance by deposit amount", async function () {
  //   const balance = await staking.balanceOf(signer.address);
  //   await staking.deposit(amount);
  //   expect(await staking.balanceOf(signer.address)).to.eq(balance.add(amount));
  // });

  // it("should have lastUpdated equal to the latest block timestamp", async function () {
  //   await staking.deposit(amount);
  //   const latest = await time.latest();
  //   expect(await staking.lastUpdated(signer.address)).to.eq(latest);
  // });

  // it("should increment the total staked by deposit amount", async function () {
  //   const totalStaked = await staking.totalStaked();
  //   await staking.deposit(amount);
  //   expect(await staking.totalStaked()).to.eq(totalStaked.add(amount));
  // });

  // it("should emit Deposit event", async function () {
  //   await expect(staking.deposit(amount)).to.emit(staking, "Deposit").withArgs(
  //     signer.address, amount
  //   );
  // });

  // it("should calculate 10 rewards after one hour", async function () {
  //   await staking.deposit(amount);
  //   await time.increase(60 * 60); // Increase time by 1 hour
  //   expect(await staking.rewards(signer.address)).to.eq(ethers.parseEther("10"));
  // });

  // it("should calculate 1/36 rewards after one second", async function () {
  //   await staking.deposit(amount);
  //   await time.increase(1); // Increase time by 1 second
  //   expect(await staking.rewards(signer.address)).to.eq(amount.div(1000).div(3600));
  // });

  // it("should calculate 0.1 reward after 36 seconds", async function () {
  //   await staking.deposit(amount);
  //   await time.increase(36); // Increase time by 36 seconds
  //   expect(await staking.rewards(signer.address)).to.eq(ethers.parseEther("0.1"));
  // });

  // it("should revert if trying to withdraw more than balance", async function () {
  //   await staking.deposit(amount);
  //   await expect(staking.withdraw(amount.add(1))).to.be.revertedWith("Insufficient funds");
  // });

  // it("should emit Withdraw event", async function () {
  //   await staking.deposit(amount);
  //   await expect(staking.withdraw(amount)).to.emit(staking, "Withdraw").withArgs(
  //     signer.address, amount
  //   );
  // });

  // it("should update lastUpdated on claim", async function () {
  //   await staking.deposit(amount);
  //   await time.increase(60 * 60); // 1 hour later
  //   await staking.claim();
  //   const timestamp = await time.latest();
  //   expect(await staking.lastUpdated(signer.address)).to.eq(timestamp);
  // });

  // it("should emit Claim event", async function () {
  //   await staking.deposit(amount);
  //   await time.increase(60 * 60); // 1 hour later
  //   await expect(staking.claim()).to.emit(staking, "Claim").withArgs(
  //     signer.address, ethers.parseEther("10")
  //   );
  // });

  // it("should compound rewards", async function () {
  //   await staking.deposit(amount);
  //   await time.increase(60 * 60); // 1 hour later
  //   await staking.compound();
  //   const balance = await staking.balanceOf(signer.address);
  //   expect(balance).to.eq(amount.add(reward));
  // });

  // it("should emit Compound event", async function () {
  //   await staking.deposit(amount);
  //   await time.increase(60 * 60); // 1 hour later
  //   await expect(staking.compound()).to.emit(staking, "Compound").withArgs(
  //     signer.address, ethers.parseEther("10")
  //   );
  // });
});