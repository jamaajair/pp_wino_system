package com.wino.demo.finance.controller;

import com.wino.demo.finance.entity.FinancialTransaction;
import com.wino.demo.finance.entity.TransactionType;
import com.wino.demo.finance.service.FinancialTransactionService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/financial-transactions")
@CrossOrigin(origins = "*")
public class FinancialTransactionController {
    
    private final FinancialTransactionService financialTransactionService;
    
    public FinancialTransactionController(FinancialTransactionService financialTransactionService) {
        this.financialTransactionService = financialTransactionService;
    }
    
    /**
     * GET /api/financial-transactions - Toutes les transactions
     */
    @GetMapping
    public ResponseEntity<List<FinancialTransaction>> getAllFinancialTransactions() {
        return ResponseEntity.ok(financialTransactionService.getAllFinancialTransactions());
    }
    
    /**
     * GET /api/financial-transactions/{id} - Une transaction par ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<FinancialTransaction> getFinancialTransactionById(@PathVariable Long id) {
        return ResponseEntity.ok(financialTransactionService.getFinancialTransactionById(id));
    }
    
    /**
     * GET /api/financial-transactions/number/{transactionNumber} - Une transaction par numéro
     */
    @GetMapping("/number/{transactionNumber}")
    public ResponseEntity<FinancialTransaction> getFinancialTransactionByTransactionNumber(@PathVariable String transactionNumber) {
        return ResponseEntity.ok(financialTransactionService.getFinancialTransactionByTransactionNumber(transactionNumber));
    }
    
    /**
     * GET /api/financial-transactions/account/{accountId} - Transactions par compte
     */
    @GetMapping("/account/{accountId}")
    public ResponseEntity<List<FinancialTransaction>> getTransactionsByAccount(@PathVariable Long accountId) {
        return ResponseEntity.ok(financialTransactionService.getTransactionsByAccount(accountId));
    }
    
    /**
     * GET /api/financial-transactions/type/{type} - Transactions par type
     */
    @GetMapping("/type/{type}")
    public ResponseEntity<List<FinancialTransaction>> getTransactionsByType(@PathVariable TransactionType type) {
        return ResponseEntity.ok(financialTransactionService.getTransactionsByType(type));
    }
    
    /**
     * GET /api/financial-transactions/creator/{userId} - Transactions par créateur
     */
    @GetMapping("/creator/{userId}")
    public ResponseEntity<List<FinancialTransaction>> getTransactionsByCreator(@PathVariable Long userId) {
        return ResponseEntity.ok(financialTransactionService.getTransactionsByCreator(userId));
    }
    
    /**
     * GET /api/financial-transactions/validator/{userId} - Transactions par validateur
     */
    @GetMapping("/validator/{userId}")
    public ResponseEntity<List<FinancialTransaction>> getTransactionsByValidator(@PathVariable Long userId) {
        return ResponseEntity.ok(financialTransactionService.getTransactionsByValidator(userId));
    }
    
    /**
     * GET /api/financial-transactions/applied - Transactions appliquées
     */
    @GetMapping("/applied")
    public ResponseEntity<List<FinancialTransaction>> getAppliedTransactions() {
        return ResponseEntity.ok(financialTransactionService.getAppliedTransactions());
    }
    
    /**
     * GET /api/financial-transactions/pending - Transactions en attente
     */
    @GetMapping("/pending")
    public ResponseEntity<List<FinancialTransaction>> getPendingTransactions() {
        return ResponseEntity.ok(financialTransactionService.getPendingTransactions());
    }
    
    /**
     * GET /api/financial-transactions/date-range?start=...&end=... - Transactions par période
     */
    @GetMapping("/date-range")
    public ResponseEntity<List<FinancialTransaction>> getTransactionsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end) {
        return ResponseEntity.ok(financialTransactionService.getTransactionsByDateRange(start, end));
    }
    
    /**
     * GET /api/financial-transactions/category/{category} - Transactions par catégorie
     */
    @GetMapping("/category/{category}")
    public ResponseEntity<List<FinancialTransaction>> getTransactionsByCategory(@PathVariable String category) {
        return ResponseEntity.ok(financialTransactionService.getTransactionsByCategory(category));
    }
    
    /**
     * GET /api/financial-transactions/account/{accountId}/total - Total des transactions d'un compte
     */
    @GetMapping("/account/{accountId}/total")
    public ResponseEntity<Map<String, Object>> getTotalTransactionsByAccount(@PathVariable Long accountId) {
        BigDecimal total = financialTransactionService.getTotalTransactionsByAccount(accountId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("accountId", accountId);
        response.put("totalTransactions", total);
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * GET /api/financial-transactions/type/{type}/total - Total des transactions par type
     */
    @GetMapping("/type/{type}/total")
    public ResponseEntity<Map<String, Object>> getTotalTransactionsByType(@PathVariable TransactionType type) {
        BigDecimal total = financialTransactionService.getTotalTransactionsByType(type);
        
        Map<String, Object> response = new HashMap<>();
        response.put("transactionType", type);
        response.put("totalTransactions", total);
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * GET /api/financial-transactions/search?reference=... - Recherche par référence
     */
    @GetMapping("/search")
    public ResponseEntity<List<FinancialTransaction>> searchByReference(@RequestParam String reference) {
        return ResponseEntity.ok(financialTransactionService.searchByReference(reference));
    }
    
    /**
     * POST /api/financial-transactions - Créer une transaction
     */
    @PostMapping
    public ResponseEntity<Map<String, Object>> createFinancialTransaction(@RequestBody FinancialTransaction financialTransaction) {
        try {
            FinancialTransaction created = financialTransactionService.createFinancialTransaction(financialTransaction);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Transaction financière créée avec succès");
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
     * PUT /api/financial-transactions/{id} - Mettre à jour une transaction
     */
    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateFinancialTransaction(
            @PathVariable Long id, 
            @RequestBody FinancialTransaction financialTransaction) {
        try {
            FinancialTransaction updated = financialTransactionService.updateFinancialTransaction(id, financialTransaction);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Transaction financière mise à jour avec succès");
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
     * DELETE /api/financial-transactions/{id} - Supprimer une transaction
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteFinancialTransaction(@PathVariable Long id) {
        try {
            financialTransactionService.deleteFinancialTransaction(id);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Transaction financière supprimée avec succès");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    /**
     * PATCH /api/financial-transactions/{id}/apply - Appliquer une transaction
     */
    @PatchMapping("/{id}/apply")
    public ResponseEntity<Map<String, Object>> applyTransaction(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, Long> validatorData) {
        try {
            Long validatedByUserId = validatorData != null ? validatorData.get("validatedByUserId") : null;
            FinancialTransaction applied = financialTransactionService.applyTransaction(id, validatedByUserId);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Transaction appliquée avec succès");
            response.put("data", applied);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    /**
     * PATCH /api/financial-transactions/{id}/reverse - Annuler une transaction
     */
    @PatchMapping("/{id}/reverse")
    public ResponseEntity<Map<String, Object>> reverseTransaction(@PathVariable Long id) {
        try {
            FinancialTransaction reversed = financialTransactionService.reverseTransaction(id);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Transaction annulée avec succès");
            response.put("data", reversed);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
}