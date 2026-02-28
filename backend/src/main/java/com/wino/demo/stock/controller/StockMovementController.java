package com.wino.demo.stock.controller;

import com.wino.demo.stock.entity.MovementType;
import com.wino.demo.stock.entity.StockMovement;
import com.wino.demo.stock.service.StockMovementService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/stock-movements")
@CrossOrigin(origins = "*")
public class StockMovementController {
    
    private final StockMovementService stockMovementService;
    
    public StockMovementController(StockMovementService stockMovementService) {
        this.stockMovementService = stockMovementService;
    }
    
    /**
     * GET /api/stock-movements - Tous les mouvements
     */
    @GetMapping
    public ResponseEntity<List<StockMovement>> getAllStockMovements() {
        return ResponseEntity.ok(stockMovementService.getAllStockMovements());
    }
    
    /**
     * GET /api/stock-movements/{id} - Un mouvement par ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<StockMovement> getStockMovementById(@PathVariable Long id) {
        return ResponseEntity.ok(stockMovementService.getStockMovementById(id));
    }
    
    /**
     * GET /api/stock-movements/product/{productId} - Mouvements par produit
     */
    @GetMapping("/product/{productId}")
    public ResponseEntity<List<StockMovement>> getStockMovementsByProduct(@PathVariable Long productId) {
        return ResponseEntity.ok(stockMovementService.getStockMovementsByProduct(productId));
    }
    
    /**
     * GET /api/stock-movements/type/{type} - Mouvements par type
     */
    @GetMapping("/type/{type}")
    public ResponseEntity<List<StockMovement>> getStockMovementsByType(@PathVariable MovementType type) {
        return ResponseEntity.ok(stockMovementService.getStockMovementsByType(type));
    }
    
    /**
     * GET /api/stock-movements/recent - Mouvements récents
     */
    @GetMapping("/recent")
    public ResponseEntity<List<StockMovement>> getRecentStockMovements() {
        return ResponseEntity.ok(stockMovementService.getRecentStockMovements());
    }
    
    /**
     * GET /api/stock-movements/date-range?start=...&end=... - Mouvements par période
     */
    @GetMapping("/date-range")
    public ResponseEntity<List<StockMovement>> getStockMovementsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        return ResponseEntity.ok(stockMovementService.getStockMovementsByDateRange(start, end));
    }
    
    /**
     * POST /api/stock-movements - Créer un mouvement
     */
    @PostMapping
    public ResponseEntity<Map<String, Object>> createStockMovement(@RequestBody StockMovement stockMovement) {
        try {
            StockMovement created = stockMovementService.createStockMovement(stockMovement);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Mouvement de stock créé avec succès");
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
     * POST /api/stock-movements/in - Entrée de stock
     */
    @PostMapping("/in")
    public ResponseEntity<Map<String, Object>> stockIn(@RequestBody Map<String, Object> data) {
        try {
            Long productId = Long.valueOf(data.get("productId").toString());
            Integer quantity = Integer.valueOf(data.get("quantity").toString());
            String reason = (String) data.get("reason");
            String reference = (String) data.get("reference");
            
            StockMovement created = stockMovementService.stockIn(productId, quantity, reason, reference);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Entrée de stock effectuée");
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
     * POST /api/stock-movements/out - Sortie de stock
     */
    @PostMapping("/out")
    public ResponseEntity<Map<String, Object>> stockOut(@RequestBody Map<String, Object> data) {
        try {
            Long productId = Long.valueOf(data.get("productId").toString());
            Integer quantity = Integer.valueOf(data.get("quantity").toString());
            String reason = (String) data.get("reason");
            String reference = (String) data.get("reference");
            
            StockMovement created = stockMovementService.stockOut(productId, quantity, reason, reference);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Sortie de stock effectuée");
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
     * POST /api/stock-movements/adjust - Ajustement de stock
     */
    @PostMapping("/adjust")
    public ResponseEntity<Map<String, Object>> adjustStock(@RequestBody Map<String, Object> data) {
        try {
            Long productId = Long.valueOf(data.get("productId").toString());
            Integer quantity = Integer.valueOf(data.get("quantity").toString());
            String reason = (String) data.get("reason");
            
            StockMovement created = stockMovementService.adjustStock(productId, quantity, reason);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Ajustement de stock effectué");
            response.put("data", created);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
}