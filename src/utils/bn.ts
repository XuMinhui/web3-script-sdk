import BigNumber from "bignumber.js"
import { BigNumber as EBignumber } from 'ethers'

BigNumber.config({ EXPONENTIAL_AT: [-8, 30] })

export const bn_wrapperBn = (
    tar: number | string | BigNumber | EBignumber
): BigNumber => {
    if (tar instanceof EBignumber) tar = tar.toString()
    return new BigNumber(tar)
}

export const bn_fromWei = (
    tar: BigNumber | string | number | EBignumber,
    decimals = 18,
    fixed = 4
) => {
    if (tar instanceof EBignumber) tar = tar.toString()
    return new BigNumber(tar).div(new BigNumber(10).pow(decimals)).dp(fixed, BigNumber.ROUND_DOWN).toNumber()
}

export const bn_toWei = (
    tar: BigNumber | string | number | EBignumber,
    decimals = 18
) => {
    if (tar instanceof EBignumber) tar = tar.toString()
    return new BigNumber(tar).times(new BigNumber(10).pow(decimals)).toString()
}

export const bn_parseWei = (
    tar: BigNumber | string | number | EBignumber,
    decimals = 18
) => {
    if (tar instanceof EBignumber) tar = tar.toString()
    return new BigNumber(tar).div(new BigNumber(10).pow(decimals)).toString()
}

export const bn_toHex = (tar: BigNumber | string | number | EBignumber) => {
    if (tar instanceof EBignumber) tar = tar.toString()
    let hex = bn_wrapperBn(tar).dp(0).toString(16)
    if (hex === `0`) return `0x`
    return `0x${hex}`
}