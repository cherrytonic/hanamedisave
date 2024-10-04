package com.medisave.backend.repository;

import com.medisave.backend.hospital.domain.Consume;
import com.medisave.backend.hospital.repository.ConsumeRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertFalse;

@SpringBootTest
public class ConsumeRepositoryTest {

    @Autowired
    private ConsumeRepository consumeRepository;

    @Test
    public void testFindByCardNb() {
        Long cardNb = 1234567812345678L;
        List<Consume> consumes = consumeRepository.findByCardNb(cardNb);
        assertFalse(consumes.isEmpty());  // 데이터가 있다면 성공
    }
}
