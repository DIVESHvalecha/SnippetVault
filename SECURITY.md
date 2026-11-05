# Security policy

## Supported versions

Only the `main` branch is maintained. There are no tagged releases.

## Reporting a vulnerability

Please **do not open a public issue** for a security problem.

Use GitHub's private vulnerability reporting:

1. Open the repository's **Security** tab.
2. Choose **Report a vulnerability**.
3. Include the affected endpoint or file, reproduction steps, and the impact.

If private reporting is unavailable, open a minimal public issue asking for a private contact channel and do not include exploit details.

There is no dedicated security email address and no bug bounty. This is a personal project maintained on a best-effort basis; no response SLA is offered.

## Known security limitations

This repository is a personal project and has not had a security review. Do not expose it to the public internet without addressing at least the following:

- **Tracked credentials.** `SnippetVault/src/main/resources/application.properties` currently contains literal datasource and mail credentials. Rotate them, remove them from the file, and move to environment variables. Assume any value committed to git is compromised.
- **CSRF is disabled** in `SecurityConfig`.
- **No rate limiting** on login, registration, or password-reset endpoints.
- **No request validation** on most endpoints; JSON bodies are bound directly to model objects.
- **Public auth surface.** `/register`, `/forgot-password`, `/validate-token`, `/reset-password`, and `/groups/public` are reachable without a session.
- **Account enumeration.** Registration distinguishes an existing email/username, and forgot-password distinguishes an unknown email.
- **Password-reset tokens** are stored as plain text in `auth_tokens`, not hashed.
- **Session cookie flags** (Secure, SameSite) are not explicitly configured; the cookie is suitable for local HTTP development only.
- **CORS** allowlists localhost origins and one Chrome extension ID; `AuthController` also declares a class-level wildcard `@CrossOrigin`.
- **No audit logging** and no structured security events.
- **Soft deletes** leave rows in the database; deleting a snippet or folder does not erase content.

## Scope

In scope: authentication and session handling, authorization bypasses between users/groups, SQL injection, credential exposure, and extension-to-API trust issues.

Out of scope: findings that require a compromised local machine, missing production hardening that is already documented above, and vulnerabilities in third-party dependencies that are not reachable from this code.
