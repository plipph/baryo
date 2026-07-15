# ADR 005: Offers and Claims

## Status

Accepted — target architecture; implementation pending.

## Context

The platform needs consumer engagement beyond discovery, but it does not currently support promotions, claims, or redemption. These features introduce eligibility, moderation, and fraud concerns.

## Decision

Model offers as business-published, time-bounded records and offer claims as profile-associated claim/redemption records. Implement only with explicit lifecycle, RLS, moderation, and redemption rules.

## Consequences

Offers can support local discovery and consumer value without turning Listahan into a transaction processor. No offer or claim functionality exists today.

## Future Considerations

Define offer states, claim limits, eligibility, redemption verification, staff permissions, notifications, expiry, abuse reporting, and analytics.
