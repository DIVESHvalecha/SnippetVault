package com.divesh.SnippetVault.service;

import com.divesh.SnippetVault.models.CustomUserDetails;
import com.divesh.SnippetVault.models.User;
import com.divesh.SnippetVault.repository.AuthRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailService implements UserDetailsService {

    @Autowired
    AuthRepository authRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = authRepository.findByEmail(username);

        if(user == null){
            throw new UsernameNotFoundException("Invalid credentials");
        }else{
//            return org.springframework.security.core.userdetails.User.builder()
//                    .username(user.getEmail())
//                    .password(user.getPassword())
//                    .roles("USER")
//                    .disabled(user.getActiveYn() == 0)
//                    .build();
            return new CustomUserDetails(user);
        }
    }
}
