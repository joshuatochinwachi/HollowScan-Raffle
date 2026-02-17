import { useState, useEffect } from 'react';
import Head from 'next/head';
import WalletButton from '../components/WalletButton';
import { useWallet } from '@solana/wallet-adapter-react';

export default function Admin() {
    const { publicKey } = useWallet();
    const [secretKey, setSecretKey] = useState('');
    const [tickets, setTickets] = useState([]);
    const [winner, setWinner] = useState(null);
    const [status, setStatus] = useState('');

    const fetchTickets = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tickets`);
            const data = await res.json();
            setTickets(data.tickets || []);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, []);

    const handleDrawWinner = async () => {
        if (!confirm("Are you sure you want to draw the winner? This cannot be undone.")) return;

        setStatus("Drawing winner...");

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/draw-winner`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${secretKey}`
                }
            });

            const data = await res.json();

            if (data.success) {
                setWinner(data.winner);
                setStatus(`Winner Drawn! Ticket #${data.winner.ticketNumber}`);
            } else {
                setStatus(`Error: ${data.message}`);
            }
        } catch (error) {
            setStatus(`Request failed: ${error.message}`);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <Head>
                <title>Raffle Admin</title>
            </Head>

            <header className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <WalletButton />
            </header>

            <div className="max-w-4xl mx-auto flex flex-col gap-8">

                {/* Controls */}
                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                    <h2 className="text-xl font-bold mb-4">Raffle Controls</h2>

                    <div className="flex flex-col gap-4">
                        <input
                            type="password"
                            placeholder="Enter Admin Secret Key"
                            className="bg-gray-900 border border-gray-600 p-3 rounded text-white"
                            value={secretKey}
                            onChange={(e) => setSecretKey(e.target.value)}
                        />

                        <button
                            onClick={handleDrawWinner}
                            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded transition"
                        >
                            🛑 DRAW WINNER (Irreversible)
                        </button>

                        {status && (
                            <div className="p-3 bg-gray-900 rounded border border-gray-600 font-mono">
                                {status}
                            </div>
                        )}
                    </div>
                </div>

                {/* Winner Display */}
                {winner && (
                    <div className="bg-green-900/50 p-6 rounded-xl border border-green-500 text-center animate-pulse">
                        <h2 className="text-2xl font-bold text-green-300 mb-2">🎉 WINNER SELECTED 🎉</h2>
                        <div className="text-xl">Ticket #{winner.ticketNumber}</div>
                        <div className="font-mono text-sm opacity-80">{winner.buyer}</div>
                        <div className="text-xs text-gray-400 mt-2">Tx: {winner.txSignature}</div>
                    </div>
                )}

                {/* Ticket List */}
                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                    <h2 className="text-xl font-bold mb-4">Tickets Sold ({tickets.length})</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-400">
                            <thead className="text-gray-200 border-b border-gray-700">
                                <tr>
                                    <th className="p-2">#</th>
                                    <th className="p-2">Buyer</th>
                                    <th className="p-2">Time</th>
                                    <th className="p-2">Tx</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tickets.map((t) => (
                                    <tr key={t.ticketNumber} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                                        <td className="p-2 text-white font-mono">{t.ticketNumber}</td>
                                        <td className="p-2 font-mono" title={t.buyer}>{t.buyer.slice(0, 8)}...{t.buyer.slice(-8)}</td>
                                        <td className="p-2">{new Date(t.timestamp).toLocaleString()}</td>
                                        <td className="p-2 font-mono text-xs">
                                            <a
                                                href={`https://solscan.io/tx/${t.txSignature}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-blue-400 hover:underline"
                                            >
                                                View
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
}
