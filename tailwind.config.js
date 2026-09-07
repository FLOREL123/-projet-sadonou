module.exports = {
  content: ["./pages/*.{html,js}", "./index.html"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1a365d", // navy-900
          50: "#e6f3ff",
          100: "#b3d9ff", 
          200: "#80bfff",
          300: "#4da6ff",
          400: "#1a8cff",
          500: "#0066cc",
          600: "#004d99",
          700: "#003366",
          800: "#001a33",
          900: "#1a365d"
        },
        secondary: {
          DEFAULT: "#2d3748", // gray-800
          50: "#f7fafc",
          100: "#edf2f7",
          200: "#e2e8f0",
          300: "#cbd5e0",
          400: "#a0aec0",
          500: "#718096",
          600: "#4a5568",
          700: "#2d3748",
          800: "#1a202c",
          900: "#171923"
        },
        accent: {
          DEFAULT: "#d69e2e", // yellow-600
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d69e2e",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f"
        },
        background: "#ffffff", // white
        surface: "#f7fafc", // gray-50
        textPrimary: "#2d3748", // gray-800
        textSecondary: "#718096", // gray-500
        success: {
          DEFAULT: "#38a169", // green-600
          50: "#f0fff4",
          100: "#c6f6d5",
          200: "#9ae6b4",
          300: "#68d391",
          400: "#48bb78",
          500: "#38a169",
          600: "#2f855a",
          700: "#276749",
          800: "#22543d",
          900: "#1c4532"
        },
        warning: {
          DEFAULT: "#ed8936", // orange-500
          50: "#fffaf0",
          100: "#feebc8",
          200: "#fbd38d",
          300: "#f6ad55",
          400: "#ed8936",
          500: "#dd6b20",
          600: "#c05621",
          700: "#9c4221",
          800: "#7b341e",
          900: "#652b19"
        },
        error: {
          DEFAULT: "#e53e3e", // red-500
          50: "#fed7d7",
          100: "#feb2b2",
          200: "#fc8181",
          300: "#f56565",
          400: "#e53e3e",
          500: "#c53030",
          600: "#9b2c2c",
          700: "#742a2a",
          800: "#63171b",
          900: "#521b1b"
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
        playfair: ['Playfair Display', 'serif'],
        inter: ['Inter', 'sans-serif']
      },
      fontSize: {
        'xs': '0.75rem',
        'sm': '0.875rem',
        'base': '1rem',
        'lg': '1.125rem',
        'xl': '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
        '6xl': '3.75rem',
        '7xl': '4.5rem',
        '8xl': '6rem',
        '9xl': '8rem'
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem'
      },
      boxShadow: {
        'subtle': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        'medium': '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        'strong': '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem'
      },
      transitionDuration: {
        '2000': '2000ms'
      },
      animation: {
        'counter': 'counter 2000ms ease-in-out',
        'fade-in': 'fadeIn 300ms ease-in-out',
        'slide-up': 'slideUp 300ms ease-in-out'
      },
      keyframes: {
        counter: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      }
    },
  },
  plugins: [],
}