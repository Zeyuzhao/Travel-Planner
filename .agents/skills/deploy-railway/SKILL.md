---
name: deploy-railway
description: Deploy, redeploy, inspect, and troubleshoot this repository on its existing Railway service. Use when asked to publish the app, update the Railway deployment, check deployment status or logs, validate RAILWAY_API_TOKEN, or verify the production URL.
---

# Deploy Railway

Deploy the current Git commit to the existing Railway project, wait for the exact deployment to finish, and verify the public app. Reuse the connected service; do not create another project or service.

## Target

- Project: `japan-trip-planner`
- Repository: `Zeyuzhao/Travel-Planner`
- Production URL: `https://japan-trip-planner-production-c615.up.railway.app/`
- Last-known project ID: `47926675-0721-4dcb-bc1c-9d01670e7c1f`
- Last-known service ID: `1d9d682e-ff13-40a9-828d-e48f4ec3a98f`
- Last-known production environment ID: `361d63ae-8578-4b51-966c-39998bdce4f2`

Treat the names as authoritative. Confirm the IDs through Railway before mutating state because Railway resources can be replaced.

## Workflow

1. Inspect `git status`, the current branch, and the remote. Preserve unrelated changes.
2. Run `bun install` when dependencies are missing, then run `bun run build`.
3. Confirm the production contract remains intact:
   - `package.json` has a `start` script that binds `0.0.0.0` and uses Railway's `$PORT`.
   - `vite.config.js` allows `.up.railway.app` preview hostnames.
4. Commit and push the intended revision before deploying. Record `git rev-parse HEAD` and deploy that exact SHA.
5. Check that `RAILWAY_API_TOKEN` is non-empty without printing its value. Never echo, log, or persist the token.
6. Authenticate and discover the existing project with the GraphQL flow in [railway-graphql.md](references/railway-graphql.md).
7. Confirm the service source still points to `Zeyuzhao/Travel-Planner` and the intended branch. Reconnect it only if the source is absent or wrong. Keep a pull-request branch selected until the user asks to deploy another branch or the PR is merged.
8. Trigger `serviceInstanceDeployV2` with the exact commit SHA. Capture the returned deployment ID.
9. Poll that deployment ID to a terminal status. On failure, fetch its deployment logs and diagnose before retrying.
10. Require an HTTP 200 from the production URL. For UI changes, also verify the live app with Jiro's headed browser and exercise the affected interaction.
11. Report the deployed commit, terminal Railway status, and production URL.

## Authentication Rules

- `RAILWAY_API_TOKEN` is account/workspace-scoped. Do not treat a failing `railway whoami`, `railway list`, or `railway link` command as proof that this token is invalid; validate it with `apiToken { workspaces { id } }` through Railway GraphQL.
- `RAILWAY_TOKEN` is project-scoped and is suitable for project-bound CLI workflows such as `railway up`.
- Ensure only the token type required by the chosen workflow is set. Do not copy either token into repository files or command output.
- Stop and ask for a replacement secret only when the appropriate authenticated API check rejects the token or returns no accessible workspace/project.

## Common Failures

- A Railway 403 page mentioning a blocked host means Vite rejected the Railway hostname. Preserve `preview.allowedHosts: [".up.railway.app"]` in `vite.config.js`.
- A process that never becomes healthy usually means the start command ignored `$PORT` or bound only to localhost. Preserve `vite preview --host 0.0.0.0 --port ${PORT:-3000}`.
- A successful deployment for an older commit is not completion. Compare the deployed commit metadata with `git rev-parse HEAD`.
- Slow builds are not automatically failures. Poll the exact deployment until it reaches `SUCCESS`, `FAILED`, `CRASHED`, `REMOVED`, or `SKIPPED`.

## Pull Request Hygiene

Browser checkpoints belong in Jiro's Work Log. Upload only the one most useful screenshot when the user requests a durable artifact. Updating the pull request after several browser actions can append every session image, so use `gh pr edit` for text-only PR updates and preserve at most one representative image in the body.
