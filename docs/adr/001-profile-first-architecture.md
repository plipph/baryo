# ADR 001: Profile-First Architecture

## Status

Accepted — target architecture; implementation pending.

## Context

The MVP is business-focused: registration creates a profile with role `owner`, and dashboard access centers on business management. The platform must also serve people who discover, save, review, claim, or follow local businesses without owning one.

## Decision

Every authenticated user will have a Profile as the platform identity. Business ownership is optional and consumer capabilities will attach to profiles.

## Consequences

New features can use one identity model, while onboarding and authorization must no longer assume every account is an owner. Existing owner profiles and business flows remain supported during transition.

## Future Considerations

Define profile defaults, consumer onboarding, RLS, settings, data retention, and whether specialized organization/government experiences extend profiles or use additional role records.
