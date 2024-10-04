package com.medisave.backend.hospital.domain;

import jakarta.persistence.*;

@Entity
@Table(name = "hospitals") // hospitals 테이블과 매핑
public class Hospital {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // 기본 키 자동 생성
    private Long id;

    @Column(name = "yadm_nm")
    private String name;

    @Column(name = "addr")
    private String address;

    @Column(name = "telno")
    private String phoneNumber;

    @Column(name = "YPos")
    private double latitude;

    @Column(name = "XPos")
    private double longitude;

    // 기타 병원 관련 필드 추가

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public double getLatitude() {
        return latitude;
    }

    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    public double getLongitude() {
        return longitude;
    }

    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }

}
