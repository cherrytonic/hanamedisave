package com.medisave.backend.reward.controller;

import com.medisave.backend.reward.domain.Reward;
import com.medisave.backend.reward.service.RewardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Date;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/reward")
public class RewardController {
    @Autowired
    private RewardService rewardService;

    @PostMapping("/create")
    public ResponseEntity<String> createReward(
            @RequestParam String memberId,
            @RequestParam Long medAccountId,
            @RequestParam Double rewardAmount,
            @RequestParam String treatmentNm,
            @RequestParam("document") MultipartFile document) {

        try {
            Reward reward = new Reward();
            reward.setMemberId(memberId);
            reward.setMedAccountId(medAccountId);
            reward.setRewardAmount(rewardAmount);
            reward.setTreatmentNm(treatmentNm);
            reward.setStatus("Y");
            reward.setIssueDate(new Date());

            // 파일(사진) 처리를 위한 코드
            if (document != null && !document.isEmpty()) {
                reward.setDocument(document.getBytes());
            }

            // 서비스 호출
            rewardService.createReward(reward);
            return ResponseEntity.ok("Reward created successfully");

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error creating reward: " + e.getMessage());
        }
    }

}
