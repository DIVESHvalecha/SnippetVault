package com.divesh.SnippetVault.controller;

import com.divesh.SnippetVault.exceptions.EmailAlreadyExists;
import com.divesh.SnippetVault.exceptions.InvalidEmailException;
import com.divesh.SnippetVault.exceptions.InvalidToken;
import com.divesh.SnippetVault.exceptions.UserNameAlreadyTakenException;
import com.divesh.SnippetVault.models.User;
import com.divesh.SnippetVault.service.AuthService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@CrossOrigin(origins =  "*")
public class AuthController {

    @Autowired
    AuthService authService;

    Logger logger = LoggerFactory.getLogger(AuthController.class);

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@RequestBody User user){
        try{
            authService.register(user);
            logger.info("Registered successfully");
            return ResponseEntity.ok().body(Map.of("body", "Inserted successfully!"));
        }catch(InvalidEmailException | EmailAlreadyExists | UserNameAlreadyTakenException e){
            logger.error(e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("body", e.getMessage()));
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, String>> forgotPassword(@RequestBody Map<String, String> body){
        try{
            authService.forgotPassword(body);
            return ResponseEntity.ok().body(Map.of("body", "Link sent"));
        }catch (InvalidEmailException e){
            logger.error(e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("body", e.getMessage()));
        }
    }

    @PostMapping("/validate-token")
    public ResponseEntity<Map<String, String>> validateToken(@RequestBody Map<String, String> body){
        try{
            authService.validateToken(body);
            return ResponseEntity.ok().body(Map.of("body", "page open"));
        }catch(InvalidToken e){
            return ResponseEntity.badRequest().body(Map.of("body", "Invalid token"));
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(@RequestBody Map<String, String> body){
        try{
            authService.resetPassword(body);
            logger.info("password updated!");
            return ResponseEntity.ok().body(Map.of("body", "password updated successfully"));
        }catch(InvalidToken e){
            return ResponseEntity.badRequest().body(Map.of("body", e.getMessage()));
        }
    }
}
