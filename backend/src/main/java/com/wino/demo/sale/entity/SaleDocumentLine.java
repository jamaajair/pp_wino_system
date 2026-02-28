package com.wino.demo.sale.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.wino.demo.products.entity.Product;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Entity
@Table(name = "sale_document_lines")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SaleDocumentLine {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "sale_document_id", nullable = false)
    @JsonBackReference
    private SaleDocument saleDocument;
    
    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal quantity;
    
    @Column(name = "unit_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal unitPrice;
    
    @Column(name = "discount_percent", precision = 5, scale = 2)
    private BigDecimal discountPercent = BigDecimal.ZERO;
    
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
        
        BigDecimal subtotal = quantity.multiply(unitPrice);
        
        if (discountPercent != null && discountPercent.compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal discount = subtotal.multiply(discountPercent).divide(new BigDecimal("100"));
            subtotal = subtotal.subtract(discount);
        }
        
        this.lineTotal = subtotal;
        return this.lineTotal;
    }
    
    @PrePersist
    @PreUpdate
    public void preSave() {
        calculateLineTotal();
    }
}