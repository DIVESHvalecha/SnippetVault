---
id: snippet-vault
title: Snippet Vault
source: personal
role: author
repo: https://github.com/DIVESHvalecha/SnippetVault
demo: ""
timeframe: 2025-05 → 2026-08
status: maintained
domain: [developer tools, code management, productivity]
shapes: [0-to-1, api-design, dx]
stack: [Java, Spring Boot, Spring Security, MySQL, React, Chrome Extension]
adoption: "[MISSING]"
evidence_strength: medium
impact:
  - "Built an end-to-end code-snippet platform with session auth, group/folder scoping, version history, and version-pinned forking."
  - "Added browser capture so a selected code block can be saved from any page without opening the web app first."
keywords: [spring boot, java, rest api, react, mysql, chrome extension, versioning, forking, developer productivity]
resume_bullets:
  - "Built a user-scoped snippet platform with group/folder visibility, append-only version history, and version-pinned forking that copies a chosen revision into the caller's private vault."
  - "Shipped a Chrome extension that captures selected code from any page through a context-menu flow, removing the manual copy-paste-and-navigate step."
strength: 3
last_used: 2026-08
confidential: false
resume_eligible: true
links: []
---

## Context
Snippet Vault is a personal full-stack project for storing, organizing, and retrieving code snippets. It combines a Spring Boot REST API, a React single-page app, and a Chrome extension for capturing code from the browser. It is aimed at individual developers who want private, group, and public snippet collections with revision history.

## Problem
Code snippets end up scattered across editors, chats, and browser tabs. Generic note tools do not model code-specific concerns such as language, visibility, group sharing, revision history, or copying someone else's snippet at a known revision. Snippet Vault addresses that workflow with a single authenticated vault and a browser capture path.

## My ownership
I wrote the backend (Spring Boot controllers, services, JDBC repositories, schema, Spring Security configuration) myself. I directed the product and built the React frontend and Chrome extension with AI assistance. I did not operate this as a hosted service, and there is no evidence of other contributors: the commit history is authored by `DIVESHvalecha` and there is no upstream remote, so it is an original project rather than a fork.

The AI-powered semantic search and snippet-explanation scope described in the project summary is **not present in this repository**. There is no OpenAI, Qdrant, embedding, vector, or LLM code. Treat it as intended scope that is unverified here, not as shipped functionality. See "Do not claim".

## Architecture
- React 19 + Vite SPA on `localhost:5173` calls a Spring Boot 3.5.9 / Java 21 REST API on `localhost:8080`.
- Spring Security handles form login with BCrypt-hashed passwords and an HTTP session cookie (`JSESSIONID`); the SPA and extension both send `credentials: 'include'`.
- Persistence uses `JdbcTemplate` over MySQL rather than an ORM. The schema is defined in `SnippetVault/queries.sql`: `users`, `auth_tokens`, `user_groups`, `group_member`, `snippets`, `snippet_versions`, `folders`, `folder_snippets`.
- Every snippet edit inserts a new `snippet_versions` row and increments `snippets.current_version`. Restore replays an old revision by writing it as a new version.
- Forking reads the immutable content of a caller-selected version, then creates a new snippet owned by the caller with `visibility = PRIVATE` and no group, starting that copy at version 1.
- Read authorization is expressed in SQL: a snippet version is visible when the caller owns the snippet, the snippet is `PUBLIC`, or the caller belongs to the snippet's `GROUP`.
- Folders are user-owned and linked to snippets through `folder_snippets`; group membership is checked before a group-scoped snippet or folder is created.
- The Manifest V3 Chrome extension keeps the API session cookie, posts to `/create-snippet`, and guesses the language from the selected text. The context-menu capture path works; the keyboard-shortcut path is incomplete (see Repo health).

## Approach & tradeoffs
- **Explicit SQL over JPA.** `JdbcTemplate` keeps the authorization predicates and versioning writes visible. The tradeoff is manual row mapping and duplicated access rules across version, fork, and read queries.
- **Session cookies over JWTs.** Reusing Spring Security's form login makes the same authenticated session work from the SPA and the extension without a token-storage design. The tradeoff is CSRF being disabled and browser-specific CORS handling.
- **Append-only versioning over in-place updates.** History, restore, and version-pinned forks fall out of the model, at the cost of unbounded version growth and no retention policy.
- **Version-pinned forks without provenance.** A fork copies exactly the requested revision, but the schema stores no `parent_snippet_id` or attribution, so lineage is not queryable.
- **SQL-side access control over a policy layer.** Access checks are co-located with reads, but they are repeated in three queries and are easy to keep in sync only by discipline.

