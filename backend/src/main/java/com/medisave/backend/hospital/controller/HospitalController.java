package com.medisave.backend.hospital.controller;

import com.medisave.backend.hospital.domain.NonPaymentItem;
import com.medisave.backend.hospital.dto.HospitalWithItems;
import com.medisave.backend.hospital.service.HospitalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = {
        "http://211.188.50.141", // 포트 8080 허용
        "http://localhost:3000", // 포트 3000 허용
})
public class HospitalController {

    @Autowired
    private HospitalService hospitalService;

    @GetMapping("/api/hospInfo")
//    public List<Hospital> getNearbyHospitals(@RequestParam double latitude, @RequestParam double longitude) {
//        return hospitalService.getHospitalsWithin5Km(latitude, longitude);
//    }
    public List<HospitalWithItems> getHospitalsWithItems(@RequestParam double latitude, @RequestParam double longitude) {
        return hospitalService.getHospitalsWithItemsWithinRadius(latitude, longitude);
    }
    @GetMapping("/api/hospitals/{hospitalId}/non-payment-items")
    public List<NonPaymentItem> getNonPaymentItems(@PathVariable Long hospitalId) {
        return hospitalService.getNonPaymentItemsByHospitalId(hospitalId);
    }
    @GetMapping("/api/hospitals/search")
    public List<HospitalWithItems> searchHospitalsByRegionAndItem(@RequestParam String region, @RequestParam String selectedItem) {
        System.out.println(hospitalService.getHospitalsByRegionAndItem(region, selectedItem));
        return hospitalService.getHospitalsByRegionAndItem(region, selectedItem);
    }
}
