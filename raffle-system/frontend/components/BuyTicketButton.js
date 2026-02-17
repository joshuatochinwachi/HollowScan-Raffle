import { useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { createBuyTicketTransaction } from '../utils/solana';

export default function BuyTicketButton({ onPurchaseSuccess }) {
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [lastTxSignature, setLastTxSignature] = useState(null);

    const handleBuyTicket = async () => {
        if (!publicKey) return;

        setLoading(true);
        setStatus(`Preparing transaction for ${quantity} ticket(s)...`);

        try {
            // 1. Create Transaction for Multiple Tickets
            const transaction = await createBuyTicketTransaction(connection, publicKey, quantity);

            // 2. Send Transaction
            setStatus(`Please approve ${quantity * 2} USDC transaction...`);
            const signature = await sendTransaction(transaction, connection);

            setStatus('Confirming transaction...');

            // 3. Confirm Transaction
            await connection.confirmTransaction(signature, 'confirmed');

            setStatus('Verifying with server...');

            // 4. Send to Backend
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/buy-ticket`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    buyerAddress: publicKey.toString(),
                    txSignature: signature,
                    quantity: quantity
                }),
            });

            const data = await response.json();

            if (data.success) {
                const ids = data.ticketIds ? ` (IDs: ${data.ticketIds.join(', ')})` : '';
                setStatus(`Success! Confirmed ${data.message}`);
                setLastTxSignature(signature);
                if (onPurchaseSuccess) onPurchaseSuccess();
            } else {
                setStatus(`Error: ${data.message}`);
            }

        } catch (error) {
            console.error(error);
            setStatus(`Transaction failed: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center gap-6 w-full">

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 bg-gray-900/50 p-2 rounded-xl border border-gray-700">
                <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-lg bg-gray-800 hover:bg-hollow-pink/20 text-white font-bold transition"
                    disabled={loading || quantity <= 1}
                >
                    -
                </button>
                <div className="text-center w-24">
                    <span className="text-2xl font-bold font-mono text-white">{quantity}</span>
                    <p className="text-xs text-gray-400">Tickets</p>
                </div>
                <button
                    onClick={() => setQuantity(Math.min(50, quantity + 1))}
                    className="w-10 h-10 rounded-lg bg-gray-800 hover:bg-hollow-cyan/20 text-white font-bold transition"
                    disabled={loading || quantity >= 50}
                >
                    +
                </button>
            </div>

            {/* Total Price & Buy Button */}
            <div className="w-full flex flex-col gap-2">
                <button
                    onClick={handleBuyTicket}
                    disabled={!publicKey || loading}
                    className={`
                        w-full px-8 py-4 rounded-xl text-xl font-bold text-white shadow-lg transform transition
                        flex justify-between items-center group
                        ${!publicKey
                            ? 'bg-gray-600 cursor-not-allowed'
                            : loading
                                ? 'bg-gray-700 cursor-wait'
                                : 'bg-gradient-to-r from-hollow-pink to-hollow-purple hover:scale-[1.02] hover:shadow-hollow-purple/50'
                        }
                    `}
                >
                    <span>{loading ? 'Processing...' : `Buy ${quantity} Ticket${quantity > 1 ? 's' : ''}`}</span>
                    <span className="bg-black/20 px-3 py-1 rounded-lg text-lg">
                        {quantity * 2} USDC
                    </span>
                </button>
            </div>

            {status && (
                <p className={`text-sm font-semibold text-center p-2 rounded ${status.includes('Error') || status.includes('failed') ? 'bg-red-900/20 text-red-400' : 'bg-green-900/20 text-green-400'}`}>
                    {status}
                </p>
            )}

            {lastTxSignature && (
                <a
                    href={`https://solscan.io/tx/${lastTxSignature}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-hollow-cyan hover:text-hollow-pink text-sm font-semibold underline transition flex items-center justify-center gap-2"
                >
                    🔗 View Transaction on Solscan
                </a>
            )}
        </div>
    );
}
