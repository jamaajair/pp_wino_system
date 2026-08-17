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
    
    /**
     * Récupérer tous les mouvements
     */
    public List<StockMovement> getAllStockMovements() {
        return stockMovementRepository.findAll();
    }
    
    /**
     * Récupérer un mouvement par ID
     */
    public StockMovement getStockMovementById(Long id) {
        return stockMovementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Mouvement de stock non trouvé avec l'ID: " + id));
    }
    
    /**
     * Créer un mouvement de stock et l'appliquer
     */
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
    
    /**
     * Mouvements par produit
     */
    public List<StockMovement> getStockMovementsByProduct(Long productId) {
        return stockMovementRepository.findByProductId(productId);
    }
    
    /**
     * Mouvements par type
     */
    public List<StockMovement> getStockMovementsByType(MovementType type) {
        return stockMovementRepository.findByType(type);
    }
    
    /**
     * Mouvements entre deux dates
     */
    public List<StockMovement> getStockMovementsByDateRange(LocalDateTime start, LocalDateTime end) {
        return stockMovementRepository.findByCreatedAtBetween(start, end);
    }
    
    /**
     * Mouvements récents
     */
    public List<StockMovement> getRecentStockMovements() {
        return stockMovementRepository.findRecentMovements();
    }
    
    /**
     * Entrée de stock
     */
    public StockMovement stockIn(Long productId, Integer quantity, String reason, String reference) {
        StockMovement movement = new StockMovement();
        movement.setProduct(productService.getProductById(productId));
        movement.setType(MovementType.IN);
        movement.setQuantity(quantity);
        movement.setReason(reason);
        movement.setReferenceDocument(reference);
        
        return createStockMovement(movement);
    }
    
    /**
     * Sortie de stock
     */
    public StockMovement stockOut(Long productId, Integer quantity, String reason, String reference) {
        StockMovement movement = new StockMovement();
        movement.setProduct(productService.getProductById(productId));
        movement.setType(MovementType.OUT);
        movement.setQuantity(quantity);
        movement.setReason(reason);
        movement.setReferenceDocument(reference);
        
        return createStockMovement(movement);
    }
    
    /**
     * Sortie liée à une vente : tolère un stock insuffisant au lieu d'échouer.
     *
     * Le stock descend au plus bas à zéro, jamais en négatif. Le mouvement enregistré
     * porte la quantité réellement sortie, pas la quantité demandée : l'historique doit
     * pouvoir être resommé pour retrouver le stock courant.
     *
     * @return la quantité manquante, 0 si tout a pu être sorti
     */
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

    /**
     * Ajustement de stock
     */
    public StockMovement adjustStock(Long productId, Integer quantity, String reason) {
        StockMovement movement = new StockMovement();
        movement.setProduct(productService.getProductById(productId));
        movement.setType(MovementType.ADJUSTMENT);
        movement.setQuantity(quantity);
        movement.setReason(reason);
        
        return createStockMovement(movement);
    }
}