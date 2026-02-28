package com.wino.demo.finance.controller;

import com.wino.demo.finance.entity.AccountType;
import com.wino.demo.finance.entity.FinancialAccount;
import com.wino.demo.finance.entity.TransactionType;
import com.wino.demo.finance.service.FinancialAccountService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/financial-accounts")
@CrossOrigin(origins = "*")
public class FinancialAccountController {
    
    private final FinancialAccountService financialAccountService;
    
    public FinancialAccountController(FinancialAccountService financialAccountService) {
        this.financialAccountService = financialAccountService;
    }
    
    /**
     * GET /api/financial-accounts - Tous les comptes
     */
    @GetMapping
    public ResponseEntity<List<FinancialAccount>> getAllFinancialAccounts() {
        return ResponseEntity.ok(financialAccountService.getAllFinancialAccounts());
    }
    
    /**
     * GET /api/financial-accounts/{id} - Un compte par ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<FinancialAccount> getFinancialAccountById(@PathVariable Long id) {
        return ResponseEntity.ok(financialAccountService.getFinancialAccountById(id));
    }
    
    /**
     * GET /api/financial-accounts/number/{accountNumber} - Un compte par numéro
     */
    @GetMapping("/number/{accountNumber}")
    public ResponseEntity<FinancialAccount> getFinancialAccountByAccountNumber(@PathVariable String accountNumber) {
        return ResponseEntity.ok(financialAccountService.getFinancialAccountByAccountNumber(accountNumber));
    }
    
    /**
     * GET /api/financial-accounts/active - Comptes actifs
     */
    @GetMapping("/active")
    public ResponseEntity<List<FinancialAccount>> getActiveAccounts() {
        return ResponseEntity.ok(financialAccountService.getActiveAccounts());
    }
    
    /**
     * GET /api/financial-accounts/type/{type} - Comptes par type
     */
    @GetMapping("/type/{type}")
    public ResponseEntity<List<FinancialAccount>> getAccountsByType(@PathVariable AccountType type) {
        return ResponseEntity.ok(financialAccountService.getAccountsByType(type));
    }
    
    /**
     * GET /api/financial-accounts/positive-balance - Comptes avec solde positif
     */
    @GetMapping("/positive-balance")
    public ResponseEntity<List<FinancialAccount>> getAccountsWithPositiveBalance() {
        return ResponseEntity.ok(financialAccountService.getAccountsWithPositiveBalance());
    }
    
    /**
     * GET /api/financial-accounts/negative-balance - Comptes avec solde négatif
     */
    @GetMapping("/negative-balance")
    public ResponseEntity<List<FinancialAccount>> getAccountsWithNegativeBalance() {
        return ResponseEntity.ok(financialAccountService.getAccountsWithNegativeBalance());
    }
    
    /**
     * GET /api/financial-accounts/total-balance - Solde total
     */
    @GetMapping("/total-balance")
    public ResponseEntity<Map<String, Object>> getTotalBalance() {
        BigDecimal total = financialAccountService.getTotalBalance();
        
        Map<String, Object> response = new HashMap<>();
        response.put("totalBalance", total);
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * GET /api/financial-accounts/type/{type}/total-balance - Solde total par type
     */
    @GetMapping("/type/{type}/total-balance")
    public ResponseEntity<Map<String, Object>> getTotalBalanceByType(@PathVariable AccountType type) {
        BigDecimal total = financialAccountService.getTotalBalanceByType(type);
        
        Map<String, Object> response = new HashMap<>();
        response.put("accountType", type);
        response.put("totalBalance", total);
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * GET /api/financial-accounts/search?name=... - Recherche par nom
     */
    @GetMapping("/search")
    public ResponseEntity<List<FinancialAccount>> searchAccountsByName(@RequestParam String name) {
        return ResponseEntity.ok(financialAccountService.searchAccountsByName(name));
    }
    
    /**
     * POST /api/financial-accounts - Créer un compte
     */
    @PostMapping
    public ResponseEntity<Map<String, Object>> createFinancialAccount(@RequestBody FinancialAccount financialAccount) {
        try {
            FinancialAccount created = financialAccountService.createFinancialAccount(financialAccount);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Compte financier créé avec succès");
            response.put("data", created);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    /**
     * PUT /api/financial-accounts/{id} - Mettre à jour un compte
     */
    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateFinancialAccount(
            @PathVariable Long id, 
            @RequestBody FinancialAccount financialAccount) {
        try {
            FinancialAccount updated = financialAccountService.updateFinancialAccount(id, financialAccount);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Compte financier mis à jour avec succès");
            response.put("data", updated);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    /**
     * DELETE /api/financial-accounts/{id} - Supprimer un compte
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteFinancialAccount(@PathVariable Long id) {
        try {
            financialAccountService.deleteFinancialAccount(id);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Compte financier supprimé avec succès");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    /**
     * PATCH /api/financial-accounts/{id}/toggle-active - Activer/Désactiver un compte
     */
    @PatchMapping("/{id}/toggle-active")
    public ResponseEntity<Map<String, Object>> toggleActive(@PathVariable Long id) {
        try {
            FinancialAccount updated = financialAccountService.toggleActive(id);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Statut du compte modifié avec succès");
            response.put("data", updated);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    /**
     * PATCH /api/financial-accounts/{id}/update-balance - Mettre à jour le solde
     */
    @PatchMapping("/{id}/update-balance")
    public ResponseEntity<Map<String, Object>> updateBalance(
            @PathVariable Long id,
            @RequestBody Map<String, Object> balanceData) {
        try {
            BigDecimal amount = new BigDecimal(balanceData.get("amount").toString());
            TransactionType transactionType = TransactionType.valueOf(balanceData.get("transactionType").toString());
            
            FinancialAccount updated = financialAccountService.updateBalance(id, amount, transactionType);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Solde mis à jour avec succès");
            response.put("data", updated);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
}