import { useFrame } from '@/components/farcaster-provider'
import { farcasterMiniApp as miniAppConnector } from '@farcaster/miniapp-wagmi-connector'
import { base } from 'viem/chains'
import {
  useAccount,
  useConnect,
  useDisconnect,
  useSwitchChain,
  useWriteContract,
} from 'wagmi'

// ABI inline pour vote(bool)
const contractAbi = [
  {
    inputs: [{ internalType: 'bool', name: '_yes', type: 'bool' }],
    name: 'vote',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
]

export function WalletActions() {
  const { isEthProviderAvailable } = useFrame()
  const { isConnected, address, chainId } = useAccount()
  const { disconnect } = useDisconnect()
  const { switchChain } = useSwitchChain()
  const { connect } = useConnect()
  const { writeContract } = useWriteContract()

  const contractAddress = '0xA1e644C438f027938e804700b25bD82A5c4Aeb49'

  // Fonction pour voter
  async function handleVote(voteValue: boolean) {
    try {
      await writeContract({
        address: contractAddress,
        abi: contractAbi,
        functionName: 'vote',
        args: [voteValue],
      })
      alert(`Vote ${voteValue ? 'Yes' : 'No'} envoyé ✅`)
    } catch (err) {
      console.error(err)
      alert('❌ Transaction échouée — vous avez peut-être déjà voté')
    }
  }

  // Affichage si connecté
  if (isConnected) {
    return (
      <div className="space-y-4 border border-gray-700 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-white">Onchain Vote</h2>
        <p>
          Connecté à : <span className="font-mono">{address}</span>
        </p>

        {chainId === base.id ? (
          <div className="flex space-x-4">
            <button
              onClick={() => handleVote(true)}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
            >
              👍 Yes
            </button>
            <button
              onClick={() => handleVote(false)}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              👎 No
            </button>
          </div>
        ) : (
          <button
            onClick={() => switchChain({ chainId: base.id })}
            className="bg-white text-black px-4 py-2 rounded-lg"
          >
            Switch to Base Mainnet
          </button>
        )}

        <button
          onClick={() => disconnect()}
          className="bg-white text-black px-4 py-2 rounded-lg"
        >
          Disconnect Wallet
        </button>
      </div>
    )
  }

  // Affichage si provider disponible mais non connecté
  if (isEthProviderAvailable) {
    return (
      <div className="space-y-4 border border-gray-700 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-white">Connect Wallet</h2>
        <button
          onClick={() => connect({ connector: miniAppConnector() })}
          className="bg-white text-black px-4 py-2 rounded-lg w-full"
        >
          Connect Wallet via Warpcast
        </button>
      </div>
    )
  }

  // Affichage si aucun provider
  return (
    <div className="space-y-4 border border-gray-700 rounded-2xl p-6">
      <h2 className="text-xl font-bold text-white">Wallet Provider not available</h2>
      <p>Wallet connection only via Warpcast</p>
    </div>
  )
}
