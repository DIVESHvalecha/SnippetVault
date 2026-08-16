package com.divesh.SnippetVault.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SnippetVersion {

    private Long versionId;
    private Long snippetId;
    private Long versionNumber;
    private String title;
    private String content;
    private String language;
    private String description;
    private Long editedBy;
    private LocalDateTime createdAt;

}