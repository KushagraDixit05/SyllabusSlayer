import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			ink: 'hsl(var(--ink))',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))'
  			},
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
  			brand: {
  				from: 'hsl(var(--brand-from))',
  				to: 'hsl(var(--brand-to))',
  				hover: 'hsl(var(--brand-hover))'
  			},
  			flame: {
  				from: 'hsl(var(--flame-from))',
  				to: 'hsl(var(--flame-to))'
  			},
  			gold: 'hsl(var(--gold))',
  			rarity: {
  				common: 'hsl(var(--rarity-common))',
  				'common-foreground': 'hsl(var(--rarity-common-foreground))',
  				rare: 'hsl(var(--rarity-rare))',
  				'rare-foreground': 'hsl(var(--rarity-rare-foreground))',
  				epic: 'hsl(var(--rarity-epic))',
  				'epic-foreground': 'hsl(var(--rarity-epic-foreground))',
  				legendary: 'hsl(var(--rarity-legendary))',
  				'legendary-foreground': 'hsl(var(--rarity-legendary-foreground))'
  			}
  		},
  		backgroundImage: {
  			'brand-gradient': 'linear-gradient(135deg, hsl(var(--brand-from)) 0%, hsl(var(--brand-to)) 100%)',
  			'flame-gradient': 'linear-gradient(135deg, hsl(var(--flame-from)) 0%, hsl(var(--flame-to)) 100%)'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 0.375rem)',
  			sm: 'calc(var(--radius) - 0.625rem)'
  		},
  		borderWidth: {
  			'3': '3px'
  		},
  		boxShadow: {
  			'brutal-sm': '3px 3px 0 0 hsl(var(--ink))',
  			brutal: '5px 5px 0 0 hsl(var(--ink))',
  			'brutal-lg': '7px 7px 0 0 hsl(var(--ink))'
  		},
  		transitionDuration: {
  			'400': '400ms'
  		},
  		fontFamily: {
  			sans: [
  				'var(--font-inter)',
  				'ui-sans-serif',
  				'system-ui',
  				'sans-serif'
  			],
  			display: [
  				'var(--font-space-grotesk)',
  				'var(--font-inter)',
  				'sans-serif'
  			],
  			mono: [
  				'var(--font-jetbrains-mono)',
  				'ui-monospace',
  				'monospace'
  			]
  		},
  		keyframes: {
  			'fade-in': {
  				'0%': {
  					opacity: '0',
  					transform: 'translateY(10px)'
  				},
  				'100%': {
  					opacity: '1',
  					transform: 'translateY(0)'
  				}
  			},
  			'slide-in': {
  				'0%': {
  					transform: 'translateX(-100%)'
  				},
  				'100%': {
  					transform: 'translateX(0)'
  				}
  			},
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			},
  			'flame-pulse': {
  				'0%, 100%': {
  					transform: 'scale(1)'
  				},
  				'50%': {
  					transform: 'scale(1.03)'
  				}
  			},
  			'glow-fade': {
  				'0%': {
  					boxShadow: '0 0 0 0 hsl(var(--flame-from) / 0.35)'
  				},
  				'100%': {
  					boxShadow: '0 0 0 16px hsl(var(--flame-from) / 0)'
  				}
  			}
  		},
  		animation: {
  			'fade-in': 'fade-in 0.3s ease-out',
  			'slide-in': 'slide-in 0.3s ease-out',
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
  			'flame-pulse': 'flame-pulse 2s ease-in-out infinite',
  			'glow-fade': 'glow-fade 2s ease-out'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
