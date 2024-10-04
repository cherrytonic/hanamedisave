package com.medisave.backend.reward.repository;

import com.medisave.backend.card.domain.Consume;
import com.medisave.backend.reward.domain.Reward;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RewardRepository extends JpaRepository<Reward, Long> {

}