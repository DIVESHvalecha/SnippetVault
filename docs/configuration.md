# Configuration

The backend reads `SnippetVault/src/main/resources/application.properties`. Spring Boot maps environment variables to those keys with relaxed binding, so you can override any value without editing the tracked file.

> **Security:** the tracked `application.properties` currently contains literal datasource and mail credentials. Rotate them before publishing the repository and keep local values in environment variables or an untracked `application-local.properties`.

## Backend variables

| Variable | Property | Purpose | Default | Required |
| --- | --- | --- | --- | --- |
| `SPRING_APPLICATION_NAME` | `spring.application.name` | Application name used in logs. | Value in `application.properties` | No |
| `SPRING_DATASOURCE_URL` | `spring.datasource.url` | JDBC URL, e.g. `jdbc:mysql://localhost:3306/SnippetVault`. | Value in `application.properties` | Yes |
| `SPRING_DATASOURCE_USERNAME` | `spring.datasource.username` | MySQL user. | Value in `application.properties` | Yes |
| `SPRING_DATASOURCE_PASSWORD` | `spring.datasource.password` | MySQL password. | Value in `application.properties` | Yes |
| `SPRING_DATASOURCE_DRIVERCLASSNAME` | `spring.datasource.driverClassName` | JDBC driver class. | Value in `application.properties` | No |
| `SPRING_MAIN_ALLOW_BEAN_DEFINITION_OVERRIDING` | `spring.main.allow-bean-definition-overriding` | Allows later bean definitions to replace earlier ones. | Value in `application.properties` | No |
| `SPRING_MAIL_HOST` | `spring.mail.host` | SMTP host for password-reset mail. | Value in `application.properties` | For password reset |
| `SPRING_MAIL_PORT` | `spring.mail.port` | SMTP port. | Value in `application.properties` | For password reset |
| `SPRING_MAIL_USERNAME` | `spring.mail.username` | SMTP user. | Value in `application.properties` | For password reset |
| `SPRING_MAIL_PASSWORD` | `spring.mail.password` | SMTP password. | Value in `application.properties` | For password reset |
| `SPRING_MAIL_PROPERTIES_MAIL_SMTP_AUTH` | `spring.mail.properties.mail.smtp.auth` | Enable SMTP authentication. | Value in `application.properties` | For password reset |
| `SPRING_MAIL_PROPERTIES_MAIL_SMTP_STARTTLS_ENABLE` | `spring.mail.properties.mail.smtp.starttls.enable` | Enable STARTTLS. | Value in `application.properties` | For password reset |
| `LOGGING_LEVEL_ROOT` | `logging.level_root` | Root log level. | Value in `application.properties` | No |
| `LOGGING_LEVEL_COM_DIVESH_SNIPPETVAULT` | `logging.level.com.divesh.SnippetVault` | Package log level. | Value in `application.properties` | No |
| `SERVER_PORT` | `server.port` | API port. | `8080` (Spring Boot default) | No |

Registration and login work without SMTP. Only `POST /forgot-password` sends mail, so an unconfigured or unreachable SMTP server affects password reset alone.

### Password-reset link

`AuthService` hardcodes the reset link as:

```text
http://localhost:5173/reset-password/<token>
```

Changing the frontend origin requires a source change in `SnippetVault/src/main/java/com/divesh/SnippetVault/service/AuthService.java`.

### CORS

`SecurityConfig.corsConfigurationSource()` allowlists:

- `http://localhost:4200`
- `http://localhost:3000`
- `http://localhost:5173`
- `chrome-extension://bhpbjalgcgajnfjhmfbklikcoakchace`

Credentials are enabled, so the origin must match exactly. An unpacked extension can receive a different ID; add yours to the list for local use.

### Security settings

| Setting | Current behavior | File |
| --- | --- | --- |
| CSRF | Disabled | `SecurityConfig.java` |
| Session | Server-side `JSESSIONID` cookie; invalidated on logout | `SecurityConfig.java` |
| Password hashing | BCrypt | `SecurityConfig.java`, `AuthService.java` |
| Public endpoints | `/login`, `/register`, `/forgot-password`, `/validate-token`, `/reset-password`, `/groups/public`, `/abc123` | `SecurityConfig.java` |
| CORS credentials | Enabled | `SecurityConfig.java` |

`/abc123` is a leftover test path and `/groups/public` is intentionally public. Everything else requires an authenticated session.

## Frontend configuration

There is no frontend `.env`. The API base URL is hardcoded in:

- `SnippetValut-Frontend/src/services/auth.js`
- `SnippetValut-Frontend/src/services/snippet.js`
- `SnippetValut-Frontend/src/services/group.js`

Each file starts with:

```js
const BASE_URL = 'http://localhost:8080';
```

Changing the API host requires editing those three files.

## Extension configuration

There is no options page. The extension hardcodes the API and app URLs:

- `SnippetValut-Extension/background.js`: `const BASE_URL = 'http://localhost:8080';`
- `SnippetValut-Extension/popup/popup.js`: `const BASE_URL = 'http://localhost:8080';`
- `SnippetValut-Extension/manifest.json`: `host_permissions` contains only `http://localhost:8080/*`
- The "Open Snippet Vault" button opens `http://localhost:5173`.

## Logging

The backend uses SLF4J. Controllers and services log at `info`/`error`; there is no request-ID correlation, structured JSON logging, or log rotation. Logs go to the console.

## Local overrides

If you prefer a file over environment variables, create an untracked `SnippetVault/src/main/resources/application-local.properties` and run with:

```bash
cd SnippetVault
./gradlew bootRun --args='--spring.profiles.active=local'
```

`application-local.properties` and `.env*` are ignored by the root `.gitignore`.
