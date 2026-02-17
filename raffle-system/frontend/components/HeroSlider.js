import { useState, useEffect } from 'react';

const HeroSlider = () => {
    const slides = [
        {
            src: '/pack_venusaur.jpg',
            title: 'Sequential Pokemon Booster Pack 1st Ed BLACK TRIANGLE ERROR Art Set - PSA 10 (Charizard) SEALED Pack',
            label: '1st Edition Error Art'
        },
        {
            src: '/pack_charizard.jpg',
            title: 'PSA 10 GEM MINT Base Set (Charizard) SEALED Pack BLACK TRIANGLE ERROR Pokemon',
            label: 'PSA 10 GEM MINT'
        },
        {
            src: '/pack_blastoise.jpg',
            title: 'Wizards of the Coast Pokémon Trading Card Blister',
            label: 'WOTC Blister Pack'
        }
    ];

    const [activeIndex, setActiveIndex] = useState(1); // Start with Charizard (middle)

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((current) => (current + 1) % slides.length);
        }, 4000); // Rotate every 4 seconds

        return () => clearInterval(interval);
    }, [slides.length]);

    const getSlideStyles = (index) => {
        if (index === activeIndex) {
            return {
                zIndex: 20,
                opacity: 1,
                transform: 'translateX(0) scale(1) perspective(1000px) rotateY(0deg)',
                filter: 'brightness(1.1) drop-shadow(0 20px 50px rgba(0,0,0,0.5))'
            };
        } else if (index === (activeIndex + 1) % slides.length) {
            // Next slide (Right)
            return {
                zIndex: 10,
                opacity: 0.6,
                transform: 'translateX(60%) scale(0.8) perspective(1000px) rotateY(-15deg)',
                filter: 'blur(2px) brightness(0.7)'
            };
        } else {
            // Previous slide (Left)
            return {
                zIndex: 10,
                opacity: 0.6,
                transform: 'translateX(-60%) scale(0.8) perspective(1000px) rotateY(15deg)',
                filter: 'blur(2px) brightness(0.7)'
            };
        }
    };

    return (
        <div className="relative w-full h-[400px] sm:h-[500px] flex items-center justify-center pt-24 mt-20 md:mt-0">
            {/* Glow Effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-gradient-to-tr from-hollow-pink/30 to-hollow-cyan/30 blur-[80px] rounded-full animate-pulse-glow z-0 pointer-events-none"></div>

            {slides.map((slide, index) => (
                <div
                    key={index}
                    className="absolute transition-all duration-700 ease-in-out w-[240px] h-[360px] sm:w-[320px] sm:h-[500px] rounded-xl overflow-hidden border border-gray-700/50 bg-gray-900 shadow-2xl"
                    style={getSlideStyles(index)}
                >
                    <img
                        src={slide.src}
                        alt={slide.title}
                        className="w-full h-full object-cover"
                    />

                    {/* Overlay Gradient for depth */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
                </div>
            ))}

            <div className="absolute bottom-[-100px] md:bottom-[-80px] left-0 right-0 text-center z-30 transition-all duration-500 px-6">
                <div className="inline-block px-3 py-1 bg-black/60 backdrop-blur-md border border-hollow-cyan/50 text-hollow-cyan rounded-lg text-[10px] md:text-xs font-bold tracking-widest uppercase mb-2 shadow-lg">
                    {slides[activeIndex].label}
                </div>
                <h3 className="text-xs md:text-xl font-bold text-white brand-font drop-shadow-lg max-w-xl mx-auto leading-tight">
                    {slides[activeIndex].title}
                </h3>
            </div>
        </div>
    );
};

export default HeroSlider;
