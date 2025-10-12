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

export function WalletActions() {
  const { isEthProviderAvailable } = useFrame()
  const { isConnected, address, chainId } = useAccount()
  const { disconnect } = useDisconnect()
  const { switchChain } = useSwitchChain()
  const { connect } = useConnect()
  const { writeContract, data: hash, isPending } = useWriteContract()

  // 👇 Appel simple à ping()
  async function handlePing() {
    try {
      await writeContract({
        address: '0xA1e644C438f027938e804700b25bD82A5c4Aeb49', // Ton contrat
        abi: [
          {
            name: 'ping',
            type: 'function',
            stateMutability: 'nonpayable',
            inputs: [],
            outputs: [{ type: 'string', name: '' }],
          },
        ],
        functionName: 'ping',
      })
    } catch (err) {
      console.error('Erreur transaction ping:', err)
    }
  }

  if (isConnected) {
    return (
      <div className="space-y-4 border border-[#333] rounded-md p-4">
        <h2 className="text-xl font-bold text-left">CompteurInteractions</h2>

        <p className="text-sm">
          Connecté à : <span className="font-mono">{address}</span>
        </p>

        {chainId === base.id ? (
          <div className="flex flex-col space-y-2 border border-[#333] p-4 rounded-md">
            <h3 className="text-lg font-semibold text-left">Appeler ping()</h3>
            <button
              type="button"
              className="bg-white text-black rounded-md p-2 text-sm"
              disabled={isPending}
              onClick={handlePing}
            >
              {isPending ? 'Transaction en cours...' : 'Envoyer un Ping'}
            </button>

            {hash && (
              <button
                type="button"
                className="bg-white text-black rounded-md p-2 text-sm"
                onClick={() =>
                  window.open(`https://basescan.org/tx/${hash}`, '_blank')
                }
              >
                Voir sur BaseScan
              </button>
            )}
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

  if (isEthProviderAvailable) {
    return (
      <div className="space-y-4 border border-[#333] rounded-md p-4">
        <h2 className="text-xl font-bold text-left">sdk.wallet.ethProvider</h2>
        <div className="flex flex-row space-x-4 justify-start items-start">
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

  return (
    <div className="space-y-4 border border-[#333] rounded-md p-4">
      <h2 className="text-xl font-bold text-left">sdk.wallet.ethProvider</h2>
      <p className="text-sm text-left">Wallet connection only via Warpcast</p>
    </div>
  )
}
