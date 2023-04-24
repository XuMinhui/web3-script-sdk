import { ethers } from "ethers";
import { bn_wrapperBn } from "../utils/bn";

export const omitAddress = (address: string) => {
    if (!address) return ''
    const startStr = address.substring(0, 6)
    const endStr = address.substring(address.length - 4, address.length)
    return `${startStr}...${endStr}`
}

export function calcGasFee(txDetail: ethers.ContractReceipt) {
    return bn_wrapperBn(txDetail.gasUsed).multipliedBy(txDetail.effectiveGasPrice.toString()).div(1e18).toNumber()
}