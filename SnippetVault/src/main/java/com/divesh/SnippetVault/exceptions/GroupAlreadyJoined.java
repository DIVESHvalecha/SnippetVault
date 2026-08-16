package com.divesh.SnippetVault.exceptions;

public class GroupAlreadyJoined extends Exception{
    public GroupAlreadyJoined() {
        super("The user has already joined this code");
    }
}
