# Repository instructions for Jiro

This repository is a Bun/Vite static Japan trip planner deployed on Railway.

## Development

- Install dependencies with `bun install`.
- Build with `bun run build`.
- Run the production server locally with `PORT=4173 bun run start`.
- Preserve Railway's runtime contract: bind `0.0.0.0`, honor `$PORT`, and allow `.up.railway.app` in Vite preview hosts.
- For UI changes, test the rendered app in Jiro's headed browser after the build succeeds.

## Railway

For deploy, redeploy, Railway status/log inspection, token validation, or production verification, read and follow `.agents/skills/deploy-railway/SKILL.md`.

Reuse the existing `japan-trip-planner` project and connected service. The production URL is `https://japan-trip-planner-production-c615.up.railway.app/`. Do not create duplicate Railway resources.

`RAILWAY_API_TOKEN` is workspace-scoped in this environment. Validate it with Railway's GraphQL `apiToken` query; a failing `railway whoami` alone does not prove the token is invalid. Never print secrets.

## Pull requests

Keep pull-request descriptions concise and include at most one representative screenshot. Browser action screenshots are Work Log evidence, not PR artifacts. Use `gh pr edit` for text-only PR updates so session images are not appended automatically.
