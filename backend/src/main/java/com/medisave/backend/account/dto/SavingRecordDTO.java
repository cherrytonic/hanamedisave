package com.medisave.backend.account.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class SavingRecordDTO {
    private BigDecimal savingAmount;
    private LocalDateTime savingDate;
    private String senderName; // 송금인 이름

    public BigDecimal getSavingAmount() {
        return savingAmount;
    }

    public void setSavingAmount(BigDecimal savingAmount) {
        this.savingAmount = savingAmount;
    }

    public LocalDateTime getSavingDate() {
        return savingDate;
    }

    public void setSavingDate(LocalDateTime savingDate) {
        this.savingDate = savingDate;
    }

    public String getSenderName() {
        return senderName;
    }

    public void setSenderName(String senderName) {
        this.senderName = senderName;
    }
}
