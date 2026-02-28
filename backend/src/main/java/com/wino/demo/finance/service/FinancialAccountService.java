package com.wino.demo.finance.service;

import com.wino.demo.finance.entity.AccountType;
import com.wino.demo.finance.entity.FinancialAccount;
import com.wino.demo.finance.entity.TransactionType;
import com.wino.demo.finance.repository.FinancialAccountRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class FinancialAccountService {
    
    private final FinancialAccountRepository financialAccountRepository;
    
    public FinancialAccountService(FinancialAccountRepository financialAccountRepository) {
        this.financialAccountRepository = financialAccountRepository;
    }
    
    /**
     * Récupérer tous les comptes
     */
    public List<FinancialAccount> getAllFinancialAccounts() {
        return financialAccountRepository.findAll();
    }
    
    /**
     * Récupérer un compte par ID
     */
    public FinancialAccount getFinancialAccountById(Long id) {
        return financialAccountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Compte financier non trouvé avec l'ID: " + id));
    }
    
    /**
     * Récupérer un compte par numéro
     */
    public FinancialAccount getFinancialAccountByAccountNumber(String accountNumber) {
        return financialAccountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new RuntimeException("Compte non trouvé avec le numéro: " + accountNumber));
    }
    
    /**
     * Créer un nouveau compte
     */
    public FinancialAccount createFinancialAccount(FinancialAccount financialAccount) {
        // Vérifier si le numéro de compte existe déjà
        if (financialAccountRepository.existsByAccountNumber(financialAccount.getAccountNumber())) {
            throw new RuntimeException("Un compte avec ce numéro existe déjà");
        }
        
        financialAccount.setCreatedAt(LocalDateTime.now());
        financialAccount.setUpdatedAt(LocalDateTime.now());
        
        return financialAccountRepository.save(financialAccount);
    }
    
    /**
     * Mettre à jour un compte
     */
    public FinancialAccount updateFinancialAccount(Long id, FinancialAccount accountDetails) {
        FinancialAccount financialAccount = getFinancialAccountById(id);
        
        financialAccount.setAccountName(accountDetails.getAccountName());
        financialAccount.setAccountType(accountDetails.getAccountType());
        financialAccount.setCurrency(accountDetails.getCurrency());
        financialAccount.setDescription(accountDetails.getDescription());
        financialAccount.setActive(accountDetails.getActive());
        
        financialAccount.setUpdatedAt(LocalDateTime.now());
        return financialAccountRepository.save(financialAccount);
    }
    
    /**
     * Supprimer un compte
     */
    public void deleteFinancialAccount(Long id) {
        FinancialAccount financialAccount = getFinancialAccountById(id);
        
        // Vérifier que le solde est à zéro
        if (financialAccount.getBalance().compareTo(BigDecimal.ZERO) != 0) {
            throw new RuntimeException("Impossible de supprimer un compte avec un solde non nul");
        }
        
        financialAccountRepository.delete(financialAccount);
    }
    
    /**
     * Activer/Désactiver un compte
     */
    public FinancialAccount toggleActive(Long id) {
        FinancialAccount financialAccount = getFinancialAccountById(id);
        financialAccount.setActive(!financialAccount.getActive());
        financialAccount.setUpdatedAt(LocalDateTime.now());
        
        return financialAccountRepository.save(financialAccount);
    }
    
    /**
     * Mettre à jour le solde
     */
    public FinancialAccount updateBalance(Long id, BigDecimal amount, TransactionType transactionType) {
        FinancialAccount financialAccount = getFinancialAccountById(id);
        financialAccount.updateBalance(amount, transactionType);
        
        return financialAccountRepository.save(financialAccount);
    }
    
    /**
     * Comptes actifs
     */
    public List<FinancialAccount> getActiveAccounts() {
        return financialAccountRepository.findByActiveTrue();
    }
    
    /**
     * Comptes par type
     */
    public List<FinancialAccount> getAccountsByType(AccountType accountType) {
        return financialAccountRepository.findByAccountType(accountType);
    }
    
    /**
     * Comptes avec solde positif
     */
    public List<FinancialAccount> getAccountsWithPositiveBalance() {
        return financialAccountRepository.findAccountsWithPositiveBalance();
    }
    
    /**
     * Comptes avec solde négatif
     */
    public List<FinancialAccount> getAccountsWithNegativeBalance() {
        return financialAccountRepository.findAccountsWithNegativeBalance();
    }
    
    /**
     * Solde total de tous les comptes
     */
    public BigDecimal getTotalBalance() {
        BigDecimal total = financialAccountRepository.getTotalBalance();
        return total != null ? total : BigDecimal.ZERO;
    }
    
    /**
     * Solde total par type de compte
     */
    public BigDecimal getTotalBalanceByType(AccountType accountType) {
        BigDecimal total = financialAccountRepository.getTotalBalanceByType(accountType);
        return total != null ? total : BigDecimal.ZERO;
    }
    
    /**
     * Rechercher par nom
     */
    public List<FinancialAccount> searchAccountsByName(String accountName) {
        return financialAccountRepository.findByAccountNameContainingIgnoreCase(accountName);
    }
}