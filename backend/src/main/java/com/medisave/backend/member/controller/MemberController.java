package com.medisave.backend.member.controller;

import com.medisave.backend.member.domain.Member;
import com.medisave.backend.member.dto.MemberDTO;
import com.medisave.backend.member.dto.RewardRequestDTO;
import com.medisave.backend.member.service.MemberService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
//@CrossOrigin(origins = {
//        "http://211.188.50.141", // 포트 8080 허용
//        "http://localhost:3000", // 포트 3000 허용
//})
@RequestMapping("/api/members")
public class MemberController {
    @Autowired
    private MemberService memberService;
    private static final Logger logger = LoggerFactory.getLogger(MemberController.class);
    @GetMapping("/{memberId}")
    public ResponseEntity<?> getMemberById(@PathVariable String memberId) {
        logger.info("Fetching member info for memberId: {}", memberId);

        MemberDTO memberDTO = memberService.getMemberById(memberId);

        if (memberDTO != null) {
            return ResponseEntity.ok(memberDTO);
        } else {
            logger.error("Member not found for memberId: {}", memberId);
            return ResponseEntity.status(404).body("Member not found");
        }
    }
    @PostMapping("/register")
    public ResponseEntity<Member> registerMember(@RequestBody Member member) {
        // 받은 데이터를 로그로 출력
        logger.info("Received member data: {}", member);
        if (member.getMemberId() == null || member.getMemberId().isEmpty()) {
            logger.error("memberId is missing");
            return ResponseEntity.badRequest().body(null); // 400 Bad Request
        }
        Member savedMember = memberService.registerMember(member);
        // 로그로 저장된 회원 정보 출력
        logger.info("Saved member data: {}", savedMember);
        return ResponseEntity.ok(savedMember); // 200 OK
    }
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Member member) {
        logger.info("Login attempt for memberId: {}", member.getMemberId());

        // 로그인 서비스 호출
        MemberDTO memberDTO = memberService.login(member.getMemberId(), member.getMemberPw());

        if (memberDTO != null) {
            logger.info("Login successful for memberId: {}", member.getMemberId());
            return ResponseEntity.ok(memberDTO); // 회원 정보 반환
        } else {
            logger.error("Login failed for memberId: {}", member.getMemberId());
            return ResponseEntity.status(401).body("Login failed. Invalid credentials.");
        }
    }
    @PostMapping("/claim")
    public ResponseEntity<?> claimReward(@RequestBody RewardRequestDTO rewardRequest) {
        logger.info("Received reward claim request for memberId: {}, reward: {}", rewardRequest.getMemberId(), rewardRequest.getReward());

        // 리워드 업데이트 서비스 호출
        boolean updated = memberService.updateReward(rewardRequest.getMemberId(), rewardRequest.getReward());

        if (updated) {
            logger.info("Reward updated successfully for memberId: {}", rewardRequest.getMemberId());
            return ResponseEntity.ok("Reward updated successfully");
        } else {
            logger.error("Failed to update reward for memberId: {}", rewardRequest.getMemberId());
            return ResponseEntity.status(404).body("Member not found or failed to update reward");
        }
    }
}
