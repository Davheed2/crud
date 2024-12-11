import * as anchor from '@coral-xyz/anchor'
import {Program} from '@coral-xyz/anchor'
import {Keypair} from '@solana/web3.js'
import {Crud2} from '../target/types/crud2'

describe('crud2', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const payer = provider.wallet as anchor.Wallet

  const program = anchor.workspace.Crud2 as Program<Crud2>

  const crud2Keypair = Keypair.generate()

  it('Initialize Crud2', async () => {
    await program.methods
      .initialize()
      .accounts({
        crud2: crud2Keypair.publicKey,
        payer: payer.publicKey,
      })
      .signers([crud2Keypair])
      .rpc()

    const currentCount = await program.account.crud2.fetch(crud2Keypair.publicKey)

    expect(currentCount.count).toEqual(0)
  })

  it('Increment Crud2', async () => {
    await program.methods.increment().accounts({ crud2: crud2Keypair.publicKey }).rpc()

    const currentCount = await program.account.crud2.fetch(crud2Keypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Increment Crud2 Again', async () => {
    await program.methods.increment().accounts({ crud2: crud2Keypair.publicKey }).rpc()

    const currentCount = await program.account.crud2.fetch(crud2Keypair.publicKey)

    expect(currentCount.count).toEqual(2)
  })

  it('Decrement Crud2', async () => {
    await program.methods.decrement().accounts({ crud2: crud2Keypair.publicKey }).rpc()

    const currentCount = await program.account.crud2.fetch(crud2Keypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Set crud2 value', async () => {
    await program.methods.set(42).accounts({ crud2: crud2Keypair.publicKey }).rpc()

    const currentCount = await program.account.crud2.fetch(crud2Keypair.publicKey)

    expect(currentCount.count).toEqual(42)
  })

  it('Set close the crud2 account', async () => {
    await program.methods
      .close()
      .accounts({
        payer: payer.publicKey,
        crud2: crud2Keypair.publicKey,
      })
      .rpc()

    // The account should no longer exist, returning null.
    const userAccount = await program.account.crud2.fetchNullable(crud2Keypair.publicKey)
    expect(userAccount).toBeNull()
  })
})
