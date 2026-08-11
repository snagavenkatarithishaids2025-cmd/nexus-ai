@AGENTS.md
# GLOBAL DESIGN SYSTEM RULES

## 1. Color Palette & Canvas
- **Canvas Background:** `#F5F2EB` (Warm Beige)
- **Primary Bento Card:** `#004434` (Deep Forest Green) with white text (`text-white`)
- **Secondary Bento Card:** `#EAE5D9` (Muted Warm Cream) with dark charcoal text (`text-[#1C1917]`)
- **Primary Text:** `#1C1917` (High-contrast dark charcoal on beige surfaces)

## 2. Typography Rules
- **Headings (`<h1>` to `<h6>`):** Always use `font-heading` (`Playfair Display` serif)
- **Body & Content:** Always use `font-body` (`Plus Jakarta Sans` sans-serif)

## 3. Bento Grid & Component Constraints
- **Layout Style:** Asymmetric Bento Grid (`grid grid-cols-1 md:grid-cols-4 gap-4`)
- **Card Radius:** ALWAYS use `rounded-3xl` on container cards.
- **Card Primitives:** Use `<BentoCard>` from `@/components/BentoCard`.
- **NO Legacy Dark Overrides:** Do NOT use flat dark gray cards (`bg-slate-900` or `bg-[#03050a]`).
-