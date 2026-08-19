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
    
    @GetMapping
    public ResponseEntity<List<CustomerPriceAgreement>> getAllAgreements() {
        return ResponseEntity.ok(agreementService.getAllAgreements());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CustomerPriceAgreement> getAgreementById(@PathVariable Long id) {
        return ResponseEntity.ok(agreementService.getAgreementById(id));
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<CustomerPriceAgreement>> getAgreementsByCustomer(@PathVariable Long customerId) {
        return ResponseEntity.ok(agreementService.getAgreementsByCustomer(customerId));
    }
    
    @GetMapping("/product/{productId}")
    public ResponseEntity<List<CustomerPriceAgreement>> getAgreementsByProduct(@PathVariable Long productId) {
        return ResponseEntity.ok(agreementService.getAgreementsByProduct(productId));
    }
    
    @GetMapping("/customer/{customerId}/valid")
    public ResponseEntity<List<CustomerPriceAgreement>> getValidAgreementsForCustomer(@PathVariable Long customerId) {
        return ResponseEntity.ok(agreementService.getValidAgreementsForCustomer(customerId));
    }

    @GetMapping("/expired")
    public ResponseEntity<List<CustomerPriceAgreement>> getExpiredAgreements() {
        return ResponseEntity.ok(agreementService.getExpiredAgreements());
    }
    
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

    @GetMapping("/{id}/valid")
    public ResponseEntity<Map<String, Object>> isAgreementValid(@PathVariable Long id) {
        boolean valid = agreementService.isAgreementValid(id);
        
        Map<String, Object> response = new HashMap<>();
        response.put("valid", valid);
        
        return ResponseEntity.ok(response);
    }
    
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