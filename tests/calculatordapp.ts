import assert from 'assert'
import * as anchor from '@project-serum/anchor'

const { SystemProgram } = anchor.web3


describe('calculatordapp', () => {

    const provider = anchor.AnchorProvider.env()
    anchor.setProvider(provider)

    const calculator = anchor.web3.Keypair.generate()
    const program = anchor.workspace.Calculatordapp

    it('Creates a calculator', async () => {
        await program.rpc.create('Welcome to anchor calculator', {
            accounts: {
                calculator: calculator.publicKey,
                user: provider.wallet.publicKey,
                systemProgram: SystemProgram.programId
            },
            signers: [calculator]
        })

        const account = await program.account.calculator.fetch(calculator.publicKey)
        assert.ok(account.greeting === 'Welcome to anchor calculator')
    })

    it('Adds two integers', async () => {
        await program.rpc.add(new anchor.BN(2), new anchor.BN(3), {
            accounts: {
                calculator: calculator.publicKey
            }
        })

        const account = await program.account.calculator.fetch(calculator.publicKey)
        assert.ok(account.result.eq(new anchor.BN(5)))
    })

    it('Subtracts one integer from the other', async () => {
        await program.rpc.subtract(new anchor.BN(5), new anchor.BN(3), {
            accounts: {
                calculator: calculator.publicKey
            }
        })

        const account = await program.account.calculator.fetch(calculator.publicKey)
        assert.ok(account.result.eq(new anchor.BN(2)))
    })

    it('Multiplies tow integers', async () => {
        await program.rpc.multiply(new anchor.BN(5), new anchor.BN(3), {
            accounts: {
                calculator: calculator.publicKey
            }
        })

        const account = await program.account.calculator.fetch(calculator.publicKey)
        assert.ok(account.result.eq(new anchor.BN(15)))
    })

    it('Divides one integer by the other and shows remainder', async () => {
        await program.rpc.divide(new anchor.BN(5), new anchor.BN(3), {
            accounts: {
                calculator: calculator.publicKey
            }
        })

        const account = await program.account.calculator.fetch(calculator.publicKey)
        assert.ok(account.result.eq(new anchor.BN(1)))
        assert.ok(account.remainder.eq(new anchor.BN(2)))
    })

})