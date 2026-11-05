# Contributing

Thanks for considering a contribution. This is a personal project, but issues and pull requests are welcome.

## Before you start

- Read [docs/getting-started.md](docs/getting-started.md) to run the app.
- For security problems, follow [SECURITY.md](SECURITY.md) instead of opening a public issue.
- Open an issue before a large change so the approach can be agreed on first.

## Development setup

```bash
# Backend
cd SnippetVault
./gradlew test
./gradlew bootRun

# Frontend (second terminal)
cd SnippetValut-Frontend
npm ci
npm run dev
npm run build
```

Requirements: JDK 21+, Node.js 20+, MySQL 8+.

## Tests and checks

| Check | Command | Current state |
| --- | --- | --- |
| Backend tests | `cd SnippetVault && ./gradlew test` | Passes (one context-load test). |
| Frontend build | `cd SnippetValut-Frontend && npm run build` | Passes. |
| Frontend lint | `cd SnippetValut-Frontend && npm run lint` | **Fails** with 29 errors and 2 warnings. |

There is no CI. Do not add new lint errors, and do not claim the lint suite is green. If your change touches a file with existing lint errors, fixing those in the same file is welcome but optional.

## Database changes

The checked-in `SnippetVault/queries.sql` is a historical scratchpad and is not executable. The documented schema is [docs/schema.sql](docs/schema.sql).

If you change the schema:

1. Update `docs/schema.sql`.
2. Update the affected repository SQL and row mappers.
3. Mention the migration in your pull request. There is no migration framework, so existing databases need manual changes.

## Code style

- Match the surrounding Java and JSX style; there is no formatter or Checkstyle/ESLint gate for the backend.
- Keep SQL in the repository layer; services should not build SQL.
- Do not introduce secrets, tokens, local database files, or personal documents.
- Keep public API changes documented in [docs/api.md](docs/api.md).

## Secrets

Never commit `.env` files, SMTP passwords, database passwords, private keys, or exported personal documents. The root `.gitignore` covers the common cases. If you find a committed secret, report it privately per [SECURITY.md](SECURITY.md); do not open a public issue with the value.

## Pull requests

- Keep the change focused; separate refactors from behavior changes.
- Describe the problem, the approach, and how you verified it.
- Include screenshots or a short recording for UI changes. See [docs/assets/README.md](docs/assets/README.md) for capture guidance.
- Update docs when behavior or configuration changes.

## License

By contributing, you agree that your contribution is licensed under the repository's [MIT License](LICENSE).
