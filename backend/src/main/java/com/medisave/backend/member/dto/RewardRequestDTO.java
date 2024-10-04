package com.medisave.backend.member.dto;

import java.math.BigDecimal;

public class RewardRequestDTO {
    private String memberId;
    private BigDecimal reward;

    public String getMemberId() {
        return memberId;
    }

    public void setMemberId(String memberId) {
        this.memberId = memberId;
    }

    public BigDecimal getReward() {
        return reward;
    }

    public void setReward(BigDecimal reward) {
        this.reward = reward;
    }
}
