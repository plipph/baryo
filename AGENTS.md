<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Listahan development instructions

## Project overview

Listahan is a local-business directory and storefront platform for Mindoro, currently branded in the interface as MyNegosyo Mindoro. Owners maintain public business pages, catalog items, contact links, appearance, and basic engagement analytics. Visitors discover active businesses and browse public storefronts.

The stack is Next.js App Router, React, TypeScript, Tailwind CSS, and Supabase (Auth, Postgres, and Storage). Keep `docs/` current whenever a change affects product behavior, architecture, data, UI, deployment, or the roadmap.

## Product Philosophy

Listahan is the digital ecosystem for Mindoro, not only a business directory. Every architectural decision should strengthen the relationship between consumers, businesses, organizations, local government, and the community. Prefer platform thinking over directory thinking, preserve reusable architecture, and do not redesign the UI unless explicitly instructed.

## Architecture rules

- Preserve the App Router structure in `app/`; routes, layouts, and route handlers belong there.
- Keep Supabase client setup in `lib/supabase/`. Use the server client in server code and the browser client only in Client Components.
- Keep business logic and shared helpers in `lib/`; do not bury reusable domain logic in presentation components.
- Prefer Server Components. Add `"use client"` only for browser APIs, local interactive state, event handlers, or browser Supabase work.
- Keep service-role access server-only. Never expose `SUPABASE_SERVICE_ROLE_KEY` to the client.
- Prefer reusable focused components. Do not duplicate components or create near-identical UI primitives.
- Preserve data ownership and visibility boundaries. Do not bypass RLS except in a narrow server-side operation that validates authorization first.

## Coding conventions

- Use TypeScript and the existing `@/` import alias.
- Follow the existing Tailwind-based visual language and component patterns.
- Do not redesign the UI unless explicitly instructed; make the smallest change required.
- Preserve responsive behavior across mobile, tablet, and desktop.
- Do not remove or silently alter existing features, routes, data fields, or user flows unless instructed.
- Do not commit secrets or copy `.env.local` values into source or documentation.

## Verification

- Always pass `npm run lint` before handing off code changes.
- Always pass `npm run build` before handing off code changes.
- Document intentional deferrals or known limitations in the relevant file under `docs/`.

## Release-driven implementation

When implementing features:

1. Read all documentation inside `docs/`.
2. Read the corresponding release specification in `docs/releases/` before making changes.
3. Implement only the scope defined in that release.
4. Do not implement future milestones early.
5. Update documentation whenever architecture changes.
