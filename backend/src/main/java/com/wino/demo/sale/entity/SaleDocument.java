package com.wino.demo.sale.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.wino.demo.customer.entity.Customer;
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
@Table(name = "sale_documents")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SaleDocument {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "document_number", nullable = false, unique = true, length = 50)
    private String documentNumber;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private SaleDocumentType type;
    
    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;
    
    @Column(name = "document_date", nullable = false)
    private LocalDate documentDate;
    
    @Column(name = "due_date")
    private LocalDate dueDate;
    
    @Column(name = "total_amount", precision = 12, scale = 2)
    private BigDecimal totalAmount = BigDecimal.ZERO;
    
    @Column(columnDefinition = "TEXT")
    private String notes;
    
    @Column(length = 100)
    private String status; // DRAFT, SENT, PAID, CANCELLED
    
    @OneToMany(mappedBy = "saleDocument", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<SaleDocumentLine> lines = new ArrayList<>();
    
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
                .map(SaleDocumentLine::getLineTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
    
    /**
     * Ajouter une ligne
     */
    public void addLine(SaleDocumentLine line) {
        lines.add(line);
        line.setSaleDocument(this);
    }
    
    /**
     * Retirer une ligne
     */
    public void removeLine(SaleDocumentLine line) {
        lines.remove(line);
        line.setSaleDocument(null);
    }
    
    /**
     * Convertir le document en un autre type
     * Par exemple: QUOTE -> ORDER -> DELIVERY_NOTE -> INVOICE
     */
    public SaleDocument convertTo(SaleDocumentType newType) {
        // Créer un nouveau document
        SaleDocument newDocument = new SaleDocument();
        newDocument.setType(newType);
        newDocument.setCustomer(this.customer);
        newDocument.setDocumentDate(LocalDate.now());
        newDocument.setNotes(this.notes);
        newDocument.setStatus("DRAFT");
        
        // Copier les lignes
        for (SaleDocumentLine line : this.lines) {
            SaleDocumentLine newLine = new SaleDocumentLine();
            newLine.setProduct(line.getProduct());
            newLine.setQuantity(line.getQuantity());
            newLine.setUnitPrice(line.getUnitPrice());
            newLine.setDiscountPercent(line.getDiscountPercent());
            newLine.calculateLineTotal();
            newDocument.addLine(newLine);
        }
        
        newDocument.calculateTotalAmount();
        
        return newDocument;
    }
    
    /**
     * Envoyer le document par email
     */
    public boolean sendByEmail() {
        // Pour l'instant, simulation de l'envoi
        // Dans une vraie application, on utiliserait JavaMailSender
        
        if (customer == null || customer.getEmail() == null || customer.getEmail().isEmpty()) {
            throw new RuntimeException("Le client n'a pas d'adresse email");
        }
        
        // Simuler l'envoi
        System.out.println("Envoi du document " + documentNumber + " à " + customer.getEmail());
        
        // Marquer le document comme envoyé
        if ("DRAFT".equals(this.status)) {
            this.status = "SENT";
        }
        
        return true;
    }
}