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
    
    /**
     * GET /api/purchase-documents - Tous les documents
     */
    @GetMapping
    public ResponseEntity<List<PurchaseDocument>> getAllPurchaseDocuments() {
        return ResponseEntity.ok(purchaseDocumentService.getAllPurchaseDocuments());
    }
    
    /**
     * GET /api/purchase-documents/{id} - Un document par ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<PurchaseDocument> getPurchaseDocumentById(@PathVariable Long id) {
        return ResponseEntity.ok(purchaseDocumentService.getPurchaseDocumentById(id));
    }
    
    /**
     * GET /api/purchase-documents/number/{documentNumber} - Un document par numéro
     */
    @GetMapping("/number/{documentNumber}")
    public ResponseEntity<PurchaseDocument> getPurchaseDocumentByDocumentNumber(@PathVariable String documentNumber) {
        return ResponseEntity.ok(purchaseDocumentService.getPurchaseDocumentByDocumentNumber(documentNumber));
    }
    
    /**
     * GET /api/purchase-documents/supplier/{supplierId} - Documents par fournisseur
     */
    @GetMapping("/supplier/{supplierId}")
    public ResponseEntity<List<PurchaseDocument>> getPurchaseDocumentsBySupplier(@PathVariable Long supplierId) {
        return ResponseEntity.ok(purchaseDocumentService.getPurchaseDocumentsBySupplier(supplierId));
    }
    
    /**
     * GET /api/purchase-documents/type/{type} - Documents par type
     */
    @GetMapping("/type/{type}")
    public ResponseEntity<List<PurchaseDocument>> getPurchaseDocumentsByType(@PathVariable PurchaseDocumentType type) {
        return ResponseEntity.ok(purchaseDocumentService.getPurchaseDocumentsByType(type));
    }
    
    /**
     * GET /api/purchase-documents/status/{status} - Documents par statut
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<List<PurchaseDocument>> getPurchaseDocumentsByStatus(@PathVariable String status) {
        return ResponseEntity.ok(purchaseDocumentService.getPurchaseDocumentsByStatus(status));
    }
    
    /**
     * GET /api/purchase-documents/stock-not-updated - Documents avec stock non mis à jour
     */
    @GetMapping("/stock-not-updated")
    public ResponseEntity<List<PurchaseDocument>> getDocumentsWithStockNotUpdated() {
        return ResponseEntity.ok(purchaseDocumentService.getDocumentsWithStockNotUpdated());
    }
    
    /**
     * GET /api/purchase-documents/overdue - Factures en retard
     */
    @GetMapping("/overdue")
    public ResponseEntity<List<PurchaseDocument>> getOverdueInvoices() {
        return ResponseEntity.ok(purchaseDocumentService.getOverdueInvoices());
    }
    
    /**
     * GET /api/purchase-documents/search?keyword=... - Recherche
     */
    @GetMapping("/search")
    public ResponseEntity<List<PurchaseDocument>> searchPurchaseDocuments(@RequestParam String keyword) {
        return ResponseEntity.ok(purchaseDocumentService.searchPurchaseDocuments(keyword));
    }
    
    /**
     * GET /api/purchase-documents/date-range?start=...&end=... - Documents par période
     */
    @GetMapping("/date-range")
    public ResponseEntity<List<PurchaseDocument>> getPurchaseDocumentsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end) {
        return ResponseEntity.ok(purchaseDocumentService.getPurchaseDocumentsByDateRange(start, end));
    }
    
    /**
     * POST /api/purchase-documents - Créer un document
     */
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
    
    /**
     * PUT /api/purchase-documents/{id} - Mettre à jour un document
     */
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
    
    /**
     * DELETE /api/purchase-documents/{id} - Supprimer un document
     */
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
    
    /**
     * PATCH /api/purchase-documents/{id}/update-stock - Mettre à jour le stock
     */
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
    
    /**
     * PATCH /api/purchase-documents/{id}/status - Changer le statut
     */
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