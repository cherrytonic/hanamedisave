package com.medisave.backend.account.domain;

import com.medisave.backend.member.domain.Member;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "SAVING_RECORD")
public class SavingRecord extends TransactionRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "savingsSeqGen")
    @SequenceGenerator(name = "savingsSeqGen", sequenceName = "SAVING_RECORD_SEQ", allocationSize = 1)
    @Column(name = "SAVING_ID", nullable = false)
    private Long savingId;

    @Column(name = "SAVING_AMOUNT", nullable = false)
    private BigDecimal savingAmount;

    @Column(name = "SAVING_DT", nullable = false)
    private LocalDateTime savingDate;

    @Column(name = "MED_ACCOUNT_ID", nullable = false)
    private Long medAccountId;

    @Column(name = "member_id")
    private String memberId;


    // Getter, Setter 추가
    public String getSender() {
        return memberId;
    }

    public void setSender(String sender) {
        this.memberId = sender;
    }
    // Getters and Setters
    public Long getSavingId() {
        return savingId;
    }

    public void setSavingId(Long savingId) {
        this.savingId = savingId;
    }

    public BigDecimal getAmount() {
        return savingAmount;
    }

    public void setSavingAmount(BigDecimal savingAmount) {
        this.savingAmount = savingAmount;
    }

    public LocalDateTime getTransactionDate() {
        return savingDate;
    }

    public void setSavingDate(LocalDateTime savingDate) {
        this.savingDate = savingDate;
    }

    public Long getMedAccountId() {
        return medAccountId;
    }

    public void setMedAccountId(Long medAccountId) {
        this.medAccountId = medAccountId;
    }

}