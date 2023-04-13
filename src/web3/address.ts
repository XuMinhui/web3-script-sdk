import { MainnetChain } from "./type"

export const ADDRESS_TOKEN_ERC20 = {
    [MainnetChain.Ethereum]: {
        USDT: "0xdac17f958d2ee523a2206206994597c13d831ec7",
        USDC: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
    },
    [MainnetChain.Binance]: {
        ETH: "0x2170ed0880ac9a755fd29b2688956bd959f933f8",
        USDT: "0x55d398326f99059ff775485246999027b3197955",
        USDC: "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d"
    },
    [MainnetChain.Polygon]: {
        USDT: "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
        USDC: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174"
    },
    [MainnetChain.Arbitrum]: {
        USDT: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
        USDC: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8"
    }
}


export const ADDRESS_LOGIC = {
    [MainnetChain.Binance]: {
        Pancake_Route: "0x10ED43C718714eb63d5aA57B78B54704E256024E"
    }
}