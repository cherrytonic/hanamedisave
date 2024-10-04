package com.medisave.backend.chat.model.dto.response;

import com.medisave.backend.chat.model.dto.ChatRoomDto;
import com.medisave.backend.chat.model.entity.ChatMessage;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class GetRoomResponseDto {
    private ChatRoomDto roomInfo;
    private List<ChatMessage> payload;
}
