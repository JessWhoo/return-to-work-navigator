/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
  	extend: {
  		fontFamily: {
  			sans: ['Nunito Sans', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
  			heading: ['var(--font-heading)'],
  			body: ['var(--font-body)'],
  			display: ['Cinzel', 'Georgia', 'serif'],
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)',
  			brand: 'var(--brand-radius-md)',
  			'brand-lg': 'var(--brand-radius-lg)',
  			pill: 'var(--brand-radius-full)'
  		},
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			brand: {
  				DEFAULT: 'var(--brand-primary)',
  				primary: 'var(--brand-primary)',
  				onPrimary: 'var(--brand-on-primary)',
  				secondary: 'var(--brand-secondary)',
  				accent: 'var(--brand-accent)',
  				sky: 'var(--brand-sky)',
  				cream: 'var(--brand-compass-cream)',
  				background: 'var(--brand-background)',
  				surface: 'var(--brand-surface)',
  				text: 'var(--brand-text)',
  				muted: 'var(--brand-muted)',
  				'muted-foreground': 'var(--brand-muted-foreground)',
  				border: 'var(--brand-border)',
  				destructive: 'var(--brand-destructive)'
  			},
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': '12 76% 61%',
  				'2': '136 22% 64%',
  				'3': '263 14% 43%',
  				'4': '351 51% 78%',
  				'5': '45 31% 80%'
  			}
  		},
  		boxShadow: {
  			'brand-sm': 'var(--brand-shadow-sm)',
  			'brand-md': 'var(--brand-shadow-md)',
  			'brand-lg': 'var(--brand-shadow-lg)'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: { height: '0' },
  				to: { height: 'var(--radix-accordion-content-height)' }
  			},
  			'accordion-up': {
  				from: { height: 'var(--radix-accordion-content-height)' },
  				to: { height: '0' }
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
}
