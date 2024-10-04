package com.medisave.backend.account.domain;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Random;

@Entity
@Table(name = "MED_ACCOUNT")
public class MedAccount {
    @Id
    @Column(name = "MED_ACCOUNT_ID", nullable = false)
    private Long medAccountId;
    @Column(name = "ACCOUNT_ID", nullable = false)
    private Long accountId;

    @PrePersist
    public void generateMedAccountId() {
        if (this.medAccountId == null) {
            this.medAccountId = generateRandomId();
        }
    }
    private Long generateRandomId() {
        Random random = new Random();
        // 13자리 난수 생성
        long min = 1000000000000L;  // 13자리 최소값
        long max = 9999999999999L;  // 13자리 최대값
        return min + (long)(random.nextDouble() * (max - min));
    }
    @Column(name = "MED_ACCOUNT_DT", nullable = false)
    private LocalDate medAccountDt;

    @Column(name = "MED_ACCOUNT_BALANCE", nullable = false)
    private BigDecimal medAccountBalance;

    @Column(name = "TARGET_SAVINGS_AMOUNT", nullable = false)
    private BigDecimal targetSavingsAmount;

    @Column(name = "INTEREST_RATE", nullable = false, precision = 5, scale = 2)
    private BigDecimal interestRate;

    @Column(name = "PER_DEPOSIT_AMOUNT")
    private BigDecimal perDepositAmount;

    @Column(name = "PRE_TAX_INTEREST")
    private BigDecimal preTaxInterest;

    @Column(name = "POST_TAX_INTEREST")
    private BigDecimal postTaxInterest;

    @Column(name = "GOAL_PERIOD_MONTHS")
    private Integer goalPeriodMonths;

    @Column(name = "ACCOUNT_TYPE", nullable = false)
    private String accountType;

    @Column(name = "DEPOSIT_CYCLE")
    private String depositCycle;

    @Column(name = "TRANSFER_DAY")
    private String transferDay;

    @Column(name = "EXPECTED_END_DATE")
    private LocalDate expectedEndDate;

    @Column(name = "MEMBER_ID", nullable = false)
    private String memberId;

    @Column(name = "EXPECTED_MONEY")
    private BigDecimal expectedMoney;
    @Column(name = "MED_ACCOUNT_NM")
    private String medAccountNm;
    @Column(name = "CLOSED")
    private String closed;
    @Column(name = "WITHDRAW")
    private int withdraw;
    @Column(name = "REWARDABLE")
    private String rewardable;

    public Long getAccountId() {
        return accountId;
    }

    public void setAccountId(Long accountId) {
        this.accountId = accountId;
    }

    public LocalDate getMedAccountDt() {
        return medAccountDt;
    }

    public void setMedAccountDt(LocalDate medAccountDt) {
        this.medAccountDt = medAccountDt;
    }

    public BigDecimal getMedAccountBalance() {
        return medAccountBalance;
    }

    public void setMedAccountBalance(BigDecimal medAccountBalance) {
        this.medAccountBalance = medAccountBalance;
    }

    public Long getMedAccountId() {
        return medAccountId;
    }

    public void setMedAccountId(Long medAccountId) {
        this.medAccountId = medAccountId;
    }

    public BigDecimal getTargetSavingsAmount() {
        return targetSavingsAmount;
    }

    public void setTargetSavingsAmount(BigDecimal targetSavingsAmount) {
        this.targetSavingsAmount = targetSavingsAmount;
    }

    public BigDecimal getInterestRate() {
        return interestRate;
    }

    public void setInterestRate(BigDecimal interestRate) {
        this.interestRate = interestRate;
    }

    public BigDecimal getPerDepositAmount() {
        return perDepositAmount;
    }

    public void setPerDepositAmount(BigDecimal perDepositAmount) {
        this.perDepositAmount = perDepositAmount;
    }

    public BigDecimal getPreTaxInterest() {
        return preTaxInterest;
    }

    public void setPreTaxInterest(BigDecimal preTaxInterest) {
        this.preTaxInterest = preTaxInterest;
    }

    public BigDecimal getPostTaxInterest() {
        return postTaxInterest;
    }

    public void setPostTaxInterest(BigDecimal postTaxInterest) {
        this.postTaxInterest = postTaxInterest;
    }

    public Integer getGoalPeriodMonths() {
        return goalPeriodMonths;
    }

    public void setGoalPeriodMonths(Integer goalPeriodMonths) {
        this.goalPeriodMonths = goalPeriodMonths;
    }

    public String getAccountType() {
        return accountType;
    }

    public void setAccountType(String accountType) {
        this.accountType = accountType;
    }

    public String getDepositCycle() {
        return depositCycle;
    }

    public void setDepositCycle(String depositCycle) {
        this.depositCycle = depositCycle;
    }

    public String getTransferDay() {
        return transferDay;
    }

    public void setTransferDay(String transferDay) {
        this.transferDay = transferDay;
    }

    public LocalDate getExpectedEndDate() {
        return expectedEndDate;
    }

    public void setExpectedEndDate(LocalDate expectedEndDate) {
        this.expectedEndDate = expectedEndDate;
    }

    public String getMemberId() {
        return memberId;
    }

    public void setMemberId(String memberId) {
        this.memberId = memberId;
    }

    public BigDecimal getExpectedMoney() {
        return expectedMoney;
    }

    public void setExpectedMoney(BigDecimal expectedMoney) {
        this.expectedMoney = expectedMoney;
    }

    public String getMedAccountNm() {
        return medAccountNm;
    }

    public void setMedAccountNm(String medAccountNm) {
        this.medAccountNm = medAccountNm;
    }

    public String getClosed() {
        return closed;
    }

    public void setClosed(String closed) {
        this.closed = closed;
    }

    public int getWithdraw() {
        return withdraw;
    }

    public void setWithdraw(int withdraw) {
        this.withdraw = withdraw;
    }

    public String getRewardable() {
        return rewardable;
    }

    public void setRewardable(String rewardable) {
        this.rewardable = rewardable;
    }
}

