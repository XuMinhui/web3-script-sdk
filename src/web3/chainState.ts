import { ChainStateInterface, SupportChain } from "./type"

export const chainStateList: Record<SupportChain, ChainStateInterface> = {
    [SupportChain.Ethereum]: {
        name: 'Ethereum Mainnet',
        chainId: 1,
        rpcUrls: ["https://rpc.ankr.com/eth"],
        nativeCurrency: {
            name: 'Ethereum ETH',
            symbol: 'ETH',
            decimals: 18
        },
        blockExplorerUrls: 'https://etherscan.io/'
    },
    [SupportChain.Binance]: {
        name: 'Binance Smart Chain',
        chainId: 56,
        rpcUrls: ["https://bsc.blockpi.network/v1/rpc/public"],
        nativeCurrency: {
            name: 'Binance BNB',
            symbol: 'BNB',
            decimals: 18
        },
        blockExplorerUrls: 'https://bscscan.com/'
    },
    [SupportChain.Arbitrum]: {
        name: 'Arbitrum One',
        chainId: 42161,
        rpcUrls: ["https://arb1.arbitrum.io/rpc"],
        nativeCurrency: {
            name: 'Arbitrum ETH',
            symbol: 'ETH',
            decimals: 18
        },
        blockExplorerUrls: 'https://arbiscan.io'
    },
    [SupportChain.Optimism]: {
        name: 'Optimism',
        chainId: 10,
        rpcUrls: [
            "https://endpoints.omniatech.io/v1/op/mainnet/public"
        ],
        nativeCurrency: {
            name: 'Optimism ETH',
            symbol: 'ETH',
            decimals: 18
        },
        blockExplorerUrls: 'https://optimistic.etherscan.io'
    },
    [SupportChain.Polygon]: {
        name: 'Polygon Mainnet',
        chainId: 137,
        rpcUrls: [
            "https://polygon.llamarpc.com"
        ],
        nativeCurrency: {
            name: 'Polygon Mainnet Matic',
            symbol: 'Matic',
            decimals: 18
        },
        blockExplorerUrls: 'https://polygonscan.com'
    },
    [SupportChain.Goerli]: {
        name: 'Goerli Testnet',
        chainId: 5,
        rpcUrls: ["https://rpc.ankr.com/eth_goerli"],
        nativeCurrency: {
            name: 'Goerli ETH',
            symbol: 'ETH',
            decimals: 18
        },
        blockExplorerUrls: 'https://goerli.etherscan.io/'
    },
    [SupportChain.Sepolia]: {
        name: 'Sepolia Testnet',
        chainId: 11155111,
        rpcUrls: ["https://ethereum-sepolia.blockpi.network/v1/rpc/public"],
        nativeCurrency: {
            name: 'Sepolia ETH',
            symbol: 'ETH',
            decimals: 18
        },
        blockExplorerUrls: 'https://sepolia.etherscan.io/'
    }
}