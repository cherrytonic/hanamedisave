package com.medisave.backend.reward.service;

import com.medisave.backend.card.dto.ConsumeDTO;
import com.medisave.backend.card.repository.ConsumeRepository;
import com.medisave.backend.reward.domain.Reward;
import com.medisave.backend.reward.repository.RewardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class RewardService {

    @Autowired
    private RewardRepository rewardRepository;

    public void createReward(Reward reward) {
        rewardRepository.save(reward);
    }

}
