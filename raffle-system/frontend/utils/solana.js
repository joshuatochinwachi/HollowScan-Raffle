import { PublicKey, Transaction } from '@solana/web3.js';
import {
    getAssociatedTokenAddress,
    createTransferInstruction,
    createAssociatedTokenAccountInstruction,
    getAccount
} from '@solana/spl-token';

const VAULT_WALLET = new PublicKey(process.env.NEXT_PUBLIC_VAULT_WALLET);
const USDC_MINT = new PublicKey(process.env.NEXT_PUBLIC_USDC_MINT);

/**
 * Creates a transaction to send USDC to the vault.
 * @param {Connection} connection 
 * @param {PublicKey} walletPublicKey 
 * @param {number} quantity - Number of tickets (defaults to 1)
 * @returns {Promise<Transaction>}
 */
export async function createBuyTicketTransaction(connection, walletPublicKey, quantity = 1) {
    // 1. Get User's USDC Account
    const userUSDCAccount = await getAssociatedTokenAddress(USDC_MINT, walletPublicKey);

    // 2. Get Vault's USDC Account
    const vaultUSDCAccount = await getAssociatedTokenAddress(USDC_MINT, VAULT_WALLET);

    // 3. Check if Vault ATA exists
    const vaultAccountInfo = await connection.getAccountInfo(vaultUSDCAccount);

    const transaction = new Transaction();

    if (!vaultAccountInfo) {
        console.log("Creating Vault ATA...");
        transaction.add(
            createAssociatedTokenAccountInstruction(
                walletPublicKey, // Payer
                vaultUSDCAccount, // ATA
                VAULT_WALLET,    // Owner
                USDC_MINT        // Mint
            )
        );
    }

    // 4. Create Transfer Instruction
    // 2 USDC per ticket = 2 * 1,000,000 micro-USDC
    const amount = 2 * quantity * 1_000_000;

    transaction.add(
        createTransferInstruction(
            userUSDCAccount,
            vaultUSDCAccount,
            walletPublicKey,
            amount
        )
    );

    const { blockhash } = await connection.getLatestBlockhash('confirmed');
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = walletPublicKey;

    return transaction;
}
