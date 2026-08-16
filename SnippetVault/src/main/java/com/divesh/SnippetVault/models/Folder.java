package com.divesh.SnippetVault.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Folder {
    Long folderId;
    String name;
    String description;
    Long userId;
    Long groupId;
    Integer activeYn;
}
