package com.medisave.backend.reservation.repository;

import com.medisave.backend.card.domain.Consume;
import com.medisave.backend.reservation.domain.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findByHospitalIdAndStatus(Long hospitalId, String status);
    List<Reservation> findByMemberId(String MemberId);
    List<Reservation> findByHospitalIdAndReservationTimeAndStatus(Long hospitalId, LocalDateTime startTime, String status);

    @Query(value = "SELECT r.*, h.* " +
            "FROM reservation r " +
            "JOIN hospitals h ON r.hospital_id = h.id " +
            "WHERE r.member_id = :memberId " +
            "AND r.status = 'CONFIRMED'", // CONFIRMED 예약만 조회
            nativeQuery = true)
    List<Object[]> findByMemberIdWithHospitalInfo(String memberId);

    @Query(value = "SELECT r.*, h.* " +
            "FROM reservation r " +
            "JOIN hospitals h ON r.hospital_id = h.id " +
            "WHERE r.reservation_id = :id " +
            "AND r.status = 'CONFIRMED'", // CONFIRMED 예약만 조회
            nativeQuery = true)
    List<Object[]> findByIdWithHospitalInfo(Long id);

    @Query("SELECT r FROM Reservation r WHERE r.reservationTime BETWEEN :currentTime AND :fiveMinutesLater")
    List<Reservation> findReservationsWithFiveMinutesLeft(@Param("currentTime") LocalDateTime currentTime, @Param("fiveMinutesLater") LocalDateTime fiveMinutesLater);

}