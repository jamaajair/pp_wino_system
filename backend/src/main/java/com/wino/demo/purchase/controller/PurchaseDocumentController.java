package com.wino.demo.purchase.controller;

import com.wino.demo.purchase.entity.PurchaseDocument;
import com.wino.demo.purchase.entity.PurchaseDocumentType;
import com.wino.demo.purchase.service.PurchaseDocumentService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/purchase-documents")
@CrossOrigin(origins = "*")
public class PurchaseDocumentController {
    
    private final PurchaseDocumentService purchaseDocumentService;
    
    public PurchaseDocumentController(PurchaseDocumentService purchaseDocumentService) {
        this.purchaseDocumentService = purchaseDocumentService;
    }
    
    @GetMapping
    public ResponseEntity<List<PurchaseDocument>> getAllPurchaseDocuments() {
        return ResponseEntity.ok(purchaseDocumentService.getAllPurchaseDocuments());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<PurchaseDocument> getPurchaseDocumentById(@PathVariable Long id) {
        return ResponseEntity.ok(purchaseDocumentService.getPurchaseDocumentById(id));
    }

    @GetMapping("/number/{documentNumber}")
    public ResponseEntity<PurchaseDocument> getPurchaseDocumentByDocumentNumber(@PathVariable String documentNumber) {
        return ResponseEntity.ok(purchaseDocumentService.getPurchaseDocumentByDocumentNumber(documentNumber));
    }

    @GetMapping("/supplier/{supplierId}")
    public ResponseEntity<List<PurchaseDocument>> getPurchaseDocumentsBySupplier(@PathVariable Long supplierId) {
        return ResponseEntity.ok(purchaseDocumentService.getPurchaseDocumentsBySupplier(supplierId));
    }
    
    @GetMapping("/type/{type}")
    public ResponseEntity<List<PurchaseDocument>> getPurchaseDocumentsByType(@PathVariable PurchaseDocumentType type) {
        return ResponseEntity.ok(purchaseDocumentService.getPurchaseDocumentsByType(type));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<PurchaseDocument>> getPurchaseDocumentsByStatus(@PathVariable String status) {
        return ResponseEntity.ok(purchaseDocumentService.getPurchaseDocumentsByStatus(status));
    }

    @GetMapping("/stock-not-updated")
    public ResponseEntity<List<PurchaseDocument>> getDocumentsWithStockNotUpdated() {
        return ResponseEntity.ok(purchaseDocumentService.getDocumentsWithStockNotUpdated());
    }

    @GetMapping("/overdue")
    public ResponseEntity<List<PurchaseDocument>> getOverdueInvoices() {
        return ResponseEntity.ok(purchaseDocumentService.getOverdueInvoices());
    }

    @GetMapping("/search")
    public ResponseEntity<List<PurchaseDocument>> searchPurchaseDocuments(@RequestParam String keyword) {
        return ResponseEntity.ok(purchaseDocumentService.searchPurchaseDocuments(keyword));
    }
    
    @GetMapping("/date-range")
    public ResponseEntity<List<PurchaseDocument>> getPurchaseDocumentsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end) {
        return ResponseEntity.ok(purchaseDocumentService.getPurchaseDocumentsByDateRange(start, end));
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createPurchaseDocument(@RequestBody PurchaseDocument purchaseDocument) {
        try {
            PurchaseDocument created = purchaseDocumentService.createPurchaseDocument(purchaseDocument);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Document d'achat créé avec succès");
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
    public ResponseEntity<Map<String, Object>> updatePurchaseDocument(
            @PathVariable Long id, 
            @RequestBody PurchaseDocument purchaseDocument) {
        try {
            PurchaseDocument updated = purchaseDocumentService.updatePurchaseDocument(id, purchaseDocument);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Document d'achat mis à jour avec succès");
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
    public ResponseEntity<Map<String, Object>> deletePurchaseDocument(@PathVariable Long id) {
        try {
            purchaseDocumentService.deletePurchaseDocument(id);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Document d'achat supprimé avec succès");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @PatchMapping("/{id}/update-stock")
    public ResponseEntity<Map<String, Object>> updateStockFromDocument(@PathVariable Long id) {
        try {
            PurchaseDocument updated = purchaseDocumentService.updateStockFromDocument(id);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Stock mis à jour avec succès");
            response.put("data", updated);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Map<String, Object>> changeStatus(
            @PathVariable Long id, 
            @RequestBody Map<String, String> statusData) {
        try {
            String newStatus = statusData.get("status");
            PurchaseDocument updated = purchaseDocumentService.changeStatus(id, newStatus);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Statut mis à jour avec succès");
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