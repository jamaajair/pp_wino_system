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
    
    // Recherche par numéro de transaction
    Optional<FinancialTransaction> findByTransactionNumber(String transactionNumber);
    
    // Vérifier si numéro existe
    boolean existsByTransactionNumber(String transactionNumber);
    
    // Transactions par compte
    List<FinancialTransaction> findByAccountId(Long accountId);
    
    // Transactions par type
    List<FinancialTransaction> findByTransactionType(TransactionType transactionType);
    
    // Transactions par utilisateur créateur
    List<FinancialTransaction> findByCreatedById(Long userId);
    
    // Transactions par utilisateur validateur
    List<FinancialTransaction> findByValidatedById(Long userId);
    
    // Transactions appliquées
    List<FinancialTransaction> findByAppliedTrue();
    
    // Transactions non appliquées
    List<FinancialTransaction> findByAppliedFalse();
    
    // Transactions entre deux dates
    List<FinancialTransaction> findByTransactionDateBetween(LocalDate startDate, LocalDate endDate);
    
    // Transactions par compte et type
    List<FinancialTransaction> findByAccountIdAndTransactionType(Long accountId, TransactionType transactionType);
    
    // Transactions par catégorie
    List<FinancialTransaction> findByCategory(String category);
    
    // Somme des transactions par compte
    @Query("SELECT SUM(CASE WHEN ft.transactionType = 'CREDIT' THEN ft.amount ELSE -ft.amount END) FROM FinancialTransaction ft WHERE ft.account.id = :accountId AND ft.applied = true")
    BigDecimal sumTransactionsByAccount(@Param("accountId") Long accountId);
    
    // Somme des transactions par type
    @Query("SELECT SUM(ft.amount) FROM FinancialTransaction ft WHERE ft.transactionType = :transactionType AND ft.applied = true")
    BigDecimal sumTransactionsByType(@Param("transactionType") TransactionType transactionType);
    
    // Somme des transactions par utilisateur créateur
    @Query("SELECT SUM(CASE WHEN ft.transactionType = 'CREDIT' THEN ft.amount ELSE -ft.amount END) FROM FinancialTransaction ft WHERE ft.createdBy.id = :userId AND ft.applied = true")
    BigDecimal sumTransactionsByCreator(@Param("userId") Long userId);
    
    // Recherche par référence
    List<FinancialTransaction> findByReferenceContainingIgnoreCase(String reference);
}