package com.medisave.backend.account.dto;

import com.medisave.backend.account.domain.MedAccount;

public class MedAccountRequest {
    private MedAccount medAccount;
    private String personName;
    private String residentRegistrationNumber;
    private String email;
    private String selectedItem;

    // Getters and Setters

    public MedAccount getMedAccount() {
        return medAccount;
    }

    public void setMedAccount(MedAccount medAccount) {
        this.medAccount = medAccount;
    }

    public String getPersonName() {
        return personName;
    }

    public void setPersonName(String personName) {
        this.personName = personName;
    }

    public String getResidentRegistrationNumber() {
        return residentRegistrationNumber;
    }

    public void setResidentRegistrationNumber(String residentRegistrationNumber) {
        this.residentRegistrationNumber = residentRegistrationNumber;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSelectedItem() {
        return selectedItem;
    }

    public void setSelectedItem(String selectedItem) {
        this.selectedItem = selectedItem;
    }
}
