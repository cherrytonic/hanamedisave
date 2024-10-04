package com.medisave.backend.account.domain;

import com.medisave.backend.member.domain.Member;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "PARTICIPANT_ACCOUNT")
public class ParticipantAccount {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "participant_seq")
    @SequenceGenerator(name = "participant_seq", sequenceName = "PARTICIPANT_ACCOUNT_SEQ", allocationSize = 1)
    @Column(name = "PARTICIPANT_ID")
    private Long participantId;


    @ManyToOne
    @JoinColumn(name = "MED_ACCOUNT_ID", nullable = false)
    private MedAccount medAccount;

    @ManyToOne
    @JoinColumn(name = "MEMBER_ID", nullable = false)
    private Member member;

    @Column(name = "PARTICIPATION_DT")
    private LocalDate participationDate = LocalDate.now();

    @Column(name = "CAN_WITHDRAW")
    private String canWithdraw;

    // 기본 생성자
    public ParticipantAccount() {}

    // Getters and Setters
    public Long getParticipantId() {
        return participantId;
    }

    public void setParticipantId(Long participantId) {
        this.participantId = participantId;
    }

    public MedAccount getMedAccount() {
        return medAccount;
    }

    public void setMedAccount(MedAccount medAccount) {
        this.medAccount = medAccount;
    }

    public Member getMember() {
        return member;
    }

    public void setMember(Member member) {
        this.member = member;
    }

    public LocalDate getParticipationDate() {
        return participationDate;
    }

    public void setParticipationDate(LocalDate participationDate) {
        this.participationDate = participationDate;
    }

    public String getCanWithdraw() {
        return canWithdraw;
    }

    public void setCanWithdraw(String canWithdraw) {
        this.canWithdraw = canWithdraw;
    }
}
