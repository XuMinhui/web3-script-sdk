import { ethers } from "ethers";
import { Web3Checker } from "../class/Checker";
import { bn_wrapperBn } from "../utils/bn";
import { SupportChainType, chainStateList } from "../web3";

export const omitAddress = (address: string) => {
    if (!address) return ''
    const startStr = address.substring(0, 6)
    const endStr = address.substring(address.length - 4, address.length)
    return `${startStr}...${endStr}`
}

export function calcGasFee(txDetail: ethers.ContractReceipt) {
    return bn_wrapperBn(txDetail.gasUsed).multipliedBy(txDetail.effectiveGasPrice.toString()).div(1e18).toNumber()
}

// 拼接区块链浏览器连接
export function splicinScanLink(chain: SupportChainType, transactionOrHashOrAddress: ethers.ContractTransaction | string) {
    const hashOrAddress = typeof transactionOrHashOrAddress === 'string' ? transactionOrHashOrAddress : transactionOrHashOrAddress.hash
    const type = Web3Checker.isAddress(hashOrAddress) ? 'address' : 'tx'
    const _scanLink = chainStateList[chain].blockExplorerUrls + `/${type}/` + hashOrAddress
    const pattern = /^(https|http):\/\/(.+)$/i
    const matchs = _scanLink.match(pattern)
    if (!matchs) return null
    const scanLink = matchs[1] + matchs[2].replace('//', '/')
    return scanLink
}