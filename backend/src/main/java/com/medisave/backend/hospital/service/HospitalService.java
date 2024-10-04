package com.medisave.backend.hospital.service;

import com.medisave.backend.hospital.dto.HospitalWithItems;
import com.medisave.backend.hospital.domain.NonPaymentItem;
import com.medisave.backend.hospital.repository.NonPaymentItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.medisave.backend.hospital.domain.Hospital;
import com.medisave.backend.hospital.repository.HospitalRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class HospitalService {

    @Autowired
    private HospitalRepository hospitalRepository;

    @Autowired
    private NonPaymentItemRepository nonPaymentItemRepository;

    // 병원 위치 기반 조회 서비스
    public List<Hospital> getHospitalsWithin5Km(double latitude, double longitude) {
        // Check if latitude or longitude is NaN
        if (Double.isNaN(latitude) || Double.isNaN(longitude)) {
            throw new IllegalArgumentException("Latitude or Longitude cannot be NaN");
        }

        // 확인용 로그 출력
        System.out.println("Latitude: " + latitude + ", Longitude: " + longitude);

        return hospitalRepository.findHospitalsWithinRadius(latitude, longitude);
    }
    // 특정 병원의 비급여 항목 조회 서비스
    public List<NonPaymentItem> getNonPaymentItemsByHospitalId(Long hospitalId) {
        return nonPaymentItemRepository.findByHospitalId(hospitalId);
    }
    public List<HospitalWithItems> getHospitalsWithItemsWithinRadius(double latitude, double longitude) {
        List<Hospital> hospitals = hospitalRepository.findHospitalsWithinRadius(latitude, longitude);

        return hospitals.stream().map(hospital -> {
            List<NonPaymentItem> items = nonPaymentItemRepository.findByHospitalId(hospital.getId());
            return new HospitalWithItems(hospital, items);
        }).collect(Collectors.toList());
    }
    // 지역과 선택된 항목을 기반으로 병원 검색
    public List<HospitalWithItems> getHospitalsByRegionAndItem(String region, String selectedItem) {
        List<Hospital> hospitals = hospitalRepository.findByRegion(region);

        // 검색된 병원이 선택된 항목을 제공하는지 필터링
        return hospitals.stream()
                .map(hospital -> {
                    List<NonPaymentItem> items = nonPaymentItemRepository.findByHospitalId(hospital.getId());
                    // 선택된 항목이 있는지 확인
                    List<NonPaymentItem> filteredItems = items.stream()
                            .filter(item -> item.getNpayKorNm().toLowerCase().contains(selectedItem.toLowerCase()))  // 부분 문자열 검색
                            .collect(Collectors.toList());

                    // 해당 항목을 제공하는 병원만 반환
                    if (!filteredItems.isEmpty()) {
                        return new HospitalWithItems(hospital, filteredItems);
                    } else {
                        return null;
                    }
                })
                .filter(hospitalWithItems -> hospitalWithItems != null) // 항목이 있는 병원만 필터링
                .collect(Collectors.toList());

    }
}
