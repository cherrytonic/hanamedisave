package com.health_insurance.Health_Insurance.Insurance.controller;

import com.health_insurance.Health_Insurance.Insurance.domain.InsuranceInfo;
import com.health_insurance.Health_Insurance.Insurance.service.InsuranceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/insurance")
public class InsuranceController {

    @Autowired
    private InsuranceService insuranceService;

    // medMemberNb로 보험 정보를 조회하는 API
    @GetMapping("/member/{medMemberNb}")
    public ResponseEntity<List<InsuranceInfo>> getInsuranceInfoByMedMemberNb(@PathVariable Long medMemberNb) {
        List<InsuranceInfo> insuranceInfoList = insuranceService.getInsuranceInfoByMedMemberNb(medMemberNb);
        return ResponseEntity.ok(insuranceInfoList);
    }
    @GetMapping("/average-premium/{birthYearDigits}")
    public ResponseEntity<BigDecimal> getAveragePremiumByAgeGroup(@PathVariable int birthYearDigits) {
        BigDecimal averagePremium = insuranceService.getAveragePremiumByAgeGroup(birthYearDigits);
        System.out.println(averagePremium);
        return ResponseEntity.ok(averagePremium);
    }
}