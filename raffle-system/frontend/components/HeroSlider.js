import { useState, useEffect } from 'react';

const HeroSlider = () => {
    const [isFlipped, setIsFlipped] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setIsFlipped(prev => !prev);
        }, 3000); // Flip every 3 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative w-full h-[500px] flex flex-col items-center justify-center pt-8 md:pt-12 mt-8 md:mt-0">
            {/* Glow Effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-gradient-to-tr from-hollow-pink/20 to-hollow-cyan/20 blur-[100px] rounded-full animate-pulse-glow z-0 pointer-events-none"></div>

            {/* Flipped Card Container */}
            <div
                className="relative w-[280px] h-[420px] sm:w-[320px] sm:h-[480px] transition-all duration-1000 preserve-3d cursor-pointer group"
                style={{ transform: `perspective(1000px) rotateY(${isFlipped ? '180deg' : '0deg'})` }}
                onClick={() => setIsFlipped(!isFlipped)}
            >
                {/* Front Side */}
                <div className="absolute inset-0 backface-hidden rounded-2xl overflow-hidden border border-white/10 bg-gray-900 shadow-2xl">
                    <img
                        src="/charizard_bgs_front.jpg"
                        alt="BGS 7.5 Charizard Front"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-40"></div>
                </div>

                {/* Back Side */}
                <div
                    className="absolute inset-0 backface-hidden rounded-2xl overflow-hidden border border-white/10 bg-gray-900 shadow-2xl"
                    style={{ transform: 'rotateY(180deg)' }}
                >
                    <img
                        src="/charizard_bgs_back.jpg"
                        alt="BGS 7.5 Charizard Back"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-40"></div>
                </div>
            </div>

            {/* Prize Info Overlay (Detached but themed) */}
            <div className="mt-12 text-center z-30 transition-all duration-700 px-4">
                <div className="inline-block px-4 py-1.5 bg-hollow-pink/10 backdrop-blur-xl border border-hollow-pink/30 text-hollow-pink rounded-full text-[10px] md:text-xs font-bold tracking-widest uppercase mb-4 shadow-[0_0_15px_rgba(236,72,153,0.3)]">
                    BGS 7.5 NEAR MINT+
                </div>
                <h3 className="text-lg md:text-2xl font-bold text-white brand-font drop-shadow-2xl max-w-[320px] md:max-w-xl mx-auto leading-tight md:leading-snug px-2">
                    1999 Base 1st Edition <br />
                    <span className="text-hollow-cyan">Charizard Holo 4/102</span>
                </h3>
                <div className="mt-4 text-2xl md:text-4xl font-black pokemon-gradient-text text-glow animate-pulse">
                    VALUED AT £19,299.00
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
