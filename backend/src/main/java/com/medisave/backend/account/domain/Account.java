package com.medisave.backend.account.domain;

import com.medisave.backend.card.domain.ConsumeCategory;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Date;

@Entity
@Table(name = "account")
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ACCOUNT_ID")
    private Long accountId;

    @Column(name = "ACCOUNT_DT", nullable = false)
    private LocalDate accountDt;

    @Column(name = "ACCOUNT_PW", nullable = false)
    private String accountPw;

    @Column(name = "ACCOUNT_BALANCE", nullable = false)
    private BigDecimal accountBalance;

    @Column(name = "MEMBER_ID", nullable = false, length = 15)
    private String memberId;

    // Getters and Setters
    public Long getAccountId() {
        return accountId;
    }

    public void setAccountId(Long accountId) {
        this.accountId = accountId;
    }

    public LocalDate getAccountDt() {
        return accountDt;
    }

    public void setAccountDt(LocalDate accountDt) {
        this.accountDt = accountDt;
    }

    public String getAccountPw() {
        return accountPw;
    }

    public void setAccountPw(String accountPw) {
        this.accountPw = accountPw;
    }

    public BigDecimal getAccountBalance() {
        return accountBalance;
    }

    public void setAccountBalance(BigDecimal accountBalance) {
        this.accountBalance = accountBalance;
    }

    public String getMemberId() {
        return memberId;
    }

    public void setMemberId(String memberId) {
        this.memberId = memberId;
    }
}
