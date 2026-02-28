package com.wino.demo.payment.entity;

import com.wino.demo.customer.entity.Customer;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Payment {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "payment_number", nullable = false, unique = true, length = 50)
    private String paymentNumber;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "payment_type", nullable = false, length = 20)
    private PaymentType paymentType;
    
    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal amount;
    
    @Column(name = "payment_date", nullable = false)
    private LocalDate paymentDate;
    
    @ManyToOne
    @JoinColumn(name = "customer_id")
    private Customer customer;
    
    @Column(length = 255)
    private String reference; // Référence du paiement (numéro de chèque, transaction ID, etc.)
    
    @Column(columnDefinition = "TEXT")
    private String notes;
    
    @Column(nullable = false)
    private Boolean validated = false;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (paymentDate == null) {
            paymentDate = LocalDate.now();
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    /**
     * Valider le paiement
     */
    public boolean validate() {
        // Vérifications de validation
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Le montant du paiement doit être positif");
        }
        
        if (paymentType == null) {
            throw new RuntimeException("Le type de paiement est requis");
        }
        
        if (paymentDate == null) {
            throw new RuntimeException("La date de paiement est requise");
        }
        
        // Si toutes les validations passent
        this.validated = true;
        this.updatedAt = LocalDateTime.now();
        
        return true;
    }
    
    /**
     * Vérifier si le paiement est valide
     */
    public boolean isValid() {
        try {
            return amount != null && amount.compareTo(BigDecimal.ZERO) > 0
                    && paymentType != null
                    && paymentDate != null;
        } catch (Exception e) {
            return false;
        }
    }
}