export enum MainnetChain {
    Ethereum = 'Ethereum',
    Binance = 'Binance',
    Arbitrum = 'Arbitrum',
    Optimism = 'Optimism',
    Polygon = 'Polygon'
}

export enum TestnetChain {
    Goerli = 'Goerli'
}

export type MainnetChainType = keyof typeof MainnetChain
export type TestnetChainType = keyof typeof TestnetChain
export type SupportChainType = MainnetChainType | TestnetChainType

export interface IChainConfig {
    name: string,
    chainId: number,
    rpcUrls: string[],
    nativeCurrency: {
        name: string,
        symbol: string,
        decimals: number,
    },
    blockExplorerUrls: string
}

export type CurrencyType = 'NATIVE' | 'ERC20'