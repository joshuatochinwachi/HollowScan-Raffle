export default function WinnerDisplay({ winner }) {
    if (!winner) return null;

    const truncateAddress = (addr) => {
        if (!addr) return '';
        return `${addr.slice(0, 6)}...${addr.slice(-6)}`;
    };

    return (
        <div className="w-full max-w-4xl mx-auto py-12 px-6">
            <div className="relative group">
                {/* Animated Background Glow */}
                <div className="absolute -inset-1 bg-gradient-to-r from-hollow-pink via-hollow-purple to-hollow-cyan rounded-3xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse-glow"></div>

                <div className="relative bg-black rounded-3xl p-8 md:p-12 border border-white/10 flex flex-col items-center text-center">
                    <div className="inline-block px-4 py-1 rounded-full border border-hollow-pink/30 bg-hollow-pink/10 text-hollow-pink text-sm font-bold tracking-widest uppercase mb-6 backdrop-blur-md">
                        Official Results
                    </div>

                    <h2 className="text-4xl md:text-6xl font-black brand-font mb-4 text-white uppercase tracking-tight">
                        We Have a <span className="pokemon-gradient-text">Winner!</span>
                    </h2>

                    <p className="text-gray-400 text-lg mb-8 max-w-2xl leading-relaxed">
                        The draw has been completed and verified on-chain. Congratulations to the lucky holder of the winning ticket!
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
                        {/* Winner Wallet */}
                        <div className="glass-panel p-6 rounded-2xl border border-hollow-cyan/20 bg-hollow-cyan/5">
                            <span className="text-hollow-cyan text-xs font-bold uppercase tracking-widest block mb-2">Winning Wallet</span>
                            <div className="text-xl md:text-2xl font-mono font-bold text-white break-all">
                                {truncateAddress(winner.address)}
                            </div>
                        </div>

                        {/* Winning Ticket */}
                        <div className="glass-panel p-6 rounded-2xl border border-hollow-pink/20 bg-hollow-pink/5">
                            <span className="text-hollow-pink text-xs font-bold uppercase tracking-widest block mb-2">Winning Ticket ID</span>
                            <div className="text-4xl md:text-5xl font-black text-white brand-font">
                                #{winner.ticketId}
                            </div>
                        </div>
                    </div>

                    {winner.tx && (
                        <a
                            href={`https://solscan.io/tx/${winner.tx}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-10 flex items-center gap-2 text-gray-400 hover:text-white transition group/link"
                        >
                            <span className="text-sm font-medium border-b border-gray-700 group-hover/link:border-white">Verify Raffle Entry on Solscan</span>
                            <svg className="w-4 h-4 transform group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}
