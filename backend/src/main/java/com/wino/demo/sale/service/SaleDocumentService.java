package com.wino.demo.sale.service;

import com.wino.demo.sale.entity.SaleDocument;
import com.wino.demo.sale.entity.SaleDocumentLine;
import com.wino.demo.sale.entity.SaleDocumentType;
import com.wino.demo.sale.repository.SaleDocumentRepository;
import com.wino.demo.customer.service.CustomerService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@Transactional
public class SaleDocumentService {
    
    private final SaleDocumentRepository saleDocumentRepository;
    private final CustomerService customerService;
    
    public SaleDocumentService(SaleDocumentRepository saleDocumentRepository,
                              CustomerService customerService) {
        this.saleDocumentRepository = saleDocumentRepository;
        this.customerService = customerService;
    }
    
    /**
     * Générer un numéro de document unique
     */
    private String generateDocumentNumber(SaleDocumentType type) {
        String prefix = switch (type) {
            case QUOTE -> "QUO";
            case ORDER -> "ORD";
            case DELIVERY_NOTE -> "DEL";
            case INVOICE -> "INV";
        };
        
        String date = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        long count = saleDocumentRepository.count();
        
        return String.format("%s%s-%04d", prefix, date, count + 1);
    }
    
    /**
     * Récupérer tous les documents
     */
    public List<SaleDocument> getAllSaleDocuments() {
        return saleDocumentRepository.findAll();
    }
    
    /**
     * Récupérer un document par ID
     */
    public SaleDocument getSaleDocumentById(Long id) {
        return saleDocumentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Document de vente non trouvé avec l'ID: " + id));
    }
    
    /**
     * Récupérer un document par numéro
     */
    public SaleDocument getSaleDocumentByDocumentNumber(String documentNumber) {
        return saleDocumentRepository.findByDocumentNumber(documentNumber)
                .orElseThrow(() -> new RuntimeException("Document non trouvé avec le numéro: " + documentNumber));
    }
    
    /**
     * Créer un nouveau document
     */
    public SaleDocument createSaleDocument(SaleDocument saleDocument) {
        // Générer le numéro de document
        saleDocument.setDocumentNumber(generateDocumentNumber(saleDocument.getType()));
        
        // Valider le client
        if (saleDocument.getCustomer() != null && saleDocument.getCustomer().getId() != null) {
            saleDocument.setCustomer(customerService.getCustomerById(saleDocument.getCustomer().getId()));
        } else {
            throw new RuntimeException("Le client est requis");
        }
        
        // Associer les lignes au document
        if (saleDocument.getLines() != null) {
            saleDocument.getLines().forEach(line -> line.setSaleDocument(saleDocument));
        }
        
        // Calculer le montant total
        saleDocument.calculateTotalAmount();
        
        saleDocument.setCreatedAt(LocalDateTime.now());
        saleDocument.setUpdatedAt(LocalDateTime.now());
        
        return saleDocumentRepository.save(saleDocument);
    }
    
    /**
     * Mettre à jour un document
     */
    public SaleDocument updateSaleDocument(Long id, SaleDocument documentDetails) {
        SaleDocument saleDocument = getSaleDocumentById(id);
        
        saleDocument.setDocumentDate(documentDetails.getDocumentDate());
        saleDocument.setDueDate(documentDetails.getDueDate());
        saleDocument.setNotes(documentDetails.getNotes());
        saleDocument.setStatus(documentDetails.getStatus());
        
        // Mise à jour des lignes si fournies
        if (documentDetails.getLines() != null) {
            saleDocument.getLines().clear();
            documentDetails.getLines().forEach(line -> {
                line.setSaleDocument(saleDocument);
                saleDocument.addLine(line);
            });
        }
        
        saleDocument.calculateTotalAmount();
        saleDocument.setUpdatedAt(LocalDateTime.now());
        
        return saleDocumentRepository.save(saleDocument);
    }
    
    /**
     * Supprimer un document
     */
    public void deleteSaleDocument(Long id) {
        SaleDocument saleDocument = getSaleDocumentById(id);
        
        // On ne peut supprimer que les documents en brouillon
        if (!"DRAFT".equals(saleDocument.getStatus())) {
            throw new RuntimeException("Seuls les documents en brouillon peuvent être supprimés");
        }
        
        saleDocumentRepository.delete(saleDocument);
    }
    
    /**
     * Convertir un document en un autre type
     */
    public SaleDocument convertDocument(Long id, SaleDocumentType newType) {
        SaleDocument originalDocument = getSaleDocumentById(id);
        SaleDocument newDocument = originalDocument.convertTo(newType);
        
        return createSaleDocument(newDocument);
    }
    
    /**
     * Envoyer un document par email
     */
    public SaleDocument sendDocumentByEmail(Long id) {
        SaleDocument saleDocument = getSaleDocumentById(id);
        saleDocument.sendByEmail();
        saleDocument.setUpdatedAt(LocalDateTime.now());
        
        return saleDocumentRepository.save(saleDocument);
    }
    
    /**
     * Changer le statut
     */
    public SaleDocument changeStatus(Long id, String newStatus) {
        SaleDocument saleDocument = getSaleDocumentById(id);
        saleDocument.setStatus(newStatus);
        saleDocument.setUpdatedAt(LocalDateTime.now());
        
        return saleDocumentRepository.save(saleDocument);
    }
    
    /**
     * Documents par client
     */
    public List<SaleDocument> getSaleDocumentsByCustomer(Long customerId) {
        return saleDocumentRepository.findByCustomerId(customerId);
    }
    
    /**
     * Documents par type
     */
    public List<SaleDocument> getSaleDocumentsByType(SaleDocumentType type) {
        return saleDocumentRepository.findByType(type);
    }
    
    /**
     * Documents par statut
     */
    public List<SaleDocument> getSaleDocumentsByStatus(String status) {
        return saleDocumentRepository.findByStatus(status);
    }
    
    /**
     * Factures en retard
     */
    public List<SaleDocument> getOverdueInvoices() {
        return saleDocumentRepository.findOverdueInvoices(LocalDate.now());
    }
    
    /**
     * Rechercher des documents
     */
    public List<SaleDocument> searchSaleDocuments(String keyword) {
        return saleDocumentRepository.searchDocuments(keyword);
    }
    
    /**
     * Documents entre deux dates
     */
    public List<SaleDocument> getSaleDocumentsByDateRange(LocalDate startDate, LocalDate endDate) {
        return saleDocumentRepository.findByDocumentDateBetween(startDate, endDate);
    }
}