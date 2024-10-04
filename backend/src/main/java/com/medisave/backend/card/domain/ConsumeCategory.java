package com.medisave.backend.card.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "CONSUME_CATEGORY")
public class ConsumeCategory {

    @Id
    @Column(name = "CATEGORY_CODE", nullable = false)
    private String categoryCode;

    @Column(name = "LARGE", nullable = false)
    private String large;

    @Column(name = "MEDIUM", nullable = false)
    private String medium;

    @Column(name = "SMALL", nullable = false)
    private String small;

    // Getters and Setters
    public String getCategoryCode() {
        return categoryCode;
    }

    public void setCategoryCode(String categoryCode) {
        this.categoryCode = categoryCode;
    }

    public String getLarge() {
        return large;
    }

    public void setLarge(String large) {
        this.large = large;
    }

    public String getMedium() {
        return medium;
    }

    public void setMedium(String medium) {
        this.medium = medium;
    }

    public String getSmall() {
        return small;
    }

    public void setSmall(String small) {
        this.small = small;
    }
}