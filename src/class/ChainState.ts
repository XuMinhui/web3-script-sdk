import { ethers } from 'ethers'
import { SupportChainType, chainState, splicinScanLink } from '../web3'

export class ChainState {
    public readonly chain: SupportChainType
    public readonly provider: ethers.providers.JsonRpcProvider

    constructor(chain: SupportChainType) {
        this.chain = chain
        this.provider = new ethers.providers.JsonRpcProvider(ChainState.getState(chain).rpcUrls[0])
    }

    static getState(chain: SupportChainType) {
        return chainState[chain]
    }

    public getScanLink(hashOrAddress: string) {
        return splicinScanLink(this.chain, hashOrAddress)
    }
}