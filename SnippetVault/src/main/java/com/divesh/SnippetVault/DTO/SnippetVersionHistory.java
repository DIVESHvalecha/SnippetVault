package com.divesh.SnippetVault.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SnippetVersionHistory {

    private Long versionNumber;
    private Long editedBy;
    private LocalDateTime createdAt;
    private String title;
    private String description;
    private String content;
    private String language;
}