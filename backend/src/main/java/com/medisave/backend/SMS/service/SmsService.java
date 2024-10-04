package com.medisave.backend.SMS.service;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.nurigo.sdk.NurigoApp;
import net.nurigo.sdk.message.request.SingleMessageSendingRequest;
import net.nurigo.sdk.message.service.DefaultMessageService;
import org.springframework.beans.factory.annotation.Value;
import net.nurigo.sdk.message.model.Message;
import org.springframework.stereotype.Service;


@Slf4j
@RequiredArgsConstructor
@Service
public class SmsService {

//    @Value("${coolsms.api-key}")
//    private String apiKey;
//    @Value("${coolsms.api-secret}")
//    private String apiSecretKey;
//    @Value("${coolsms.sender-phone}")
//    private String senderPhone;

//    DefaultMessageService messageService; // 메시지 서비스를 위한 객체
//
//    @PostConstruct // 의존성 주입이 완료된 후 초기화를 수행하는 메서드
//    public void init(){
//        this.messageService = NurigoApp.INSTANCE.initialize(apiKey, apiSecretKey, "https://api.coolsms.co.kr"); // 메시지 서비스 초기화
//    }
//
//    // 단일 메시지 발송
//    public void sendSms(String to, String text){
//        Message message = new Message(); // 새 메시지 객체 생성
//        message.setFrom(senderPhone); // 발신자 번호 설정
//        message.setTo(to); // 수신자 번호 설정
//        message.setText(text); // 메시지 내용 설정
//        this.messageService.sendOne(new SingleMessageSendingRequest(message)); // 메시지 발송 요청
//    }

//    public SmsResponseDTO sendSms(MessageDTO messageDto) throws JsonProcessingException, RestClientException, URISyntaxException, InvalidKeyException, NoSuchAlgorithmException, UnsupportedEncodingException {
//
//        // 현재 시간
//        String time = Long.toString(System.currentTimeMillis());
//
//        Message coolsms = new Message(apiKey, apiSecretKey);
//
//        List<MessageDTO> messages = new ArrayList<>();
//        messages.add(messageDto);
//
//        // API 요청 양식에 맞춰 세팅
//        SmsRequestDTO request = SmsRequestDTO.builder()
//                .type("SMS")
//                .contentType("COMM")
//                .countryCode("82")
//                .from(phone)
//                .content("ㅎㅇ")
//                .messages(messages)
//                .build();
//
//        // request를 JSON 형태로 변환
//        ObjectMapper objectMapper = new ObjectMapper();
//        String body = objectMapper.writeValueAsString(request);
//
//        // body와 header를 합친다
//        HttpEntity<String> httpBody = new HttpEntity<>(body, headers);
//
//        // RestTemplate 설정
//        RestTemplate restTemplate = new RestTemplate();
//
//        // RestTemplate을 통해 외부 API와 통신
//        SmsResponseDTO smsResponseDto = restTemplate.postForObject(
//                new URI("https://sens.apigw.ntruss.com/sms/v2/services/" + serviceId + "/messages"),
//                httpBody,
//                SmsResponseDTO.class
//        );
//
//        return smsResponseDto;
//    }
//
//    // 전달하고자 하는 데이터를 암호화하는 작업
//    public String getSignature(String time) throws NoSuchAlgorithmException, UnsupportedEncodingException, InvalidKeyException {
//        String space = " ";
//        String newLine = "\n";
//        String method = "POST";
//        String url = "/sms/v2/services/" + this.serviceId + "/messages";
//        String accessKey = this.accessKey;
//        String secretKey = this.secretKey;
//
//        String message = new StringBuilder()
//                .append(method)
//                .append(space)
//                .append(url)
//                .append(newLine)
//                .append(time)
//                .append(newLine)
//                .append(accessKey)
//                .toString();
//
//        SecretKeySpec signingKey = new SecretKeySpec(secretKey.getBytes("UTF-8"), "HmacSHA256");
//        Mac mac = Mac.getInstance("HmacSHA256");
//        mac.init(signingKey);
//
//        byte[] rawHmac = mac.doFinal(message.getBytes("UTF-8"));
//        return Base64.encodeBase64String(rawHmac);
//    }
}
