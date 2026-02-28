package com.wino.demo.stock.entity;

import com.wino.demo.products.entity.Product;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "stock_movements")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class StockMovement {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "movement_type", nullable = false, length = 20)
    private MovementType type;
    
    @Column(nullable = false)
    private Integer quantity;
    
    @Column(length = 255)
    private String reason;
    
    @Column(name = "reference_document", length = 100)
    private String referenceDocument; // Référence du document source (bon de commande, vente, etc.)
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
    
    /**
     * Appliquer le mouvement au stock du produit
     */
    public void apply() {
        if (product == null) {
            throw new RuntimeException("Produit non défini pour ce mouvement de stock");
        }
        
        Integer currentStock = product.getStockQuantity();
        if (currentStock == null) {
            currentStock = 0;
        }
        
        switch (type) {
            case IN:
            case ADJUSTMENT:
                product.setStockQuantity(currentStock + quantity);
                break;
            case OUT:
                if (currentStock < quantity) {
                    throw new RuntimeException("Stock insuffisant pour le produit: " + product.getName());
                }
                product.setStockQuantity(currentStock - quantity);
                break;
        }
    }
}