package com.wino.demo.finance.repository;

import com.wino.demo.finance.entity.AccountType;
import com.wino.demo.finance.entity.FinancialAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface FinancialAccountRepository extends JpaRepository<FinancialAccount, Long> {
    
    Optional<FinancialAccount> findByAccountNumber(String accountNumber);
    
    boolean existsByAccountNumber(String accountNumber);
    
    List<FinancialAccount> findByActiveTrue();
    
    List<FinancialAccount> findByAccountType(AccountType accountType);
    
    @Query("SELECT fa FROM FinancialAccount fa WHERE fa.balance > 0")
    List<FinancialAccount> findAccountsWithPositiveBalance();
    
    @Query("SELECT fa FROM FinancialAccount fa WHERE fa.balance < 0")
    List<FinancialAccount> findAccountsWithNegativeBalance();
    
    @Query("SELECT SUM(fa.balance) FROM FinancialAccount fa WHERE fa.active = true")
    BigDecimal getTotalBalance();
    
    @Query("SELECT SUM(fa.balance) FROM FinancialAccount fa WHERE fa.accountType = :accountType AND fa.active = true")
    BigDecimal getTotalBalanceByType(@Param("accountType") AccountType accountType);
    
    List<FinancialAccount> findByAccountNameContainingIgnoreCase(String accountName);
}