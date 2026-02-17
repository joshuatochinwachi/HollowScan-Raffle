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

    const [activeIndex, setActiveIndex] = useState(1);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize();
        window.addEventListener('resize', handleResize);

        const interval = setInterval(() => {
            setActiveIndex((current) => (current + 1) % slides.length);
        }, 4500);

        return () => {
            window.removeEventListener('resize', handleResize);
            clearInterval(interval);
        };
    }, [slides.length]);

    const getSlideStyles = (index) => {
        const isCenter = index === activeIndex;
        const isNext = index === (activeIndex + 1) % slides.length;

        // Dynamic translation based on screen size
        const translateVal = isMobile ? '45%' : '60%';
        const scaleVal = isMobile ? '0.75' : '0.8';

        if (isCenter) {
            return {
                zIndex: 20,
                opacity: 1,
                transform: 'translateX(0) scale(1) perspective(1000px) rotateY(0deg)',
                filter: 'brightness(1.1) drop-shadow(0 20px 50px rgba(0,0,0,0.5))'
            };
        } else if (isNext) {
            return {
                zIndex: 10,
                opacity: 0.5,
                transform: `translateX(${translateVal}) scale(${scaleVal}) perspective(1000px) rotateY(-15deg)`,
                filter: 'blur(3px) brightness(0.6)'
            };
        } else {
            return {
                zIndex: 10,
                opacity: 0.5,
                transform: `translateX(-${translateVal}) scale(${scaleVal}) perspective(1000px) rotateY(15deg)`,
                filter: 'blur(3px) brightness(0.6)'
            };
        }
    };

    return (
        <div className="relative w-full h-[480px] sm:h-[500px] flex items-center justify-center pt-16 md:pt-24 mt-8 md:mt-0">
            {/* Glow Effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-gradient-to-tr from-hollow-pink/20 to-hollow-cyan/20 blur-[100px] rounded-full animate-pulse-glow z-0 pointer-events-none"></div>

            {slides.map((slide, index) => (
                <div
                    key={index}
                    className="absolute transition-all duration-1000 cubic-bezier(0.4, 0, 0.2, 1) w-[220px] h-[330px] sm:w-[320px] sm:h-[500px] rounded-2xl overflow-hidden border border-white/10 bg-gray-900 shadow-2xl"
                    style={getSlideStyles(index)}
                >
                    <img
                        src={slide.src}
                        alt={slide.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80"></div>
                </div>
            ))}

            <div className="absolute bottom-[0px] md:bottom-[-60px] left-0 right-0 text-center z-30 transition-all duration-700 px-4">
                <div className="inline-block px-3 py-1 bg-hollow-cyan/10 backdrop-blur-xl border border-hollow-cyan/30 text-hollow-cyan rounded-full text-[9px] md:text-xs font-bold tracking-widest uppercase mb-3 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                    {slides[activeIndex].label}
                </div>
                <h3 className="text-sm md:text-xl font-bold text-white brand-font drop-shadow-2xl max-w-[300px] md:max-w-xl mx-auto leading-tight md:leading-snug animate-fade-in px-2">
                    {slides[activeIndex].title}
                </h3>
            </div>
        </div>
    );
};

export default HeroSlider;
