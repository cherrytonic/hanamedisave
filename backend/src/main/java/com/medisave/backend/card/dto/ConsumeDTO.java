package com.medisave.backend.card.dto;
import java.util.Date;
public class ConsumeDTO {
    private Long consumeId;
    private Long accountId;
    private Long cardNb;
    private Long consumeAmount;
    private Date consumeDate;
    private String storeName;
    private String largeCategory;
    private String mediumCategory;
    private String smallCategory;
    // Getters and Setters
    public Date getConsumeDate() {
        return consumeDate;
    }
    public void setConsumeDate(Date consumeDate) {
        this.consumeDate = consumeDate;
    }
    public Long getConsumeAmount() {
        return consumeAmount;
    }
    public void setConsumeAmount(long consumeAmount) {
        this.consumeAmount = consumeAmount;
    }
    public String getStoreName() {
        return storeName;
    }
    public void setStoreName(String storeName) {
        this.storeName = storeName;
    }
    public String getLargeCategory() {
        return largeCategory;
    }
    public void setLargeCategory(String largeCategory) {
        this.largeCategory = largeCategory;
    }
    public String getMediumCategory() {
        return mediumCategory;
    }
    public void setMediumCategory(String mediumCategory) {
        this.mediumCategory = mediumCategory;
    }
    public String getSmallCategory() {
        return smallCategory;
    }
    public void setSmallCategory(String smallCategory) {
        this.smallCategory = smallCategory;
    }
    public Long getConsumeId() {
        return consumeId;
    }
    public void setConsumeId(long consumeId) {
        this.consumeId = consumeId;
    }
    public Long getAccountId() {
        return accountId;
    }
    public void setAccountId(long accountId) {
        this.accountId = accountId;
    }
    public Long getCardNb() {
        return cardNb;
    }
    public void setCardNb(long cardNb) {
        this.cardNb = cardNb;
    }
}