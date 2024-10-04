package com.medisave.backend.account.domain;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public abstract class TransactionRecord {
    public abstract LocalDateTime getTransactionDate();
    public abstract BigDecimal getAmount();
}
