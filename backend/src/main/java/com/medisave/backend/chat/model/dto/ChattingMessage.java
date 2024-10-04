package com.medisave.backend.chat.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChattingMessage implements Serializable {
    private static final long serialVersionUID = 1L;

    private String roomNo;         // The room identifier where the chat is happening
    private String user;           // The user who sent the message
    private String message;        // The actual message content
    private LocalDateTime timestamp;  // The time the message was sent
    private MessageType type;      // Enum to represent the type of message (e.g., CHAT, JOIN, LEAVE)

    public enum MessageType {
        CHAT, JOIN, LEAVE
    }
}