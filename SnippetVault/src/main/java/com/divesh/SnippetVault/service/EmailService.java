package com.divesh.SnippetVault.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    JavaMailSender javaMailSender;

    public void sendEmail(String to, String url){
        MimeMessage message = javaMailSender.createMimeMessage();

        MimeMessageHelper messageHelper = new MimeMessageHelper(message);

        try {
            String html = "<!DOCTYPE html>" +
                    "<html>" +
                    "<body style=\"font-family:Arial; background:#f4f4f4; padding:20px;\">" +
                    "  <div style=\"max-width:400px; background:#fff; padding:20px; margin:auto;\">" +
                    "    <p>Hi,</p>" +
                    "    <p>Click the link below to reset your password:</p>" +
                    "    <p>" +
                    "      <a href=\"" + url + "\" " +
                    "         style=\"display:inline-block; padding:10px 15px; background:#6d4aff; color:#fff; " +
                    "                text-decoration:none; border-radius:5px;\">" +
                    "         Reset Password" +
                    "      </a>" +
                    "    </p>" +
                    "    <p>If you didn’t request this, please ignore this email.</p>" +
                    "    <p>– Team Expense Tracker</p>" +
                    "  </div>" +
                    "</body>" +
                    "</html>";
            messageHelper.setTo(to);
//            messageHelper.setText(token);
            messageHelper.setSubject("Reset password - Expense Tracker");
            messageHelper.setText(html, true);
        } catch (MessagingException e) {
            throw new RuntimeException(e);
        }
        javaMailSender.send(message);
    }
}
