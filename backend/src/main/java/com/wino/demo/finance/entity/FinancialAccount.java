package com.wino.demo.finance.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "financial_accounts")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FinancialAccount {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "account_number", nullable = false, unique = true, length = 50)
    private String accountNumber;
    
    @Column(name = "account_name", nullable = false, length = 200)
    private String accountName;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "account_type", nullable = false, length = 20)
    private AccountType accountType;
    
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal balance = BigDecimal.ZERO;
    
    @Column(length = 100)
    private String currency = "EUR";
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(nullable = false)
    private Boolean active = true;
    
    @OneToMany(mappedBy = "account", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<FinancialTransaction> transactions = new ArrayList<>();
    
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
     * Mettre à jour le solde du compte
     */
    public void updateBalance(BigDecimal amount, TransactionType transactionType) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Le montant doit être positif");
        }
        
        if (transactionType == TransactionType.CREDIT) {
            // Crédit = ajout d'argent
            this.balance = this.balance.add(amount);
        } else if (transactionType == TransactionType.DEBIT) {
            // Débit = retrait d'argent
            this.balance = this.balance.subtract(amount);
        }
        
        this.updatedAt = LocalDateTime.now();
    }
    
    /**
     * Vérifier si le solde est suffisant pour un débit
     */
    public boolean hasSufficientBalance(BigDecimal amount) {
        return this.balance.compareTo(amount) >= 0;
    }
}