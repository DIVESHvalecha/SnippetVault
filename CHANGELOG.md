# Changelog

All notable changes to this project are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project uses [Semantic Versioning](https://semver.org/).

The repository has no git tags. Versions below are snapshot labels derived from the Gradle project version (`0.0.1-SNAPSHOT`) and the commit history.

## [Unreleased]

### Added

- Root `README.md` with setup, usage, architecture, and configuration.
- Documentation under `docs/`: getting started, architecture, API reference, configuration, troubleshooting, FAQ, reconstructed schema, and screenshot capture instructions.
- MIT `LICENSE`.
- `CONTRIBUTING.md`, `SECURITY.md`, and this changelog.
- GitHub issue templates and a pull request template.
- Root `.gitignore` covering secrets, build output, editor files, and personal documents.

### Changed

- Replaced the Vite boilerplate frontend README with project-specific instructions.

### Known gaps

- No CI workflow, no tagged release, and no Docker packaging.
- Frontend lint is red (29 errors, 2 warnings).
- `SnippetVault/queries.sql` remains stale; `docs/schema.sql` is the documented schema and is marked `[UNVERIFIED]`.
- AI semantic search and snippet explanation are not implemented.

## [0.0.1] - 2026-08-16

### Added

- Spring Boot 3.5.9 / Java 21 REST API with session authentication, BCrypt passwords, and email-based password reset.
- Snippet CRUD with `PRIVATE`, `GROUP`, and `PUBLIC` visibility.
- Append-only version history, restore, and version-pinned forking.
- Groups with random join codes and public/private listing.
- User-owned folders with snippet links.
- React 19 + Vite dashboard with Monaco editor, search, and version-history panel.
- Chrome Manifest V3 extension for context-menu code capture.
- MySQL schema and a single Spring Boot context-load test.

Initial snapshot: commit [`3e07cb9`](https://github.com/DIVESHvalecha/SnippetVault/commit/3e07cb9).
