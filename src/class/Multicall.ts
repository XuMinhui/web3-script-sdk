import { BigNumber, ethers } from "ethers";
import { SupportChain } from "../web3";
import { Multicall__factory } from "../web3/types";
import { ChainState } from "./ChainState";
import { number } from "joi";
import { bn_fromWei, bn_parseWei } from "../utils";
import invariant from "tiny-invariant";

type MulticallCallsFragmentInterface = ([string, string] | { target: string, callData: string })[]

export class Multicall {
    static readonly multicallInterface = Multicall__factory.createInterface()
    public readonly multicallAddr: string
    public readonly multicall: ethers.Contract
    public readonly provider: ethers.providers.Provider

    constructor(chainState: ChainState, multicallAddr: string) {
        this.multicallAddr = multicallAddr
        this.provider = chainState.provider
        this.multicall = Multicall__factory.connect(multicallAddr, this.provider)
    }


    async call(calls: MulticallCallsFragmentInterface): Promise<[BigNumber, string[]]> {
        const multicallData = Multicall.encodeFunctionData(calls)
        const results = await this.provider.call({
            to: this.multicallAddr,
            data: multicallData,
        })

        const [_blockNumber, decodedResults] = Multicall.multicallInterface.decodeFunctionResult('aggregate', results)
        return [_blockNumber, decodedResults]
    }

    static decode(decodedResults: string[], serializtions: [ethers.Contract, string, ('string' | 'number' | 'boolean')?, number?][]) {
        invariant(decodedResults.length >= serializtions.length, `decodedResults length must then serializtions length`)
        const results = serializtions.map((serializtion, index) => {
            const [contract, method, format, decimals] = serializtion
            const data = contract.interface.decodeFunctionResult(method, decodedResults[index]).toString()
            switch (format) {
                case 'number':
                    return decimals ? bn_fromWei(data, decimals) : Number(data)
                case 'boolean':
                    return Boolean(data)
                default:
                    return decimals ? bn_parseWei(data, decimals) : data
            }
        })

        return results
    }

    static encodeFunctionData(calls: MulticallCallsFragmentInterface) {
        if (Array.isArray(calls[0])) {
            calls = (calls as [string, string][]).map((call) => {
                return { target: call[0], callData: call[1] }
            })
        }
        return Multicall.multicallInterface.encodeFunctionData('aggregate', [calls as { target: string, callData: string }[]]);
    }
}