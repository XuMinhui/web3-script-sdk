import { MainnetChain } from "./type"

export const ADDRESS_TOKEN_ERC20 = {
    [MainnetChain.Ethereum]: {
        USDT: "0xdac17f958d2ee523a2206206994597c13d831ec7",
        USDC: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
        WETH: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
    },
    [MainnetChain.Binance]: {
        ETH: "0x2170ed0880ac9a755fd29b2688956bd959f933f8",
        USDT: "0x55d398326f99059ff775485246999027b3197955",
        USDC: "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d",
        WETH: "0x4DB5a66E937A9F4473fA95b1cAF1d1E1D62E29EA"
    },
    [MainnetChain.Polygon]: {
        USDT: "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
        USDC: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
        WETH: "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619"
    },
    [MainnetChain.Arbitrum]: {
        USDT: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
        USDC: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
        WETH: "0x82af49447d8a07e3bd95bd0d56f35241523fbab1"
    },
    [MainnetChain.Optimism]: {
        USDT: "0x94b008aa00579c1307b0ef2c499ad98a8ce58e58",
        USDC: "0x7f5c764cbc14f9669b88837ca1490cca17c31607",
        WETH: "0x4200000000000000000000000000000000000006"
    }
}


export const ADDRESS_LOGIC = {
    [MainnetChain.Binance]: {
        Pancake_Route: "0x10ED43C718714eb63d5aA57B78B54704E256024E"
    }
}