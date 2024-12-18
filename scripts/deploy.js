const hre = require("hardhat");

async function main () {
    const ERC20Staking = await hre.ethers.getContractFactory("ERC20Staking");

    const tokenAddress = '0x03A546D824a533999b5a883f3666A791B66fe587';

    const staking = await ERC20Staking.deploy(tokenAddress);

    // await staking.deployed();

    console.log("ERC20Staking deployed to:", staking.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });