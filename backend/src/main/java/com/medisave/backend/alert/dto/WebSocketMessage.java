package com.medisave.backend.alert.dto;

public class WebSocketMessage {
    private String text;

    public WebSocketMessage(String text) {
        this.text = text;
    }

    // Getter and Setter
    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }
}
