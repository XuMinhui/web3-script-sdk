import { ethers } from "ethers";
import { ZERO_ADDRESS } from "../web3/constants";
import { SupportChainType } from "../web3";
import { Multicall__factory, UniversalErc20, UniversalErc20__factory } from "../web3/types";
import { ChainNetwork } from "./ChainNetwork";
import invariant from "tiny-invariant";
import { Multicall } from "./Multicall";
import { bn_fromWei } from "../utils";

type CurrencyType = 'Native' | 'Erc20'
/**
 * WEI is origin wei
 * AMOUNT is wrapper bn_parseWei(decimals)
 * SIGNUFICAN is forEmample 1,000,000
 */
type FormatType = 'WEI' | 'AMOUNT' | 'SIGNUFICAN'
class CurrencyBase {
    protected provider: ethers.providers.Provider
    readonly chainNetwork: ChainNetwork
    readonly chain: SupportChainType | 'OtherChain'
    readonly type: CurrencyType

    readonly address: string
    public name: string | undefined
    public symbol: string | undefined
    public decimals: number | undefined

    constructor(chainNetwork: ChainNetwork, type: CurrencyType, address: string, decimals?: number, symbol?: string, name?: string) {
        this.provider = chainNetwork.provider
        this.chainNetwork = chainNetwork
        this.chain = chainNetwork.chain
        this.type = type
        this.address = address
        this.decimals = decimals
        this.symbol = symbol
        this.name = name
    }

    public equals(other: CurrencyErc20): boolean {
        return this.chain === other.chain && this.address.toLowerCase() === other.address.toLowerCase()
    }
}

export class CurrencyNative extends CurrencyBase {
    constructor(chainNetwork: ChainNetwork) {
        const name = chainNetwork.state.nativeCurrency.name
        const symbol = chainNetwork.state.nativeCurrency.symbol
        const decimals = chainNetwork.state.nativeCurrency.decimals
        super(chainNetwork, 'Native', ZERO_ADDRESS, decimals, symbol, name)
    }

    async batchQueryBalance(addresses: string[], format: FormatType = 'WEI') {
        const multicall = this.chainNetwork.getMulticall()
        invariant(multicall, 'Multicall not supported/not configured for this chain')
        const muticallContract = Multicall__factory.connect(multicall.address, this.provider)

        const [_blockNumber, decodedResults] = await multicall.call(
            addresses.map(address => {
                return [multicall.address, muticallContract.interface.encodeFunctionData('getEthBalance', [address])]
            })
        )

        const balances: string[] = Multicall.decode(decodedResults, addresses.map(_ => [muticallContract, 'getEthBalance']))
        const results: Record<string, string | number> = {}
        addresses.forEach((address, index) => {
            results[address] = format === 'AMOUNT' ? bn_fromWei(balances[index]) : balances[index]
        })

        return results
    }
}

export class CurrencyErc20 extends CurrencyBase {
    public readonly contract: UniversalErc20

    constructor(chainNetwork: ChainNetwork, address: string, decimals?: number, symbol?: string, name?: string) {
        super(chainNetwork, 'Erc20', address, decimals, symbol, name)
        this.contract = UniversalErc20__factory.connect(address, this.provider)
    }

    async initialize(): Promise<this> {
        this.symbol = this.symbol || await this.contract.symbol()
        this.decimals = this.decimals || await this.contract.decimals()
        this.name = this.name || await this.contract.name()
        return this
    }

    async batchQueryBalance(addresses: string[], format: FormatType = 'WEI') {
        const multicall = this.chainNetwork.getMulticall()
        invariant(multicall, 'Multicall not supported/not configured for this chain')
        const tarErc20Contract = UniversalErc20__factory.connect(this.address, this.provider)

        const [_blockNumber, decodedResults] = await multicall.call(
            addresses.map(address => {
                return [tarErc20Contract.address, tarErc20Contract.interface.encodeFunctionData('balanceOf', [address])]
            })
        )

        const balances: string[] = Multicall.decode(decodedResults, addresses.map(_ => [tarErc20Contract, 'balanceOf']))
        const results: Record<string, string | number> = {}
        addresses.forEach((address, index) => {
            // TODO to Significant
            results[address] = format === 'AMOUNT' ? bn_fromWei(balances[index]) : balances[index]
        })

        return results
    }
}