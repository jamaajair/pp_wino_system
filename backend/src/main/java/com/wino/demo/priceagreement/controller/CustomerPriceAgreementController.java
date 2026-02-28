package com.wino.demo.priceagreement.controller;

import com.wino.demo.priceagreement.entity.CustomerPriceAgreement;
import com.wino.demo.priceagreement.service.CustomerPriceAgreementService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/price-agreements")
@CrossOrigin(origins = "*")
public class CustomerPriceAgreementController {
    
    private final CustomerPriceAgreementService agreementService;
    
    public CustomerPriceAgreementController(CustomerPriceAgreementService agreementService) {
        this.agreementService = agreementService;
    }
    
    /**
     * GET /api/price-agreements - Tous les accords
     */
    @GetMapping
    public ResponseEntity<List<CustomerPriceAgreement>> getAllAgreements() {
        return ResponseEntity.ok(agreementService.getAllAgreements());
    }
    
    /**
     * GET /api/price-agreements/{id} - Un accord par ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<CustomerPriceAgreement> getAgreementById(@PathVariable Long id) {
        return ResponseEntity.ok(agreementService.getAgreementById(id));
    }
    
    /**
     * GET /api/price-agreements/customer/{customerId} - Accords par client
     */
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<CustomerPriceAgreement>> getAgreementsByCustomer(@PathVariable Long customerId) {
        return ResponseEntity.ok(agreementService.getAgreementsByCustomer(customerId));
    }
    
    /**
     * GET /api/price-agreements/product/{productId} - Accords par produit
     */
    @GetMapping("/product/{productId}")
    public ResponseEntity<List<CustomerPriceAgreement>> getAgreementsByProduct(@PathVariable Long productId) {
        return ResponseEntity.ok(agreementService.getAgreementsByProduct(productId));
    }
    
    /**
     * GET /api/price-agreements/customer/{customerId}/valid - Accords valides pour un client
     */
    @GetMapping("/customer/{customerId}/valid")
    public ResponseEntity<List<CustomerPriceAgreement>> getValidAgreementsForCustomer(@PathVariable Long customerId) {
        return ResponseEntity.ok(agreementService.getValidAgreementsForCustomer(customerId));
    }
    
    /**
     * GET /api/price-agreements/expired - Accords expirés
     */
    @GetMapping("/expired")
    public ResponseEntity<List<CustomerPriceAgreement>> getExpiredAgreements() {
        return ResponseEntity.ok(agreementService.getExpiredAgreements());
    }
    
    /**
     * GET /api/price-agreements/special-price?customerId=...&productId=... - Obtenir le prix spécial
     */
    @GetMapping("/special-price")
    public ResponseEntity<Map<String, Object>> getSpecialPrice(
            @RequestParam Long customerId, 
            @RequestParam Long productId) {
        Optional<BigDecimal> specialPrice = agreementService.getSpecialPrice(customerId, productId);
        
        Map<String, Object> response = new HashMap<>();
        if (specialPrice.isPresent()) {
            response.put("hasSpecialPrice", true);
            response.put("specialPrice", specialPrice.get());
        } else {
            response.put("hasSpecialPrice", false);
            response.put("specialPrice", null);
        }
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * GET /api/price-agreements/{id}/valid - Vérifier si un accord est valide
     */
    @GetMapping("/{id}/valid")
    public ResponseEntity<Map<String, Object>> isAgreementValid(@PathVariable Long id) {
        boolean valid = agreementService.isAgreementValid(id);
        
        Map<String, Object> response = new HashMap<>();
        response.put("valid", valid);
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * POST /api/price-agreements - Créer un accord
     */
    @PostMapping
    public ResponseEntity<Map<String, Object>> createAgreement(@RequestBody CustomerPriceAgreement agreement) {
        try {
            CustomerPriceAgreement created = agreementService.createAgreement(agreement);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Accord de prix créé avec succès");
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
     * PUT /api/price-agreements/{id} - Mettre à jour un accord
     */
    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateAgreement(
            @PathVariable Long id, 
            @RequestBody CustomerPriceAgreement agreement) {
        try {
            CustomerPriceAgreement updated = agreementService.updateAgreement(id, agreement);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Accord de prix mis à jour avec succès");
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
     * DELETE /api/price-agreements/{id} - Supprimer un accord
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteAgreement(@PathVariable Long id) {
        try {
            agreementService.deleteAgreement(id);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Accord de prix supprimé avec succès");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
}