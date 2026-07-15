# ADR 004: Plan-Based Permissions

## Status

Proposed — current UI has only partial plan behavior.

## Context

The dashboard link manager reads `business.plan` and applies a Libre visible-link limit, while Pro and Premium are referenced without billing, entitlement, or upgrade implementation.

## Decision

Treat plans as explicit, server-enforced business entitlements when monetization is implemented. Plan checks must be centralized in business logic and RLS/secure server operations where appropriate, not rely solely on client UI limits.

## Consequences

The existing Libre link limit remains MVP behavior. No paid-plan promise or permission model is currently implemented.

## Future Considerations

Define plan catalog, billing provider, entitlement source, grace periods, downgrade behavior, auditability, feature flags, and owner-facing upgrade flows.
