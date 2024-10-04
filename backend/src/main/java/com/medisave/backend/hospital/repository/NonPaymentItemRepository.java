package com.medisave.backend.hospital.repository;
import com.medisave.backend.hospital.domain.NonPaymentItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NonPaymentItemRepository extends JpaRepository<NonPaymentItem, Long> {

    // 특정 병원의 비급여 항목 조회
    List<NonPaymentItem> findByHospitalId(Long hospitalId);
}