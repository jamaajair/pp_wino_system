package com.wino.demo.stock.service;

import com.wino.demo.stock.entity.MovementType;
import com.wino.demo.stock.entity.StockMovement;
import com.wino.demo.stock.repository.StockMovementRepository;
import com.wino.demo.products.entity.Product;
import com.wino.demo.products.service.ProductService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class StockMovementService {
    
    private final StockMovementRepository stockMovementRepository;
    private final ProductService productService;
    
    public StockMovementService(StockMovementRepository stockMovementRepository,
                                ProductService productService) {
        this.stockMovementRepository = stockMovementRepository;
        this.productService = productService;
    }

    public List<StockMovement> getAllStockMovements() {
        return stockMovementRepository.findAll();
    }

    public StockMovement getStockMovementById(Long id) {
        return stockMovementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Mouvement de stock non trouvé avec l'ID: " + id));
    }

    public StockMovement createStockMovement(StockMovement stockMovement) {
        // Valider le produit
        if (stockMovement.getProduct() != null && stockMovement.getProduct().getId() != null) {
            stockMovement.setProduct(productService.getProductById(stockMovement.getProduct().getId()));
        } else {
            throw new RuntimeException("Le produit est requis");
        }
        
        // Valider la quantité
        if (stockMovement.getQuantity() == null || stockMovement.getQuantity() <= 0) {
            throw new RuntimeException("La quantité doit être positive");
        }
        
        // Sauvegarder le mouvement
        StockMovement saved = stockMovementRepository.save(stockMovement);
        
        // Appliquer le mouvement au stock
        saved.apply();
        
        // Mettre à jour le produit
        productService.updateProduct(saved.getProduct().getId(), saved.getProduct());
        
        return saved;
    }

    public List<StockMovement> getStockMovementsByProduct(Long productId) {
        return stockMovementRepository.findByProductId(productId);
    }

    public List<StockMovement> getStockMovementsByType(MovementType type) {
        return stockMovementRepository.findByType(type);
    }
    
    public List<StockMovement> getStockMovementsByDateRange(LocalDateTime start, LocalDateTime end) {
        return stockMovementRepository.findByCreatedAtBetween(start, end);
    }

    public List<StockMovement> getRecentStockMovements() {
        return stockMovementRepository.findRecentMovements();
    }

    public StockMovement stockIn(Long productId, Integer quantity, String reason, String reference) {
        StockMovement movement = new StockMovement();
        movement.setProduct(productService.getProductById(productId));
        movement.setType(MovementType.IN);
        movement.setQuantity(quantity);
        movement.setReason(reason);
        movement.setReferenceDocument(reference);
        
        return createStockMovement(movement);
    }

    public StockMovement stockOut(Long productId, Integer quantity, String reason, String reference) {
        StockMovement movement = new StockMovement();
        movement.setProduct(productService.getProductById(productId));
        movement.setType(MovementType.OUT);
        movement.setQuantity(quantity);
        movement.setReason(reason);
        movement.setReferenceDocument(reference);
        
        return createStockMovement(movement);
    }

    public int stockOutForSale(Long productId, int quantity, String reason, String reference) {
        Product product = productService.getProductById(productId);

        int available = Math.max(product.getStockQuantity() == null ? 0 : product.getStockQuantity(), 0);
        int applied = Math.min(quantity, available);
        int shortage = quantity - applied;

        // Rien de disponible : pas de mouvement à zéro, createStockMovement le refuserait.
        if (applied > 0) {
            StockMovement movement = new StockMovement();
            movement.setProduct(product);
            movement.setType(MovementType.OUT);
            movement.setQuantity(applied);
            movement.setReason(shortage > 0
                    ? reason + " (rupture : " + shortage + " non décomptés)"
                    : reason);
            movement.setReferenceDocument(reference);
            createStockMovement(movement);
        }

        return shortage;
    }

    public StockMovement adjustStock(Long productId, Integer quantity, String reason) {
        StockMovement movement = new StockMovement();
        movement.setProduct(productService.getProductById(productId));
        movement.setType(MovementType.ADJUSTMENT);
        movement.setQuantity(quantity);
        movement.setReason(reason);
        
        return createStockMovement(movement);
    }
}