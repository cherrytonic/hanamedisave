package com.medisave.backend.config;


import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config){
        // 클라이언트에게 topic으로 시작하는 것에 대한 구독 기능 제공
        config.enableSimpleBroker("/sub");
        // 클라이언트에서 서버로 메시지 보낼 때 app 경로 사용하도록 설정
        config.setApplicationDestinationPrefixes("/pub");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry){
        // ws 엔드포인트 등록하고 모든 도메인에서 접근 허용, SockJS 사용해서 브라우저가 웹소켓 지원하지 않을때 폴백 옵션 활성화(다른 수단으로 통신)
        registry.addEndpoint("/api/ws").setAllowedOriginPatterns("*").withSockJS();
    }
}
