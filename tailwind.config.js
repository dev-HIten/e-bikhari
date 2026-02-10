/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'focus-black': '#0a0a0a',
                'focus-gray': '#1c1c1e',
                'focus-accent': '#ffffff',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                display: ['"Plus Jakarta Sans"', 'sans-serif'],
            },
            keyframes: {
                shine: {
                    '0%': { left: '-150%' },
                    '100%': { left: '150%' }
                },
                shimmer: {
                    '100%': { transform: 'translateX(100%)' },
                }
            },
            animation: {
                shine: 'shine 0.8s ease-out forwards',
                shimmer: 'shimmer 1.5s infinite',
            }
        }
    },
    plugins: [],
}
