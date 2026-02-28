package com.wino.demo.priceagreement.entity;

import com.wino.demo.customer.entity.Customer;
import com.wino.demo.products.entity.Product;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "customer_price_agreements")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomerPriceAgreement {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;
    
    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;
    
    @Column(name = "special_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal specialPrice;
    
    @Column(name = "valid_from")
    private LocalDate validFrom;
    
    @Column(name = "valid_until")
    private LocalDate validUntil;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    /**
     * Vérifier si l'accord de prix est valide aujourd'hui
     */
    public boolean isValid() {
        LocalDate today = LocalDate.now();
        
        // Si pas de dates, l'accord est toujours valide
        if (validFrom == null && validUntil == null) {
            return true;
        }
        
        // Vérifier la date de début
        if (validFrom != null && today.isBefore(validFrom)) {
            return false;
        }
        
        // Vérifier la date de fin
        if (validUntil != null && today.isAfter(validUntil)) {
            return false;
        }
        
        return true;
    }
    
    /**
     * Vérifier si l'accord est valide à une date donnée
     */
    public boolean isValidOn(LocalDate date) {
        if (date == null) {
            date = LocalDate.now();
        }
        
        if (validFrom == null && validUntil == null) {
            return true;
        }
        
        if (validFrom != null && date.isBefore(validFrom)) {
            return false;
        }
        
        if (validUntil != null && date.isAfter(validUntil)) {
            return false;
        }
        
        return true;
    }
}