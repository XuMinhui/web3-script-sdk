import { ethers } from "ethers";
import { ZERO_ADDRESS } from "../web3/constants";
import { chainStateList, SupportChain, SupportChainType } from "../web3";
import { UniversalErc20, UniversalErc20__factory } from "../web3/types";

type CurrencyType = 'Native' | 'Erc20'
class CurrencyBase {
    protected provider: ethers.providers.Provider

    readonly chain: SupportChainType
    readonly type: CurrencyType

    readonly address: string
    public name: string | undefined
    public symbol: string | undefined
    public decimals: number | undefined

    constructor(chain: SupportChainType, type: CurrencyType, address: string, decimals?: number, symbol?: string, name?: string) {
        const provider = new ethers.providers.JsonRpcProvider(chainStateList[chain].rpcUrls[0])
        this.provider = provider
        this.chain = chain
        this.type = type
        this.address = address

    }

    public equals(other: CurrencyErc20): boolean {
        return this.chain === other.chain && this.address.toLowerCase() === other.address.toLowerCase()
    }
}

export class CurrencyNative extends CurrencyBase {
    constructor(chain: SupportChainType) {
        const name = chainStateList[chain].nativeCurrency.name
        const symbol = chainStateList[chain].nativeCurrency.symbol
        const decimals = chainStateList[chain].nativeCurrency.decimals
        super(chain, 'Native', ZERO_ADDRESS, decimals, symbol, name)
    }
}

export class CurrencyErc20 extends CurrencyBase {
    public readonly contract: UniversalErc20

    constructor(chain: SupportChain, address: string, decimals?: number, symbol?: string, name?: string) {
        super(chain, 'Erc20', address, decimals, symbol, name)
        this.contract = UniversalErc20__factory.connect(address, this.provider)
    }

    async initialize(): Promise<this> {
        this.symbol = this.symbol || await this.contract.symbol()
        this.decimals = this.decimals || await this.contract.decimals()
        this.name = this.name || await this.contract.name()
        return this
    }
}