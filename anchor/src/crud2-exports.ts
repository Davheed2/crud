// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import Crud2IDL from '../target/idl/crud2.json'
import type { Crud2 } from '../target/types/crud2'

// Re-export the generated IDL and type
export { Crud2, Crud2IDL }

// The programId is imported from the program IDL.
export const CRUD2_PROGRAM_ID = new PublicKey(Crud2IDL.address)

// This is a helper function to get the Crud2 Anchor program.
export function getCrud2Program(provider: AnchorProvider, address?: PublicKey) {
  return new Program({ ...Crud2IDL, address: address ? address.toBase58() : Crud2IDL.address } as Crud2, provider)
}

// This is a helper function to get the program ID for the Crud2 program depending on the cluster.
export function getCrud2ProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      // This is the program ID for the Crud2 program on devnet and testnet.
      return new PublicKey('coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF')
    case 'mainnet-beta':
    default:
      return CRUD2_PROGRAM_ID
  }
}
