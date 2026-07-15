# Roadmap

## Current Sprint

**Version 1.5A — Profile Foundation**

### Objectives

- Profile-first architecture
- Authentication refactor
- Dashboard updates
- Permission layer
- Documentation updates

The active implementation specification is [v1.5A.md](releases/v1.5A.md). This sprint is planning-ready; its database changes are intentionally not created by the documentation work.

## Status key

- **Complete** — implemented in the current repository.
- **Current Sprint** — the active, bounded release specification.
- **Planned** — approved direction that is not implemented.
- **Future** — longer-term direction requiring product and technical design.

## Version 1 — Core local storefronts

**Status: Complete**

- Public business directory on home and `/discover` for active businesses.
- Directory search across business name, description, industry, and city.
- Email/password owner registration and login through Supabase Auth.
- Owner dashboard with setup progress and management navigation.
- Business profile, branding, location, and hours management.
- Category and item management, public filtering/search, and item detail modal.
- Contact/social/website link management and primary inquiry links.
- Active public storefronts at `/{slug}` with metadata and appearance settings.
- Storefront theme, accent color, card radius, and button style controls.
- Visit, primary-link click, and item-click analytics.
- Admin-controlled business activation for a profile whose role is `admin`.

## Version 1.5 — Community Foundation

Version 1.5 evolves the business-owner-first MVP into a profile-first community platform without replacing the existing local storefront foundation. Each milestone has its own implementation specification in [docs/releases](releases/).

### Version 1.5A — Profile Foundation

**Status: Current Sprint**

**Goal:** Transform Listahan from a business-owner-first application into a profile-first platform.

**Objectives:**

- Introduce profile-first architecture.
- Ensure every authenticated user receives a profile.
- Make business ownership optional.
- Add a profile page and user settings.
- Establish a permission layer.
- Update project documentation for the new foundation.

Implementation contract: [v1.5A.md](releases/v1.5A.md). Keep engineering detail, acceptance criteria, and migration decisions in that release specification rather than duplicating them here.

### Version 1.5B — Community

**Status: Planned**

- Favorites
- Reviews
- Public profiles
- Verified reviewers

Specification: [v1.5B.md](releases/v1.5B.md)

### Version 1.5C — Business Growth

**Status: Planned**

- Offers
- Claimable offers
- Coupon codes
- Offer analytics
- Featured promotions

Specification: [v1.5C.md](releases/v1.5C.md)

### Version 1.5D — Engagement

**Status: Planned**

- Notifications
- Following businesses
- Saved offers
- Activity feed

Specification: [v1.5D.md](releases/v1.5D.md)

### Foundation work retained from the previous Version 1.5 plan

- Commit/review database migrations, policies, indexes, and generated types.
- Complete or remove incomplete navigation only with explicit product direction.
- Define plan entitlements and implement billing/upgrade flow if paid plans are adopted.
- Strengthen owner-management validation and tracked-redirect safety.

## Version 2 — Community engagement

**Status: Planned**

- Consumer profiles and authenticated consumer experiences.
- Favorite businesses/items.
- Moderated business reviews.
- Business offers and consumer offer claims.
- In-app notifications for relevant owner/consumer events.

These items remain long-term roadmap commitments. Their Version 1.5 counterparts define the first bounded releases; none of the features or supporting tables exist in the current codebase.

## Version 3 — Local ecosystem platform

**Status: Future**

- Government and organization partnership workflows, subject to separate authorization and verification requirements.
- Business verification and trusted-directory signals.
- Community/tourism discovery programs with explicit content governance.
- Broader reporting, promotion, and marketplace integrations after the core directory is stable.

## Future improvements

Before promoting a feature, validate demand and define its product decision, data model, RLS plan, UI flow, and deployment/migration plan. Update this roadmap and the relevant release specification when a capability is implemented or intentionally deprioritized.
