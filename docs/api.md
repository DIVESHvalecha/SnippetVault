# API reference

Base URL: `http://localhost:8080`. There is no `/api` prefix.

Authentication uses the Spring Security session cookie (`JSESSIONID`). Send `credentials: 'include'` from the browser, or `-b cookies.txt` from curl. All endpoints except the public ones listed below return `401 {"error":"Please Login"}` without a session.

## Endpoint summary

### Auth

| Method | Path | Auth | Purpose |
| --- | --- | --- | --- |
| `POST` | `/register` | Public | Create a user. |
| `POST` | `/login` | Public | Form login; sets `JSESSIONID`. |
| `POST` | `/logout` | Session | Invalidate the session. |
| `POST` | `/forgot-password` | Public | Email a reset link. |
| `POST` | `/validate-token` | Public | Check a reset token. |
| `POST` | `/reset-password` | Public | Set a new password with a token. |

### Snippets

| Method | Path | Auth | Purpose |
| --- | --- | --- | --- |
| `POST` | `/create-snippet` | Session | Create a snippet and revision 1. |
| `GET` | `/snippets/public` | Session | All public snippets. |
| `GET` | `/snippets/own` | Session | Everything the caller owns. |
| `GET` | `/snippets/private` | Session | The caller's private snippets. |
| `GET` | `/snippets/group/{groupCode}` | Session + membership | Snippets in a joined group. |
| `GET` | `/snippets/{id}` | Session, **owner only** | One snippet. |
| `PATCH` | `/snippets/{id}` | Session, owner | Edit; appends a revision. |
| `DELETE` | `/snippets/{id}` | Session, owner | Soft delete. |
| `GET` | `/snippets/{id}/versions` | Session, owner/public/group | Version history. |
| `GET` | `/snippets/{id}/versions/{n}` | Session, **owner only** | One full revision. |
| `POST` | `/snippets/{id}/restore/{n}` | Session, owner | Append the old revision as a new version. |
| `POST` | `/snippets/{id}/fork/{n}` | Session, owner/public/group | Copy revision `n` into the caller's private vault. |

### Groups

| Method | Path | Auth | Purpose |
| --- | --- | --- | --- |
| `POST` | `/group` | Session | Create a group and auto-join it. |
| `POST` | `/join-group/{groupCode}` | Session | Join by 6-character code. |
| `GET` | `/groups/public` | **Public** | Public groups with member counts. |
| `GET` | `/groups/my-groups` | Session | Groups the caller belongs to. |
| `DELETE` | `/leave-group/{groupCode}` | Session | Soft-leave a group. |

### Folders

| Method | Path | Auth | Purpose |
| --- | --- | --- | --- |
| `POST` | `/folder` | Session | Create a folder. |
| `GET` | `/folder` | Session | List the caller's folders. |
| `DELETE` | `/folder/{id}` | Session, owner | Soft delete. |
| `POST` | `/folder/{id}/snippet/{snippetId}` | Session, folder owner | Add a snippet. |
| `GET` | `/folder/{id}/snippet` | Session, folder owner | List folder snippets. |
| `DELETE` | `/folder/{id}/snippet/{snippetId}` | Session, folder owner | Remove a snippet. |

## Snippet object

```json
{
  "snippetId": 42,
  "title": "Read a file",
  "content": "Files.readString(Path.of(\"notes.txt\"));",
  "description": "Reads a UTF-8 file",
  "language": "java",
  "visibility": "PRIVATE",
  "currentVersion": 3,
  "groupId": 0,
  "userId": 12,
  "activeYn": 1,
  "folderId": null
}
```

`visibility` is `PRIVATE`, `GROUP`, or `PUBLIC` (upper-case in the API; the SPA lower-cases it). `groupId` is `0` rather than `null` when the database value is `NULL`, because the row mapper uses `ResultSet.getLong`. `folderId` is not populated by the snippet row mapper.

## Auth examples

**Register**

```bash
curl -s -X POST http://localhost:8080/register \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Dev User",
    "username": "devuser",
    "email": "dev@example.com",
    "password": "ChangeMe123!",
    "phoneNo": "9876543210"
  }'
```

`200 {"body":"Inserted successfully!"}`

Errors: `400 {"body":"Email already exists"}` (or the corresponding username/email validation message).

**Login**

```bash
curl -s -c cookies.txt -X POST http://localhost:8080/login \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'email=dev@example.com&password=ChangeMe123!'
```

`200 {"message":"Login Successful","user":"dev@example.com"}` and a `JSESSIONID` cookie.

**Logout**

```bash
curl -s -b cookies.txt -X POST http://localhost:8080/logout
```

**Forgot / reset password**

