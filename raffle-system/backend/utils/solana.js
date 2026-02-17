require('dotenv').config();
const { Connection, PublicKey } = require('@solana/web3.js');
const { getAccount, getMint } = require('@solana/spl-token');
const BigNumber = require('bignumber.js');

// Initialize Connection
const SOLANA_RPC_URL = process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';
const connection = new Connection(SOLANA_RPC_URL, 'confirmed');

const VAULT_WALLET_ADDRESS = new PublicKey(process.env.VAULT_WALLET_ADDRESS);
const USDC_MINT_ADDRESS = new PublicKey(process.env.USDC_MINT_ADDRESS);
const TICKET_PRICE_USDC = new BigNumber(process.env.TICKET_PRICE_USDC || 2);
const USDC_DECIMALS = 6;
// 2 USDC = 2,000,000 micro-USDC
const EXPECTED_AMOUNT_RAW = TICKET_PRICE_USDC.multipliedBy(new BigNumber(10).pow(USDC_DECIMALS));

/**
 * Verifies a USDC transfer transaction on Solana.
 * @param {string} signature - The transaction signature to verify.
 * @param {number} quantity - Number of tickets purchased (defaults to 1).
 * @returns {Promise<{success: boolean, message: string}>}
 */
async function verifyTransaction(signature, quantity = 1) {
    try {
        console.log(`[Verify] Checking signature: ${signature} for ${quantity} tickets`);

        const expectedTotalAmount = TICKET_PRICE_USDC.multipliedBy(quantity).multipliedBy(new BigNumber(10).pow(USDC_DECIMALS));

        // 1. Fetch the parsed transaction
        const transaction = await connection.getParsedTransaction(signature, {
            maxSupportedTransactionVersion: 0,
            commitment: 'confirmed'
        });

        if (!transaction) {
            return { success: false, message: "Transaction not found or not confirmed yet." };
        }

        // 2. Check for errors
        if (transaction.meta && transaction.meta.err) {
            return { success: false, message: "Transaction failed on-chain." };
        }

        // 3. Verify Sender (Buyer) - (Skipped for now as per previous logic)

        // 4. Validate Transfer Instructions
        const instructions = transaction.transaction.message.instructions;
        const innerInstructions = transaction.meta.innerInstructions || [];

        let allInstructions = [...instructions];
        innerInstructions.forEach(inner => {
            allInstructions = allInstructions.concat(inner.instructions);
        });

        let validTransferFound = false;

        for (const ix of allInstructions) {
            // Check for SPL Token Transfer
            if (ix.programId.toString() === 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA') {
                if (ix.parsed && (ix.parsed.type === 'transfer' || ix.parsed.type === 'transferChecked')) {
                    const info = ix.parsed.info;

                    // Check Amount
                    const amount = new BigNumber(info.amount || info.tokenAmount.amount);
                    if (!amount.isEqualTo(expectedTotalAmount)) {
                        continue; // Wrong amount
                    }

                    // Check Destination via Balance Change
                    validTransferFound = verifyBalanceChange(transaction, VAULT_WALLET_ADDRESS.toString(), expectedTotalAmount);
                    if (validTransferFound) break;
                }
            }
        }

        if (!validTransferFound) {
            return { success: false, message: `Valid ${quantity * 2} USDC transfer to vault not found.` };
        }

        return { success: true, message: "Transaction verified." };

    } catch (error) {
        console.error("Verification Error:", error);
        return { success: false, message: `Verification failed: ${error.message}` };
    }
}

/**
 * Checks if the vault's token balance increased by the expected amount.
 */
function verifyBalanceChange(parsedTx, vaultAddress, expectedAmount) {
    const preBalances = parsedTx.meta.preTokenBalances;
    const postBalances = parsedTx.meta.postTokenBalances;

    if (!preBalances || !postBalances) return false;

    const vaultPostBalance = postBalances.find(b => b.owner === vaultAddress && b.mint === process.env.USDC_MINT_ADDRESS);
    if (!vaultPostBalance) return false;

    const vaultPreBalance = preBalances.find(b => b.accountIndex === vaultPostBalance.accountIndex);

    const postAmount = new BigNumber(vaultPostBalance.uiTokenAmount.amount);
    const preAmount = vaultPreBalance ? new BigNumber(vaultPreBalance.uiTokenAmount.amount) : new BigNumber(0);

    const diff = postAmount.minus(preAmount);

    return diff.isEqualTo(expectedAmount);
}

module.exports = {
    verifyTransaction
};
