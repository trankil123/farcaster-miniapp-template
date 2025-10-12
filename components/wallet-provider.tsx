import { farcasterMiniApp as miniAppConnector } from '@farcaster/miniapp-wagmi-connector'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { http, WagmiProvider, createConfig } from 'wagmi'
//import { monadTestnet } from 'wagmi/chains'
import { base } from 'wagmi/chains'

export const config = createConfig({
 //chains: [monadTestnet],
  chains: [base],
  transports: {
   // [monadTestnet.id]: http(),
   [base.id]: http(),
  },
  connectors: [miniAppConnector()],
})

const queryClient = new QueryClient()

export function WalletProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}
