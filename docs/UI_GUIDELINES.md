# UI Guidelines

## Design character

The existing interface is a warm local-directory experience: off-white surfaces, deep-green primary actions, bold friendly headings, generous rounded corners, and soft shadows. Preserve this visual direction; these are current guidelines, not a redesign proposal.

## Color palette

| Role | Current value/use |
| --- | --- |
| App background | `#FAF7F2` warm off-white |
| Primary | `#14532D` deep green |
| Primary hover | `#166534` |
| Secondary green | `#16A34A` |
| Light green surface | `#F0FDF4` / `#EEF6E9` |
| Accent | `#FB923C` orange |
| Primary text | `#111827` charcoal |
| Muted text | `#6B7280` |
| Border | `#E5E7EB` |
| Destructive | `#EF4444` |

Global CSS defines dark-mode tokens, while the main product uses the warm light palette. Storefront appearance supports `earthy`, `minimal`, `dark`, and `modern` themes; appearance values apply only to storefront presentation.

## Typography

The global sans stack is `Inter`, `Plus Jakarta Sans`, and system fallbacks. Headings are generally `font-black`, tight-tracked, and scale from 2xl/3xl on small screens to 4xl/6xl on large screens. Body copy is readable neutral text, commonly `text-sm` with relaxed line-height. Eyebrows use small uppercase text with generous letter spacing.

## Spacing and layout

- Use Tailwind's 4 px rhythm, commonly `p-4`, `p-5`, `p-6`, `p-8`, and `py-10 md:py-14` for sections.
- Center public pages at `max-w-7xl`; storefront hero/content uses `max-w-5xl`.
- Preserve `px-4` on mobile and `md:px-6` at wider sizes.
- Use clear vertical groups (`gap-4` to `gap-8`); do not compress dashboard forms or public cards.

## Cards

Standard cards are white with `rounded-[1.5rem]` or `rounded-[2rem]`, a light `#E5E7EB` border, and restrained soft shadow. Storefront cards may use theme-specific surfaces and configurable `sharp`, `rounded`, or `pill` radius. Use cards to group a meaningful unit, not as decoration around every element.

## Buttons

Primary actions are deep green, white, bold, and around 44 px minimum touch height, usually rounded-full or rounded-2xl. They may lift subtly or darken on hover. Secondary actions are white with a light border and neutral text. Destructive actions use red-tinted surfaces. New controls need visible focus treatment and clear disabled states.

## Sidebar and navigation

The desktop dashboard sidebar is a 72-unit white/translucent column with an active deep-green row. It is hidden below `lg`; a sticky mobile bar and drawer replace it. Public navigation uses a sticky top navbar on desktop and fixed bottom navigation on mobile. Do not remove a path from one breakpoint without an equivalent route affordance.

## Business cards

Directory business cards are reusable previews. They communicate visual identity (cover/logo or fallback), business name, industry, location, and direct link to `/{slug}`. Keep the image-first, rounded-card local-discovery presentation and handle optional fields safely.

## Responsive design

- Start with one-column mobile layouts; expand grids at `md` and `xl` as existing screens do.
- Keep touch targets at least 44 px high where practical.
- Avoid horizontal overflow in long names, URLs, and storefront content.
- Preserve horizontal category scrolling and modal behavior on small storefront screens.
- Keep fixed/sticky navigation clear of content and retain existing safe-area handling.

## Dashboard design

The dashboard is task-oriented: clear heading, explanatory copy, prominent setup/progress state, and focused white form/list cards. Use the warm background and generous spacing. Owner actions must be understandable without relying on icon-only controls; status and visibility require readable labels.

## Storefront design

The storefront starts with a business hero—cover, logo, name, industry, location, optional hours, description, and primary contact links. Its catalog uses search, categories, themed item cards, and a detail modal. Appearance may change theme, accent, and corner styles, but must not harm content contrast or readability.

## Rules for future UI development

- Do not redesign existing screens unless explicitly instructed.
- Reuse existing components and tokens before introducing a new pattern.
- Prefer semantic HTML, accessible labels, keyboard support, and visible focus states.
- Do not convey critical status only through color.
- Test at mobile and desktop breakpoints.
- Do not present future-only features as live product capabilities.
