const { ethers } = require("hardhat")
const fs = require("fs")

const FRONT_END_ADDRESSES_FILE =
  "../hardhat-lottery-nextjs/constants/contractAddresses.json"
const FRONT_END_ABI_FILE = "../hardhat-lottery-nextjs/constants/abi.json"

module.exports = async function () {
  if (process.env.UPDATE_FRONT_END) {
    await updateContractAddresses()
    await updateAbi()
    console.log("Updated contract address and abi")
  }
}

async function updateAbi() {
  const raffle = await ethers.getContract("Raffle")
  fs.writeFileSync(
    FRONT_END_ABI_FILE,
    raffle.interface.format(ethers.utils.FormatTypes.json)
  )
}

async function updateContractAddresses() {
  const raffle = await ethers.getContract("Raffle")
  const chaindId = network.config.chainId.toString()
  const currentAddresses = JSON.parse(
    fs.readFileSync(FRONT_END_ADDRESSES_FILE, "utf8")
  )
  if (chaindId in currentAddresses) {
    if (!currentAddresses[chaindId].includes(raffle.address)) {
      currentAddresses[chaindId].push(raffle.address)
    }
  } else {
    currentAddresses[chaindId] = [raffle.address]
  }
  fs.writeFileSync(FRONT_END_ADDRESSES_FILE, JSON.stringify(currentAddresses))
}

module.exports.tags = ["all", "frontend"]
