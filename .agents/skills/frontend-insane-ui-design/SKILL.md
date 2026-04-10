---
name: frontend-insane-ui-design
description: Use this skill when building or styling any frontend interface — components, pages, landing pages, dashboards, portfolios, posters, or any visual UI. Triggers on: "build a UI", "create a component", "design a page", "make it look good", "build a landing page", "style this", "create a dashboard", "make it beautiful", "build a frontend", or any request involving visual interface creation. Produces production-grade, visually unforgettable interfaces that avoid generic AI aesthetics.
---

# Frontend Insane UI Design Skill

Build distinctive, production-grade frontend interfaces. Every output must be visually unforgettable and avoid generic "AI slop" aesthetics. This skill applies to HTML/CSS/JS, React, Next.js, or any frontend stack.

---

## Step 0 — Design Thinking Before Any Code

Before writing a single line, commit to a bold aesthetic direction:

- **Purpose**: What problem does this UI solve? Who uses it?
- **Tone**: Pick ONE extreme and own it fully:
  - Brutally minimal | Maximalist chaos | Retro-futuristic | Organic/natural
  - Luxury/refined | Playful/toy-like | Editorial/magazine | Brutalist/raw
  - Art deco/geometric | Soft/pastel | Industrial/utilitarian | Cyberpunk/neon
- **Differentiation**: What's the ONE thing someone will remember about this UI?

Never start coding without this decision locked in.

---

## Rule 1 — Typography

**BANNED**: Inter, Roboto, Arial, system-ui, Helvetica as the primary font.

**REQUIRED**: Choose a characterful, unexpected font pairing every time.

- Heading/display font → distinctive, personality-driven
- Body font → refined, readable complement
- Import from Google Fonts CDN

```html
<!-- Example pairing: editorial dark theme -->
<link
  href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@300;400;500&display=swap"
  rel="stylesheet"
/>

<!-- Example pairing: brutalist tech -->
<link
  href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Barlow:wght@300;400;600&display=swap"
  rel="stylesheet"
/>

<!-- Example pairing: luxury minimal -->
<link
  href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=Jost:wght@300;400;500&display=swap"
  rel="stylesheet"
/>
```

Vary font choices across every generation. Never reuse the same pairing twice.

---

## Rule 2 — Color & Theme

- Use CSS custom properties for ALL color tokens
- Dominant color(s) with sharp accent(s) — no timid even distributions
- **BANNED**: purple gradient on white background
- Vary between dark, light, earthy, monochrome, saturated — never repeat

```css
/* Dark editorial example */
:root {
  --bg: #0a0a0a;
  --surface: #111111;
  --border: #1e1e1e;
  --text: #f0ede8;
  --muted: #6b6b6b;
  --accent: #c8a96e;
  --accent-2: #2a4a3e;
}

/* Soft organic example */
:root {
  --bg: #f5f0e8;
  --surface: #ede8dc;
  --border: #d4cfc4;
  --text: #1a1814;
  --muted: #7a7670;
  --accent: #8b6f47;
  --accent-2: #4a7c59;
}
```

---

## Rule 3 — Backgrounds & Atmosphere

Never use a flat solid color alone. Add depth with at least one:

```css
/* Gradient mesh */
background:
  radial-gradient(ellipse at 20% 50%, hsla(210, 80%, 50%, 0.12) 0%, transparent 60%),
  radial-gradient(ellipse at 80% 20%, hsla(280, 70%, 60%, 0.08) 0%, transparent 50%), var(--bg);

/* Grain texture overlay */
.grain::after {
  content: '';
  position: fixed;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  opacity: 0.035;
  pointer-events: none;
  z-index: 9999;
}

/* Geometric pattern */
background-image: radial-gradient(circle, var(--border) 1px, transparent 1px);
background-size: 28px 28px;
```

---

## Rule 4 — Motion & Animation

CSS-only for HTML. Framer Motion for React complex orchestration.

```css
/* Staggered page load — best pattern */
.item {
  animation: fadeUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
}
.item:nth-child(1) {
  animation-delay: 0ms;
}
.item:nth-child(2) {
  animation-delay: 80ms;
}
.item:nth-child(3) {
  animation-delay: 160ms;
}
.item:nth-child(4) {
  animation-delay: 240ms;
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Hover that surprises */
.card {
  transition:
    transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
    box-shadow 0.3s ease;
}
.card:hover {
  transform: translateY(-6px) rotate(0.5deg);
  box-shadow: 0 24px 48px -12px rgba(0, 0, 0, 0.4);
}
```

```tsx
// React — Framer Motion stagger
const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
};

<motion.ul variants={container} initial="hidden" animate="show">
  {items.map((i) => (
    <motion.li key={i.id} variants={item}>
      {i.name}
    </motion.li>
  ))}
</motion.ul>;
```

---

## Rule 5 — Spatial Composition

- Asymmetry over perfect centering
- Overlap elements to create depth layers
- At least one grid-breaking element per layout
- Choose: generous negative space OR controlled density — commit fully
- Diagonal rhythms welcome

```css
/* Overlapping elements */
.hero-image {
  position: absolute;
  right: -80px;
  top: -40px;
  z-index: 0;
}
.hero-text {
  position: relative;
  z-index: 1;
}

/* Grid-breaking accent */
.section-number {
  position: absolute;
  left: -2rem;
  font-size: 8rem;
  opacity: 0.06;
  font-weight: 900;
  line-height: 1;
}
```

---

## Anti-Patterns — Hard Stops

Stop and redesign if you catch yourself doing any of these:

- ❌ Inter / Roboto / Arial as primary font
- ❌ Purple-to-blue gradient on white
- ❌ Card grid: equal padding, center-aligned, `box-shadow: 0 2px 8px rgba(0,0,0,0.1)`
- ❌ Hero layout: big title + subtitle + 2 CTA buttons + right-side illustration
- ❌ Space Grotesk as the "distinctive" choice (it's now cliché)
- ❌ Flat solid background with no atmosphere
- ❌ Hover = just `opacity: 0.8`
- ❌ Every project looking visually identical

---

## Production Standards

Every output must be:

- Fully functional — not a mockup
- CSS custom properties for all design tokens
- Semantic HTML (`<nav>`, `<main>`, `<section>`, `<article>`)
- Keyboard accessible + visible focus rings
- AA color contrast minimum
- Mobile-responsive (mobile-first)

---

## Self-Check Before Delivery

> _"Would someone screenshot this and share it as an example of exceptional UI?"_

If the answer is uncertain — push the design further. This standard is non-negotiable.
