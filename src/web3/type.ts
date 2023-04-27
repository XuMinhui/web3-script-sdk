export enum SupportChain {
    Ethereum = 'Ethereum',
    Binance = 'Binance',
    Arbitrum = 'Arbitrum',
    Optimism = 'Optimism',
    Polygon = 'Polygon',
    Goerli = 'Goerli',
    Sepolia = 'Sepolia'
}

export type SupportChainType = keyof typeof SupportChain;

export interface ChainStateInterface {
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