## Results
No verified adoption or usage outcomes. There are no users, stars, installs, downloads, benchmarks, or time-saved numbers to report; `adoption` is `[MISSING]`.

## Repo health
- **Tests:** one Spring Boot `contextLoads` test; no service, controller, repository, or frontend tests.
- **CI/releases:** no CI workflow and no tags. The history is short (initial snapshot `3e07cb9`, follow-up `5174dc4`), so there is no release process or detailed development history.
- **Docs:** a root README, `docs/`, and an MIT license were added during the GitHub-readiness pass. `queries.sql` remains a stale scratchpad that mixes DDL with ad-hoc queries; `docs/schema.sql` is the reconstructed schema.
- **Secrets:** `SnippetVault/src/main/resources/application.properties` is tracked and contains literal datasource and mail credentials. Rotate them and move to environment variables before making the repository public.
- **Known defects:** the extension's `Ctrl/Cmd+Shift+S` path sends `STORE_CODE` to a background worker that never handles it; folder linking in the extension relies on a `snippetId` the create endpoint does not return; `getSnippetById` is owner-only, so a public snippet cannot be opened by another user through that endpoint; MySQL `NULL` `group_id` values are mapped to `0`; the frontend silently falls back to mock snippets; `AuthController` declares `@CrossOrigin("*")` while credentialed CORS is configured globally.
- **Hardening gaps:** CSRF disabled, no rate limiting, no request validation, and no logging/retry/timeout policy.
- **Tracked personal files:** commit `5174dc4` added `.DS_Store` files, `.vscode/settings.json`, two PDFs, and a Word lock file to git. They are now ignored for future changes but remain tracked until removed with `git rm --cached`.

## Interview talking points
- How to model version-pinned forking so a copy stays anchored to the exact revision the user selected, and what provenance and retention you would add next.
- Where authorization belongs when the same rule (owner OR public OR joined-group) gates reads, version history, and forks, and how to avoid drift across three SQL queries.
- Why a shared session cookie was chosen for a SPA plus browser extension, and how you would move to tokens without breaking the capture flow.

## Best fit for
Backend or full-stack roles in developer tools and productivity software, especially 0-to-1 product work, REST API design, and authenticated multi-tenant-style data access. It is not evidence for AI/ML, large-scale operations, or security engineering.

## Do not claim
- **AI semantic search or snippet explanation as implemented.** No such code exists in this repository; it is `[MISSING]` and must not appear as shipped work.
- **Production users, scale, uptime, or adoption.** None are verified.
- **A published Chrome Web Store extension.** It runs unpacked against `localhost` only.
- **Security hardening.** Credentials are tracked, CSRF is disabled, and no security review exists.
- **Sole ownership of every frontend/extension line.** Those were built with AI assistance; the backend is my own work.
- **Any benchmark, latency, or time-saved number.**

## Evidence
- Repository: https://github.com/DIVESHvalecha/SnippetVault (remote `origin`; no upstream, so not a fork)
- Commits on `main`: `3e07cb97e56b193c9e3740bd4b293c18a09f391c` (initial) and `5174dc4` (follow-up)
- `git ls-files | wc -l` → 98 tracked files; `git ls-files '*.java' | wc -l` → 35 Java files
- `git ls-files ... | xargs wc -l` → 6,726 lines across Java, JSX, and JS (excludes `node_modules`)
- `git grep -hE '@(Get|Post|Patch|Delete|Put)Mapping' -- '*.java' | wc -l` → 27 REST endpoints
- `git grep -nIiE 'openai|qdrant|embedding|semantic|vector|gpt|llm'` → no implementation matches (only a `package-lock.json` integrity hash)
- `git tag | wc -l` → 0 tags; `git rev-list --count HEAD` → 2 commits
- Test suite: `SnippetVault/src/test/java/com/divesh/SnippetVault/SnippetVaultApplicationTests.java`
- Schema: `SnippetVault/queries.sql` (historical), `docs/schema.sql` (reconstructed, `[UNVERIFIED]`)
- Added during the GitHub-readiness pass: `LICENSE` (MIT), root `README.md`, `docs/`, and `.github/` templates; still no CI workflow