```bash
curl -s -X POST http://localhost:8080/forgot-password \
  -H 'Content-Type: application/json' \
  -d '{"email":"dev@example.com"}'

curl -s -X POST http://localhost:8080/validate-token \
  -H 'Content-Type: application/json' \
  -d '{"token":"<token-from-email>"}'

curl -s -X POST http://localhost:8080/reset-password \
  -H 'Content-Type: application/json' \
  -d '{"token":"<token-from-email>","password":"NewPassword123!"}'
```

Tokens expire after 15 minutes. A successful reset marks all of the user's tokens as used.

## Snippet examples

**Create**

```bash
curl -s -b cookies.txt -X POST http://localhost:8080/create-snippet \
  -H 'Content-Type: application/json' \
  -d '{
    "title": "Read a file",
    "description": "Reads a UTF-8 file",
    "language": "java",
    "visibility": "PRIVATE",
    "content": "Files.readString(Path.of(\"notes.txt\"));"
  }'
```

For a group snippet, add `"visibility":"GROUP"` and `"groupId":1` and join the group first. For a folder, add `"folderId":1`. The response is `{"body":"Snippet created successfully"}` and does **not** include the new snippet ID.

**List**

```bash
curl -s -b cookies.txt http://localhost:8080/snippets/own
curl -s -b cookies.txt http://localhost:8080/snippets/public
curl -s -b cookies.txt http://localhost:8080/snippets/private
curl -s -b cookies.txt http://localhost:8080/snippets/group/ABC123
```

**Read / edit / delete**

```bash
curl -s -b cookies.txt http://localhost:8080/snippets/42

curl -s -b cookies.txt -X PATCH http://localhost:8080/snippets/42 \
  -H 'Content-Type: application/json' \
  -d '{
    "title": "Read a file safely",
    "description": "Adds a size check",
    "language": "java",
    "visibility": "PRIVATE",
    "content": "Files.readString(Path.of(\"notes.txt\"));"
  }'

curl -s -b cookies.txt -X DELETE http://localhost:8080/snippets/42
```

A `PATCH` always appends a new revision, even if the content is unchanged. `DELETE` is a soft delete (`active_yn = 0`).

**History, restore, fork**

```bash
# Newest-first history
curl -s -b cookies.txt http://localhost:8080/snippets/42/versions

# One revision (owner only)
curl -s -b cookies.txt http://localhost:8080/snippets/42/versions/2

# Restore revision 2 as a new revision
curl -s -b cookies.txt -X POST http://localhost:8080/snippets/42/restore/2

# Fork revision 2 into your own private vault
curl -s -b cookies.txt -X POST http://localhost:8080/snippets/42/fork/2
```

## Group examples

```bash
# Create and auto-join
curl -s -b cookies.txt -X POST http://localhost:8080/group \
  -H 'Content-Type: application/json' \
  -d '{"name":"Java Team","description":"Shared Java snippets","groupVisibility":"PUBLIC"}'

# Join with the returned code (the create response does not include the code; query your groups)
curl -s -b cookies.txt -X POST http://localhost:8080/join-group/ABC123

# List
curl -s -b cookies.txt http://localhost:8080/groups/my-groups
curl -s http://localhost:8080/groups/public

# Leave
curl -s -b cookies.txt -X DELETE http://localhost:8080/leave-group/ABC123
```

`/groups/public` is the only snippet/group endpoint reachable without a session. It returns `Map<Group, Integer>`: group representations as keys and member counts as values.

## Folder examples

```bash
curl -s -b cookies.txt -X POST http://localhost:8080/folder \
  -H 'Content-Type: application/json' \
  -d '{"name":"Java","description":"Java snippets"}'

curl -s -b cookies.txt http://localhost:8080/folder

curl -s -b cookies.txt -X POST http://localhost:8080/folder/1/snippet/42

curl -s -b cookies.txt http://localhost:8080/folder/1/snippet

curl -s -b cookies.txt -X DELETE http://localhost:8080/folder/1/snippet/42

curl -s -b cookies.txt -X DELETE http://localhost:8080/folder/1
```

## Error format

Most errors are `{"body":"<message>"}` or `{"error":"<message>"}` with a `4xx`/`5xx` status. Notable cases:

| Status | Body | Cause |
| --- | --- | --- |
| `401` | `{"error":"Please Login"}` | No or expired session. |
| `401` | `{"error":"Invalid Credentials"}` | Wrong email/password on login. |
| `400` | `{"body":"Invalid token"}` | Expired or unknown reset token. |
| `400` | `{"body":"User has not joined this group"}` | Group snippet/folder without membership. |
| `400` | `{"body":"Snippet version not found or access denied"}` | Fork target not visible to the caller. |
| `500` | Framework error page / JSON | Missing snippet, unavailable DB, or SMTP failure. |

`AuthController` also declares `@CrossOrigin(origins = "*")` at class level, while global CORS enables credentials. This is a known configuration inconsistency.
