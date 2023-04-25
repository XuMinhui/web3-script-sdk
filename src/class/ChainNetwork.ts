import { ethers } from 'ethers'
import { ChainStateInterface, SupportChain, chainStateList } from '../web3'
import { Web3Checker } from './Checker'
import invariant from 'tiny-invariant'
import { Multicall } from './Multicall'

export class ChainNetwork {
    public readonly state: ChainStateInterface
    public readonly chain: SupportChain | "OtherChain"
    public readonly chainId: number
    public provider: ethers.providers.JsonRpcProvider
    public readonly multicallAddr?: string

    constructor(chain: SupportChain | ChainStateInterface) {
        if (typeof chain === 'object') {
            // chain is ChainStateInterface
            this.chain = 'OtherChain'
            this.state = chain
        } else {
            this.chain = chain
            this.state = chainStateList[chain]
        }

        this.provider = new ethers.providers.JsonRpcProvider(this.state.rpcUrls[0])
        this.chainId = this.state.chainId
        this.multicallAddr = this.state.multicall
    }

    updateRpc(rpc: string) {
        this.provider = new ethers.providers.JsonRpcProvider(rpc)
    }

    getMulticall(address?: string) {
        const multicallAddr = address || this.multicallAddr
        invariant(multicallAddr, 'No multicall call address provided')
        return new Multicall(this, multicallAddr)
    }

    // calGasDust(gasLimit: number) {
    //     const gasPrice =  
    // }

    // 拼接 Etherscan link
    public getViewScanLink(transactionOrHashOrAddress: ethers.ContractTransaction | string) {
        if (!this.state.blockExplorerUrls) return ''
        const hashOrAddress = typeof transactionOrHashOrAddress === 'string' ? transactionOrHashOrAddress : transactionOrHashOrAddress.hash
        const type = Web3Checker.isAddress(hashOrAddress) ? 'address' : 'tx'
        const _scanLink = this.state.blockExplorerUrls + `/${type}/` + hashOrAddress
        const pattern = /^(https|http):\/\/(.+)$/i
        const matchs = _scanLink.match(pattern)
        if (!matchs) return ''
        const scanLink = matchs[1] + matchs[2].replace('//', '/')
        return scanLink
    }
}