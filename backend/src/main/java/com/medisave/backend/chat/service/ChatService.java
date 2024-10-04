package com.medisave.backend.chat.service;

import com.fasterxml.jackson.databind.ObjectMapper;

import com.medisave.backend.chat.model.dto.ChattingMessage;
import com.medisave.backend.chat.model.dto.response.GetRoomResponseDto;
import com.medisave.backend.chat.repository.ChatRepository;
import com.medisave.backend.member.domain.Member;
import com.medisave.backend.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import com.medisave.backend.alert.service.AlertPublishService;
import com.medisave.backend.chat.model.dto.ChatRoomDto;
import com.medisave.backend.chat.model.dto.request.CreateRoomRequestDto;
import com.medisave.backend.chat.model.dto.request.CreateMessageRequestDto;
import com.medisave.backend.chat.model.dto.response.GetRoomsResponseDto;
import com.medisave.backend.chat.model.entity.ChatMessage;
import com.medisave.backend.chat.model.entity.ChatRoom;
import com.medisave.backend.chat.service.ChatService;
import com.medisave.backend.chat.service.ChatPublisherService;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class ChatService {
//    @Autowired
//    private RedisTemplate<String, ChattingMessage> redisTemplate;
//    private final Logger log = LoggerFactory.getLogger(getClass());
//
//    // Redis에 저장할 메시지의 키
//    private static final String MESSAGE_KEY = "messages";
//
//    // 메시지 저장 메서드
//    public void saveMessage(ChattingMessage message){
//        log.info("ChatService_saveMessage : " + message);
//
//        // 각 채팅방에 대한 별도의 키 생성
//        String roomKey = MESSAGE_KEY + ":" + message.getRoomNo();
//
//        // 해당 채팅방의 메시지 목록에 새로운 메시지 추가
//        redisTemplate.opsForList().rightPush(roomKey, message);
//    }
//
//    // 전체 채팅방의 메시지 목록 조회 메서드
//    public List<ChattingMessage> getMessages() {
//        log.info("ChatService_getMessages");
//
//        Long size = redisTemplate.opsForList().size(MESSAGE_KEY);
//        if (size != null) {
//            return redisTemplate.opsForList().range(MESSAGE_KEY, 0, size - 1);
//        }
//        return Collections.emptyList();
//    }
//
//    // 특정 채팅방의 메시지 목록 조회 메서드
//    public List<ChattingMessage> getMessagesByRoom(String roomNo) {
//        log.info("ChatService_getMessagesByRoom : "+ roomNo);
//        String roomKey = MESSAGE_KEY + ":" + roomNo;
//
//        Long size = redisTemplate.opsForList().size(roomKey);
//        log.info("Room key: {}, Message count: {}", roomKey, size);
//
//        if (size != null) {
//            List<ChattingMessage> messages = redisTemplate.opsForList().range(roomKey, 0, size - 1);
//            log.info("Messages retrieved: {}", messages);
//            return messages;
//        }
//        log.info("No messages found.");
//        return Collections.emptyList();
//    }
//    private final ChatRepository chatRepository;
//    private final MemberRepository memberRepository;
//    private final ObjectMapper objectMapper;
//    private HashMap<String, Long> sessionidWithUserId = new HashMap<>();
//    private HashMap<Long, String> userIdWithSessionId = new HashMap<>();
//    private HashMap<String, String> sessionidWithChatroomId = new HashMap<>();
//
//    /**
//     * 채팅방 생성
//     * @param createRoomRequestDto
//     * @return
//     */
//    public ChatRoom createRoom(CreateRoomRequestDto createRoomRequestDto, String user) {
//        Long senderId = createRoomRequestDto.getSenderId();
//        Set<Long> userIds = new HashSet<>();
//        Member myInfo = getMember(user);
//        userIds.add(myInfo.getId());
//        userIds.add(senderId);
//        ChatRoom chatRoom = new ChatRoom(userIds);
//        chatRepository.createRoom(chatRoom);
//        return chatRoom;
//    }
//
//    public List<ChatRoomDto> getRooms(Long id) {
//        Member myInfo = getMember(id);
//        Map<String, ChatRoom> rooms = chatRepository.getRooms();
//        List<ChatRoomDto> myRooms = new ArrayList<>();
//        for(Map.Entry<String, ChatRoom> entrySet : rooms.entrySet()) {
//            ChatRoom room = entrySet.getValue();
//            if(room.isMyRoom(myInfo.getId())) {
//                ChatRoomDto chatRoomDto = getRoomDto(room, myInfo);
//                myRooms.add(chatRoomDto);
//            }
//        }
//        return myRooms;
//    }
//
//    public GetRoomResponseDto getRoom(String roomId, Long id) {
//        Member myInfo = getMember(id);
//        ChatRoom chatRoom = chatRepository.getRoom(roomId);
//        List<ChatMessage> messages = chatRepository.getMessages(roomId);
//        List<ChatMessage> chatMessages = new ArrayList<>();
//        for(Object messageObject : messages) {
//            ChatMessage message = objectMapper.convertValue(messageObject, ChatMessage.class);
//            chatMessages.add(message);
//        }
//        return new GetRoomResponseDto(getRoomDto(chatRoom, myInfo), chatMessages);
//    }
//
//    public ChatRoomDto getRoomDto(ChatRoom room, Member myInfo) {
//        ChatRoomDto chatRoomDto = new ChatRoomDto();
//        chatRoomDto.setId(room.getId());
//        chatRoomDto.setContent(room.getContent());
//        chatRoomDto.setMsgs(room.getMsgs());
//        chatRoomDto.setMyNotReadIndex(room.getLastReadIndex().get(myInfo.getId()));
//        chatRoomDto.setLastMsgTime(room.getLastMsgTime());
//        chatRoomDto.setOther(getOtherInfo(room.getUserIds(), myInfo, room));
//        chatRoomDto.setMyLastSendIndex(room.getLastSendIndex().get(myInfo.getId()));
//        return chatRoomDto;
//    }
//
//    public Member getMember(Long id) {
//        return memberRepository.findById(id)
//                .orElseThrow(() -> new NoSuchElementException("No member found with id: " + id));
//    }
//    public Member getMember(String memberId) {
//        return memberRepository.findByMemberId(memberId)
//                .orElseThrow(() -> new NoSuchElementException("No member found with memberId: " + memberId));
//    }
//    public Map<String, Object> getOtherInfo(Set<Long> userIds, Member myInfo, ChatRoom chatRoom) {
//        Long[] ids = userIds.toArray(new Long[2]);
//        Long otherId = myInfo.getId().longValue() == ids[0] ? ids[1] : ids[0];
//        Member otherInfo = getMember(otherId);
//        Map<String, Object> other = new HashMap<>();
//
//        other.put("otherId", otherInfo.getId());
//        other.put("name", otherInfo.getMemberNm());
//        other.put("notReadIndex", chatRoom.getLastReadIndex().get(otherInfo.getId()));
//
//        return other;
//    }
//
//    public ChatMessage createMessage(CreateMessageRequestDto messageDto) {
//        Member myInfo = getMember(messageDto.getSenderId());
//        ChatMessage message = new ChatMessage();
//        Long id = chatRepository.getMessageSize(messageDto.getRoomId()) + 1;
//
//        ChatRoom chatRoom = chatRepository.getRoom(messageDto.getRoomId());
//        chatRoom.setMsgs(id);
//        chatRoom.setContent(messageDto.getContent());
//
//        Map<Long, Long> lastReadIndex = chatRoom.getLastReadIndex();
//        lastReadIndex.put(myInfo.getId(), id);
//
//        Map<Long, Long> lastSendIndex = chatRoom.getLastSendIndex();
//        lastSendIndex.put(myInfo.getId(), id);
//
//        LocalDateTime nowTime = LocalDateTime.now();
//        chatRoom.setLastMsgTime(nowTime);
//
//        message.setId(id);
//        message.setRoomId(messageDto.getRoomId());
//        message.setContent(messageDto.getContent());
//        message.setCreatedTime(nowTime);
//        message.setSenderId(myInfo.getId());
//        message.setReceiverId(messageDto.getReceiverId());
//        message.setRead(false);
//
//        Map<String, Object> otherInfo = getOtherInfo(chatRoom.getUserIds(), myInfo, chatRoom);
//        Long otherId = (Long) otherInfo.get("otherId");
//        String sessionId = userIdWithSessionId.get(otherId);
//        if(sessionId != null && sessionidWithChatroomId.get(sessionId) != null) {
//            if(sessionidWithChatroomId.get(sessionId).equals(messageDto.getRoomId())) {
//                message.setRead(true);
//                lastReadIndex.put(otherId, id);
//            }
//        }
//
//        chatRoom.setLastReadIndex(lastReadIndex);
//        chatRoom.setLastSendIndex(lastSendIndex);
//        chatRepository.setRoom(chatRoom);
//        chatRepository.saveMessage(message);
//        return message;
//    }
//
//    public void connectUser(String roomId, String websocketSessionId, Long myId) {
//        sessionidWithChatroomId.put(websocketSessionId, roomId);
//        sessionidWithUserId.put(websocketSessionId, myId);
//        userIdWithSessionId.put(myId, websocketSessionId);
//    }
//
//    public void disconnectUser(String key) {
//        String chatroomId = sessionidWithChatroomId.get(key);
//        if (chatroomId == null) {
//            log.error(" have to exist but not sessionId=" + key + " userId=" + sessionidWithUserId.get(key));
//        } else {
//            Long userId = sessionidWithUserId.get(key);
//            if (userId == null) log.error("no user found");
//            else {
//                ChatRoom chatRoom = chatRepository.getRoom(chatroomId);
//                Map<Long, Long> lastReadIndex = chatRoom.getLastReadIndex();
//                lastReadIndex.put(userId, chatRoom.getMsgs());
//                chatRepository.setRoom(chatRoom);
//
//                log.debug("remove the user from Redis joining members because of disconnection");
//                userIdWithSessionId.remove(userId);
//            }
//        }
//        sessionidWithUserId.remove(key);
//        sessionidWithChatroomId.remove(key);
//    }
//
//    public ChatRoom enterRoom(String roomId, Long myId) {
//        ChatRoom chatRoom = chatRepository.getRoom(roomId);
//        Map<Long, Long> lastReadIndex = chatRoom.getLastReadIndex();
//        Long msgSize = chatRepository.getMessageSize(roomId);
//        lastReadIndex.put(myId, msgSize);
//        chatRoom.setLastReadIndex(lastReadIndex);
//        chatRepository.setRoom(chatRoom);
//        return chatRoom;
//    }
//
//    public void exitChatRoom(String roomId) {
//        chatRepository.deleteRoom(roomId);
//    }
}
