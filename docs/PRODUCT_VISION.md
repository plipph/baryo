# Product Vision

## What Listahan is

Listahan is a local-business discovery and storefront platform currently branded in the interface as **MyNegosyo Mindoro**. A business owner can manage a public page at `/{slug}` where customers view the business, browse categorized items, and use contact or external links. Visitors can discover active listings from the home page or the searchable `/discover` directory.

The current product is a directory and lightweight digital storefront. It is not an e-commerce checkout, review platform, government registry, booking system, or event marketplace.

## Mission

Make local Mindoro businesses easier to discover, understand, and contact online, while giving owners a straightforward way to maintain a credible public presence.

## Vision

Become a trusted local digital directory where residents and visitors can find businesses across Mindoro, and where local enterprises can present their offerings without needing a separate website.

## Target users

### Business owners

Primary users are local entrepreneurs and operators who need a simple storefront. Current owner capabilities include account registration, business profile management, item and category management, contact links, visual customization, and basic analytics.

### Consumers

Residents and visitors are the public audience. They can explore active businesses, search the directory by business details and location, browse a storefront's products or services, and follow contact links. They do not currently create accounts or save favorites.

### Government

Local-government use is an opportunity, not a current product capability. The codebase includes an admin status-control flow, but no government verification, permitting, reporting, or registry workflow.

### Organizations

Community groups, chambers, tourism organizations, and local-development partners may benefit from directory visibility. No organization accounts, partner dashboards, event publishing, or organization-specific workflow is implemented today.

## Long-term roadmap

The implemented foundation is discovery, owner-managed storefronts, and interaction analytics. The long-term direction is to strengthen that foundation with richer trust, engagement, and ecosystem features—such as favorites, reviews, offers, claim workflows, and notifications—only after they are designed and implemented. See [ROADMAP.md](ROADMAP.md).

## One Account Philosophy

Every person joins Listahan through the same account model and receives a profile. Consumers can participate in local discovery; business owners can optionally register and manage businesses; future organizations and government participants can receive specialized capabilities through the same platform identity. Business ownership is optional, not the definition of an account.

In the target platform, a person can browse businesses, save favorites, claim offers, write reviews, follow businesses, and register a business from the same account. Favorites, offers, claims, reviews, follows, and profile-first onboarding are future capabilities, not current product behavior.

Organizations and government may eventually receive specialized account experiences, but those roles and workflows are not implemented today. They should extend the same platform identity model rather than create disconnected account systems.

## Product Philosophy

Listahan is intended to become the digital ecosystem for Oriental Mindoro and Occidental Mindoro, not merely a listing directory. Every new feature should strengthen the relationship between residents, visitors, businesses, organizations, government, and community. Consumer experience matters as much as owner and administrator experience; avoid work that benefits only administrators without a direct community or platform outcome.

## Municipality-first Architecture

The platform is geographically focused. The target model places businesses in municipalities and municipalities in provinces, beginning with Oriental Mindoro and Occidental Mindoro. Today, business records use `city` and `province` fields. Structured municipalities and province relationships are planned future architecture. Future geographic expansion should use configuration and data, not a redesign of the application structure.

## Non Goals

Listahan is not intended to become a POS, ERP, accounting product, inventory product, food-delivery platform, or general social network. Its focus remains local discovery, business presence, and community engagement.

## Product boundaries

- Public listings show only businesses marked active.
- Public storefronts expose visible items and links; primary links are promoted in the hero.
- Contact and transaction completion happen through external links. Listahan does not process orders, payments, bookings, or messages.
- Analytics track business visits plus item and tracked-link clicks; they are not a full customer analytics suite.
