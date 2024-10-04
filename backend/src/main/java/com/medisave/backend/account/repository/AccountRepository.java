package com.medisave.backend.account.repository;

import com.medisave.backend.account.domain.Account;
import com.medisave.backend.card.domain.Consume;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {
    List<Account> findByMemberId(String memberId);
}