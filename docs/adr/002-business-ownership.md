# ADR 002: Business Ownership and Membership

## Status

Accepted — target architecture; implementation pending.

## Context

Current business access is based on `businesses.owner_id`, which implies one owner and causes the dashboard to select the most recent business. This does not support shared administration.

## Decision

Model business access through planned `business_members` records joining profiles to businesses with Owner, Manager, or Staff roles. Preserve `owner_id` during migration as the legacy primary-owner reference.

## Consequences

Multi-owner and delegated business management become possible, but every dashboard query and write policy must become membership-aware. This is not implemented today.

## Future Considerations

Define invitation flows, role capabilities, ownership transfer, member removal, selected-business context, audit history, and backfill strategy.
