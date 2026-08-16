package com.divesh.SnippetVault.exceptions;

public class GroupAlreadyExistsException extends Exception{
    public GroupAlreadyExistsException() {
        super("Group with this name already exits");
    }
}
