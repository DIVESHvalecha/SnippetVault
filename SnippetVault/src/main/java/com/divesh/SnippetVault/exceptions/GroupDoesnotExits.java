package com.divesh.SnippetVault.exceptions;

public class GroupDoesnotExits extends Exception{
    public GroupDoesnotExits() {
        super("Group with this code doesn't exits");
    }

    public GroupDoesnotExits(String message) {
        super(message);
    }
}
