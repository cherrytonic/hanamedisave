package com.medisave.backend.account.repository;

import com.medisave.backend.account.domain.Account;
import com.medisave.backend.account.domain.MedAccount;
import com.medisave.backend.account.domain.SavingRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MedAccountRepository extends JpaRepository<MedAccount, Long> {
    List<MedAccount> findByMemberId(String memberId);
    List<SavingRecord> findByMedAccountId(Long medAccountId);

    List<MedAccount> findByMemberIdAndClosed(String memberId, String closed);
}
