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
    
    @GetMapping
    public ResponseEntity<List<FinancialTransaction>> getAllFinancialTransactions() {
        return ResponseEntity.ok(financialTransactionService.getAllFinancialTransactions());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<FinancialTransaction> getFinancialTransactionById(@PathVariable Long id) {
        return ResponseEntity.ok(financialTransactionService.getFinancialTransactionById(id));
    }
    
    @GetMapping("/number/{transactionNumber}")
    public ResponseEntity<FinancialTransaction> getFinancialTransactionByTransactionNumber(@PathVariable String transactionNumber) {
        return ResponseEntity.ok(financialTransactionService.getFinancialTransactionByTransactionNumber(transactionNumber));
    }

    @GetMapping("/account/{accountId}")
    public ResponseEntity<List<FinancialTransaction>> getTransactionsByAccount(@PathVariable Long accountId) {
        return ResponseEntity.ok(financialTransactionService.getTransactionsByAccount(accountId));
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<FinancialTransaction>> getTransactionsByType(@PathVariable TransactionType type) {
        return ResponseEntity.ok(financialTransactionService.getTransactionsByType(type));
    }

    @GetMapping("/creator/{userId}")
    public ResponseEntity<List<FinancialTransaction>> getTransactionsByCreator(@PathVariable Long userId) {
        return ResponseEntity.ok(financialTransactionService.getTransactionsByCreator(userId));
    }

    @GetMapping("/validator/{userId}")
    public ResponseEntity<List<FinancialTransaction>> getTransactionsByValidator(@PathVariable Long userId) {
        return ResponseEntity.ok(financialTransactionService.getTransactionsByValidator(userId));
    }

    @GetMapping("/applied")
    public ResponseEntity<List<FinancialTransaction>> getAppliedTransactions() {
        return ResponseEntity.ok(financialTransactionService.getAppliedTransactions());
    }

    @GetMapping("/pending")
    public ResponseEntity<List<FinancialTransaction>> getPendingTransactions() {
        return ResponseEntity.ok(financialTransactionService.getPendingTransactions());
    }

    @GetMapping("/date-range")
    public ResponseEntity<List<FinancialTransaction>> getTransactionsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end) {
        return ResponseEntity.ok(financialTransactionService.getTransactionsByDateRange(start, end));
    }
    
    @GetMapping("/category/{category}")
    public ResponseEntity<List<FinancialTransaction>> getTransactionsByCategory(@PathVariable String category) {
        return ResponseEntity.ok(financialTransactionService.getTransactionsByCategory(category));
    }

    @GetMapping("/account/{accountId}/total")
    public ResponseEntity<Map<String, Object>> getTotalTransactionsByAccount(@PathVariable Long accountId) {
        BigDecimal total = financialTransactionService.getTotalTransactionsByAccount(accountId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("accountId", accountId);
        response.put("totalTransactions", total);
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/type/{type}/total")
    public ResponseEntity<Map<String, Object>> getTotalTransactionsByType(@PathVariable TransactionType type) {
        BigDecimal total = financialTransactionService.getTotalTransactionsByType(type);
        
        Map<String, Object> response = new HashMap<>();
        response.put("transactionType", type);
        response.put("totalTransactions", total);
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<FinancialTransaction>> searchByReference(@RequestParam String reference) {
        return ResponseEntity.ok(financialTransactionService.searchByReference(reference));
    }
    
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