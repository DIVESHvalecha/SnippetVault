# Screenshot and GIF capture instructions

No screenshots are committed yet. Do not add stock images or mockups; capture the running app.

## Before capturing

1. Start MySQL, the backend, and the frontend as described in [../getting-started.md](../getting-started.md).
2. Create a demo account and seed at least:
   - 4 snippets with different languages (Java, JavaScript, Python, SQL)
   - one `PRIVATE`, one `GROUP`, and one `PUBLIC` snippet
   - 2 revisions on one snippet so the history panel is not empty
   - 2 folders
3. Use a clean browser profile with no extension overlays or personal data.
4. Set the browser zoom to 100% and hide bookmarks.

## Required files

| File | Viewport | What to show |
| --- | --- | --- |
| `dashboard.png` | 1440 × 900 | Dashboard with the sidebar, search box, and at least 4 snippet cards. |
| `snippet-editor.png` | 1440 × 900 | Snippet detail modal with the Monaco editor and visibility controls. |
| `version-history.png` | 1440 × 900 | Version-history panel with multiple revisions and the Fork button. |
| `extension-popup.png` | 400 × 700 | Extension popup with title, description, language, visibility, and code filled in. |
| `capture-flow.gif` | 1280 × 720 | 10–15 s: select code on a page → right-click → Save to Snippet Vault → save. |

## Capture steps

### Web app

1. Open `http://localhost:5173/dashboard`.
2. For PNGs, use the browser's full-window screenshot or the OS screenshot tool at the viewport sizes above.
3. Keep text readable: no zoom below 100%, no dark-mode inversion, no personal email addresses in the account menu.
4. Save into this directory with the exact file names in the table.

### Extension popup

1. Load the unpacked extension from `SnippetValut-Extension/`.
2. Log in at `http://localhost:5173` in the same profile.
3. Open the extension popup and fill every field with harmless demo content.
4. Capture only the popup at roughly 400 × 700.

### GIF

1. Use a screen recorder that exports GIF (for example Kap, LICEcap, or QuickTime → GIF conversion).
2. Record at 1280 × 720, 10–15 fps, under 15 seconds.
3. Show the context-menu path, not the keyboard shortcut (the shortcut is currently broken).
4. Keep the file under 8 MB so GitHub renders it inline.

## After capturing

Add the dashboard image to the placeholder in the root `README.md`:

```markdown
![Snippet Vault dashboard](docs/assets/dashboard.png)
```

Reference the rest from the relevant docs. Do not commit personal data, real email addresses, API keys, or database credentials in any capture.

## Social preview

For the repository's social preview, use `dashboard.png` cropped to 1280 × 640 and add the project name. GitHub applies its own overlay, so keep important content away from the bottom-right corner.
