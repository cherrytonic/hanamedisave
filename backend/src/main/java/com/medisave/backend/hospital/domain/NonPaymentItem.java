package com.medisave.backend.hospital.domain;

import jakarta.persistence.*;
@Entity
@Table(name = "non_payment_items")
public class NonPaymentItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")  // 변경된 컬럼 이름
    private Long id;

    @Column(name = "HOSPITAL_ID")  // 변경된 컬럼 이름
    private Long hospitalId;

    @Column(name = "NPAY_CD")  // 변경된 컬럼 이름
    private String npayCd;

    @Column(name = "NPAY_KOR_NM")  // 변경된 컬럼 이름
    private String npayKorNm;

    @Column(name = "CUR_AMT")  // 변경된 컬럼 이름
    private Integer curAmt;

    @Column(name = "YADM_NPAY_CD_NM")  // 변경된 컬럼 이름
    private String yadmNpayCdNm;

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getHospitalId() {
        return hospitalId;
    }

    public void setHospitalId(Long hospitalId) {
        this.hospitalId = hospitalId;
    }

    public String getNpayCd() {
        return npayCd;
    }

    public void setNpayCd(String npayCd) {
        this.npayCd = npayCd;
    }

    public String getNpayKorNm() {
        return npayKorNm;
    }

    public void setNpayKorNm(String npayKorNm) {
        this.npayKorNm = npayKorNm;
    }

    public Integer getCurAmt() {
        return curAmt;
    }

    public void setCurAmt(Integer curAmt) {
        this.curAmt = curAmt;
    }

    public String getYadmNpayCdNm() {
        return yadmNpayCdNm;
    }

    public void setYadmNpayCdNm(String yadmNpayCdNm) {
        this.yadmNpayCdNm = yadmNpayCdNm;
    }
}