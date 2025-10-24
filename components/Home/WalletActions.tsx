'use client'

import { useFrame } from '@/components/farcaster-provider'
import { farcasterMiniApp as miniAppConnector } from '@farcaster/miniapp-wagmi-connector'
import { parseEther } from 'viem'
import { base } from 'viem/chains'
import {
  useAccount,
  useConnect,
  useDisconnect,
  useSwitchChain,
  useWriteContract,
} from 'wagmi'

// --- ABI minimale de ton contrat (juste la fonction utilisée)
const simplePayableAbi = [
  {
    type: 'function',
    name: 'pay',
    stateMutability: 'payable',
    inputs: [{ name: '_message', type: 'string' }],
    outputs: [],
  },
] as const

// Adresse de ton contrat déployé sur Base mainnet
const contractAddress = '0xd16440dD226Cee618069f56600518546ed6829eF'

// Montant envoyé à chaque vote (doit être > 0)
const VOTE_AMOUNT = '0.000001' // en ETH

export function WalletActions() {
  const { isEthProviderAvailable } = useFrame()
  const { isConnected, address, chainId } = useAccount()
  const { disconnect } = useDisconnect()
  const { switchChain } = useSwitchChain()
  const { connect } = useConnect()

  // Hook pour écrire sur le contrat
  const { writeContractAsync, isPending, data: txHash } = useWriteContract()

  // Questions
  const q1 = 'Will Base airdrop happen before the end of Q2 2025?'
  const q2 = 'Will $MEGA launch before the end of this year?'

  async function vote(questionId: 1 | 2, choice: 'YES' | 'NO') {
    const message = `Q${questionId}|${choice}` // ex: "Q1|YES"
    try {
      await writeContractAsync({
        address: contractAddress as `0x${string}`,
        abi: simplePayableAbi,
        functionName: 'pay',
        args: [message],
        value: parseEther(VOTE_AMOUNT),
        chainId: base.id,
      })
      alert(`✅ Vote sent: ${message}`)
    } catch (e) {
      console.error(e)
      alert('❌ Transaction failed.')
    }
  }

  // --- Si le wallet est connecté
  if (isConnected) {
    return (
      <div className="space-y-4 border border-[#333] rounded-md p-4">
        <h2 className="text-xl font-bold text-left">Question Pool</h2>

        <div className="flex flex-col space-y-1 text-sm">
          <p>
            Connected wallet:{' '}
            <span className="bg-white text-black font-mono rounded px-1.5">
              {address}
            </span>
          </p>
          <p>
            Chain ID:{' '}
            <span className="bg-white text-black font-mono rounded px-1.5">
              {chainId}
            </span>
          </p>
        </div>

        {chainId === base.id ? (
          <div className="space-y-5">
            {/* --- Question 1 --- */}
            <div className="border border-[#333] p-4 rounded-md space-y-3">
              <h3 className="text-lg font-semibold">{q1}</h3>
              <div className="flex gap-3">
                <button
                  disabled={isPending}
                  onClick={() => vote(1, 'YES')}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 disabled:opacity-60"
                >
                  Yes
                </button>
                <button
                  disabled={isPending}
                  onClick={() => vote(1, 'NO')}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 disabled:opacity-60"
                >
                  No
                </button>
              </div>
            </div>

            {/* --- Question 2 --- */}
            <div className="border border-[#333] p-4 rounded-md space-y-3">
              <h3 className="text-lg font-semibold">{q2}</h3>
              <div className="flex gap-3">
                <button
                  disabled={isPending}
                  onClick={() => vote(2, 'YES')}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 disabled:opacity-60"
                >
                  Yes
                </button>
                <button
                  disabled={isPending}
                  onClick={() => vote(2, 'NO')}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 disabled:opacity-60"
                >
                  No
                </button>
              </div>
            </div>

            {/* --- Lien vers BaseScan --- */}
            {txHash && (
              <a
                href={`https://basescan.org/tx/${txHash}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-blue-400 underline"
              >
                View your last transaction on BaseScan
              </a>
            )}

            <p className="text-xs text-gray-400">
              Each vote sends {VOTE_AMOUNT} ETH to the contract with a message
              like <code>Q1|YES</code>. You can verify it in the{' '}
              <code>Received</code> events on BaseScan.
            </p>
          </div>
        ) : (
          <button
            type="button"
            className="bg-white text-black rounded-md p-2 text-sm"
            onClick={() => switchChain({ chainId: base.id })}
          >
            Switch to Base Mainnet
          </button>
        )}

        <button
          type="button"
          className="bg-white text-black rounded-md p-2 text-sm"
          onClick={() => disconnect()}
        >
          Disconnect Wallet
        </button>
      </div>
    )
  }

  // --- Si Farcaster est dispo (Warpcast)
  if (isEthProviderAvailable) {
    return (
      <div className="space-y-4 border border-[#333] rounded-md p-4">
        <h2 className="text-xl font-bold text-left">Question Pool</h2>
        <div className="flex flex-row space-x-4 justify-start items-start w-full">
          <button
            type="button"
            className="bg-white text-black w-full rounded-md p-2 text-sm"
            onClick={() => connect({ connector: miniAppConnector() })}
          >
            Connect Wallet
          </button>
        </div>
      </div>
    )
  }

  // --- Fallback (hors Warpcast)
  return (
    <div className="space-y-4 border border-[#333] rounded-md p-4">
      <h2 className="text-xl font-bold text-left">Question Pool</h2>
      <p className="text-sm text-left text-gray-400">
        Wallet connection available only via Warpcast
      </p>
    </div>
  )
}
