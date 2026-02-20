import { useState, useEffect } from 'react';

const HeroSlider = () => {
    const [isFlipped, setIsFlipped] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setIsFlipped(prev => !prev);
        }, 4000); // Flip every 4 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative w-full h-[600px] md:h-[750px] flex flex-col items-center justify-center pt-4 md:pt-8">
            {/* Glow Effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-gradient-to-tr from-hollow-pink/15 to-hollow-cyan/15 blur-[120px] rounded-full animate-pulse-glow z-0 pointer-events-none"></div>

            {/* Flipped Card Container - Strict Vertical Aspect Ratio */}
            <div
                className="relative w-[280px] h-[420px] sm:w-[380px] sm:h-[570px] transition-all duration-1000 preserve-3d cursor-pointer group z-10"
                style={{ transform: `perspective(2000px) rotateY(${isFlipped ? '180deg' : '0deg'})` }}
                onClick={() => setIsFlipped(!isFlipped)}
            >
                {/* Front Side */}
                <div className="absolute inset-0 backface-hidden rounded-[2rem] overflow-hidden border-[6px] border-white/5 bg-black shadow-[0_0_50px_rgba(0,0,0,0.8)]">
                    <img
                        src="/charizard_bgs_front.jpg"
                        alt="BGS 7.5 Charizard Front"
                        className="w-full h-full object-cover scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-50 pointer-events-none"></div>

                    {/* Premium Case Glint */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full rotate-45 transform pointer-events-none"></div>
                </div>

                {/* Back Side */}
                <div
                    className="absolute inset-0 backface-hidden rounded-[2rem] overflow-hidden border-[6px] border-white/5 bg-black shadow-[0_0_50px_rgba(0,0,0,0.8)]"
                    style={{ transform: 'rotateY(180deg)' }}
                >
                    <img
                        src="/charizard_bgs_back.jpg"
                        alt="BGS 7.5 Charizard Back"
                        className="w-full h-full object-cover scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-50 pointer-events-none"></div>
                </div>
            </div>

            {/* Prize Info Overlay */}
            <div className="mt-12 text-center z-30 transition-all duration-700 px-4">
                <div className="inline-block px-5 py-2 bg-hollow-pink/10 backdrop-blur-2xl border border-hollow-pink/30 text-hollow-pink rounded-full text-xs md:text-sm font-bold tracking-[0.2em] uppercase mb-4 shadow-[0_0_20px_rgba(236,72,153,0.3)]">
                    BGS 7.5 NEAR MINT+
                </div>
                <h3 className="text-xl md:text-4xl font-bold text-white brand-font drop-shadow-2xl max-w-[320px] md:max-w-2xl mx-auto leading-tight md:leading-[1.1] px-2 italic uppercase">
                    1999 Base Set 1st Edition <br />
                    <span className="text-hollow-cyan">Charizard Holo 4/102</span>
                </h3>
                <div className="mt-6 flex flex-col items-center gap-1">
                    <span className="text-gray-400 text-[10px] md:text-xs font-bold tracking-widest uppercase">Current Market Value</span>
                    <div className="text-4xl md:text-6xl font-black pokemon-gradient-text text-glow animate-pulse tracking-tighter">
                        $26,000.00
                    </div>
                </div>
            </div>

            <style jsx>{`
                .preserve-3d {
                    transform-style: preserve-3d;
                }
                .backface-hidden {
                    backface-visibility: hidden;
                }
            `}</style>
        </div>
    );
};

export default HeroSlider;
