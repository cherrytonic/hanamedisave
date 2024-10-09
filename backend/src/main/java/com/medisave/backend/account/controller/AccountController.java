package com.medisave.backend.account.controller;

import com.medisave.backend.account.domain.*;
import com.medisave.backend.account.dto.AccountPasswordRequest;
import com.medisave.backend.account.dto.MedAccountRequest;
import com.medisave.backend.account.dto.SavingRecordDTO;
import com.medisave.backend.account.service.AccountService;
import com.medisave.backend.card.service.ConsumeService;
import com.medisave.backend.member.controller.MemberController;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/account")
@CrossOrigin(origins = {
        "http://211.188.50.141", // 포트 8080 허용
        "http://localhost:3000", // 포트 3000 허용
})
public class AccountController {
    @Autowired
    private AccountService accountService;
    @Autowired
    private static final Logger logger = LoggerFactory.getLogger(AccountController.class);
    // memberId로 계좌 목록 조회
    @GetMapping("/list/{memberId}")
    public ResponseEntity<List<Account>> getAccountsByMemberId(@PathVariable String memberId) {
        List<Account> accounts = accountService.getAccountsByMemberId(memberId);
        return ResponseEntity.ok(accounts);
    }
    @GetMapping("/medlist/{memberId}")
    public ResponseEntity<List<MedAccountWithRecordDTO>> getActiveMedAccountsByMemberId(@PathVariable String memberId) {
        List<MedAccountWithRecordDTO> accounts = accountService.getActiveMedAccountsByMemberId(memberId);
        return ResponseEntity.ok(accounts);
    }
    @GetMapping("/medlistClosed/{memberId}")
    public ResponseEntity<List<MedAccount>> getClosedMedAccountsByMemberId(@PathVariable String memberId) {
        List<MedAccount> accounts = accountService.getClosedMedAccountsByMemberId(memberId);
        return ResponseEntity.ok(accounts);
    }
    @PostMapping("/verify-password")
    public ResponseEntity<String> verifyAccountPassword(@RequestBody AccountPasswordRequest request) {
        boolean isPasswordValid = accountService.verifyAccountPassword(request.getAccountId(), request.getPassword());

        if (isPasswordValid) {
            return ResponseEntity.ok("비밀번호가 일치합니다.");
        } else {
            return ResponseEntity.status(400).body("비밀번호가 일치하지 않습니다.");
        }
    }
    @PostMapping("/create")
    public ResponseEntity<?> createAccount(@RequestBody MedAccountRequest request) {
        try {
            MedAccount medAccount = request.getMedAccount();
            String personName = request.getPersonName();
            String residentRegistrationNumber = request.getResidentRegistrationNumber();
            String email = request.getEmail();
            String selectedItem = request.getSelectedItem();

            System.out.println("컨트롤러 이름: " + personName);
            System.out.println("컨트롤러 이메일: " + email);
            System.out.println("컨트롤러 주민등록번호: " + residentRegistrationNumber);
            System.out.println("컨트롤러 계좌: " + medAccount);
            return ResponseEntity.ok(accountService.createMedAccount(medAccount, personName, residentRegistrationNumber, email, selectedItem));
        } catch (Exception e) {
            // 예외가 발생했을 경우 로그 출력 및 클라이언트에 응답 반환
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error creating MedAccount: " + e.getMessage());
        }
    }
    @GetMapping("/analyze/{memberId}")
    public ResponseEntity<Map<String, Object>> getCategorizedAccountsWithTrends(@PathVariable String memberId) {
        try {
            Map<String, Object> response = accountService.getCategorizedAccountsWithMonthlyTrends(memberId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", e.getMessage()));
        }
    }
    @GetMapping("/participant/{memberId}")
    public ResponseEntity<?> getParticipantMedAccountsAndRecords(@PathVariable String memberId) {
        try {
            Map<String, Object> participantMedAccounts = accountService.getParticipantMedAccountsAndRecords(memberId);
            return ResponseEntity.ok(participantMedAccounts);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error fetching participant med accounts: " + e.getMessage());
        }
    }
    @PostMapping("/join/{medAccountId}")
    public ResponseEntity<?> joinMedAccount(@PathVariable Long medAccountId, @RequestBody Map<String, String> requestBody) {
        String memberId = requestBody.get("memberId"); // 요청 바디에서 memberId 가져오기
        System.out.println("Received memberId: " + memberId); // 확인용 로그
        BigDecimal depositAmount = new BigDecimal(requestBody.get("depositAmount"));
        int point = Integer.parseInt(requestBody.get("point"));

        try {
            accountService.addParticipantToMedAccount(medAccountId, memberId);
            accountService.depositToMedAccountFromParticipant(medAccountId, memberId, depositAmount, point);
            return ResponseEntity.ok("Successfully joined the med account.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error joining MedAccount: " + e.getMessage());
        }
    }
    @PostMapping("/send/{medAccountId}")
    public ResponseEntity<?> sendMedAccount(@PathVariable Long medAccountId, @RequestBody Map<String, String> requestBody) {
        String memberId = requestBody.get("memberId"); // 요청 바디에서 memberId 가져오기
        System.out.println("Received memberId: " + memberId); // 확인용 로그
        BigDecimal depositAmount = new BigDecimal(requestBody.get("depositAmount"));
        int point = Integer.parseInt(requestBody.get("point"));
        try {
            // accountService에서 받은 response 객체를 그대로 반환
            Map<String, Object> response = accountService.depositToMedAccountFromParticipant(medAccountId, memberId, depositAmount, point);
            return ResponseEntity.ok(response);  // 성공 시 반환
        } catch (Exception e) {
            // 에러 발생 시 에러 메시지와 함께 상태 코드 반환
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Error joining MedAccount: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }


    // 특정 적금의 참여자 목록 조회
    @GetMapping("/participants/{medAccountId}")
    public ResponseEntity<List<ParticipantAccount>> getParticipants(@PathVariable Long medAccountId) {
        List<ParticipantAccount> participants = accountService.getParticipantsByMedAccountId(medAccountId);
        return ResponseEntity.ok(participants);
    }
    @PostMapping("/close/{medAccountId}")
    public ResponseEntity<String> closeAccount(@PathVariable Long medAccountId, @RequestBody Map<String, Object> requestData) {
        System.out.println("Received close account request for MedAccountId: " + medAccountId);
        System.out.println("Request Data: " + requestData);
        try {
            BigDecimal amount = new BigDecimal(requestData.get("amount").toString());
            Long accountId = Long.valueOf(requestData.get("accountId").toString());

            accountService.closeMedAccount(medAccountId, amount, accountId);
            return ResponseEntity.ok("Account closed and amount transferred successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to close account: " + e.getMessage());
        }
    }
    @PostMapping("/withdraw/{medAccountId}")
    public ResponseEntity<String> withdrawAccount(@PathVariable Long medAccountId, @RequestBody Map<String, Object> requestData) {
        System.out.println("Received withdraw account request for MedAccountId: " + medAccountId);
        System.out.println("Request Data: " + requestData);
        try {
            BigDecimal amount = new BigDecimal(requestData.get("amount").toString());
            Long accountId = Long.valueOf(requestData.get("accountId").toString());

            accountService.withdrawMedAccount(medAccountId, amount, accountId);
            return ResponseEntity.ok("Account withdrew and amount transferred successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to withdraw account: " + e.getMessage());
        }
    }
    @PostMapping("/update-rewardable")
    public ResponseEntity<String> updateRewardable(@RequestBody Map<String, Long> request) {
        Long medAccountId = request.get("medAccountId");
        try {
            // 서비스 메서드를 호출하여 rewardable 값을 N으로 업데이트
            MedAccount updatedAccount = accountService.updateRewardable(medAccountId);
            return ResponseEntity.ok("MedAccount updated successfully, rewardable set to N");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating MedAccount: " + e.getMessage());
        }
    }
}