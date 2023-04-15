import invariant from "tiny-invariant"
import { ChainState } from "../src/class/ChainState"
import { CurrencyErc20 } from "../src/class/Currency"
import { Multicall } from "../src/class/Multicall"
import { bn_fromWei } from "../src/utils"
import { SupportChain, ZERO_ADDRESS, multicallAddress } from "../src/web3"
import { Web3Checker } from "../src/class/Checker"

const runMulticall = async () => {
    const ethereum = new ChainState(SupportChain.Ethereum)
    const multicall = new Multicall(ethereum, multicallAddress[SupportChain.Ethereum])

    const ethereumUsdtAddress = '0xdAC17F958D2ee523a2206206994597C13D831ec7'
    invariant(Web3Checker.isAddress(ethereumUsdtAddress), `should received a address`)
    const usdt = new CurrencyErc20(SupportChain.Ethereum, ethereumUsdtAddress)
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
        [usdt.contract, 'totalSupply', 'number', usdt.decimals],
        [usdt.contract, 'balanceOf', 'number', usdt.decimals],
    ])

    console.log(totalSupply, name, balance)
}

runMulticall()