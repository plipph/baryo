# ADR 003: Municipality-First Geography

## Status

Accepted — target architecture; implementation pending.

## Context

Listahan serves Mindoro. Current business records use free-form `city` and `province` fields, which limits consistent geographic discovery and expansion.

## Decision

Introduce municipalities as structured records belonging to provinces. Initial configured provinces are Oriental Mindoro and Occidental Mindoro. Businesses will reference a municipality when the model is implemented.

## Consequences

Location filtering and curation can be consistent, and future expansion becomes a configuration/data change. Existing free-form location data needs a careful normalization and backfill plan.

## Future Considerations

Define province records, municipality identifiers, display names, boundary/coverage policy, data migration, fallback behavior, and whether barangay-level detail is needed.
