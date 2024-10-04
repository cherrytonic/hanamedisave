package com.medisave.backend.alert.controller;

import com.medisave.backend.alert.model.dto.response.AlertResponseDto;
import com.medisave.backend.alert.service.AlertPublishService;
import com.medisave.backend.member.domain.Member;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/alert")
public class AlertController {
    private final AlertPublishService alertPublishService;
    @GetMapping("/chat")
    public ResponseEntity<?> getChatAlert(@PathVariable Long memberId) {
        Member myInfo = alertPublishService.getMember(memberId);
        AlertResponseDto alertResponseDto = new AlertResponseDto(alertPublishService.isChatAlertExist(myInfo));
        return new ResponseEntity<>(alertResponseDto, HttpStatus.OK);
    }

    @GetMapping("/noti")
    public ResponseEntity<?> getNotiAlert(@PathVariable Long memberId) {
        Member myInfo = alertPublishService.getMember(memberId);
        AlertResponseDto alertResponseDto = new AlertResponseDto(alertPublishService.isNotiAlertExist(myInfo));
        return new ResponseEntity<>(alertResponseDto, HttpStatus.OK);
    }
}
