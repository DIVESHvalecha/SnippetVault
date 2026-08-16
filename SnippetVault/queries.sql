create database SnippetVault;
use SnippetVault;

create table users(
	user_id INT primary key AUTO_INCREMENT,
    name varchar(50) not null,
    username varchar(50) not null unique,
    password varchar(255) not null,
    email varchar(30) not null unique,
    phone_no varchar(10) not null,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    active_yn int default 1
);
select * from users;

INSERT INTO users (name, username, password, email, phone_no)
VALUES
('Rahul Sharma', 'rahul_s', 'hashed_password_1', 'rahul@gmail.com', '9876543210'),
('Ananya Verma', 'ananya_v', 'hashed_password_2', 'ananya@gmail.com', '9123456780'),
('Amit Patel', 'amit_p', 'hashed_password_3', 'amit@gmail.com', '9988776655');

SELECT * FROM users;

create table auth_tokens(
	token VARCHAR(255) PRIMARY KEY,
    user_id INT NOT NULL,
    expiry TIMESTAMP,
    used_yn BOOLEAN DEFAULT FALSE,
    foreign key (user_id) references users(user_id) on delete cascade
);

CREATE TABLE user_groups (
    group_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    group_code VARCHAR(20) UNIQUE,
    user_id INT NOT NULL,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    active_yn int default 1,

    -- composite unique constraint
    UNIQUE (user_id, name),

    -- foreign key constraint
    CONSTRAINT fk_groups_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

ALTER TABLE user_groups
ADD COLUMN group_visibility ENUM('PUBLIC','PRIVATE')
DEFAULT 'PRIVATE'
NOT NULL;

INSERT INTO user_groups (name, description, group_code, group_visibility, user_id) values(?, ?, ?, ?, ?);
SELECT group_id, name, description, group_code, group_visibility, user_id from user_groups where name = ? and user_id = ?;
SELECT group_id, name, description, group_code, group_visibility, user_id from user_groups where group_code = "TSBQAA";

select * from user_groups;
SELECT group_id, name, description, group_code, group_visibility, user_id from user_groups where group_visibility = "PUBLIC";

CREATE TABLE group_member (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    group_id INT NOT NULL,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    active_yn int default 1,

    -- prevent duplicate membership
    UNIQUE (user_id, group_id),

    -- foreign keys
    CONSTRAINT fk_usergroups_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_usergroups_group
        FOREIGN KEY (group_id)
        REFERENCES user_groups(group_id)
        ON DELETE CASCADE
);

SHOW INDEX FROM group_member;

ALTER TABLE group_member
DROP INDEX user_id;

INSERT INTO group_member (user_id, group_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE active_yn = 1;

insert into group_member (user_id, group_id) values (?, ?);

SELECT id, user_id, group_id from group_member where user_id = ? and group_id = ?;

UPDATE group_member SET active_yn = 0 where id = ?;

SELECT g.group_id, g.name, g.description, g.group_code, g.group_visibility, g.user_id from user_groups g, group_member m where g.group_id = m.group_id and m.user_id = ?;

CREATE TABLE snippets (
    snippet_id      INT AUTO_INCREMENT PRIMARY KEY,
    title           VARCHAR(200) NOT NULL,
    content         MEDIUMTEXT NOT NULL,

    language        VARCHAR(50),          -- java, python, sql, js, etc
    description     TEXT,

    group_id        INT NULL,          -- NULL = private snippet
    user_id         INT NOT NULL,      -- creator

    visibility      ENUM('PRIVATE','GROUP','PUBLIC') DEFAULT 'PRIVATE',

    active_yn       TINYINT DEFAULT 1,    -- soft delete

    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- foreign keys
    CONSTRAINT fk_snippet_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_snippet_group
        FOREIGN KEY (group_id)
        REFERENCES user_groups(group_id)
        ON DELETE SET NULL
);

CREATE TABLE folders (
    folder_id     BIGINT AUTO_INCREMENT PRIMARY KEY,

    name          VARCHAR(150) NOT NULL,
    description   TEXT,

    user_id       INT NOT NULL,          -- owner of folder
    group_id      INT NULL,              -- optional (for shared folders later)

    active_yn     TINYINT DEFAULT 1,

    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_folder_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_folder_group
        FOREIGN KEY (group_id)
        REFERENCES user_groups(group_id)
        ON DELETE SET NULL
);

select folder_id, name, description, user_id, group_id, active_yn from folders where user_id = ? and active_yn = 1;

CREATE TABLE folder_snippets (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,

    folder_id   BIGINT NOT NULL,
    snippet_id  INT NOT NULL,

    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE (folder_id, snippet_id),

    CONSTRAINT fk_fs_folder
        FOREIGN KEY (folder_id)
        REFERENCES folders(folder_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_fs_snippet
        FOREIGN KEY (snippet_id)
        REFERENCES snippets(snippet_id)
        ON DELETE CASCADE
);

select * from folder_snippets;

select fs.snippet_id, s.title, s.content, s.language, s.description, s.group_id, s.user_id, s.visibility, s.active_yn from folder_snippet fs inner join snippets s on fs.snippet_id = s.snippet_id where s.active_yn = 1 and s.user_id = ? and fs.folder_id = ?;


select * from snippets;
select snippet_id, title, content, language, description, group_id, user_id, visibility, active_yn from snippets where active_yn = 1 and user_id = 15;
select snippet_id, title, content, language, description, group_id, user_id, visibility, active_yn from snippets where active_yn = 1 and user_id = 12 and snippet_id = 5;
select snippet_id, title, content, language, description, group_id, user_id, visibility, active_yn from snippets where visibility = 'PUBLIC' and active_yn = 1;

UPDATE snippets
SET title = ?, content = ?, language = ?, description = ?, group_id = ?, visibility = ? WHERE active_yn = 1 AND user_id = ? AND snippet_id = ?;

