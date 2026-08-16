package com.divesh.SnippetVault.exceptions;

public class EmailAlreadyExists extends Exception{
    public EmailAlreadyExists(){
        super("Email already exists!");
    }
}
