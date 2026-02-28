package com.wino.demo.customer.controller;

import com.wino.demo.customer.entity.Customer;
import com.wino.demo.customer.entity.CustomerType;
import com.wino.demo.customer.service.CustomerService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/customers")
@CrossOrigin(origins = "*")
public class CustomerController {
    
    private final CustomerService customerService;
    
    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }
    
    /**
     * GET /api/customers - Tous les clients
     */
    @GetMapping
    public ResponseEntity<List<Customer>> getAllCustomers() {
        return ResponseEntity.ok(customerService.getAllCustomers());
    }
    
    /**
     * GET /api/customers/active - Clients actifs
     */
    @GetMapping("/active")
    public ResponseEntity<List<Customer>> getActiveCustomers() {
        return ResponseEntity.ok(customerService.getActiveCustomers());
    }
    
    /**
     * GET /api/customers/{id} - Un client par ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Customer> getCustomerById(@PathVariable Long id) {
        return ResponseEntity.ok(customerService.getCustomerById(id));
    }
    
    /**
     * GET /api/customers/code/{code} - Un client par code
     */
    @GetMapping("/code/{code}")
    public ResponseEntity<Customer> getCustomerByCode(@PathVariable String code) {
        return ResponseEntity.ok(customerService.getCustomerByCode(code));
    }
    
    /**
     * GET /api/customers/type/{type} - Clients par type
     */
    @GetMapping("/type/{type}")
    public ResponseEntity<List<Customer>> getCustomersByType(@PathVariable CustomerType type) {
        return ResponseEntity.ok(customerService.getCustomersByType(type));
    }
    
    /**
     * GET /api/customers/debt - Clients avec des dettes
     */
    @GetMapping("/debt")
    public ResponseEntity<List<Customer>> getCustomersWithDebt() {
        return ResponseEntity.ok(customerService.getCustomersWithDebt());
    }
    
    /**
     * GET /api/customers/exceeding-limit - Clients dépassant leur limite
     */
    @GetMapping("/exceeding-limit")
    public ResponseEntity<List<Customer>> getCustomersExceedingCreditLimit() {
        return ResponseEntity.ok(customerService.getCustomersExceedingCreditLimit());
    }
    
    /**
     * GET /api/customers/city/{city} - Clients par ville
     */
    @GetMapping("/city/{city}")
    public ResponseEntity<List<Customer>> getCustomersByCity(@PathVariable String city) {
        return ResponseEntity.ok(customerService.getCustomersByCity(city));
    }
    
    /**
     * GET /api/customers/search?keyword=... - Recherche
     */
    @GetMapping("/search")
    public ResponseEntity<List<Customer>> searchCustomers(@RequestParam String keyword) {
        return ResponseEntity.ok(customerService.searchCustomers(keyword));
    }
    
    /**
     * POST /api/customers - Créer un client
     */
    @PostMapping
    public ResponseEntity<Map<String, Object>> createCustomer(@RequestBody Customer customer) {
        try {
            Customer created = customerService.createCustomer(customer);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Client créé avec succès");
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
     * PUT /api/customers/{id} - Mettre à jour un client
     */
    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateCustomer(
            @PathVariable Long id, 
            @RequestBody Customer customer) {
        try {
            Customer updated = customerService.updateCustomer(id, customer);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Client mis à jour avec succès");
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
     * DELETE /api/customers/{id} - Supprimer un client
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteCustomer(@PathVariable Long id) {
        try {
            customerService.deleteCustomer(id);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Client supprimé avec succès");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    /**
     * PATCH /api/customers/{id}/deactivate - Désactiver un client
     */
    @PatchMapping("/{id}/deactivate")
    public ResponseEntity<Map<String, Object>> deactivateCustomer(@PathVariable Long id) {
        try {
            Customer customer = customerService.deactivateCustomer(id);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Client désactivé avec succès");
            response.put("data", customer);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    /**
     * PATCH /api/customers/{id}/activate - Activer un client
     */
    @PatchMapping("/{id}/activate")
    public ResponseEntity<Map<String, Object>> activateCustomer(@PathVariable Long id) {
        try {
            Customer customer = customerService.activateCustomer(id);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Client activé avec succès");
            response.put("data", customer);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    /**
     * PATCH /api/customers/{id}/balance - Mettre à jour le solde
     */
    @PatchMapping("/{id}/balance")
    public ResponseEntity<Map<String, Object>> updateBalance(
            @PathVariable Long id, 
            @RequestBody Map<String, BigDecimal> balanceData) {
        try {
            BigDecimal amount = balanceData.get("amount");
            if (amount == null) {
                throw new RuntimeException("Le montant est requis");
            }
            Customer customer = customerService.updateBalance(id, amount);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Solde mis à jour avec succès");
            response.put("data", customer);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
}