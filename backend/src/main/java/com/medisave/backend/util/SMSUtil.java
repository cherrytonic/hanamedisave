package com.medisave.backend.util;

import jakarta.annotation.PostConstruct;
import net.nurigo.sdk.NurigoApp;
import net.nurigo.sdk.message.model.Message;
import net.nurigo.sdk.message.request.SingleMessageSendingRequest;
import net.nurigo.sdk.message.service.DefaultMessageService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class SMSUtil {
    @Value("${coolsms.api-key}")
    private String apiKey;
    @Value("${coolsms.api-secret}")
    private String apiSecretKey;
    @Value("${coolsms.sender-phone}")
    private String senderPhone;

    DefaultMessageService messageService; // 메시지 서비스를 위한 객체

    @PostConstruct // 의존성 주입이 완료된 후 초기화를 수행하는 메서드
    public void init(){
        this.messageService = NurigoApp.INSTANCE.initialize(apiKey, apiSecretKey, "https://api.coolsms.co.kr"); // 메시지 서비스 초기화
    }

    // 단일 메시지 발송
    public void sendSms(String to, String text){
        Message message = new Message(); // 새 메시지 객체 생성
        message.setFrom(senderPhone); // 발신자 번호 설정
        message.setTo(to); // 수신자 번호 설정
        message.setText(text); // 메시지 내용 설정
        this.messageService.sendOne(new SingleMessageSendingRequest(message)); // 메시지 발송 요청
    }
}
