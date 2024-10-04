package com.medisave.backend.card.domain;

import jakarta.persistence.*;

import java.util.Date;

@Entity
@Table(name = "CONSUME")
public class Consume {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CONSUME_ID")
    private Long consumeId;

    @Column(name = "ACCOUNT_ID", nullable = false)
    private Long accountId;

    @Column(name = "CONSUME_DT", nullable = false)
    @Temporal(TemporalType.DATE)
    private Date consumeDate;

    @Column(name = "CONSUME_AMOUNT", nullable = false)
    private Long consumeAmount;

    @Column(name = "CARD_NB", nullable = false, length = 16)
    private Long cardNb;

    @Column(name = "STORE_NM", nullable = false, length = 15)
    private String storeName;

    @Column(name = "CATEGORY_CODE", nullable = false, length = 6)
    private String categoryCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CATEGORY_CODE", referencedColumnName = "CATEGORY_CODE", insertable = false, updatable = false)
    private ConsumeCategory consumeCategory;

    // Getters and Setters
    public Long getConsumeId() {
        return consumeId;
    }

    public void setConsumeId(Long consumeId) {
        this.consumeId = consumeId;
    }

    public Long getAccountId() {
        return accountId;
    }

    public void setAccountId(Long accountId) {
        this.accountId = accountId;
    }

    public Date getConsumeDate() {
        return consumeDate;
    }

    public void setConsumeDate(Date consumeDate) {
        this.consumeDate = consumeDate;
    }

    public Long getConsumeAmount() {
        return consumeAmount;
    }

    public void setConsumeAmount(Long consumeAmount) {
        this.consumeAmount = consumeAmount;
    }

    public Long getCardNb() {
        return cardNb;
    }

    public void setCardNumber(Long cardNumber) {
        this.cardNb = cardNumber;
    }

    public String getStoreName() {
        return storeName;
    }

    public void setStoreName(String storeName) {
        this.storeName = storeName;
    }

    public String getCategoryCode() {
        return categoryCode;
    }

    public void setCategoryCode(String categoryCode) {
        this.categoryCode = categoryCode;
    }
    public ConsumeCategory getConsumeCategory() {
        return consumeCategory;
    }

    public void setConsumeCategory(ConsumeCategory consumeCategory) {
        this.consumeCategory = consumeCategory;
    }
}
