package com.health_insurance.Health_Insurance.Insurance.repository;

import com.health_insurance.Health_Insurance.Insurance.domain.InsuranceInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface InsuranceInfoRepository extends JpaRepository<InsuranceInfo, Long> {
    List<InsuranceInfo> findByMedMemberNb(Long medMemberNb);
    @Query("SELECT AVG(i.premium) FROM InsuranceInfo i " +
            "WHERE (FLOOR((YEAR(CURRENT_DATE) - (CASE " +
            "WHEN CAST(SUBSTRING(CAST(i.medMemberNb AS string), 1, 2) AS int) <= 20 THEN 2000 + CAST(SUBSTRING(CAST(i.medMemberNb AS string), 1, 2) AS int) " +
            "ELSE 1900 + CAST(SUBSTRING(CAST(i.medMemberNb AS string), 1, 2) AS int) END)) / 10) * 10) = :ageGroup")
    BigDecimal findAveragePremiumByAgeGroup(int ageGroup);


}