package com.medisave.backend.reward.domain;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "REWARD_HISTORY")  // 테이블명과 매핑
public class Reward {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "reward_seq_generator")
    @SequenceGenerator(name = "reward_seq_generator", sequenceName = "REWARD_SEQ", allocationSize = 1)
    @Column(name = "REWARD_ID", nullable = false)
    private Long rewardId;

    @Column(name = "MEMBER_ID", nullable = false)
    private String memberId;

    @Column(name = "MED_ACCOUNT_ID", nullable = false)
    private Long medAccountId;

    @Column(name = "REWARD_AMOUNT", nullable = false)
    private Double rewardAmount;

    @Column(name = "TREATMENT_NM", length = 50, nullable = false)
    private String treatmentNm;

    @Column(name = "ISSUE_DATE", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)  // 날짜와 시간 정보 매핑
    private Date issueDate;

    @Column(name = "STATUS", nullable = false)
    private String status;

    @Column(name = "CREATED_AT", nullable = false, updatable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = new Date();
    }

    @Lob  // BLOB 타입을 위한 어노테이션
    @Column(name = "DOCUMENT")
    private byte[] document;

    // Getters and Setters
    public Long getRewardId() { return rewardId; }
    public void setRewardId(Long rewardId) { this.rewardId = rewardId; }

    public String getMemberId() { return memberId; }
    public void setMemberId(String memberId) { this.memberId = memberId; }

    public Long getMedAccountId() { return medAccountId; }
    public void setMedAccountId(Long medAccountId) { this.medAccountId = medAccountId; }

    public Double getRewardAmount() { return rewardAmount; }
    public void setRewardAmount(Double rewardAmount) { this.rewardAmount = rewardAmount; }

    public String getTreatmentNm() { return treatmentNm; }
    public void setTreatmentNm(String treatmentNm) { this.treatmentNm = treatmentNm; }

    public Date getIssueDate() { return issueDate; }
    public void setIssueDate(Date issueDate) { this.issueDate = issueDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }

    public byte[] getDocument() { return document; }
    public void setDocument(byte[] document) { this.document = document; }
}

