package com.medisave.backend.reservation.controller;

import com.medisave.backend.reservation.domain.Reservation;
import com.medisave.backend.reservation.service.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    @Autowired
    private ReservationService reservationService;

    @GetMapping("/available")
    public ResponseEntity<Boolean> isSlotAvailable(
            @RequestParam Long hospitalId,
            @RequestParam String reservationTime) {

        // Parse reservationTime as OffsetDateTime to handle the 'Z' in the timestamp
        OffsetDateTime offsetDateTime = OffsetDateTime.parse(reservationTime);

        // Convert OffsetDateTime to LocalDateTime if necessary
        LocalDateTime time = offsetDateTime.toLocalDateTime();

        // Check if the slot is available
        boolean available = reservationService.isSlotAvailable(hospitalId, time);

        return ResponseEntity.ok(available);
    }

    @PostMapping("/create")
    public ResponseEntity<Reservation> createReservation(
            @RequestBody Map<String, Object> payload) {

        Long hospitalId = Long.parseLong(payload.get("hospitalId").toString());
        String memberId = payload.get("memberId").toString();
        String reservationTime = payload.get("reservationTime").toString();

        OffsetDateTime offsetDateTime = OffsetDateTime.parse(reservationTime);
        LocalDateTime time = offsetDateTime.toLocalDateTime();

        Reservation reservation = reservationService.createReservation(hospitalId, memberId, time);

        return ResponseEntity.ok(reservation);
    }
    @PostMapping("/update/{reservationId}")
    public ResponseEntity<Reservation> updateReservation(
            @PathVariable Long reservationId,  // PathVariable로 reservationId를 받음
            @RequestBody Map<String, Object> payload) {

        Long hospitalId = Long.parseLong(payload.get("hospitalId").toString());
        String memberId = payload.get("memberId").toString();
        String reservationTime = payload.get("reservationTime").toString();

        // 예약 시간을 OffsetDateTime으로 파싱한 후 LocalDateTime으로 변환
        OffsetDateTime offsetDateTime = OffsetDateTime.parse(reservationTime);
        LocalDateTime time = offsetDateTime.toLocalDateTime();

        // 서비스 메서드 호출하여 예약 업데이트
        Reservation reservation = reservationService.updateReservation(reservationId, hospitalId, memberId, time);

        return ResponseEntity.ok(reservation);
    }
    @PostMapping("/cancel")
    public ResponseEntity<String> cancelReservation(@RequestBody Map<String, Object> payload) {
        Long reservationId = Long.parseLong(payload.get("reservationId").toString());

        // 서비스 메서드 호출하여 예약 취소 처리
        reservationService.cancelReservation(reservationId);

        return ResponseEntity.ok("Reservation canceled successfully");
    }

    // Retrieve all reservations for a hospital
    @GetMapping("/{hospitalId}")
    public ResponseEntity<List<Reservation>> getReservations(@PathVariable Long hospitalId) {
        List<Reservation> reservations = reservationService.getReservations(hospitalId);
        return ResponseEntity.ok(reservations);
    }
    @GetMapping("/get/{memberId}")
    public ResponseEntity<List<Object[]>> getReservationsWithHospitalInfo(@PathVariable String memberId) {
        List<Object[]> reservations = reservationService.getMemberReservations(memberId);
        return ResponseEntity.ok(reservations);
    }
    @GetMapping("/id/{reservationId}")
    public ResponseEntity<List<Object[]>> getReservation(@PathVariable Long reservationId) {
        List<Object[]> reservations = reservationService.getReservation(reservationId);
        return ResponseEntity.ok(reservations);
    }
}