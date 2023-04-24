import invariant from "tiny-invariant"
import { ChainNetwork } from "../src/class/ChainNetwork"
import { CurrencyErc20 } from "../src/class/Currency"
import { Multicall } from "../src/class/Multicall"
import { SupportChain, ZERO_ADDRESS } from "../src/web3"
import { Web3Checker } from "../src/class/Checker"

const runMulticall = async () => {
    const ethereum = new ChainNetwork(SupportChain.Ethereum)
    // const multicall = new Multicall(ethereum, multicallAddress[SupportChain.Ethereum])
    const multicall = new Multicall(ethereum, '0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696')

    const ethereumUsdtAddress = '0xdAC17F958D2ee523a2206206994597C13D831ec7'
    invariant(Web3Checker.isAddress(ethereumUsdtAddress), `should received a address`)
    const usdt = new CurrencyErc20(ethereum, ethereumUsdtAddress)
    await usdt.initialize()

    console.log(usdt.name)
    console.log(usdt.symbol)
    console.log(usdt.decimals)
    const [_blockNumber, decodedResults] = await multicall.call([
        [ethereumUsdtAddress, usdt.contract.interface.encodeFunctionData('name')],
        [ethereumUsdtAddress, usdt.contract.interface.encodeFunctionData('totalSupply')],
        [ethereumUsdtAddress, usdt.contract.interface.encodeFunctionData('balanceOf', [ZERO_ADDRESS])],
    ])

    // const name = usdt.contract.interface.decodeFunctionResult('name', decodedResults[0]).toString()
    // const totalSupply = usdt.contract.interface.decodeFunctionResult('totalSupply', decodedResults[1]).toString()
    // const balance = usdt.contract.interface.decodeFunctionResult('balanceOf', decodedResults[2]).toString()
    const [name, totalSupply, balance] = Multicall.decode(decodedResults, [
        [usdt.contract, 'name'],
        [usdt.contract, 'totalSupply'],
        [usdt.contract, 'balanceOf'],
    ])

    console.log(totalSupply, name, balance)
}

runMulticall()