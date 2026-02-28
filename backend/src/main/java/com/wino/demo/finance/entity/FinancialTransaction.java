package com.wino.demo.finance.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.wino.demo.user.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "financial_transactions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FinancialTransaction {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "transaction_number", nullable = false, unique = true, length = 50)
    private String transactionNumber;
    
    @ManyToOne
    @JoinColumn(name = "account_id", nullable = false)
    @JsonBackReference
    private FinancialAccount account;
    
    @ManyToOne
    @JoinColumn(name = "created_by_user_id")
    private User createdBy;
    
    @ManyToOne
    @JoinColumn(name = "validated_by_user_id")
    private User validatedBy;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "transaction_type", nullable = false, length = 20)
    private TransactionType transactionType;
    
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal amount;
    
    @Column(name = "transaction_date", nullable = false)
    private LocalDate transactionDate;
    
    @Column(length = 200)
    private String description;
    
    @Column(length = 100)
    private String reference; // Référence externe (facture, paiement, etc.)
    
    @Column(length = 100)
    private String category; // Catégorie de transaction (vente, achat, salaire, etc.)
    
    @Column(nullable = false)
    private Boolean applied = false;
    
    @Column(columnDefinition = "TEXT")
    private String notes;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (transactionDate == null) {
            transactionDate = LocalDate.now();
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    /**
     * Appliquer la transaction au compte
     */
    public void apply() {
        if (this.applied) {
            throw new RuntimeException("La transaction a déjà été appliquée");
        }
        
        if (this.account == null) {
            throw new RuntimeException("Le compte est requis");
        }
        
        if (this.amount == null || this.amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Le montant doit être positif");
        }
        
        // Vérifier le solde pour les débits
        if (this.transactionType == TransactionType.DEBIT) {
            if (!this.account.hasSufficientBalance(this.amount)) {
                throw new RuntimeException("Solde insuffisant pour cette transaction");
            }
        }
        
        // Mettre à jour le solde du compte
        this.account.updateBalance(this.amount, this.transactionType);
        
        // Marquer la transaction comme appliquée
        this.applied = true;
        this.updatedAt = LocalDateTime.now();
    }
    
    /**
     * Annuler la transaction
     */
    public void reverse() {
        if (!this.applied) {
            throw new RuntimeException("La transaction n'a pas encore été appliquée");
        }
        
        // Inverser le type de transaction
        TransactionType reverseType = (this.transactionType == TransactionType.CREDIT) 
                ? TransactionType.DEBIT 
                : TransactionType.CREDIT;
        
        // Mettre à jour le solde du compte
        this.account.updateBalance(this.amount, reverseType);
        
        // Marquer la transaction comme non appliquée
        this.applied = false;
        this.updatedAt = LocalDateTime.now();
    }
}