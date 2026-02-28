package com.wino.demo.finance.service;

import com.wino.demo.finance.entity.FinancialTransaction;
import com.wino.demo.finance.entity.TransactionType;
import com.wino.demo.finance.repository.FinancialTransactionRepository;
import com.wino.demo.user.entity.User;
import com.wino.demo.user.service.UserService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@Transactional
public class FinancialTransactionService {
    
    private final FinancialTransactionRepository financialTransactionRepository;
    private final FinancialAccountService financialAccountService;
    private final UserService userService;
    
    public FinancialTransactionService(FinancialTransactionRepository financialTransactionRepository,
                                      FinancialAccountService financialAccountService,
                                      UserService userService) {
        this.financialTransactionRepository = financialTransactionRepository;
        this.financialAccountService = financialAccountService;
        this.userService = userService;
    }
    
    /**
     * Générer un numéro de transaction unique
     */
    private String generateTransactionNumber() {
        String prefix = "TXN";
        String date = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        
        long count = financialTransactionRepository.count();
        
        return String.format("%s%s-%06d", prefix, date, count + 1);
    }
    
    /**
     * Récupérer toutes les transactions
     */
    public List<FinancialTransaction> getAllFinancialTransactions() {
        return financialTransactionRepository.findAll();
    }
    
    /**
     * Récupérer une transaction par ID
     */
    public FinancialTransaction getFinancialTransactionById(Long id) {
        return financialTransactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction financière non trouvée avec l'ID: " + id));
    }
    
    /**
     * Récupérer une transaction par numéro
     */
    public FinancialTransaction getFinancialTransactionByTransactionNumber(String transactionNumber) {
        return financialTransactionRepository.findByTransactionNumber(transactionNumber)
                .orElseThrow(() -> new RuntimeException("Transaction non trouvée avec le numéro: " + transactionNumber));
    }
    
    /**
     * Créer une nouvelle transaction
     */
    public FinancialTransaction createFinancialTransaction(FinancialTransaction financialTransaction) {
        // Générer le numéro de transaction
        financialTransaction.setTransactionNumber(generateTransactionNumber());
        
        // Valider le compte
        if (financialTransaction.getAccount() != null && financialTransaction.getAccount().getId() != null) {
            financialTransaction.setAccount(
                financialAccountService.getFinancialAccountById(financialTransaction.getAccount().getId())
            );
        } else {
            throw new RuntimeException("Le compte est requis");
        }
        
        // Valider l'utilisateur créateur si fourni
        if (financialTransaction.getCreatedBy() != null && financialTransaction.getCreatedBy().getId() != null) {
            User creator = userService.getUserById(financialTransaction.getCreatedBy().getId());
            financialTransaction.setCreatedBy(creator);
        }
        
        financialTransaction.setCreatedAt(LocalDateTime.now());
        financialTransaction.setUpdatedAt(LocalDateTime.now());
        
        return financialTransactionRepository.save(financialTransaction);
    }
    
    /**
     * Mettre à jour une transaction
     */
    public FinancialTransaction updateFinancialTransaction(Long id, FinancialTransaction transactionDetails) {
        FinancialTransaction financialTransaction = getFinancialTransactionById(id);
        
        // On ne peut modifier que les transactions non appliquées
        if (financialTransaction.getApplied()) {
            throw new RuntimeException("Impossible de modifier une transaction déjà appliquée");
        }
        
        financialTransaction.setTransactionType(transactionDetails.getTransactionType());
        financialTransaction.setAmount(transactionDetails.getAmount());
        financialTransaction.setTransactionDate(transactionDetails.getTransactionDate());
        financialTransaction.setDescription(transactionDetails.getDescription());
        financialTransaction.setReference(transactionDetails.getReference());
        financialTransaction.setCategory(transactionDetails.getCategory());
        financialTransaction.setNotes(transactionDetails.getNotes());
        
        financialTransaction.setUpdatedAt(LocalDateTime.now());
        return financialTransactionRepository.save(financialTransaction);
    }
    
    /**
     * Supprimer une transaction
     */
    public void deleteFinancialTransaction(Long id) {
        FinancialTransaction financialTransaction = getFinancialTransactionById(id);
        
        // On ne peut supprimer que les transactions non appliquées
        if (financialTransaction.getApplied()) {
            throw new RuntimeException("Impossible de supprimer une transaction déjà appliquée");
        }
        
        financialTransactionRepository.delete(financialTransaction);
    }
    
    /**
     * Appliquer une transaction
     */
    public FinancialTransaction applyTransaction(Long id, Long validatedByUserId) {
        FinancialTransaction financialTransaction = getFinancialTransactionById(id);
        
        // Définir l'utilisateur qui valide
        if (validatedByUserId != null) {
            User validator = userService.getUserById(validatedByUserId);
            financialTransaction.setValidatedBy(validator);
        }
        
        financialTransaction.apply();
        
        return financialTransactionRepository.save(financialTransaction);
    }
    
    /**
     * Annuler une transaction
     */
    public FinancialTransaction reverseTransaction(Long id) {
        FinancialTransaction financialTransaction = getFinancialTransactionById(id);
        financialTransaction.reverse();
        
        return financialTransactionRepository.save(financialTransaction);
    }
    
    /**
     * Transactions par compte
     */
    public List<FinancialTransaction> getTransactionsByAccount(Long accountId) {
        return financialTransactionRepository.findByAccountId(accountId);
    }
    
    /**
     * Transactions par type
     */
    public List<FinancialTransaction> getTransactionsByType(TransactionType transactionType) {
        return financialTransactionRepository.findByTransactionType(transactionType);
    }
    
    /**
     * Transactions par utilisateur créateur
     */
    public List<FinancialTransaction> getTransactionsByCreator(Long userId) {
        return financialTransactionRepository.findByCreatedById(userId);
    }
    
    /**
     * Transactions par utilisateur validateur
     */
    public List<FinancialTransaction> getTransactionsByValidator(Long userId) {
        return financialTransactionRepository.findByValidatedById(userId);
    }
    
    /**
     * Transactions appliquées
     */
    public List<FinancialTransaction> getAppliedTransactions() {
        return financialTransactionRepository.findByAppliedTrue();
    }
    
    /**
     * Transactions en attente
     */
    public List<FinancialTransaction> getPendingTransactions() {
        return financialTransactionRepository.findByAppliedFalse();
    }
    
    /**
     * Transactions entre deux dates
     */
    public List<FinancialTransaction> getTransactionsByDateRange(LocalDate startDate, LocalDate endDate) {
        return financialTransactionRepository.findByTransactionDateBetween(startDate, endDate);
    }
    
    /**
     * Transactions par catégorie
     */
    public List<FinancialTransaction> getTransactionsByCategory(String category) {
        return financialTransactionRepository.findByCategory(category);
    }
    
    /**
     * Somme des transactions d'un compte
     */
    public BigDecimal getTotalTransactionsByAccount(Long accountId) {
        BigDecimal total = financialTransactionRepository.sumTransactionsByAccount(accountId);
        return total != null ? total : BigDecimal.ZERO;
    }
    
    /**
     * Somme des transactions par type
     */
    public BigDecimal getTotalTransactionsByType(TransactionType transactionType) {
        BigDecimal total = financialTransactionRepository.sumTransactionsByType(transactionType);
        return total != null ? total : BigDecimal.ZERO;
    }
    
    /**
     * Rechercher par référence
     */
    public List<FinancialTransaction> searchByReference(String reference) {
        return financialTransactionRepository.findByReferenceContainingIgnoreCase(reference);
    }
}