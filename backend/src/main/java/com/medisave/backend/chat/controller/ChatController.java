package com.medisave.backend.chat.controller;

import com.medisave.backend.alert.service.AlertPublishService;
import com.medisave.backend.chat.model.dto.ChatMessageDto;
import com.medisave.backend.chat.model.dto.ChatRoomDto;
import com.medisave.backend.chat.model.dto.ChattingMessage;
import com.medisave.backend.chat.model.dto.request.CreateRoomRequestDto;
import com.medisave.backend.chat.model.dto.request.CreateMessageRequestDto;
import com.medisave.backend.chat.model.dto.response.GetRoomsResponseDto;
import com.medisave.backend.chat.model.entity.ChatMessage;
import com.medisave.backend.chat.model.entity.ChatRoom;
import com.medisave.backend.chat.service.ChatService;
import com.medisave.backend.chat.service.ChatPublisherService;
import com.medisave.backend.member.domain.Member;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class ChatController {
    @Autowired
    private final ChatService chatService;

    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    private final Logger log = LoggerFactory.getLogger(getClass());

    // 클라이언트에서 특정 채팅방의 메시지 조회
//    @GetMapping("/api/messages/{roomNo}")
//    public List<ChattingMessage> getMessagesByRoom(@PathVariable String roomNo) {
//        log.info("Received request to get messages for room: {}", roomNo);
//        return chatService.getMessagesByRoom(roomNo);
//    }
//
//
//    // WebSocket에서 사용하는 메시지 매핑 : 채팅방 입장 메시지 처리
//    @MessageMapping("/chat/join/{roomNo}")
//    public void join(@DestinationVariable String roomNo, @Payload ChattingMessage chatDto) {
//        log.info("User '{}' joined the room '{}'", chatDto.getUser(), roomNo);
//
//        // 채팅방 입장 메시지 저장
//        chatService.saveMessage(chatDto);
//
//        // 채팅방 입장 메시지를 해당 채팅방의 구독자에게 전송
//        chatDto.setMessage(chatDto.getUser() + "님이 입장하셨습니다.");
//        simpMessagingTemplate.convertAndSend("/sub/chat/join/" + roomNo, chatDto);
//    }
//
//    // WebSocket에서 사용하는 메시지 매핑 : 채팅방 메시지 전송 처리
//    @MessageMapping("/chat/message/{roomNo}")
//    public void sendMessage(@DestinationVariable String roomNo, @Payload ChattingMessage chatDto) {
//        log.info("User '{}' sent a message in the room '{}': '{}'", chatDto.getUser(), roomNo, chatDto.getMessage());
//
//        // 채팅방 메시지 저장
//        chatService.saveMessage(chatDto);
//
//        // 메시지가 ~로 시작한다면 해당 채팅방의 모든 구독자에게 전송
//        if (chatDto.getMessage().startsWith("님이 입장하셨습니다.")) {
//            simpMessagingTemplate.convertAndSend("/sub/chat/room/" + roomNo, chatDto);
//        }
//    }

//    private final ChatPublisherService publishService;
//    private final AlertPublishService alertPublishService;

//    /**
//     * 채팅방 생성 이벤트 수신
//     * @param createRoomRequestDto
//     */
//    @MessageMapping("/chat/room")
//    public void createRoom(StompHeaderAccessor accessor, CreateRoomRequestDto createRoomRequestDto) {
//        String user = accessor.getUser().getName();
//        ChatRoom chatRoom = chatService.createRoom(createRoomRequestDto, user);
//        publishService.publishRoom(chatRoom);
//    }
//
//    @GetMapping("/chat/room")
//    public ResponseEntity<?> getRooms(@PathVariable Long id) {
//        List<ChatRoomDto> rooms = chatService.getRooms(id);
//        return new ResponseEntity<>(new GetRoomsResponseDto(rooms), HttpStatus.OK);
//    }
//
//    @GetMapping("/chat/room/{room-id}")
//    public ResponseEntity<?> getRoom(@PathVariable String roomId, Long id) {
//        return new ResponseEntity<>(chatService.getRoom(roomId, id), HttpStatus.OK);
//    }
//
//    @MessageMapping("/chat/room/{room-id}")
//    public void createMessage(@DestinationVariable("room-id") String roomId, @Payload CreateMessageRequestDto messageDto) {
//
//        ChatMessage message = chatService.createMessage(messageDto);
//        publishService.publishMessage(message);
//
//        Member otherInfo = chatService.getMember(messageDto.getReceiverId());
//        alertPublishService.publishChatAlert(otherInfo);
//    }
//
//    @PutMapping("/chat/room/{room-id}")
//    public ResponseEntity<?> exitChatRoom(@PathVariable("room-id") String roomId) {
//        chatService.exitChatRoom(roomId);
//        return new ResponseEntity<>(HttpStatus.OK);
//    }
}
