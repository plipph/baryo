# ADR 006: Profile Foundation

## Status

Accepted as the Version 1.5A implementation direction; implementation pending.

## Context

Listahan's MVP registration creates a Supabase Auth user and a `profiles` record with role `owner`. Dashboard access and business management rely on that owner-first assumption. The platform roadmap requires consumers, business owners, future organizations, and future government participants to use one coherent identity model, while existing owners must retain uninterrupted access.

## Decision

Adopt a profile-first architecture. Every authenticated user receives a Profile, and business ownership becomes optional. Preserve `businesses.owner_id` as the current ownership relation during Version 1.5A. Introduce centralized permission helpers under `lib/permissions/` for Profile, legacy owner, admin, and future feature decisions. Do not implement business membership, organization models, or future community features in this release.

## Consequences

New users can have an account without a business, and future community features have a shared authorization subject. Existing navigation and onboarding need to distinguish account-level experience from business workspace. Permission logic must become explicit and server-aligned with RLS rather than be scattered across UI paths. The legacy single-owner limitation remains until a later membership release.

## Migration

Inventory Auth/Profile records and owner-dependent code paths; establish migration/type practices; make Profile provisioning idempotent; remediate missing Profiles through a reviewed process; preserve and verify every `owner_id` relationship; then add profile/account experience and centralized checks. Validate anonymous, non-owner, owner, and admin paths before release. No migration is created by this ADR.

## Alternatives Considered

- **Keep owner-first registration:** rejected because it blocks consumer-first participation and requires later identity rework for every community feature.
- **Create separate consumer and owner account systems:** rejected because it duplicates authentication, identity, settings, and authorization.
- **Implement business membership immediately:** deferred because it expands the sprint beyond profile foundation and increases migration/authorization risk.
- **Use client-side feature/plan checks:** rejected because client UI cannot be the authorization boundary.

## Future Impact

The Profile becomes the basis for favorites, reviews, claims, notifications, follows, settings, and organization/government contexts. Future `business_members` can evolve business authority from legacy `owner_id` without replacing the identity model. The feature and permission systems can add capabilities incrementally while keeping plans as entitlement inputs rather than authorization substitutes.
