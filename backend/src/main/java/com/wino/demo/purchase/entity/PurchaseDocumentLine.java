package com.wino.demo.purchase.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.wino.demo.products.entity.Product;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Entity
@Table(name = "purchase_document_lines")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PurchaseDocumentLine {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "purchase_document_id", nullable = false)
    @JsonBackReference
    private PurchaseDocument purchaseDocument;
    
    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal quantity;
    
    @Column(name = "unit_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal unitPrice;
    
    @Column(name = "line_total", nullable = false, precision = 12, scale = 2)
    private BigDecimal lineTotal;
    
    /**
     * Calculer le total de la ligne
     */
    public BigDecimal calculateLineTotal() {
        if (quantity == null || unitPrice == null) {
            this.lineTotal = BigDecimal.ZERO;
            return this.lineTotal;
        }
        
        this.lineTotal = quantity.multiply(unitPrice);
        return this.lineTotal;
    }
    
    @PrePersist
    @PreUpdate
    public void preSave() {
        calculateLineTotal();
    }
}