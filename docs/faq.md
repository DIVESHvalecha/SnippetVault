# FAQ

## Is this an AI-powered app?

Not in this repository. The original project description mentions AI semantic search and snippet explanation, but there is no OpenAI, Qdrant, embedding, vector, or LLM code here. The dashboard search is an in-memory substring match on title, description, and language. Treat semantic search as unbuilt scope, not a shipped feature.

## Is there a hosted demo?

No. The app runs locally: React on `http://localhost:5173` and the API on `http://localhost:8080`.

## Is the Chrome extension on the Web Store?

No. It runs as an unpacked Manifest V3 extension from `SnippetValut-Extension/`, and its host permissions only allow `http://localhost:8080`.

## How is this different from a snippets feature in an editor?

It adds server-side storage, user accounts, private/group/public visibility, append-only revisions, version-pinned forking, folders, and browser capture. It is not an editor plugin and does not sync with VS Code or JetBrains IDEs.

## What does "fork" mean here?

You copy one specific revision of a snippet you can see (your own, a public snippet, or a group snippet) into a new snippet that you own. The copy is private, has no group, and starts at version 1. The schema does not store the source snippet or revision, so there is no visible fork lineage.

## Does editing create a new version?

Yes. Every `PATCH /snippets/{id}` inserts a new row in `snippet_versions` and increments `snippets.current_version`, even when the content is unchanged. Restoring an old revision also appends a new version rather than deleting history.

## Can another user read my private snippet by guessing the ID?

The list endpoints filter by owner or group. `GET /snippets/{id}` is owner-only, and the version/fork queries require owner, `PUBLIC`, or active group membership. That said, this is a personal project without a security review; see [SECURITY.md](../SECURITY.md) before exposing it to the internet.

## How do groups work?

A user creates a group and receives a random 6-character `group_code`. Others join with that code. Group visibility controls whether the group appears in `GET /groups/public`; it does not change snippet access. A snippet is shared with a group only when its `visibility` is `GROUP` and its `groupId` points to that group.

## What is the difference between group visibility and snippet visibility?

- `user_groups.group_visibility`: whether the group is listed publicly (`PUBLIC`) or unlisted (`PRIVATE`). Joining still requires the code.
- `snippets.visibility`: who can read the snippet (`PRIVATE`, `GROUP`, `PUBLIC`).

## Can I use PostgreSQL?

Not without code changes. The repositories use MySQL-specific SQL (`ENUM`, `ON DUPLICATE KEY UPDATE`, `MEDIUMTEXT`, `ON UPDATE CURRENT_TIMESTAMP`). The JDBC driver is `com.mysql:mysql-connector-j`.

## Can I deploy this with Docker?

There is no Dockerfile or Compose file in the repository. You would need to package the Spring Boot jar, serve the Vite `dist/`, and provide MySQL yourself. The frontend and extension also hardcode `localhost`, so deployment requires source edits.

## Why does `npm run lint` fail?

The current code has unused imports and hook-rule violations. `npm run build` passes. CI is not configured, so the failing lint does not block anything today.

## Are there tests?

One backend context-load test (`SnippetVaultApplicationTests`). There are no controller, service, repository, integration, or frontend tests.

## Which license applies?

MIT. See [LICENSE](../LICENSE).

## Who maintains it?

Divesh Valecha. The repository has no tagged releases; see [CHANGELOG.md](../CHANGELOG.md).
