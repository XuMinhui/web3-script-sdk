import { ethers } from 'ethers'
import { ChainStateInterface, SupportChainType, chainStateList } from '../web3'
import { splicinScanLink } from '../utils'
import { CurrencyNative } from './Currency'

export class ChainState {
    public readonly state: ChainStateInterface
    public readonly chain: SupportChainType
    public readonly chainId: number
    public nativeToken: CurrencyNative
    public provider: ethers.providers.JsonRpcProvider

    constructor(chain: SupportChainType) {
        this.chain = chain
        this.state = chainStateList[chain]
        this.provider = new ethers.providers.JsonRpcProvider(this.state.rpcUrls[0])
        this.chainId = this.state.chainId
        this.nativeToken = new CurrencyNative(chain)
    }

    updateRpc(rpc: string) {
        this.provider = new ethers.providers.JsonRpcProvider(rpc)
    }

    getChainId() {
        return this.state.chainId
    }

    public getViewScanLink(transactionOrHashOrAddress: ethers.ContractTransaction | string) {
        return splicinScanLink(this.chain, transactionOrHashOrAddress)
    }
}