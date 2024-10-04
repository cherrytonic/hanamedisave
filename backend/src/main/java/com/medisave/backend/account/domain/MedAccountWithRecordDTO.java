package com.medisave.backend.account.domain;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class MedAccountWithRecordDTO {
    private Long medAccountId;
    private Long accountId;
    private LocalDate medAccountDt;
    private BigDecimal medAccountBalance;
    private BigDecimal targetSavingsAmount;
    private BigDecimal interestRate;
    private BigDecimal perDepositAmount;
    private BigDecimal preTaxInterest;
    private BigDecimal postTaxInterest;
    private Integer goalPeriodMonths;
    private String accountType;
    private String depositCycle;
    private String transferDay;
    private LocalDate expectedEndDate;
    private String memberId;
    private BigDecimal expectedMoney;
    private String medAccountNm;
    private String closed;
    private Integer withdraw;

    private List<SavingRecord> records;

    public Long getMedAccountId() {
        return medAccountId;
    }

    public void setMedAccountId(Long medAccountId) {
        this.medAccountId = medAccountId;
    }

    public Long getAccountId() {
        return accountId;
    }

    public void setAccountId(Long accountId) {
        this.accountId = accountId;
    }

    public LocalDate  getMedAccountDt() {
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

    public Integer getWithdraw() {
        return withdraw;
    }

    public void setWithdraw(Integer withdraw) {
        this.withdraw = withdraw;
    }

    public List<SavingRecord> getRecords() {
        return records;
    }

    public void setRecords(List<SavingRecord> records) {
        this.records = records;
    }
    // 기본 생성자 및 getter/setter
}
