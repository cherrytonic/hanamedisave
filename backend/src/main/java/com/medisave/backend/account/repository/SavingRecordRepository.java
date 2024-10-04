package com.medisave.backend.account.repository;

import com.medisave.backend.account.domain.SavingRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SavingRecordRepository extends JpaRepository<SavingRecord, Long> {
    List<SavingRecord> findByMedAccountId(Long medAccountId);

}