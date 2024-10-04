package com.medisave.backend.member.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class MemberDTO {
    private Long id;
    private String memberId;
    private Long residentNb;
    private String memberEmail;
    private String memberPhoneNb;
    private LocalDate enrollDt;
    private String memberNm;
    private BigDecimal reward;
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMemberId() {
        return memberId;
    }

    public void setMemberId(String memberId) {
        this.memberId = memberId;
    }

    public Long getResidentNb() {
        return residentNb;
    }

    public void setResidentNb(Long residentNb) {
        this.residentNb = residentNb;
    }

    public String getMemberEmail() {
        return memberEmail;
    }

    public void setMemberEmail(String memberEmail) {
        this.memberEmail = memberEmail;
    }

    public String getMemberPhoneNb() {
        return memberPhoneNb;
    }

    public void setMemberPhoneNb(String memberPhoneNb) {
        this.memberPhoneNb = memberPhoneNb;
    }

    public LocalDate getEnrollDt() {
        return enrollDt;
    }

    public void setEnrollDt(LocalDate enrollDt) {
        this.enrollDt = enrollDt;
    }

    public String getMemberNm() {
        return memberNm;
    }

    public void setMemberNm(String memberNm) {
        this.memberNm = memberNm;
    }



    public BigDecimal getReward() {
        return reward;
    }

    public void setReward(BigDecimal reward) {
        this.reward = reward;
    }
}