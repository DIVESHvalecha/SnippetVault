package com.divesh.SnippetVault.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class User {
    long id;
    String name;
    String username;
    String password;
    String email;
    String phoneNo;
    int activeYn;
}
