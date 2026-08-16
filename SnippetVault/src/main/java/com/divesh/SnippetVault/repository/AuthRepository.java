package com.divesh.SnippetVault.repository;

import com.divesh.SnippetVault.models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public class AuthRepository {

    @Autowired
    JdbcTemplate jdbcTemplate;

    public void register(String name, String userName, String phoneNo, String email, String password){
        String query = "INSERT INTO users (name, username, password, email, phone_no) VALUES (?, ?, ?, ?, ?)";
        jdbcTemplate.update(query,name, userName, password, email, phoneNo );
    }

    public User findByEmail(String email){
        String query = "SELECT user_id, name, username, password, email, phone_no, active_yn FROM users WHERE email = ?";
        try{
            return jdbcTemplate.queryForObject(query,(rs, rowNum) -> {
                User user = new User();
                user.setId(rs.getLong("user_id"));
                user.setName(rs.getString("name"));
                user.setUsername(rs.getString("username"));
                user.setPassword(rs.getString("password"));
                user.setEmail(rs.getString("email"));
                user.setPhoneNo(rs.getString("phone_no"));
                user.setActiveYn(rs.getInt("active_yn"));
                return user;
            }, email);
        }catch(EmptyResultDataAccessException e){
            return null;
        }
    }

    public User findByUsername(String userName){
        String query = "SELECT user_id, name, username, password, email, phone_no, active_yn FROM users WHERE username = ?";
        try{
            return jdbcTemplate.queryForObject(query,(rs, rowNum) -> {
                User user = new User();
                user.setId(rs.getLong("user_id"));
                user.setName(rs.getString("name"));
                user.setUsername(rs.getString("username"));
                user.setPassword(rs.getString("password"));
                user.setEmail(rs.getString("email"));
                user.setPhoneNo(rs.getString("phone_no"));
                user.setActiveYn(rs.getInt("active_yn"));
                return user;
            }, userName);
        }catch(EmptyResultDataAccessException e){
            return null;
        }
    }

    public Integer validateToken(String token, LocalDateTime currentTime){
        String query = "select user_id from auth_tokens where token like (?) AND used_yn = 0 AND expiry > current_timestamp";
        try{
            return (Integer) jdbcTemplate.queryForMap(query, token).get("user_id");
        }catch(EmptyResultDataAccessException e){
            return null;
        }
    }

    public void resetPassword(Integer userId, String password) {
        String updateUser = "update users set password = ? where user_id = ?";
        String updateAuth = "update auth_tokens set used_yn = 1 where user_id = ?";
        jdbcTemplate.update(updateUser, password, userId);
        jdbcTemplate.update(updateAuth, userId);
    }

    public String checkIfTokenExists(long userId, LocalDateTime currentTime){
        String query = "select token from auth_tokens where user_id like (?) AND used_yn = 0 AND expiry > current_timestamp";
        String updateQuery = "update auth_tokens set expiry = (?) where user_id = (?)";
        try{
            String token = (String) jdbcTemplate.queryForMap(query, userId).get("token");
            LocalDateTime expiryTime = currentTime.plusMinutes(15);
            jdbcTemplate.update(updateQuery, expiryTime, userId);
            return token;
        }catch (EmptyResultDataAccessException e){
            return null;
        }
    }

    public void forgotPassword(long id, String uuid, LocalDateTime expiryTime) {
        String query = "INSERT INTO auth_tokens (user_id, token, expiry) VALUES (?, ?, ?)";
        jdbcTemplate.update(query, id, uuid, expiryTime);
    }

}
