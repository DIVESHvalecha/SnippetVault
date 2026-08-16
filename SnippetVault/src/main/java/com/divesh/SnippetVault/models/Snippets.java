package com.divesh.SnippetVault.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Snippets {
    Long snippetId;
    String title;
    String content;
    String description;
    String language;
    String visibility;
    Long currentVersion;

    Long groupId;
    Long userId;
    Integer activeYn;

    Long folderId;
}
