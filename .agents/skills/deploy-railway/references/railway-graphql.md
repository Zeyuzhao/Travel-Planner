# Railway GraphQL commands

Use `https://backboard.railway.com/graphql/v2` with `Authorization: Bearer $RAILWAY_API_TOKEN` and `Content-Type: application/json`. Build request JSON with `jq -nc` so variables are encoded safely. Never print the token.

## Validate the workspace token

```bash
if [ -z "${RAILWAY_API_TOKEN:-}" ]; then
  printf 'RAILWAY_API_TOKEN is missing\n'
  exit 1
fi

curl -fsS https://backboard.railway.com/graphql/v2 \
  -H "Authorization: Bearer $RAILWAY_API_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{"query":"query { apiToken { workspaces { id } } }"}' \
  | jq '{workspaces: .data.apiToken.workspaces, errors: [.errors[]?.message]}'
```

Authentication is valid only when Railway returns at least one accessible workspace and no authentication error.

## Discover the existing target

Read the first accessible workspace ID from the validation response, then find the project by name:

```bash
payload=$(jq -nc --arg workspaceId "$workspace_id" '{
  query: "query($workspaceId: String!) { workspace(workspaceId: $workspaceId) { projects { edges { node { id name } } } } }",
  variables: {workspaceId: $workspaceId}
}')

curl -fsS https://backboard.railway.com/graphql/v2 \
  -H "Authorization: Bearer $RAILWAY_API_TOKEN" \
  -H "Content-Type: application/json" \
  --data "$payload" \
  | jq '.data.workspace.projects.edges[].node | select(.name == "japan-trip-planner")'
```

Resolve the service and available environments from the discovered project ID. Select `staging` for staging requests and `production` only when production was explicitly requested:

```bash
payload=$(jq -nc --arg projectId "$project_id" '{
  query: "query($projectId: String!) { project(id: $projectId) { id name services { edges { node { id name } } } environments { edges { node { id name } } } } }",
  variables: {projectId: $projectId}
}')

curl -fsS https://backboard.railway.com/graphql/v2 \
  -H "Authorization: Bearer $RAILWAY_API_TOKEN" \
  -H "Content-Type: application/json" \
  --data "$payload" | jq '{project: .data.project, errors: [.errors[]?.message]}'
```

Use the selected environment and the app service. Compare the results with the last-known IDs in the skill before deploying. Do not deploy a staging request to the production environment.

## Inspect the service source

```bash
payload=$(jq -nc --arg serviceId "$service_id" --arg environmentId "$environment_id" '{
  query: "query($serviceId: String!, $environmentId: String!) { serviceInstance(serviceId: $serviceId, environmentId: $environmentId) { serviceName source { repo image } latestDeployment { id status createdAt meta } domains { serviceDomains { domain } customDomains { domain } } } }",
  variables: {serviceId: $serviceId, environmentId: $environmentId}
}')

curl -fsS https://backboard.railway.com/graphql/v2 \
  -H "Authorization: Bearer $RAILWAY_API_TOKEN" \
  -H "Content-Type: application/json" \
  --data "$payload" | jq '{service: .data.serviceInstance, errors: [.errors[]?.message]}'
```

If the source must be repaired, use `serviceConnect` only after confirming the repository and branch with the user-visible Git state:

```graphql
mutation($id: String!, $input: ServiceConnectInput!) {
  serviceConnect(id: $id, input: $input) { id name }
}
```

Pass `{ "repo": "Zeyuzhao/Travel-Planner", "branch": "<current intended branch>" }` as the input.

## Deploy the exact commit

```bash
commit_sha=$(git rev-parse HEAD)
payload=$(jq -nc \
  --arg serviceId "$service_id" \
  --arg environmentId "$environment_id" \
  --arg commitSha "$commit_sha" '{
    query: "mutation($serviceId: String!, $environmentId: String!, $commitSha: String) { serviceInstanceDeployV2(serviceId: $serviceId, environmentId: $environmentId, commitSha: $commitSha) }",
    variables: {serviceId: $serviceId, environmentId: $environmentId, commitSha: $commitSha}
  }')

curl -fsS https://backboard.railway.com/graphql/v2 \
  -H "Authorization: Bearer $RAILWAY_API_TOKEN" \
  -H "Content-Type: application/json" \
  --data "$payload" | jq '{deployment_id: .data.serviceInstanceDeployV2, errors: [.errors[]?.message]}'
```

Poll the returned ID with:

```graphql
query($id: String!) {
  deployment(id: $id) { id status createdAt updatedAt meta }
}
```

Use short polling intervals and keep the user informed during long builds. Terminal statuses are `SUCCESS`, `FAILED`, `CRASHED`, `REMOVED`, and `SKIPPED`.

For a failed or crashed deployment, fetch logs:

```graphql
query($id: String!) {
  deploymentLogs(deploymentId: $id, limit: 100) {
    timestamp
    severity
    message
  }
}
```

After `SUCCESS`, verify both the commit metadata and the URL for the selected environment. The production check is only for an explicit production request:

```bash
curl -fsS -o /dev/null -w '%{http_code}\n' \
  https://japan-trip-planner-production-c615.up.railway.app/
```
