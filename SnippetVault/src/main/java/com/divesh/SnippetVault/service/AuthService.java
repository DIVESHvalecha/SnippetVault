package com.divesh.SnippetVault.service;

import com.divesh.SnippetVault.exceptions.EmailAlreadyExists;
import com.divesh.SnippetVault.exceptions.InvalidEmailException;
import com.divesh.SnippetVault.exceptions.InvalidToken;
import com.divesh.SnippetVault.exceptions.UserNameAlreadyTakenException;
import com.divesh.SnippetVault.models.User;
import com.divesh.SnippetVault.repository.AuthRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class AuthService {

    @Autowired
    AuthRepository authRepository;
    @Autowired
    EmailService emailService;

    Logger logger = LoggerFactory.getLogger(AuthService.class);
    public void register(User user) throws EmailAlreadyExists, InvalidEmailException, UserNameAlreadyTakenException {
        String name = user.getName();
        String userName = user.getUsername();
        String phoneNo = user.getPhoneNo();
        String password = user.getPassword();
        String email = user.getEmail();

        if(authRepository.findByEmail(email) != null){
            throw new EmailAlreadyExists();
        }

        if(authRepository.findByUsername(userName) != null){
            throw new UserNameAlreadyTakenException();
        }

        if(!isEmailValid(email)){
            throw new InvalidEmailException();
        }
        System.out.println("Reached to service");
        password = encodePassword(password);
        authRepository.register(name, userName, phoneNo, email, password);
    }

    private boolean isEmailValid(String email){
        if(email == null)   return false;
        String REGEX = "^[A-Za-z0-9.+-_]+@[A-Za-z0-9.+-_]+\\.[a-z]{2,}$";
        Pattern pattern = Pattern.compile(REGEX);
        Matcher matcher = pattern.matcher(email);
        return matcher.matches();
    }

    private String encodePassword(String password){
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        return encoder.encode(password);
    }

    public void forgotPassword(Map<String, String> body) throws InvalidEmailException {
        String email = body.get("email");
        User user = authRepository.findByEmail(email);
        if(user == null){
            throw new InvalidEmailException();
        }
        LocalDateTime currentTime = LocalDateTime.now();
        String token = authRepository.checkIfTokenExists(user.getId(), currentTime);
        String uuid;
        if(token == null){
            uuid = UUID.randomUUID().toString();
            LocalDateTime expiryTime = LocalDateTime.now().plusMinutes(15);
            authRepository.forgotPassword(user.getId(), uuid, expiryTime);
        }else{
            uuid = token;
        }
        sendFrogotMail(uuid, email);
    }

    public void sendFrogotMail(String uuid, String email){
        final String FRONTENDURL = "http://localhost:5173/reset-password/"+uuid;

        emailService.sendEmail(email, FRONTENDURL);
    }

    public void validateToken(Map<String, String> body) throws InvalidToken{
        String token = body.get("token");
        LocalDateTime currentTime = LocalDateTime.now();
        Integer user_id = authRepository.validateToken(token, currentTime);
        if(user_id == null){
            throw new InvalidToken();
        }
    }

    public void resetPassword(Map<String, String> body) throws InvalidToken{
        String password = body.get("password");
        String token = body.get("token");
        LocalDateTime currentTime = LocalDateTime.now();
        Integer user_id = authRepository.validateToken(token, currentTime);
        password = encodePassword(password);
        if(user_id != null){
            authRepository.resetPassword(user_id, password);
        }else{
            throw new InvalidToken();
        }
    }
}
