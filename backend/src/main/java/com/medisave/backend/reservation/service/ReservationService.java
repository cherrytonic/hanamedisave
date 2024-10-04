package com.medisave.backend.reservation.service;


import com.medisave.backend.reservation.domain.Reservation;
import com.medisave.backend.reservation.repository.ReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;


@Service
public class ReservationService {

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    // 30분 단위로 예약 가능 여부 확인
    public boolean isSlotAvailable(Long hospitalId, LocalDateTime reservationTime) {
        List<Reservation> reservations = reservationRepository.findByHospitalIdAndReservationTimeAndStatus(hospitalId, reservationTime, "CONFIRMED");

        // 예약이 없으면 true 반환 (슬롯이 비어있음)
        return reservations.isEmpty();
    }
    public Reservation createReservation(Long hospitalId, String memberId, LocalDateTime reservationTime) {
        if (!isSlotAvailable(hospitalId, reservationTime)) {
            throw new IllegalArgumentException("Time slot is already booked");
        }

        Reservation reservation = new Reservation();
        reservation.setHospitalId(hospitalId);
        reservation.setMemberId(memberId);
        reservation.setReservationTime(reservationTime);
        reservation.setStatus("CONFIRMED");
        reservation.setCreatedAt(LocalDateTime.now());
        reservation.setUpdatedAt(LocalDateTime.now());

        return reservationRepository.save(reservation);
    }
    public Reservation updateReservation(Long reservationId, Long hospitalId, String memberId, LocalDateTime reservationTime) {
        // 예약이 존재하는지 확인
        Reservation existingReservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new IllegalArgumentException("Reservation not found"));

        // 해당 시간대에 예약이 가능한지 확인
        if (!isSlotAvailable(hospitalId, reservationTime)) {
            throw new IllegalArgumentException("Time slot is already booked");
        }

        // 예약 정보 업데이트
        existingReservation.setHospitalId(hospitalId);
        existingReservation.setMemberId(memberId);
        existingReservation.setReservationTime(reservationTime);
        existingReservation.setStatus("CONFIRMED");
        existingReservation.setUpdatedAt(LocalDateTime.now());

        return reservationRepository.save(existingReservation);
    }
    public void cancelReservation(Long reservationId) {
        // 예약이 존재하는지 확인
        Reservation existingReservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new IllegalArgumentException("Reservation not found"));

        // 예약 상태를 취소로 변경
        existingReservation.setStatus("CANCELED");
        existingReservation.setUpdatedAt(LocalDateTime.now());

        // 변경된 예약 정보 저장
        reservationRepository.save(existingReservation);
    }


    // Find all reservations for a given hospital
    public List<Reservation> getReservations(Long hospitalId) {
        return reservationRepository.findByHospitalIdAndStatus(hospitalId, "CONFIRMED");
    }
    public List<Object[]> getMemberReservations(String memberId) {
        return reservationRepository.findByMemberIdWithHospitalInfo(memberId);
    }
    public List<Object[]> getReservation(Long reservationId) {
        return reservationRepository.findByIdWithHospitalInfo(reservationId);
    }

    // 예약 시간 도래 시 사용자에게 알림 전송
    @Scheduled(fixedRate = 60000) // 1분 간격으로 실행
    public void checkReservationsForNotification() {
        LocalDateTime currentTime = LocalDateTime.now();
        LocalDateTime fiveMinutesLater = currentTime.plusMinutes(1);

        // 예약 시간이 5분 남은 예약 조회
        List<Reservation> upcomingReservations = reservationRepository.findReservationsWithFiveMinutesLeft(currentTime, fiveMinutesLater);

        for (Reservation reservation : upcomingReservations) {
            // 사용자에게 전송할 예약 정보 가져오기
            List<Object[]> reservationInfo = getMemberReservations(reservation.getMemberId());

            // 메시지 구성
            Map<String, Object> messageData = new HashMap<>();
            messageData.put("reservationId", reservation.getReservationId());
            messageData.put("hospitalName", reservationInfo.get(0)[8]); // 병원이름
            messageData.put("reservationTime", reservation.getReservationTime().toString()); // 예약 시간
            System.out.println(messageData);
            String destination = "/sub/notification/" + reservation.getMemberId();
            messagingTemplate.convertAndSend(destination, messageData);
        }
    }
}
