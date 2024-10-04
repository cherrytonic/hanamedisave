package com.medisave.backend.account.repository;

import com.medisave.backend.account.domain.AccountRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AccountRecordRepository extends JpaRepository<AccountRecord, Long> {
    List<AccountRecord> findByAccountId(Long accountId);

}