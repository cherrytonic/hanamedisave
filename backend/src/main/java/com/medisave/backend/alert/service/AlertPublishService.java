package com.medisave.backend.alert.service;

import com.medisave.backend.alert.model.dto.response.AlertResponseDto;
import com.medisave.backend.chat.repository.ChatRepository;
import com.medisave.backend.member.domain.Member;
import com.medisave.backend.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.NoSuchElementException;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AlertPublishService {
    private final SimpMessagingTemplate messagingTemplate;
    private final ChatRepository chatRepository;
    private final RedisTemplate<String, Object> redisTemplate;
    private final MemberRepository memberRepository;
    public void publishChatAlert(Member member) {
        AlertResponseDto alertResponseDto = new AlertResponseDto(isChatAlertExist(member));
        messagingTemplate.convertAndSend("/sub/matching/chatalert/" + alertResponseDto);
        messagingTemplate.convertAndSend("/sub/chat/chatalert/" + alertResponseDto);
    }

    public void publishNotiAlert(Member member) {
        AlertResponseDto alertResponseDto = new AlertResponseDto(isNotiAlertExist(member));
        messagingTemplate.convertAndSend("/sub/matching/notialert/" + alertResponseDto);
        messagingTemplate.convertAndSend("/sub/chat/notialert/" + alertResponseDto);
    }

    // Redis에 알림 저장
    public void saveAlertToRedis(Long memberId, String alertType) {
        String key = "alert:" + memberId + ":" + alertType;
        redisTemplate.opsForValue().set(key, true);  // 알림 존재 여부를 true로 설정
    }

    // Redis에서 알림 존재 여부 확인
    public boolean isAlertExistInRedis(Long memberId, String alertType) {
        String key = "alert:" + memberId + ":" + alertType;
        return redisTemplate.hasKey(key);  // 해당 키가 존재하는지 확인
    }
    public boolean isChatAlertExist(Member member) {
        // 기존 로직 유지 또는 Redis로 대체
        return chatRepository.findAllAlert(member.getId());
    }

    public boolean isNotiAlertExist(Member member) {
        // matchingRepository 대신 Redis로 대체
        return isAlertExistInRedis(member.getId(), "notification");
    }
    public Member getMember(Long id) {
        return memberRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("No member found with id: " + id));
    }

}
