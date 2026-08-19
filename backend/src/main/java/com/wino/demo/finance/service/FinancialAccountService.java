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
    

    public List<FinancialAccount> getAllFinancialAccounts() {
        return financialAccountRepository.findAll();
    }
    

    public FinancialAccount getFinancialAccountById(Long id) {
        return financialAccountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Compte financier non trouvé avec l'ID: " + id));
    }

    public FinancialAccount getFinancialAccountByAccountNumber(String accountNumber) {
        return financialAccountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new RuntimeException("Compte non trouvé avec le numéro: " + accountNumber));
    }
    

    public FinancialAccount createFinancialAccount(FinancialAccount financialAccount) {
        // Vérifier si le numéro de compte existe déjà
        if (financialAccountRepository.existsByAccountNumber(financialAccount.getAccountNumber())) {
            throw new RuntimeException("Un compte avec ce numéro existe déjà");
        }
        
        financialAccount.setCreatedAt(LocalDateTime.now());
        financialAccount.setUpdatedAt(LocalDateTime.now());
        
        return financialAccountRepository.save(financialAccount);
    }
    

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
    

    public void deleteFinancialAccount(Long id) {
        FinancialAccount financialAccount = getFinancialAccountById(id);
        
        // Vérifier que le solde est à zéro
        if (financialAccount.getBalance().compareTo(BigDecimal.ZERO) != 0) {
            throw new RuntimeException("Impossible de supprimer un compte avec un solde non nul");
        }
        
        financialAccountRepository.delete(financialAccount);
    }
    

    public FinancialAccount toggleActive(Long id) {
        FinancialAccount financialAccount = getFinancialAccountById(id);
        financialAccount.setActive(!financialAccount.getActive());
        financialAccount.setUpdatedAt(LocalDateTime.now());
        
        return financialAccountRepository.save(financialAccount);
    }
    
    public FinancialAccount updateBalance(Long id, BigDecimal amount, TransactionType transactionType) {
        FinancialAccount financialAccount = getFinancialAccountById(id);
        financialAccount.updateBalance(amount, transactionType);
        
        return financialAccountRepository.save(financialAccount);
    }
    
    public List<FinancialAccount> getActiveAccounts() {
        return financialAccountRepository.findByActiveTrue();
    }
    

    public List<FinancialAccount> getAccountsByType(AccountType accountType) {
        return financialAccountRepository.findByAccountType(accountType);
    }
    

    public List<FinancialAccount> getAccountsWithPositiveBalance() {
        return financialAccountRepository.findAccountsWithPositiveBalance();
    }
    

    public List<FinancialAccount> getAccountsWithNegativeBalance() {
        return financialAccountRepository.findAccountsWithNegativeBalance();
    }
    
    public BigDecimal getTotalBalance() {
        BigDecimal total = financialAccountRepository.getTotalBalance();
        return total != null ? total : BigDecimal.ZERO;
    }
    
    public BigDecimal getTotalBalanceByType(AccountType accountType) {
        BigDecimal total = financialAccountRepository.getTotalBalanceByType(accountType);
        return total != null ? total : BigDecimal.ZERO;
    }
    
    public List<FinancialAccount> searchAccountsByName(String accountName) {
        return financialAccountRepository.findByAccountNameContainingIgnoreCase(accountName);
    }
}