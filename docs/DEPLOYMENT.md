# Deployment

## Runtime

Listahan is a Next.js 16 application. Available scripts:

- `npm run dev` — local development server
- `npm run lint` — ESLint
- `npm run build` — production build
- `npm run start` — run the built production server

The app can run on a Node-compatible Next.js host. Vercel is a natural option for this stack, but no deployment-provider configuration is committed.

## Environment variables

| Variable | Required by | Handling |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Browser, server, middleware, and service-role setup | Public project URL; configure locally and in hosting environments. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Browser, server, and middleware clients | Public anonymous key; RLS must enforce authorization. |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only admin client for analytics/admin status changes | Secret; never expose, prefix with `NEXT_PUBLIC_`, or commit. |

`.env.local` is used locally and ignored by Git. Do not put actual values in documentation or source. Configure equivalent variables per deployment environment.

## Supabase

Supabase provides Auth, Postgres, and Storage. The repository has CLI link metadata but no tracked schema or migrations. Image uploads accept a caller-provided bucket and return public URLs; bucket names/policies are not centralized in checked-in code.

Before production deployment, verify:

- Email/password Auth settings and allowed redirect URLs.
- RLS for every application table, including public reads and owner-only writes.
- Service-role key availability only to server runtime code.
- Storage bucket existence, image expectations, and object policies.
- The physical schema, relationships, indexes, and any live triggers.

## Production deployment

1. Confirm the target branch contains intended application and documentation changes.
2. Run `npm run lint` and `npm run build` locally or in CI.
3. Apply and verify database migrations before code that depends on them. Today this is out-of-repository because migrations are not tracked.
4. Configure the three required environment variables in the host.
5. Deploy the application.
6. Smoke-test registration/login, dashboard access, business activity/visibility, `/{slug}` rendering, analytics endpoints, and image uploads.
7. Monitor host and Supabase logs; use the provider's rollback process if required.

## Database migrations

There is no committed migration workflow. Do not treat manual dashboard edits as durable history. Until migrations are introduced, record every schema/policy change in the deployment record and export live state before modifying it.

### Recommended future migration process

1. Create versioned Supabase migrations in `supabase/migrations/`.
2. Review schema, constraints, RLS, indexes, functions, triggers, and Storage policy changes alongside code.
3. Test on a non-production Supabase project with representative data.
4. Apply to production in a coordinated application release.
5. Commit generated database types and update [DATABASE.md](DATABASE.md).

## GitHub workflow

No GitHub Actions workflow is present. Until CI exists, pull requests should include a concise summary, relevant documentation updates, and evidence that lint/build passed.

### Recommended future GitHub workflow

- Protect the production branch and use pull requests.
- Run lint and build checks on every pull request.
- Add migration validation when migrations exist.
- Keep deployment secrets in GitHub/hosting-provider secrets, never in Git.
- Deploy previews for review, then promote only verified builds.

## Future improvements

- Add committed CI for lint and build verification.
- Add documented staging and production Supabase environments.
- Version migrations, types, and Storage policies.
- Define a rollback runbook for application and database releases.
