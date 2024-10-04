package com.medisave.backend.hospital.repository;

import com.medisave.backend.hospital.domain.Hospital;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

@Repository
public interface HospitalRepository extends JpaRepository<Hospital, Long> {

    @Query(value = "SELECT * FROM hospitals h WHERE " +
            "(6371 * acos(cos(:latitude * (3.141592653589793 / 180)) * cos(h.YPos * (3.141592653589793 / 180)) " +
            "* cos((h.XPos * (3.141592653589793 / 180)) - (:longitude * (3.141592653589793 / 180))) " +
            "+ sin(:latitude * (3.141592653589793 / 180)) * sin(h.YPos * (3.141592653589793 / 180)))) < 1",
            nativeQuery = true)
    List<Hospital> findHospitalsWithinRadius(@Param("latitude") double latitude, @Param("longitude") double longitude);
    @Query(value = "SELECT * FROM hospitals h WHERE h.addr LIKE %:region%", nativeQuery = true)
    List<Hospital> findByRegion(@Param("region") String region);
}