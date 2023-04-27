import { SupportChain } from "./type"

export const multicallAddress: Record<SupportChain, string> = {
    // Uniswap deployments view https://docs.uniswap.org/contracts/v3/reference/deployments
    [SupportChain.Ethereum]: '0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696',
    [SupportChain.Polygon]: '0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696',
    [SupportChain.Optimism]: '0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696',
    [SupportChain.Arbitrum]: '0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696',
    [SupportChain.Binance]: '0xcD1163D095d80786E0BdE074dF6fA683dD896230',
    [SupportChain.Goerli]: '0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696',
    [SupportChain.Sepolia]: '0xE95c7a5bACDc227BDBac477506C82d4717c3916c'
}