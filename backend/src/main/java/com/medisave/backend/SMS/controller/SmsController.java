package com.medisave.backend.SMS.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.medisave.backend.SMS.dto.MessageDTO;
import com.medisave.backend.SMS.dto.SmsResponseDTO;
import com.medisave.backend.SMS.service.SmsService;
import com.medisave.backend.member.controller.MemberController;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestClientException;

import java.io.UnsupportedEncodingException;
import java.net.URISyntaxException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.Map;

@RestController
@RequestMapping("/sms")
public class SmsController {
//    @Autowired
//    private SmsService smsService;
//    private static final Logger logger = LoggerFactory.getLogger(MemberController.class);

//    @PostMapping("/send")
//    public String sendSms(@RequestBody Map<String, String> body) {
//        String phoneNumber = body.get("phoneNumber");
//        try {
//            String generatedCode = smsService.sendSms(phoneNumber);
//            return "Generated verification code: " + generatedCode;
//        } catch (Exception e) {
//            e.printStackTrace();
//            return "Failed to send SMS: " + e.getMessage();
//        }
//    }

}
