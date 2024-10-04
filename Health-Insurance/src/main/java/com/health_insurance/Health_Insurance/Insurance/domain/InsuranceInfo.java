package com.health_insurance.Health_Insurance.Insurance.domain;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.Date;

@Entity
@Table(name = "insurance_info")
public class InsuranceInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "INSURANCE_ID")
    private Long insuranceId;

    @Column(name = "MED_MEMBER_NB", nullable = false)
    private Long medMemberNb;

    @Column(name = "INSURANCE_NM", length = 100, nullable = false)
    private String insuranceNm;

    @Column(name = "COMPANY_NM", length = 20, nullable = false)
    private String companyNm;

    @Column(name = "CONTRACT_DT", nullable = false)
    private Date contractDt;

    @Column(name = "CONTRACT_STATUS", length = 2, nullable = false)
    private String contractStatus;

    @Column(name = "INSURANCE_TERM", length = 10, nullable = false)
    private String insuranceTerm;

    @Column(name = "SUM_INSURED", nullable = false)
    private BigDecimal sumInsured;

    @Column(name = "PREMIUM", nullable = false)
    private BigDecimal premium;
    @Column(name = "SILSON", nullable = false)
    private String silson;
    public Long getInsuranceId() {
        return insuranceId;
    }

    public void setInsuranceId(Long insuranceId) {
        this.insuranceId = insuranceId;
    }

    public Long getMedMemberNb() {
        return medMemberNb;
    }

    public void setMedMemberNb(Long medMemberNb) {
        this.medMemberNb = medMemberNb;
    }

    public String getInsuranceNm() {
        return insuranceNm;
    }

    public void setInsuranceNm(String insuranceNm) {
        this.insuranceNm = insuranceNm;
    }

    public String getCompanyNm() {
        return companyNm;
    }

    public void setCompanyNm(String companyNm) {
        this.companyNm = companyNm;
    }

    public Date getContractDt() {
        return contractDt;
    }

    public void setContractDt(Date contractDt) {
        this.contractDt = contractDt;
    }

    public String getContractStatus() {
        return contractStatus;
    }

    public void setContractStatus(String contractStatus) {
        this.contractStatus = contractStatus;
    }

    public BigDecimal getSumInsured() {
        return sumInsured;
    }

    public void setSumInsured(BigDecimal sumInsured) {
        this.sumInsured = sumInsured;
    }

    public BigDecimal getPremium() {
        return premium;
    }

    public void setPremium(BigDecimal premium) {
        this.premium = premium;
    }

    public String getInsuranceTerm() {
        return insuranceTerm;
    }

    public void setInsuranceTerm(String insuranceTerm) {
        this.insuranceTerm = insuranceTerm;
    }

    public String getSilson() {
        return silson;
    }

    public void setSilson(String silson) {
        this.silson = silson;
    }
}