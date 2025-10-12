import { useFrame } from '@/components/farcaster-provider'
import { farcasterMiniApp as miniAppConnector } from '@farcaster/miniapp-wagmi-connector'
import { base } from 'viem/chains'
import {
  useAccount,
  useConnect,
  useDisconnect,
  useSwitchChain,
  useWriteContract,
  useReadContract,
} from 'wagmi'
import { useState, useEffect } from 'react'

// ABI inline pour vote(bool) et getResults()
const contractAbi = [
  {
    inputs: [{ internalType: 'bool', name: '_yes', type: 'bool' }],
    name: 'vote',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getResults',
    outputs: [
      { internalType: 'uint256', name: 'yes', type: 'uint256' },
      { internalType: 'uint256', name: 'no', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
]

export function OnchainVoteApp() {
  const { isEthProviderAvailable } = useFrame()
  const { isConnected, address, chainId } = useAccount()
  const { disconnect } = useDisconnect()
  const { switchChain } = useSwitchChain()
  const { connect } = useConnect()
  const { writeContract } = useWriteContract()

  const contractAddress = '0xA1e644C438f027938e804700b25bD82A5c4Aeb49'

  // State pour afficher les résultats
  const [yesCount, setYesCount] = useState<number>(0)
  const [noCount, setNoCount] = useState<number>(0)

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
      fetchResults()
    } catch (err) {
      console.error(err)
      alert('❌ Transaction échouée — vous avez peut-être déjà voté')
    }
  }

  // Fonction pour récupérer les résultats
  async function fetchResults() {
    try {
      const result: { yes: bigint; no: bigint } = await useReadContract({
        address: contractAddress,
        abi: contractAbi,
        functionName: 'getResults',
      })
      setYesCount(Number(result.yes))
      setNoCount(Number(result.no))
    } catch (err) {
      console.error('Erreur lecture résultats:', err)
    }
  }

  // Mise à jour des résultats toutes les 5 secondes
  useEffect(() => {
    if (isConnected) {
      fetchResults()
      const interval = setInterval(fetchResults, 5000)
      return () => clearInterval(interval)
    }
  }, [isConnected])

  // Affichage si connecté
  if (isConnected) {
    return (
      <div className="space-y-4 border border-gray-700 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-white">Onchain Vote</h2>
        <p>
          Connecté à : <span className="font-mono">{address}</span>
        </p>

        {chainId === base.id ? (
          <div className="flex flex-col items-center space-y-4">
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
            <div className="text-white text-lg mt-2">
              Résultats : {yesCount} 👍 / {noCount} 👎
            </div>
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

  // Affichage si le provider est disponible mais pas connecté
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

  // Affichage si aucun provider disponible
  return (
    <div className="space-y-4 border border-gray-700 rounded-2xl p-6">
      <h2 className="text-xl font-bold text-white">Wallet Provider not available</h2>
      <p>Wallet connection only via Warpcast</p>
    </div>
  )
}
