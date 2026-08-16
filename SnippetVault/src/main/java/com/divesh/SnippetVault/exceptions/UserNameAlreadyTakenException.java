package com.divesh.SnippetVault.exceptions;

public class UserNameAlreadyTakenException extends Exception{
    public UserNameAlreadyTakenException(){
        super("Username already taken!");
    }
}
