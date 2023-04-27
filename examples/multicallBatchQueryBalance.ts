import { ChainNetwork } from "../src/class/ChainNetwork"
import { CurrencyErc20, CurrencyNative } from "../src/class/Currency"
import { ZERO_ADDRESS } from "../src/constants"
import { SupportChain } from "../src/web3"

const runMulticallBatchQueryBalance = async () => {
    const eth = new CurrencyNative(new ChainNetwork(SupportChain.Goerli))
    const usdt = new CurrencyErc20(new ChainNetwork(SupportChain.Ethereum), '0xdac17f958d2ee523a2206206994597c13d831ec7')
    const addresses = ['0x88888888B0A018D28947b7FbDe08E0B408de9f70', '0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696', '0xB753548F6E010e7e680BA186F9Ca1BdAB2E90cf2', ZERO_ADDRESS]

    const ethBalances = await eth.batchQueryBalance(addresses)
    const usdtBalances = await usdt.batchQueryBalance(addresses)

    console.log(ethBalances)
    console.log(usdtBalances)
}

runMulticallBatchQueryBalance()