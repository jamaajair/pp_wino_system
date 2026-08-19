package com.wino.demo.supplier.controller;

import com.wino.demo.supplier.entity.Supplier;
import com.wino.demo.supplier.service.SupplierService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/suppliers")
@CrossOrigin(origins = "*")
public class SupplierController {
    
    private final SupplierService supplierService;
    
    public SupplierController(SupplierService supplierService) {
        this.supplierService = supplierService;
    }

    @GetMapping
    public ResponseEntity<List<Supplier>> getAllSuppliers() {
        return ResponseEntity.ok(supplierService.getAllSuppliers());
    }

    @GetMapping("/active")
    public ResponseEntity<List<Supplier>> getActiveSuppliers() {
        return ResponseEntity.ok(supplierService.getActiveSuppliers());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Supplier> getSupplierById(@PathVariable Long id) {
        return ResponseEntity.ok(supplierService.getSupplierById(id));
    }
    
    @GetMapping("/code/{code}")
    public ResponseEntity<Supplier> getSupplierByCode(@PathVariable String code) {
        return ResponseEntity.ok(supplierService.getSupplierByCode(code));
    }

    @GetMapping("/city/{city}")
    public ResponseEntity<List<Supplier>> getSuppliersByCity(@PathVariable String city) {
        return ResponseEntity.ok(supplierService.getSuppliersByCity(city));
    }

    @GetMapping("/country/{country}")
    public ResponseEntity<List<Supplier>> getSuppliersByCountry(@PathVariable String country) {
        return ResponseEntity.ok(supplierService.getSuppliersByCountry(country));
    }

    @GetMapping("/payment-terms/{days}")
    public ResponseEntity<List<Supplier>> getSuppliersByPaymentTerms(@PathVariable Integer days) {
        return ResponseEntity.ok(supplierService.getSuppliersByPaymentTerms(days));
    }

    @GetMapping("/search")
    public ResponseEntity<List<Supplier>> searchSuppliers(@RequestParam String keyword) {
        return ResponseEntity.ok(supplierService.searchSuppliers(keyword));
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createSupplier(@RequestBody Supplier supplier) {
        try {
            Supplier created = supplierService.createSupplier(supplier);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Fournisseur créé avec succès");
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
    public ResponseEntity<Map<String, Object>> updateSupplier(
            @PathVariable Long id, 
            @RequestBody Supplier supplier) {
        try {
            Supplier updated = supplierService.updateSupplier(id, supplier);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Fournisseur mis à jour avec succès");
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
    public ResponseEntity<Map<String, Object>> deleteSupplier(@PathVariable Long id) {
        try {
            supplierService.deleteSupplier(id);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Fournisseur supprimé avec succès");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    @PatchMapping("/{id}/deactivate")
    public ResponseEntity<Map<String, Object>> deactivateSupplier(@PathVariable Long id) {
        try {
            Supplier supplier = supplierService.deactivateSupplier(id);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Fournisseur désactivé avec succès");
            response.put("data", supplier);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @PatchMapping("/{id}/activate")
    public ResponseEntity<Map<String, Object>> activateSupplier(@PathVariable Long id) {
        try {
            Supplier supplier = supplierService.activateSupplier(id);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Fournisseur activé avec succès");
            response.put("data", supplier);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
}