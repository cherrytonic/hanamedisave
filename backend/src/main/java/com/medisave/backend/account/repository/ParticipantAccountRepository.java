package com.medisave.backend.account.repository;

import com.medisave.backend.account.domain.ParticipantAccount;
import com.medisave.backend.account.domain.MedAccount;
import com.medisave.backend.member.domain.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ParticipantAccountRepository extends JpaRepository<ParticipantAccount, Long> {
    List<ParticipantAccount> findByMedAccount(MedAccount medAccount);
    List<ParticipantAccount> findByMember(Member member);
    boolean existsByMedAccountAndMember(MedAccount medAccount, Member member);
}
