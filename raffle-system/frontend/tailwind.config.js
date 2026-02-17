/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx}',
        './components/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            colors: {
                'hollow-pink': '#d946ef',   // Fuschia 500
                'hollow-purple': '#8b5cf6', // Violet 500
                'hollow-cyan': '#06b6d4',   // Cyan 500
                'hollow-dark': '#0b0c15',   // Deep Space
                'pokemon-blue': '#3B4CCA',
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'pulse-glow': 'pulse-glow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'spin-slow': 'spin 12s linear infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                'pulse-glow': {
                    '0%, 100%': { opacity: 1, filter: 'brightness(1.2) blur(8px)' },
                    '50%': { opacity: .7, filter: 'brightness(1) blur(4px)' },
                }
            }
        },
    },
    plugins: [],
}
