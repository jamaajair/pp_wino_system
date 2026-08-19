package com.wino.demo.finance.repository;

import com.wino.demo.finance.entity.FinancialTransaction;
import com.wino.demo.finance.entity.TransactionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface FinancialTransactionRepository extends JpaRepository<FinancialTransaction, Long> {
    
    Optional<FinancialTransaction> findByTransactionNumber(String transactionNumber);
    
    boolean existsByTransactionNumber(String transactionNumber);
    
    List<FinancialTransaction> findByAccountId(Long accountId);
    
    List<FinancialTransaction> findByTransactionType(TransactionType transactionType);
    
    List<FinancialTransaction> findByCreatedById(Long userId);
    
    List<FinancialTransaction> findByValidatedById(Long userId);
    
    List<FinancialTransaction> findByAppliedTrue();
    
    List<FinancialTransaction> findByAppliedFalse();
    
    List<FinancialTransaction> findByTransactionDateBetween(LocalDate startDate, LocalDate endDate);
    
    List<FinancialTransaction> findByAccountIdAndTransactionType(Long accountId, TransactionType transactionType);
    
    List<FinancialTransaction> findByCategory(String category);
    
    @Query("SELECT SUM(CASE WHEN ft.transactionType = 'CREDIT' THEN ft.amount ELSE -ft.amount END) FROM FinancialTransaction ft WHERE ft.account.id = :accountId AND ft.applied = true")
    BigDecimal sumTransactionsByAccount(@Param("accountId") Long accountId);
    
    @Query("SELECT SUM(ft.amount) FROM FinancialTransaction ft WHERE ft.transactionType = :transactionType AND ft.applied = true")
    BigDecimal sumTransactionsByType(@Param("transactionType") TransactionType transactionType);
    
    @Query("SELECT SUM(CASE WHEN ft.transactionType = 'CREDIT' THEN ft.amount ELSE -ft.amount END) FROM FinancialTransaction ft WHERE ft.createdBy.id = :userId AND ft.applied = true")
    BigDecimal sumTransactionsByCreator(@Param("userId") Long userId);
    
    List<FinancialTransaction> findByReferenceContainingIgnoreCase(String reference);
}