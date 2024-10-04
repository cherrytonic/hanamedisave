package com.medisave.backend.card.service;

import com.medisave.backend.card.dto.ConsumeDTO;
import com.medisave.backend.card.repository.ConsumeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ConsumeService {

    @Autowired
    private ConsumeRepository consumeRepository;
    public List<ConsumeDTO> getConsumesWithCategoryByCardNb(Long cardNb) {
        List<Object[]> result = consumeRepository.findConsumesWithCategoryByCardNb(cardNb);
        List<ConsumeDTO> consumeDTOs = new ArrayList<>();

        for (Object[] row : result) {
            ConsumeDTO consumeDTO = new ConsumeDTO();
            consumeDTO.setConsumeId(Long.parseLong(String.valueOf(row[0]))); // consume_id
            consumeDTO.setAccountId(Long.parseLong(String.valueOf(row[1])));  // account_id
            consumeDTO.setCardNb(Long.parseLong(String.valueOf(row[2])));     // card_nb
            consumeDTO.setConsumeAmount(Long.parseLong(String.valueOf(row[3])));  // consume_amount
            consumeDTO.setConsumeDate(((Date) row[4]));     // consume_dt
            consumeDTO.setStoreName((String) row[5]);                     // store_nm
            consumeDTO.setLargeCategory((String) row[6]);               // large
            consumeDTO.setMediumCategory((String) row[7]);              // medium
            consumeDTO.setSmallCategory((String) row[8]);               // small
            consumeDTOs.add(consumeDTO);
        }
        return consumeDTOs;
    }
    public Map<String, Object> getConsumesForFrontend(Long cardNb) {
        // 소비 데이터를 가져온다
        List<Object[]> consumeData = consumeRepository.findConsumesWithCategoryByCardNb(cardNb);

        // 대분류별 금액 합산
        Map<String, Long> categoryTotalMap = new HashMap<>();
        Map<String, Long> medicalTotalMap = new HashMap<>();
        Map<String, Map<String, Object>> monthsMap = new LinkedHashMap<>();

        // 각 월별 데이터 초기화 및 대분류, 중분류로 데이터 분리
        for (Object[] row : consumeData) {
            String largeCategory = (String) row[6];  // 대분류
            String mediumCategory = (String) row[7]; // 중분류
            Long amount = ((BigDecimal) row[3]).longValue();
            String consumeDate = row[4].toString();  // 날짜 정보

            // 월을 기준으로 데이터를 분류
            String monthKey = consumeDate.substring(5, 7) + "월";

            monthsMap.putIfAbsent(monthKey, new HashMap<>());
            Map<String, Object> monthDetails = monthsMap.get(monthKey);
            monthDetails.putIfAbsent("total", new ArrayList<Map<String, Object>>());
            monthDetails.putIfAbsent("medical", new ArrayList<Map<String, Object>>());

            // 대분류 금액 합산
            categoryTotalMap.put(largeCategory, categoryTotalMap.getOrDefault(largeCategory, 0L) + amount);

            // 중분류가 '의료'인 경우 처리
            if ("의료".equals(largeCategory)) {
                medicalTotalMap.put(mediumCategory, medicalTotalMap.getOrDefault(mediumCategory, 0L) + amount);
            }

            // 월별 'total' 항목에 데이터 추가
            List<Map<String, Object>> totalList = (List<Map<String, Object>>) monthDetails.get("total");
            totalList.add(Map.of("label", largeCategory, "value", amount + "원"));

            // '의료' 항목인 경우 'medical' 항목에 추가
            if ("의료".equals(largeCategory)) {
                List<Map<String, Object>> medicalList = (List<Map<String, Object>>) monthDetails.get("medical");
                medicalList.add(Map.of("label", mediumCategory, "value", amount + "원"));
            }
        }

        List<Map<String, Object>> totalChartList = categoryTotalMap.entrySet().stream()
                .map(entry -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", entry.getKey());
                    map.put("label", entry.getKey());
                    map.put("value", entry.getValue());
                    return map;
                })
                .collect(Collectors.toList());

        List<Map<String, Object>> medicalChartList = medicalTotalMap.entrySet().stream()
                .map(entry -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", entry.getKey());
                    map.put("label", entry.getKey());
                    map.put("value", entry.getValue());
                    return map;
                })
                .collect(Collectors.toList());


        // 최종 데이터 구조
        Map<String, Object> response = new HashMap<>();
        response.put("months", monthsMap);
        response.put("charts", Map.of("total", totalChartList, "medical", medicalChartList));

        return response;
    }
}
