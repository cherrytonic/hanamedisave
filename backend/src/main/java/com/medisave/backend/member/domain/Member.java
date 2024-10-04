package com.medisave.backend.member.domain;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "MEMBER")
public class Member {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "member_seq")
    @SequenceGenerator(name = "member_seq", sequenceName = "member_seq", allocationSize = 1)
    @Column(name = "id", nullable = false, updatable = false)
    private Long id;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @Column(name = "member_id", nullable = false, length = 15)
    private String memberId;

    @Column(name = "resident_nb", nullable = false)
    private Long residentNb;

    @Column(name = "member_email", nullable = false, length = 30)
    private String memberEmail;

    @Column(name = "member_phone_nb", nullable = false, length = 12)
    private String memberPhoneNb;

    @Column(name = "enroll_dt", nullable = false)
    private LocalDate enrollDt;

    @Column(name = "member_pw", nullable = false, length = 20)
    private String memberPw;

    @Column(name = "member_nm", nullable = false, length = 10)
    private String memberNm;
    @Column(name = "reward")
    private BigDecimal reward;

    // Getters and Setters

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

    public String getMemberPw() {
        return memberPw;
    }

    public void setMemberPw(String memberPw) {
        this.memberPw = memberPw;
    }

    public String getMemberNm() {
        return memberNm;
    }

    public void setMemberNm(String memberNm) {
        this.memberNm = memberNm;
    }
    @Override
    public String toString() {
        return "Member{" +
                "id=" + id +
                ", memberId='" + memberId + '\'' +
                ", residentNb=" + residentNb +
                ", memberEmail='" + memberEmail + '\'' +
                ", memberPhoneNb='" + memberPhoneNb + '\'' +
                ", enrollDt=" + enrollDt +
                ", memberPw='" + memberPw + '\'' +
                ", memberNm='" + memberNm + '\'' +
                '}';
    }
    @PrePersist
    protected void onCreate() {
        this.enrollDt = LocalDate.now();
        System.out.println("Enroll date set to: " + this.enrollDt);  // 로그 추
    }

    public BigDecimal getReward() {
        return reward;
    }

    public void setReward(BigDecimal reward) {
        this.reward = reward;
    }
}
