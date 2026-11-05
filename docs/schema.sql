-- Snippet Vault schema
-- Reconstructed from the repository/row-mapper code because SnippetVault/queries.sql
-- is a historical scratchpad and is not executable as a single script.
--
-- [UNVERIFIED] These statements were not executed against a MySQL instance during
-- the documentation pass. Verify with:
--   mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS SnippetVault CHARACTER SET utf8mb4;"
--   mysql -u root -p SnippetVault < docs/schema.sql
--
-- Usage:
--   mysql -u root -p SnippetVault < docs/schema.sql

CREATE TABLE IF NOT EXISTS users (
    user_id    INT AUTO_INCREMENT PRIMARY KEY,
    name       VARCHAR(50)  NOT NULL,
    username   VARCHAR(50)  NOT NULL UNIQUE,
    password   VARCHAR(255) NOT NULL,
    email      VARCHAR(30)  NOT NULL UNIQUE,
    phone_no   VARCHAR(10)  NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    active_yn  INT DEFAULT 1
);

CREATE TABLE IF NOT EXISTS auth_tokens (
    token    VARCHAR(255) PRIMARY KEY,
    user_id  INT NOT NULL,
    expiry   TIMESTAMP,
    used_yn  BOOLEAN DEFAULT FALSE,
    CONSTRAINT fk_auth_tokens_user
        FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS user_groups (
    group_id         INT AUTO_INCREMENT PRIMARY KEY,
    name             VARCHAR(100) NOT NULL,
    description      TEXT,
    group_code       VARCHAR(20) UNIQUE,
    user_id          INT NOT NULL,
    created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    active_yn        INT DEFAULT 1,
    group_visibility ENUM('PUBLIC', 'PRIVATE') NOT NULL DEFAULT 'PRIVATE',
    UNIQUE (user_id, name),
    CONSTRAINT fk_groups_user
        FOREIGN KEY (user_id) REFERENCES users (user_id)
        ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS group_member (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    user_id    INT NOT NULL,
    group_id   INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    active_yn  INT DEFAULT 1,
    UNIQUE (user_id, group_id),
    CONSTRAINT fk_group_member_user
        FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE,
    CONSTRAINT fk_group_member_group
        FOREIGN KEY (group_id) REFERENCES user_groups (group_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS snippets (
    snippet_id      INT AUTO_INCREMENT PRIMARY KEY,
    title           VARCHAR(200) NOT NULL,
    content         MEDIUMTEXT NOT NULL,
    language        VARCHAR(50),
    description     TEXT,
    group_id        INT NULL,
    user_id         INT NOT NULL,
    visibility      ENUM('PRIVATE', 'GROUP', 'PUBLIC') DEFAULT 'PRIVATE',
    active_yn       TINYINT DEFAULT 1,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    current_version INT NOT NULL DEFAULT 1,
    CONSTRAINT fk_snippet_user
        FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE,
    CONSTRAINT fk_snippet_group
        FOREIGN KEY (group_id) REFERENCES user_groups (group_id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS snippet_versions (
    version_id     BIGINT AUTO_INCREMENT PRIMARY KEY,
    snippet_id     INT NOT NULL,
    version_number INT NOT NULL,
    title          VARCHAR(200),
    content        MEDIUMTEXT,
    language       VARCHAR(50),
    description    TEXT,
    edited_by      INT,
    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (snippet_id, version_number),
    CONSTRAINT fk_version_snippet
        FOREIGN KEY (snippet_id) REFERENCES snippets (snippet_id) ON DELETE CASCADE,
    CONSTRAINT fk_version_editor
        FOREIGN KEY (edited_by) REFERENCES users (user_id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS folders (
    folder_id  BIGINT AUTO_INCREMENT PRIMARY KEY,
    name       VARCHAR(150) NOT NULL,
    description TEXT,
    user_id    INT NOT NULL,
    group_id   INT NULL,
    active_yn  TINYINT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_folder_user
        FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE,
    CONSTRAINT fk_folder_group
        FOREIGN KEY (group_id) REFERENCES user_groups (group_id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS folder_snippets (
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    folder_id  BIGINT NOT NULL,
    snippet_id INT NOT NULL,
    active_yn  TINYINT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (folder_id, snippet_id),
    CONSTRAINT fk_folder_snippets_folder
        FOREIGN KEY (folder_id) REFERENCES folders (folder_id) ON DELETE CASCADE,
    CONSTRAINT fk_folder_snippets_snippet
        FOREIGN KEY (snippet_id) REFERENCES snippets (snippet_id) ON DELETE CASCADE
);
