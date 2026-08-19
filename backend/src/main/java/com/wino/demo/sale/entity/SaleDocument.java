package com.wino.demo.sale.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.wino.demo.customer.entity.Customer;
import com.wino.demo.sale.exception.SaleDocumentConversionException;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.beans.ConstructorProperties;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.EnumSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "sale_documents")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SaleDocument {

    private static final Set<SaleDocumentStatus> NON_CONVERTIBLE_STATUSES = EnumSet.of(
            SaleDocumentStatus.CANCELLED,
            SaleDocumentStatus.REJECTED,
            SaleDocumentStatus.EXPIRED,
            SaleDocumentStatus.REFUNDED);

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
    
    @Column(nullable = false, length = 30)
    @Enumerated(EnumType.STRING)
    private SaleDocumentStatus status;
    
    @OneToMany(mappedBy = "saleDocument", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<SaleDocumentLine> lines = new ArrayList<>();
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "converted_from_document_number")
    private String convertedFromDocumentNumber;

    @Column(name = "converted_quote_to_order")
    private Boolean convertedQuoteToOrder = false;
    
    @Column(name = "converted_quote_to_delivery_note")
    private Boolean convertedQuoteToDeliveryNote = false;

    @Column(name = "converted_quote_to_invoice")
    private Boolean convertedQuoteToInvoice = false;


    @Column(name = "converted_order_to_delivery_note")
    private Boolean convertedOrderToDeliveryNote = false;

    @Column(name = "converted_order_to_invoice")
    private Boolean convertedOrderToInvoice = false;

    @Column(name = "converted_delivery_note_to_invoice")
    private Boolean convertedDeliveryNoteToInvoice = false;


    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (documentDate == null) {
            documentDate = LocalDate.now();
        }
        if (status == null) {
            status = SaleDocumentStatus.DRAFT;
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public void calculateTotalAmount() {
        this.totalAmount = lines.stream()
                .map(SaleDocumentLine::getLineTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public void addLine(SaleDocumentLine line) {
        lines.add(line);
        line.setSaleDocument(this);
    }

    public void removeLine(SaleDocumentLine line) {
        lines.remove(line);
        line.setSaleDocument(null);
    }

    public SaleDocument convertTo(SaleDocumentType newType) {
        if (NON_CONVERTIBLE_STATUSES.contains(this.status)) {
            throw new SaleDocumentConversionException("Le document " + this.documentNumber + " est au statut "
                    + this.status + " : il ne peut plus être converti.");
        }
        if (!canConvertTo(newType)) {
            throw new SaleDocumentConversionException("Conversion de " + this.documentNumber + " (" + this.type
                    + ") vers " + newType + " impossible : déjà effectuée ou non autorisée.");
        }

        setConvertedFlag(newType);
        SaleDocument newDocument = new SaleDocument();
        newDocument.setType(newType);
        newDocument.setConvertedFromDocumentNumber(this.documentNumber);
        newDocument.setCustomer(this.customer);
        newDocument.setDocumentDate(LocalDate.now());
        newDocument.setDueDate(LocalDate.now().plusDays(30));
        newDocument.setNotes(this.notes);
        newDocument.setStatus(getNewStatusAfterConversion(newType));

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

    public boolean canConvertTo(SaleDocumentType newType) {
        if (NON_CONVERTIBLE_STATUSES.contains(this.status)) {
            return false;
        }
        return switch (this.type) {
            case QUOTE -> (newType == SaleDocumentType.ORDER && !alreadyConverted(convertedQuoteToOrder))
                    || (newType == SaleDocumentType.DELIVERY_NOTE && !alreadyConverted(convertedQuoteToDeliveryNote))
                    || (newType == SaleDocumentType.INVOICE && !alreadyConverted(convertedQuoteToInvoice));
            case ORDER -> (newType == SaleDocumentType.DELIVERY_NOTE && !alreadyConverted(convertedOrderToDeliveryNote))
                    || (newType == SaleDocumentType.INVOICE && !alreadyConverted(convertedOrderToInvoice));
            case DELIVERY_NOTE -> (newType == SaleDocumentType.INVOICE && !alreadyConverted(convertedDeliveryNoteToInvoice));
            case INVOICE, CREDIT_NOTE -> false;
        };
    }


    private static boolean alreadyConverted(Boolean flag) {
        return Boolean.TRUE.equals(flag);
    }

    public void setConvertedFlag(SaleDocumentType newType) {
        switch (this.type) {
            case QUOTE -> {
                if (newType == SaleDocumentType.ORDER) convertedQuoteToOrder = true;
                else if (newType == SaleDocumentType.DELIVERY_NOTE) convertedQuoteToDeliveryNote = true;
                else if (newType == SaleDocumentType.INVOICE) convertedQuoteToInvoice = true;
            }
            case ORDER -> {
                if (newType == SaleDocumentType.DELIVERY_NOTE) convertedOrderToDeliveryNote = true;
                else if (newType == SaleDocumentType.INVOICE) convertedOrderToInvoice = true;
            }
            case DELIVERY_NOTE -> {
                if (newType == SaleDocumentType.INVOICE) convertedDeliveryNoteToInvoice = true;
            }
            case INVOICE -> { }
            case CREDIT_NOTE -> { }
        }
    }

    public static SaleDocumentStatus getNewStatusAfterConversion(SaleDocumentType newType) {
        return switch (newType) {
            case ORDER -> SaleDocumentStatus.CONFIRMED;
            case DELIVERY_NOTE -> SaleDocumentStatus.IN_PREPARATION;
            case QUOTE, INVOICE, CREDIT_NOTE -> SaleDocumentStatus.DRAFT;
        };
    }
}