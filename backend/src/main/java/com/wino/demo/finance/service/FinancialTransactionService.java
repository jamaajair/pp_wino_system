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
    

    private String generateTransactionNumber() {
        String prefix = "TXN";
        String date = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        
        long count = financialTransactionRepository.count();
        
        return String.format("%s%s-%06d", prefix, date, count + 1);
    }

    public List<FinancialTransaction> getAllFinancialTransactions() {
        return financialTransactionRepository.findAll();
    }
    
    public FinancialTransaction getFinancialTransactionById(Long id) {
        return financialTransactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction financière non trouvée avec l'ID: " + id));
    }

    public FinancialTransaction getFinancialTransactionByTransactionNumber(String transactionNumber) {
        return financialTransactionRepository.findByTransactionNumber(transactionNumber)
                .orElseThrow(() -> new RuntimeException("Transaction non trouvée avec le numéro: " + transactionNumber));
    }
    

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
    

    public void deleteFinancialTransaction(Long id) {
        FinancialTransaction financialTransaction = getFinancialTransactionById(id);
        
        // On ne peut supprimer que les transactions non appliquées
        if (financialTransaction.getApplied()) {
            throw new RuntimeException("Impossible de supprimer une transaction déjà appliquée");
        }
        
        financialTransactionRepository.delete(financialTransaction);
    }
    

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
    
    public FinancialTransaction reverseTransaction(Long id) {
        FinancialTransaction financialTransaction = getFinancialTransactionById(id);
        financialTransaction.reverse();
        
        return financialTransactionRepository.save(financialTransaction);
    }
    

    public List<FinancialTransaction> getTransactionsByAccount(Long accountId) {
        return financialTransactionRepository.findByAccountId(accountId);
    }
    
    public List<FinancialTransaction> getTransactionsByType(TransactionType transactionType) {
        return financialTransactionRepository.findByTransactionType(transactionType);
    }
    

    public List<FinancialTransaction> getTransactionsByCreator(Long userId) {
        return financialTransactionRepository.findByCreatedById(userId);
    }
    

    public List<FinancialTransaction> getTransactionsByValidator(Long userId) {
        return financialTransactionRepository.findByValidatedById(userId);
    }
    
    public List<FinancialTransaction> getAppliedTransactions() {
        return financialTransactionRepository.findByAppliedTrue();
    }
    
    public List<FinancialTransaction> getPendingTransactions() {
        return financialTransactionRepository.findByAppliedFalse();
    }
    
    public List<FinancialTransaction> getTransactionsByDateRange(LocalDate startDate, LocalDate endDate) {
        return financialTransactionRepository.findByTransactionDateBetween(startDate, endDate);
    }

    public List<FinancialTransaction> getTransactionsByCategory(String category) {
        return financialTransactionRepository.findByCategory(category);
    }

    public BigDecimal getTotalTransactionsByAccount(Long accountId) {
        BigDecimal total = financialTransactionRepository.sumTransactionsByAccount(accountId);
        return total != null ? total : BigDecimal.ZERO;
    }
    
    public BigDecimal getTotalTransactionsByType(TransactionType transactionType) {
        BigDecimal total = financialTransactionRepository.sumTransactionsByType(transactionType);
        return total != null ? total : BigDecimal.ZERO;
    }
    
    public List<FinancialTransaction> searchByReference(String reference) {
        return financialTransactionRepository.findByReferenceContainingIgnoreCase(reference);
    }
}