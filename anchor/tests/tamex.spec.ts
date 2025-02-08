import * as anchor from '@coral-xyz/anchor'
import {Program} from '@coral-xyz/anchor'
import {Keypair} from '@solana/web3.js'
import {Tamex} from '../target/types/tamex'

describe('tamex', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const payer = provider.wallet as anchor.Wallet

  const program = anchor.workspace.Tamex as Program<Tamex>

  const tamexKeypair = Keypair.generate()

  it('Initialize Tamex', async () => {
    await program.methods
      .initialize()
      .accounts({
        tamex: tamexKeypair.publicKey,
        payer: payer.publicKey,
      })
      .signers([tamexKeypair])
      .rpc()

    const currentCount = await program.account.tamex.fetch(tamexKeypair.publicKey)

    expect(currentCount.count).toEqual(0)
  })

  it('Increment Tamex', async () => {
    await program.methods.increment().accounts({ tamex: tamexKeypair.publicKey }).rpc()

    const currentCount = await program.account.tamex.fetch(tamexKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Increment Tamex Again', async () => {
    await program.methods.increment().accounts({ tamex: tamexKeypair.publicKey }).rpc()

    const currentCount = await program.account.tamex.fetch(tamexKeypair.publicKey)

    expect(currentCount.count).toEqual(2)
  })

  it('Decrement Tamex', async () => {
    await program.methods.decrement().accounts({ tamex: tamexKeypair.publicKey }).rpc()

    const currentCount = await program.account.tamex.fetch(tamexKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Set tamex value', async () => {
    await program.methods.set(42).accounts({ tamex: tamexKeypair.publicKey }).rpc()

    const currentCount = await program.account.tamex.fetch(tamexKeypair.publicKey)

    expect(currentCount.count).toEqual(42)
  })

  it('Set close the tamex account', async () => {
    await program.methods
      .close()
      .accounts({
        payer: payer.publicKey,
        tamex: tamexKeypair.publicKey,
      })
      .rpc()

    // The account should no longer exist, returning null.
    const userAccount = await program.account.tamex.fetchNullable(tamexKeypair.publicKey)
    expect(userAccount).toBeNull()
  })
})
