// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import TamexIDL from '../target/idl/tamex.json'
import type { Tamex } from '../target/types/tamex'

// Re-export the generated IDL and type
export { Tamex, TamexIDL }

// The programId is imported from the program IDL.
export const TAMEX_PROGRAM_ID = new PublicKey(TamexIDL.address)

// This is a helper function to get the Tamex Anchor program.
export function getTamexProgram(provider: AnchorProvider, address?: PublicKey) {
  return new Program({ ...TamexIDL, address: address ? address.toBase58() : TamexIDL.address } as Tamex, provider)
}

// This is a helper function to get the program ID for the Tamex program depending on the cluster.
export function getTamexProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      // This is the program ID for the Tamex program on devnet and testnet.
      return new PublicKey('coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF')
    case 'mainnet-beta':
    default:
      return TAMEX_PROGRAM_ID
  }
}
