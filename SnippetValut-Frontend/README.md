# Snippet Vault — Frontend

React 19 + Vite single-page app for the Snippet Vault API. The root [README](../README.md) covers the full system; this file covers the frontend only.

## Run

```bash
npm ci
npm run dev
```

Open `http://localhost:5173`. The API must be running on `http://localhost:8080`.

## Scripts

| Command | What it does | Current state |
| --- | --- | --- |
| `npm run dev` | Vite dev server with HMR. | Works. |
| `npm run build` | Production build into `dist/`. | Passes. |
| `npm run preview` | Serve the production build locally. | Works after a build. |
| `npm run lint` | ESLint over the project. | Fails: 29 errors, 2 warnings. |

## Structure

```text
src/
├── components/
│   ├── common/      Button, Input, Modal, Toast, folder/group modals
│   ├── layout/      Navbar, Sidebar
│   └── snippets/    SnippetCard, SnippetDetails, EditorWrapper, version history
├── context/         AuthContext, GroupContext, SnippetContext
├── pages/
│   ├── Auth/        Login, Signup, ForgotPassword, ResetPassword
│   └── Dashboard/   Dashboard
├── services/        fetch wrappers for auth, snippets, groups
└── utils/           mockData fallback
```

## API configuration

The API base URL is hardcoded in `src/services/auth.js`, `src/services/snippet.js`, and `src/services/group.js`:

```js
const BASE_URL = 'http://localhost:8080';
```

There is no `.env` support. Change all three files if the API moves.

## Authentication

Login uses Spring Security's form endpoint (`application/x-www-form-urlencoded`), and the browser stores the `JSESSIONID` cookie. Requests use `credentials: 'include'`. The user's email is also cached in `localStorage` under `snippet_vault_user` for UI state.

## Known limitations

- `npm run lint` is red; `npm run build` is the reliable check.
- The dashboard search is client-side substring matching, not semantic search.
- The snippet list silently falls back to `src/utils/mockData.js` if fetching throws.
- `getSnippetById` on the backend is owner-only, so opening another user's public snippet relies on data already loaded in the feed.
- No frontend tests.

## Related docs

- [Getting started](../docs/getting-started.md)
- [API reference](../docs/api.md)
- [Troubleshooting](../docs/troubleshooting.md)
