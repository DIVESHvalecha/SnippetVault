package com.divesh.SnippetVault.models;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class Group {
    Long id;
    String name;
    String description;
    String groupCode;
    String groupVisibility;
    Long userId;
}
