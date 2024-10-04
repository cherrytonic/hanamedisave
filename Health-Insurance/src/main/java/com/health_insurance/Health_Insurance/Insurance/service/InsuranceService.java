package com.health_insurance.Health_Insurance.Insurance.service;

import com.health_insurance.Health_Insurance.Insurance.domain.InsuranceInfo;
import com.health_insurance.Health_Insurance.Insurance.repository.InsuranceInfoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
public class InsuranceService {

    @Autowired
    private InsuranceInfoRepository insuranceInfoRepository;

    // medMemberNb로 InsuranceInfo 목록 조회
    public List<InsuranceInfo> getInsuranceInfoByMedMemberNb(Long medMemberNb) {
        return insuranceInfoRepository.findByMedMemberNb(medMemberNb);
    }
    // 연령대를 계산하는 메서드
    private int calculateAgeGroup(int birthYearDigits) {
        int currentYear = LocalDate.now().getYear();

        // 주민번호 앞 두 자리로 태어난 연도 계산
        int birthYear = birthYearDigits < 20 ? 2000 + birthYearDigits : 1900 + birthYearDigits;

        // 나이를 계산하고 연령대를 10년 단위로 반환
        int age = currentYear - birthYear;
        int ageGroup = (age / 10) * 10; // 10대, 20대, 30대 등 연령대

        System.out.println("Birth Year Digits: " + birthYearDigits);
        System.out.println("Birth Year: " + birthYear);
        System.out.println("Age: " + age);
        System.out.println("Age Group: " + ageGroup);

        return ageGroup;
    }

    // 해당 연령대의 평균 보험료 조회
    public BigDecimal getAveragePremiumByAgeGroup(int birthYearDigits) {
        int ageGroup = calculateAgeGroup(birthYearDigits);
        return insuranceInfoRepository.findAveragePremiumByAgeGroup(ageGroup);
    }
}