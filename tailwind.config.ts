import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Core surface layers
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        "surface-1": "hsl(var(--surface-1))",
        "surface-2": "hsl(var(--surface-2))",
        "surface-3": "hsl(var(--surface-3))",

        // Text colors
        "text-secondary": "hsl(var(--text-secondary))",
        "text-tertiary": "hsl(var(--text-tertiary))",

        // Borders
        border: "hsl(var(--border))",
        "border-glow": "hsl(var(--border-glow))",
        input: "hsl(var(--surface-2) / 0.5)",
        ring: "hsl(var(--ring))",

        // Shadcn standard
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          glow: "hsl(var(--primary-glow))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },

        // Role-based accents with glow variants
        admin: {
          DEFAULT: "hsl(var(--admin))",
          soft: "hsl(var(--admin-soft))",
          glow: "hsl(var(--admin-glow))",
        },
        shop: {
          DEFAULT: "hsl(var(--shop))",
          soft: "hsl(var(--shop-soft))",
          glow: "hsl(var(--shop-glow))",
        },
        delivery: {
          DEFAULT: "hsl(var(--delivery))",
          soft: "hsl(var(--delivery-soft))",
          glow: "hsl(var(--delivery-glow))",
        },

        // Status colors with glow variants
        success: {
          DEFAULT: "hsl(var(--success))",
          soft: "hsl(var(--success-soft))",
          glow: "hsl(var(--success-glow))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          soft: "hsl(var(--warning-soft))",
          glow: "hsl(var(--warning-glow))",
        },
        error: {
          DEFAULT: "hsl(var(--error))",
          soft: "hsl(var(--error-soft))",
          glow: "hsl(var(--error-glow))",
        },
        info: {
          DEFAULT: "hsl(var(--info))",
          soft: "hsl(var(--info-soft))",
          glow: "hsl(var(--info-glow))",
        },
      },

      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },

      fontFamily: {
        heading: ["var(--font-heading)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
        urdu: ["Noto Nastaliq Urdu", "system-ui", "sans-serif"],
      },

      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(var(--tw-gradient-stops))",
      },

      boxShadow: {
        glow: "0 0 20px hsl(var(--primary-glow) / 0.15)",
        "glow-lg": "0 0 40px hsl(var(--primary-glow) / 0.2)",
        "glow-sm": "0 0 8px hsl(var(--primary-glow) / 0.3)",
        glass: "0 4px 24px hsl(0 0% 0% / 0.2), inset 0 1px 0 hsl(0 0% 100% / 0.05)",
        "glass-hover": "0 8px 32px hsl(0 0% 0% / 0.3), 0 0 20px hsl(var(--primary-glow) / 0.08)",
      },

      keyframes: {
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideRight: {
          "0%": { opacity: "0", transform: "translateX(-16px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        slideLeft: {
          "0%": { opacity: "0", transform: "translateX(16px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 8px hsl(var(--warning-glow) / 0.3)" },
          "50%": { boxShadow: "0 0 20px hsl(var(--warning-glow) / 0.6)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        gradientShift: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },

      animation: {
        "fade-in-up": "fadeInUp 0.5s ease-out both",
        "slide-right": "slideRight 0.4s ease-out both",
        "slide-left": "slideLeft 0.4s ease-out both",
        "scale-in": "scaleIn 0.3s ease-out both",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        shimmer: "shimmer 2s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        "gradient-shift": "gradientShift 15s ease infinite",
      },

      transitionTimingFunction: {
        spring: "cubic-bezier(0.4, 0, 0.2, 1)",
        bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
