import { useState, useEffect } from 'react';
import Head from 'next/head';
import WalletButton from '../components/WalletButton';
import BuyTicketButton from '../components/BuyTicketButton';
import HeroSlider from '../components/HeroSlider';
import { useWallet } from '@solana/wallet-adapter-react';

export default function Home() {
    const { publicKey } = useWallet();
    const [raffleInfo, setRaffleInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchRaffleInfo = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/raffle-info`);
            const data = await res.json();
            setRaffleInfo(data);
        } catch (error) {
            console.error("Failed to fetch raffle info", error);
        }
    };

    const fetchTickets = async () => {
        await fetchRaffleInfo();
    }

    const [userTickets, setUserTickets] = useState([]);

    const fetchUserTickets = async () => {
        if (!publicKey) return;
        try {
            console.log('Fetching tickets for wallet:', publicKey.toString());
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tickets?wallet=${publicKey.toString()}`);
            const data = await res.json();
            console.log('Received tickets:', data);
            setUserTickets(data || []);
        } catch (error) {
            console.error("Failed to fetch user tickets", error);
        }
    };

    useEffect(() => {
        if (publicKey) {
            fetchUserTickets();
        } else {
            setUserTickets([]);
        }
    }, [publicKey]);

    useEffect(() => {
        fetchRaffleInfo();
        const interval = setInterval(fetchRaffleInfo, 10000); // Poll every 10s
        setLoading(false);
        return () => clearInterval(interval);
    }, []);

    // Config defaults
    const maxTickets = raffleInfo?.maxTickets || parseInt(process.env.NEXT_PUBLIC_MAX_TICKETS) || 10000;
    const soldTickets = raffleInfo?.totalTickets || 0;
    const remainingTickets = maxTickets - soldTickets;
    const progressPercent = (soldTickets / maxTickets) * 100;

    // Countdown Timer Logic
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const timer = setInterval(() => {
            const endDate = new Date(raffleInfo?.endDate || process.env.NEXT_PUBLIC_RAFFLE_END_DATE).getTime();
            const now = new Date().getTime();
            const distance = endDate - now;

            if (distance < 0) {
                clearInterval(timer);
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            } else {
                setTimeLeft({
                    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((distance % (1000 * 60)) / 1000)
                });
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [raffleInfo]);

    return (
        <div className="min-h-screen flex flex-col items-center relative overflow-hidden text-white selection:bg-hollow-pink selection:text-white">
            <Head>
                <title>Hollow Raffle | Win the BGS 7.5 1st Edition Charizard</title>
                <meta name="description" content="Win a BGS 7.5 Near Mint+ 1st Edition Charizard worth $26,000.00!" />
                <link rel="icon" href="/favicon.png" />
            </Head>

            {/* Animated Mesh Background */}
            <div className="mesh-bg">
                <div className="orb orb-1"></div>
                <div className="orb orb-2"></div>
                <div className="orb orb-3"></div>
            </div>

            {/* Navbar */}
            <header className="w-full max-w-7xl p-4 md:p-6 flex justify-between items-center z-50">
                <div className="glass-panel px-3 md:px-6 py-2 md:py-3 rounded-full flex items-center gap-2 md:gap-3">
                    <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-hollow-pink animate-pulse"></div>
                    <span className="text-sm md:text-2xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 brand-font">
                        HOLLOW RAFFLE
                    </span>
                </div>
                <WalletButton />
            </header>

            <main className="flex flex-col items-center w-full max-w-7xl px-4 flex-1 py-8 md:py-16 gap-20 z-10">

                {/* Hero Section */}
                <div className="flex flex-col md:flex-row items-center justify-between w-full gap-12">

                    {/* Left: Text & CTA */}
                    <div className="flex-1 flex flex-col text-center md:text-left">
                        <div className="inline-block px-4 py-1 rounded-full border border-hollow-cyan/30 bg-hollow-cyan/10 text-hollow-cyan text-sm font-bold tracking-widest uppercase mb-6 w-fit mx-auto md:mx-0 backdrop-blur-md">
                            Live on Solana Mainnet
                        </div>

                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-black leading-tight brand-font mb-6 drop-shadow-2xl uppercase">
                            WIN THE <br />
                            <span className="pokemon-gradient-text text-glow">1ST EDITION CHARIZARD</span>
                        </h1>

                        {/* Countdown Timer */}
                        <div className="flex gap-2 md:gap-4 mb-8 justify-center md:justify-start">
                            {[
                                { label: 'Days', value: timeLeft.days },
                                { label: 'Hours', value: timeLeft.hours },
                                { label: 'Minutes', value: timeLeft.minutes },
                                { label: 'Seconds', value: timeLeft.seconds }
                            ].map((item, i) => (
                                <div key={i} className="flex flex-col items-center bg-black/40 border border-gray-700 p-2 md:p-3 rounded-lg min-w-[60px] md:min-w-[70px] backdrop-blur-sm">
                                    <span className="text-xl md:text-2xl font-bold font-mono text-hollow-cyan">{String(item.value).padStart(2, '0')}</span>
                                    <span className="text-[10px] md:text-xs text-gray-400 uppercase tracking-wider">{item.label}</span>
                                </div>
                            ))}
                        </div>



                        <p className="text-gray-300 text-sm md:text-lg lg:text-xl mb-8 max-w-lg mx-auto md:mx-0 leading-relaxed">
                            Own one of the rarest collectibles in history. A <b>BGS 7.5 Near Mint+</b> First Edition Charizard Holo. Valued at <b className="text-hollow-cyan">$26,000.00</b>. Verified on-chain, exclusively on HollowScan.
                        </p>

                        <div className="flex flex-col items-center md:items-start gap-4">
                            {!publicKey ? (
                                <div className="glass-card p-6 rounded-2xl border border-gray-600/50 text-center w-full max-w-md">
                                    <p className="text-gray-300 mb-4">Connect your wallet to enter the draw</p>
                                    <div className="animate-bounce">👇</div>
                                </div>
                            ) : (
                                <div className="w-full max-w-md space-y-6">
                                    <BuyTicketButton onPurchaseSuccess={() => { fetchTickets(); fetchUserTickets(); }} />

                                    {/* User Tickets Display */}
                                    <div className="glass-panel p-4 rounded-xl border border-hollow-cyan/30 bg-hollow-cyan/5">
                                        <div className="flex justify-between items-center mb-2">
                                            <h3 className="text-hollow-cyan font-bold uppercase tracking-wider text-sm">My Tickets</h3>
                                            <span className="bg-hollow-cyan/20 text-hollow-cyan text-xs font-bold px-2 py-1 rounded-full">{userTickets.length} Entries</span>
                                        </div>
                                        {userTickets.length > 0 ? (
                                            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto pr-2 custom-scrollbar">
                                                {userTickets.map((ticket) => (
                                                    <span key={ticket.id} className="text-xs bg-black/40 border border-gray-700 text-gray-300 px-2 py-1 rounded font-mono">
                                                        #{ticket.id}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-gray-400 text-xs text-center py-2">No tickets purchased yet</p>
                                        )}
                                    </div>
                                </div>
                            )}
                            <p className="text-xs text-gray-500 uppercase tracking-widest mt-2">
                                Verified • Transparent • Immutable
                            </p>
                        </div>
                    </div>

                    {/* Right: Floating Card Slider */}
                    <div className="flex-1 flex justify-center relative w-full z-0">
                        <HeroSlider />
                    </div>
                </div>

                {/* Stats Dashboard */}
                <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Stat Card 1 */}
                    <div className="glass-card p-6 rounded-2xl flex flex-col items-center justify-center text-center card-hover">
                        <span className="text-gray-400 text-sm uppercase tracking-wider mb-2">Entry Price</span>
                        <div className="text-4xl font-black text-white brand-font">2 USDC</div>
                        <span className="text-xs text-hollow-cyan mt-1">Fixed Rate</span>
                    </div>

                    {/* Stat Card 2: Progress */}
                    <div className="glass-card p-6 rounded-2xl flex flex-col justify-center card-hover md:col-span-2">
                        <div className="flex justify-between items-end mb-4">
                            <div>
                                <span className="text-gray-400 text-sm uppercase tracking-wider block mb-1">Tickets Sold</span>
                                <div className="text-3xl font-black text-white brand-font">
                                    {soldTickets.toLocaleString()} <span className="text-gray-600 text-xl">/ {maxTickets.toLocaleString()}</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-hollow-pink font-bold text-xl">{remainingTickets.toLocaleString()}</span>
                                <span className="text-gray-500 text-xs block uppercase tracking-wider">Remaining</span>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full h-4 bg-gray-800 rounded-full overflow-hidden border border-gray-700">
                            <div
                                className="h-full bg-gradient-to-r from-hollow-pink via-hollow-purple to-hollow-cyan rounded-full transition-all duration-1000 ease-out"
                                style={{ width: `${Math.max(5, progressPercent)}%` }} // Min 5% so visualization is visible
                            ></div>
                        </div>
                    </div>
                </div>

                {/* Features */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mt-8">
                    {[
                        { icon: "⚡", title: "Instant", desc: "Connect -> Approve -> Win. No signups typically required." },
                        { icon: "🔒", title: "Secure", desc: "Powered by Solana blockchain. Your funds are verifying on-chain." },
                        { icon: "🎲", title: "Provably Fair", desc: "Randomness generated on backend, verifiable via transaction hash." }
                    ].map((feature, i) => (
                        <div key={i} className="glass-panel p-8 rounded-3xl hover:bg-white/5 transition duration-300 border border-transparent hover:border-hollow-purple/30 group">
                            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
                            <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                            <p className="text-gray-400 leading-relaxed text-sm">{feature.desc}</p>
                        </div>
                    ))}
                </div>

            </main>

            {/* Simple Footer */}
            <footer className="w-full py-8 text-center text-gray-600 text-sm z-10 glass-panel border-t-0 border-b-0 border-l-0 border-r-0 border-t border-gray-800">
                <p>© 2026 HollowScan Raffle System. All rights reserved.</p>
            </footer>
        </div>
    );
}
