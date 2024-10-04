package com.medisave.backend.card.repository;

import com.medisave.backend.card.domain.Consume;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConsumeRepository extends JpaRepository<Consume, Long> {
//    List<Consume> findByCardNb(Long cardNb);
@Query(value = "SELECT c.consume_id, c.account_id, c.card_nb, c.consume_amount, c.consume_dt, c.store_nm, " +
        "cc.large, cc.medium, cc.small " +
        "FROM consume c " +
        "JOIN consume_category cc ON c.category_code = cc.category_code " +
        "WHERE c.card_nb = :cardNb", nativeQuery = true)
List<Object[]> findConsumesWithCategoryByCardNb(@Param("cardNb") Long cardNb);
}