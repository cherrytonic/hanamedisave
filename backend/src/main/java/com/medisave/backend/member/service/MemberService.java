package com.medisave.backend.member.service;

import com.medisave.backend.member.domain.Member;
import com.medisave.backend.member.dto.MemberDTO;
import com.medisave.backend.member.repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class MemberService {

    @Autowired
    private MemberRepository memberRepository;
    @Transactional
    public MemberDTO getMemberById(String memberId) {
        Optional<Member> member = memberRepository.findByMemberId(memberId);

        if (member.isPresent()) {
            return toMemberDTO(member.get());
        }

        return null;
    }
    @Transactional
    public Member registerMember(Member member) {
        member.setEnrollDt(LocalDate.now());
        return memberRepository.save(member);
    }
    @Transactional
    public MemberDTO login(String memberId, String password) {
        // memberId로 회원 정보 조회
        Optional<Member> member = memberRepository.findByMemberId(memberId);

        // 회원이 존재하고 비밀번호가 일치하는지 확인
        if (member.isPresent() && member.get().getMemberPw().equals(password)) {
            return toMemberDTO(member.get());
        }
        return null;
    }
    // 리워드 업데이트 로직 추가
    @Transactional
    public boolean updateReward(String memberId, BigDecimal reward) {
        Optional<Member> member = memberRepository.findByMemberId(memberId);

        if (member.isPresent()) {
            Member foundMember = member.get();
            // 기존 리워드에 새로운 리워드를 더함
            foundMember.setReward(foundMember.getReward().add(reward));
            memberRepository.save(foundMember); // 업데이트된 멤버 저장
            return true;
        }

        return false; // 멤버가 없으면 false 반환
    }
    // Member 엔티티를 MemberDTO로 변환하는 메서드
    private MemberDTO toMemberDTO(Member member) {
        MemberDTO memberDTO = new MemberDTO();
        memberDTO.setId(member.getId());
        memberDTO.setMemberId(member.getMemberId());
        memberDTO.setResidentNb(member.getResidentNb());
        memberDTO.setMemberEmail(member.getMemberEmail());
        memberDTO.setMemberPhoneNb(member.getMemberPhoneNb());
        memberDTO.setEnrollDt(member.getEnrollDt());
        memberDTO.setMemberNm(member.getMemberNm());
        memberDTO.setReward(member.getReward());
        return memberDTO;
    }
}
