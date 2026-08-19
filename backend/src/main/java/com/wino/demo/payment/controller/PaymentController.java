package com.wino.demo.payment.controller;

import com.wino.demo.payment.entity.Payment;
import com.wino.demo.payment.entity.PaymentType;
import com.wino.demo.payment.service.PaymentService;
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
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*")
public class PaymentController {
    
    private final PaymentService paymentService;
    
    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @GetMapping
    public ResponseEntity<List<Payment>> getAllPayments() {
        return ResponseEntity.ok(paymentService.getAllPayments());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Payment> getPaymentById(@PathVariable Long id) {
        return ResponseEntity.ok(paymentService.getPaymentById(id));
    }

    @GetMapping("/number/{paymentNumber}")
    public ResponseEntity<Payment> getPaymentByPaymentNumber(@PathVariable String paymentNumber) {
        return ResponseEntity.ok(paymentService.getPaymentByPaymentNumber(paymentNumber));
    }
    
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<Payment>> getPaymentsByCustomer(@PathVariable Long customerId) {
        return ResponseEntity.ok(paymentService.getPaymentsByCustomer(customerId));
    }
    
    @GetMapping("/type/{type}")
    public ResponseEntity<List<Payment>> getPaymentsByType(@PathVariable PaymentType type) {
        return ResponseEntity.ok(paymentService.getPaymentsByType(type));
    }
    
    @GetMapping("/validated")
    public ResponseEntity<List<Payment>> getValidatedPayments() {
        return ResponseEntity.ok(paymentService.getValidatedPayments());
    }

    @GetMapping("/pending")
    public ResponseEntity<List<Payment>> getPendingPayments() {
        return ResponseEntity.ok(paymentService.getPendingPayments());
    }
    
    @GetMapping("/date-range")
    public ResponseEntity<List<Payment>> getPaymentsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end) {
        return ResponseEntity.ok(paymentService.getPaymentsByDateRange(start, end));
    }

    @GetMapping("/customer/{customerId}/total")
    public ResponseEntity<Map<String, Object>> getTotalPaymentsByCustomer(@PathVariable Long customerId) {
        BigDecimal total = paymentService.getTotalPaymentsByCustomer(customerId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("customerId", customerId);
        response.put("totalPayments", total);
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/type/{type}/total")
    public ResponseEntity<Map<String, Object>> getTotalPaymentsByType(@PathVariable PaymentType type) {
        BigDecimal total = paymentService.getTotalPaymentsByType(type);
        
        Map<String, Object> response = new HashMap<>();
        response.put("paymentType", type);
        response.put("totalPayments", total);
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<Payment>> searchByReference(@RequestParam String reference) {
        return ResponseEntity.ok(paymentService.searchByReference(reference));
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createPayment(@RequestBody Payment payment) {
        try {
            Payment created = paymentService.createPayment(payment);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Paiement créé avec succès");
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
    public ResponseEntity<Map<String, Object>> updatePayment(
            @PathVariable Long id, 
            @RequestBody Payment payment) {
        try {
            Payment updated = paymentService.updatePayment(id, payment);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Paiement mis à jour avec succès");
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
    public ResponseEntity<Map<String, Object>> deletePayment(@PathVariable Long id) {
        try {
            paymentService.deletePayment(id);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Paiement supprimé avec succès");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @PatchMapping("/{id}/validate")
    public ResponseEntity<Map<String, Object>> validatePayment(@PathVariable Long id) {
        try {
            Payment validated = paymentService.validatePayment(id);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Paiement validé avec succès");
            response.put("data", validated);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
}