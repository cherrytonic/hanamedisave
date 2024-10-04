package com.medisave.backend.hospital.dto;

import com.medisave.backend.hospital.domain.Hospital;
import com.medisave.backend.hospital.domain.NonPaymentItem;

import java.util.List;

public class HospitalWithItems {

    private Hospital hospital;
    private List<NonPaymentItem> items;

    public HospitalWithItems(Hospital hospital, List<NonPaymentItem> items) {
        this.hospital = hospital;
        this.items = items;
    }

    public Hospital getHospital() {
        return hospital;
    }

    public void setHospital(Hospital hospital) {
        this.hospital = hospital;
    }

    public List<NonPaymentItem> getItems() {
        return items;
    }

    public void setItems(List<NonPaymentItem> items) {
        this.items = items;
    }
}
