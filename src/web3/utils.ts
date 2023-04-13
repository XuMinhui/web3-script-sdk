import { ethers } from "ethers";
import { SupportChainType } from "../web3/type";
import { Web3Checker } from "../class/Checker";
import { chainState } from "../web3";
import { bn_wrapperBn } from "../utils/bn";

export const calcGasFee = (txDetail: ethers.ContractReceipt) => {
    return bn_wrapperBn(txDetail.gasUsed).multipliedBy(txDetail.effectiveGasPrice.toString()).div(1e18).toNumber()
}

// 拼接区块链浏览器连接
export const splicinScanLink = (chain: SupportChainType, transactionOrHashOrAddress: ethers.ContractTransaction | string) => {
    const hashOrAddress = typeof transactionOrHashOrAddress === 'string' ? transactionOrHashOrAddress : transactionOrHashOrAddress.hash
    const type = Web3Checker.isAddress(hashOrAddress) ? 'address' : 'tx'
    const _scanLink = chainState[chain].blockExplorerUrls + `/${type}/` + hashOrAddress
    const pattern = /^(https|http):\/\/(.+)$/i
    const matchs = _scanLink.match(pattern)
    if (!matchs) return null
    const scanLink = matchs[1] + matchs[2].replace('//', '/')
    return scanLink
}