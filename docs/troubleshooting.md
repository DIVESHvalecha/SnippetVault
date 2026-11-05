# Troubleshooting

## The backend exits on startup

**Check MySQL is running and reachable.**

```bash
mysqladmin -u root -p ping
```

**Check the datasource variables are set in the same shell that runs Gradle.**

```bash
echo "$SPRING_DATASOURCE_URL"
```

**Check the database exists.**

```bash
mysql -u root -p -e "SHOW DATABASES LIKE 'SnippetVault';"
```

**Check the port is free.**

```bash
lsof -i :8080
```

If another process owns `8080`, either stop it or run `SERVER_PORT=8081 ./gradlew bootRun` and change the frontend `BASE_URL` values.

## `Table 'snippetvault.snippets' doesn't exist`

The schema was not applied to the database the backend is using. Create the tables:

```bash
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS SnippetVault CHARACTER SET utf8mb4;"
mysql -u root -p SnippetVault < docs/schema.sql
```

`SnippetVault/queries.sql` is not a runnable migration: it mixes DDL with `?` placeholders and omits `snippet_versions`. Do not pipe it into MySQL.

## `Unknown column 'current_version'` or `Unknown column 'active_yn'`

Your database predates the current code. The repository expects:

- `snippets.current_version`
- `snippet_versions` (whole table)
- `folder_snippets.active_yn`

Recreate the database from `docs/schema.sql` or add the missing columns manually.

## Every request returns `401 {"error":"Please Login"}`

1. Log in first and keep the `JSESSIONID` cookie.
2. With curl, use a cookie jar consistently:

   ```bash
   curl -c cookies.txt -X POST http://localhost:8080/login \
     -H 'Content-Type: application/x-www-form-urlencoded' \
     -d 'email=dev@example.com&password=ChangeMe123!'

   curl -b cookies.txt http://localhost:8080/snippets/own
   ```

3. From the SPA or extension, requests must include `credentials: 'include'`. The existing service files already do.
4. A `401` is also expected on `GET /snippets/{id}` for a snippet you do not own, even when it is public. The endpoint is owner-only; use the public feed, version history, or fork endpoint instead.

## Browser CORS error

The backend allowlists exact origins:

- `http://localhost:5173` (the SPA)
- `http://localhost:3000`
- `http://localhost:4200`
- `chrome-extension://bhpbjalgcgajnfjhmfbklikcoakchace`

If the extension was loaded unpacked and Chrome assigned a different ID, the origin does not match. Either add the new `chrome-extension://<id>` origin to `SecurityConfig.corsConfigurationSource()` or load the extension in a way that preserves the expected ID.

Credentials are enabled, so `Access-Control-Allow-Origin` cannot be `*`. `AuthController` also has a class-level `@CrossOrigin(origins = "*")`; if you see conflicting CORS headers, that annotation is the reason.

## The extension says "Not signed in"

The extension checks `GET /snippets/own` with the browser's cookies.

1. Open `http://localhost:5173` and log in in the **same Chrome profile**.
2. Make sure the backend is on `http://localhost:8080`.
3. Reopen the popup. The check runs on popup load.

## The extension keyboard shortcut does nothing

Known limitation. `content.js` sends a `STORE_CODE` message to the background service worker, but `background.js` does not handle that message type. Use the right-click **Save to Snippet Vault** context-menu entry instead.

## Saving from the extension does not put the snippet in the selected folder

Known limitation. The popup tries to read `saved.snippetId` from the create response, but `POST /create-snippet` returns only `{"body":"Snippet created successfully"}`. The snippet is created; the folder link is skipped. Add it from the web app instead.

## Forgot-password returns 500 or no email arrives

SMTP is not configured or is unreachable. Set the `SPRING_MAIL_*` variables from [configuration.md](configuration.md) and restart the backend. Registration and login do not require mail.

The current mail template still says "Expense Tracker" and uses the subject "Reset password - Expense Tracker". That is stale branding, not a configuration failure.

## `npm run lint` fails

Expected in the current snapshot. `npm run lint` reports 29 errors and 2 warnings (unused `motion` imports, `no-useless-catch`, React hook rules). This does not block the app: `npm run build` succeeds.

## `npm ci` fails

Use Node.js 20 or newer:

```bash
node --version
```

The lockfile is lockfile version 3. Delete `node_modules` and retry only after confirming the Node version.

## `./gradlew` permission denied

```bash
chmod +x SnippetVault/gradlew
```

## Gradle cannot find Java 21

The build declares a Java 21 toolchain:

```groovy
java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(21)
    }
}
```

Install JDK 21 or let Gradle auto-provision it. `./gradlew --version` shows the launcher JVM and the daemon JVM.

## `./gradlew test` passes but the app fails to start

The single test is a context-load test and does not require a live database. `bootRun` does. Configure MySQL before running the app.

## Port 5173 is already in use

Vite picks the next free port by default, which breaks the backend CORS allowlist. Stop the other process or start Vite explicitly on 5173:

```bash
npm run dev -- --port 5173
```
