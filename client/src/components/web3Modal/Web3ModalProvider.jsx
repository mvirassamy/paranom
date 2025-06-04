import { createWeb3Modal } from '@web3modal/wagmi/react'
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'

import {WagmiProvider, createConfig, http} from 'wagmi'
import {arbitrum, mainnet, goerli, localhost, sepolia} from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {coinbaseWallet, injected, walletConnect} from "wagmi/connectors";
import {ganache} from "../../utils/ganacheChain.jsx";

// 0. Setup queryClient
const queryClient = new QueryClient()

// 1. Your WalletConnect Cloud project ID
const projectId = 'c2e21b61c019268e57aacf60997a9f6e'

// 2. Create wagmiConfig
const metadata = {
    name: 'Paranom',
    description: 'AppKit Example',
    url: 'https://web3modal.com', // origin must match your domain & subdomain
    icons: ['https://avatars.githubusercontent.com/u/37784886']
}

const config = createConfig({
    chains: [mainnet, sepolia, ganache],
    connectors: [
        coinbaseWallet(),
        walletConnect({ projectId: projectId, metadata: metadata }),
    ],
    transports: {
        [mainnet.id]: http(),
        [sepolia.id]: http(),
        [ganache.id]: http(),
    },
})



export function Web3ModalProvider({ children }) {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </WagmiProvider>
    )
}
