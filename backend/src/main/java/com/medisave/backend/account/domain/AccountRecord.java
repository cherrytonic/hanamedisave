package com.medisave.backend.account.domain;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "ACCOUNT_RECORDS")
public class AccountRecord extends TransactionRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "accountRecordSeqGen")
    @SequenceGenerator(name = "accountRecordSeqGen", sequenceName = "ACCOUNT_RECORD_SEQ", allocationSize = 1)
    private Long recordId;

    @Column(name = "ACCOUNT_ID", nullable = false)
    private Long accountId;

    @Column(name = "TRANSACTION_DT", nullable = false)
    private LocalDateTime transactionDate;

    @Column(name = "AMOUNT", nullable = false)
    private BigDecimal amount;

    @Column(name = "DESCRIPTION")
    private String description;

    // Getters and Setters
    public Long getRecordId() {
        return recordId;
    }

    public void setRecordId(Long recordId) {
        this.recordId = recordId;
    }

    public Long getAccountId() {
        return accountId;
    }

    public void setAccountId(Long accountId) {
        this.accountId = accountId;
    }

    public LocalDateTime getTransactionDate() {
        return transactionDate;
    }

    public void setTransactionDate(LocalDateTime transactionDate) {
        this.transactionDate = transactionDate;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }


}
