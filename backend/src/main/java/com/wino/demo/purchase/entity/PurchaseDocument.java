package com.wino.demo.purchase.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.wino.demo.supplier.entity.Supplier;
import com.wino.demo.stock.entity.StockMovement;
import com.wino.demo.stock.entity.MovementType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "purchase_documents")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PurchaseDocument {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "document_number", nullable = false, unique = true, length = 50)
    private String documentNumber;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private PurchaseDocumentType type;
    
    @ManyToOne
    @JoinColumn(name = "supplier_id", nullable = false)
    private Supplier supplier;
    
    @Column(name = "document_date", nullable = false)
    private LocalDate documentDate;
    
    @Column(name = "due_date")
    private LocalDate dueDate;
    
    @Column(name = "total_amount", precision = 12, scale = 2)
    private BigDecimal totalAmount = BigDecimal.ZERO;
    
    @Column(columnDefinition = "TEXT")
    private String notes;
    
    @Column(length = 100)
    private String status; // DRAFT, SENT, RECEIVED, PAID
    
    @Column(name = "stock_updated")
    private Boolean stockUpdated = false;
    
    @OneToMany(mappedBy = "purchaseDocument", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<PurchaseDocumentLine> lines = new ArrayList<>();
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (documentDate == null) {
            documentDate = LocalDate.now();
        }
        if (status == null) {
            status = "DRAFT";
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    /**
     * Calculer le montant total
     */
    public void calculateTotalAmount() {
        this.totalAmount = lines.stream()
                .map(PurchaseDocumentLine::getLineTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
    
    /**
     * Ajouter une ligne
     */
    public void addLine(PurchaseDocumentLine line) {
        lines.add(line);
        line.setPurchaseDocument(this);
    }
    
    /**
     * Retirer une ligne
     */
    public void removeLine(PurchaseDocumentLine line) {
        lines.remove(line);
        line.setPurchaseDocument(null);
    }
    
    /**
     * Mettre à jour le stock
     * Crée des mouvements de stock pour chaque ligne du document
     */
    public List<StockMovement> updateStock() {
        if (this.stockUpdated) {
            throw new RuntimeException("Le stock a déjà été mis à jour pour ce document");
        }
        
        // Ne mettre à jour le stock que pour les réceptions et factures
        if (this.type != PurchaseDocumentType.RECEIPT && this.type != PurchaseDocumentType.INVOICE) {
            throw new RuntimeException("Le stock ne peut être mis à jour que pour les réceptions et factures");
        }
        
        List<StockMovement> movements = new ArrayList<>();
        
        for (PurchaseDocumentLine line : this.lines) {
            StockMovement movement = new StockMovement();
            movement.setProduct(line.getProduct());
            movement.setType(MovementType.IN);
            movement.setQuantity(line.getQuantity().intValue());
            movement.setReason("Réception fournisseur");
            movement.setReferenceDocument(this.documentNumber);
            
            // Appliquer le mouvement au produit
            movement.apply();
            
            movements.add(movement);
        }
        
        this.stockUpdated = true;
        this.updatedAt = LocalDateTime.now();
        
        return movements;
    }
}