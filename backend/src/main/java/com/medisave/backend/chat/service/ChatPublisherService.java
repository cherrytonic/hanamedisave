package com.medisave.backend.chat.service;

import com.medisave.backend.chat.model.dto.response.GetRoomResponseDto;
import com.medisave.backend.member.domain.Member;
import com.medisave.backend.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import com.medisave.backend.chat.model.dto.ChatRoomDto;
import com.medisave.backend.chat.model.entity.ChatMessage;
import com.medisave.backend.chat.model.entity.ChatRoom;

import java.util.*;

@Service
@RequiredArgsConstructor
public class ChatPublisherService {
    private final SimpMessagingTemplate messagingTemplate;
    private final MemberRepository memberRepository;

    /**
     * 채팅방 생성 이벤트 발신
     * @param chatRoom
     */
    public void publishRoom(ChatRoom chatRoom) {
        Set<Long> userIds = chatRoom.getUserIds();
        Long[] ids = userIds.toArray(new Long[2]);
        Member[] members = new Member[2];
        members[0] = getMember(ids[0]);
        members[1] = getMember(ids[1]);

        ChatRoomDto chatRoomDto = new ChatRoomDto();
        chatRoomDto.setId(chatRoom.getId());
        chatRoomDto.setMsgs(chatRoom.getMsgs());
        chatRoomDto.setContent(chatRoom.getContent());
        chatRoomDto.setLastMsgTime(chatRoom.getLastMsgTime());

        for(int i = 0; i < 2; i++) {
            Map<String, Object> other = new HashMap<>();
            int otherIndex = getOtherIndex(i);
            Member otherInfo = members[otherIndex];
            Member myInfo = members[i];
            other.put("otherId", otherInfo.getId());
            other.put("name", otherInfo.getMemberNm());
            other.put("notReadIndex", chatRoom.getLastReadIndex().get(otherInfo.getId()));

            chatRoomDto.setOther(other);
            chatRoomDto.setMyNotReadIndex(chatRoom.getLastReadIndex().get(myInfo.getId()));

            messagingTemplate.convertAndSend("/sub/chat/room/" +  chatRoomDto);
        }
    }

    public Member getMember(Long id) {
        return memberRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("No member found with id: " + id));
    }
    public int getOtherIndex(int myIndex) {
        return myIndex == 0 ? 1 : 0;
    }


    public void publishMessage(ChatMessage message) {
        messagingTemplate.convertAndSend("/sub/chat/room/" + message.getRoomId(), message);
    }

    public void publishEnter(String roomId, GetRoomResponseDto message) {
        messagingTemplate.convertAndSend("/sub/chat/room/" + roomId + "/entrance", message);
    }
}
