# Getting started

This guide takes a clean clone to a running web app and, optionally, the Chrome extension.

## Prerequisites

| Tool | Version | Notes |
| --- | --- | --- |
| JDK | 21+ | The Gradle build targets Java 21. |
| Node.js | 20+ | Vite 7 and React 19. |
| MySQL | 8+ | The schema uses `ENUM`, `MEDIUMTEXT`, and `ON UPDATE CURRENT_TIMESTAMP`. |
| Chrome | Recent | Only needed for the extension. |

The backend wrapper is Gradle 8.14.3, so you do not need a local Gradle install.

## 1. Clone

```bash
git clone https://github.com/DIVESHvalecha/SnippetVault.git
cd SnippetVault
```

## 2. Create the database

`SnippetVault/queries.sql` is a historical scratchpad: it mixes DDL with `?` placeholders and is missing the `snippet_versions` table and `snippets.current_version` column. Use the reconstructed [schema.sql](schema.sql) instead.

```bash
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS SnippetVault CHARACTER SET utf8mb4;"
mysql -u root -p SnippetVault < docs/schema.sql
```

> `[UNVERIFIED]` These commands were not run during the documentation pass because MySQL root credentials were unavailable. If `schema.sql` fails, compare it with the live schema your backend expects in `SnippetVault/src/main/java/com/divesh/SnippetVault/repository/`.

Confirm the tables:

```bash
mysql -u root -p -D SnippetVault -e "SHOW TABLES;"
```

Expected: `auth_tokens`, `folder_snippets`, `folders`, `group_member`, `snippet_versions`, `snippets`, `user_groups`, `users`.

## 3. Configure the backend

`SnippetVault/src/main/resources/application.properties` contains literal datasource and mail settings. Override them with environment variables rather than editing a tracked file:

```bash
export SPRING_DATASOURCE_URL='jdbc:mysql://localhost:3306/SnippetVault'
export SPRING_DATASOURCE_USERNAME='root'
export SPRING_DATASOURCE_PASSWORD='your-mysql-password'
```

Optional, only for password-reset email:

```bash
export SPRING_MAIL_HOST='smtp.example.com'
export SPRING_MAIL_PORT='587'
export SPRING_MAIL_USERNAME='your-smtp-user'
export SPRING_MAIL_PASSWORD='your-smtp-password'
export SPRING_MAIL_PROPERTIES_MAIL_SMTP_AUTH='true'
export SPRING_MAIL_PROPERTIES_MAIL_SMTP_STARTTLS_ENABLE='true'
```

## 4. Run the API

```bash
cd SnippetVault
./gradlew bootRun
```

The API listens on `http://localhost:8080`. Leave this terminal running.

Verify it is up:

```bash
curl -i http://localhost:8080/snippets/own
```

An unauthenticated request should return `401` with `{"error":"Please Login"}`.

## 5. Run the web app

In a second terminal:

```bash
cd SnippetValut-Frontend
npm ci
npm run dev
```

Open `http://localhost:5173`. The root route redirects to `/dashboard`, which requires a session. Click through to sign up, then log in.

The frontend talks to `http://localhost:8080` directly. Both origins are already in the backend CORS allowlist.

## 6. Verify without the UI

```bash
# Register
curl -s -X POST http://localhost:8080/register \
  -H 'Content-Type: application/json' \
  -d '{"name":"Dev User","username":"devuser","email":"dev@example.com","password":"ChangeMe123!","phoneNo":"9876543210"}'

# Log in and store the session cookie
curl -s -c cookies.txt -X POST http://localhost:8080/login \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'email=dev@example.com&password=ChangeMe123!'

# Create a snippet
curl -s -b cookies.txt -X POST http://localhost:8080/create-snippet \
  -H 'Content-Type: application/json' \
  -d '{"title":"Hello","description":"Example","language":"java","visibility":"PRIVATE","content":"System.out.println(\"hi\");"}'

# Read it back
curl -s -b cookies.txt http://localhost:8080/snippets/own
```

## 7. Optional: load the extension

1. Open `chrome://extensions` and enable **Developer mode**.
2. Choose **Load unpacked** and select the `SnippetValut-Extension/` directory.
3. Log in to `http://localhost:5173` in the same Chrome profile. The extension calls `/snippets/own` with `credentials: 'include'` to detect the session.
4. Select text on any page, right-click, and choose **Save to Snippet Vault**.
5. Fill in the title and description, then save.

Limitations:

- The extension hardcodes `http://localhost:8080`; there is no configuration screen.
- The backend CORS allowlist contains one extension ID (`chrome-extension://bhpbjalgcgajnfjhmfbklikcoakchace`). An unpacked build can receive a different ID, in which case the popup's requests are blocked. Add your ID to `SecurityConfig.corsConfigurationSource()` for local use.
- The keyboard shortcut path (`Ctrl/Cmd+Shift+S`) is incomplete. Use the context menu.

## Run the tests

Backend:

```bash
cd SnippetVault
./gradlew test
```

This currently runs one `@SpringBootTest` context-load test. It passes without a live database because the connection pool is lazy.

Frontend:

```bash
cd SnippetValut-Frontend
npm run build
```

`npm run lint` is **not** green: it reports 29 errors and 2 warnings. See [troubleshooting.md](troubleshooting.md).

## Next steps

- [Architecture](architecture.md)
- [API reference](api.md)
- [Configuration](configuration.md)
- [Troubleshooting](troubleshooting.md)
- [FAQ](faq.md)
