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
    
    // Recherche par numéro de compte
    Optional<FinancialAccount> findByAccountNumber(String accountNumber);
    
    // Vérifier si numéro existe
    boolean existsByAccountNumber(String accountNumber);
    
    // Comptes actifs
    List<FinancialAccount> findByActiveTrue();
    
    // Comptes par type
    List<FinancialAccount> findByAccountType(AccountType accountType);
    
    // Comptes avec solde positif
    @Query("SELECT fa FROM FinancialAccount fa WHERE fa.balance > 0")
    List<FinancialAccount> findAccountsWithPositiveBalance();
    
    // Comptes avec solde négatif
    @Query("SELECT fa FROM FinancialAccount fa WHERE fa.balance < 0")
    List<FinancialAccount> findAccountsWithNegativeBalance();
    
    // Somme totale des soldes
    @Query("SELECT SUM(fa.balance) FROM FinancialAccount fa WHERE fa.active = true")
    BigDecimal getTotalBalance();
    
    // Somme des soldes par type
    @Query("SELECT SUM(fa.balance) FROM FinancialAccount fa WHERE fa.accountType = :accountType AND fa.active = true")
    BigDecimal getTotalBalanceByType(@Param("accountType") AccountType accountType);
    
    // Recherche par nom
    List<FinancialAccount> findByAccountNameContainingIgnoreCase(String accountName);
}