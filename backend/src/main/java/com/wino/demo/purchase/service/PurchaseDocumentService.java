package com.wino.demo.purchase.service;

import com.wino.demo.purchase.entity.PurchaseDocument;
import com.wino.demo.purchase.entity.PurchaseDocumentType;
import com.wino.demo.purchase.repository.PurchaseDocumentRepository;
import com.wino.demo.supplier.service.SupplierService;
import com.wino.demo.stock.entity.StockMovement;
import com.wino.demo.stock.service.StockMovementService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@Transactional
public class PurchaseDocumentService {
    
    private final PurchaseDocumentRepository purchaseDocumentRepository;
    private final SupplierService supplierService;
    private final StockMovementService stockMovementService;
    
    public PurchaseDocumentService(PurchaseDocumentRepository purchaseDocumentRepository,
                                  SupplierService supplierService,
                                  StockMovementService stockMovementService) {
        this.purchaseDocumentRepository = purchaseDocumentRepository;
        this.supplierService = supplierService;
        this.stockMovementService = stockMovementService;
    }

    private String generateDocumentNumber(PurchaseDocumentType type) {
        String prefix = switch (type) {
            case REQUEST -> "REQ";
            case ORDER -> "PO";
            case RECEIPT -> "REC";
            case INVOICE -> "PINV";
        };
        
        String date = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        long count = purchaseDocumentRepository.count();
        
        return String.format("%s%s-%04d", prefix, date, count + 1);
    }

    public List<PurchaseDocument> getAllPurchaseDocuments() {
        return purchaseDocumentRepository.findAll();
    }

    public PurchaseDocument getPurchaseDocumentById(Long id) {
        return purchaseDocumentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Document d'achat non trouvé avec l'ID: " + id));
    }

    public PurchaseDocument getPurchaseDocumentByDocumentNumber(String documentNumber) {
        return purchaseDocumentRepository.findByDocumentNumber(documentNumber)
                .orElseThrow(() -> new RuntimeException("Document non trouvé avec le numéro: " + documentNumber));
    }
    

    public PurchaseDocument createPurchaseDocument(PurchaseDocument purchaseDocument) {
        // Générer le numéro de document
        purchaseDocument.setDocumentNumber(generateDocumentNumber(purchaseDocument.getType()));
        
        // Valider le fournisseur
        if (purchaseDocument.getSupplier() != null && purchaseDocument.getSupplier().getId() != null) {
            purchaseDocument.setSupplier(supplierService.getSupplierById(purchaseDocument.getSupplier().getId()));
        } else {
            throw new RuntimeException("Le fournisseur est requis");
        }
        
        // Associer les lignes au document et calculer leur total
        if (purchaseDocument.getLines() != null) {
            purchaseDocument.getLines().forEach(line -> {
                line.setPurchaseDocument(purchaseDocument);
                line.calculateLineTotal();
            });
        }

        // Calculer le montant total
        purchaseDocument.calculateTotalAmount();
        
        purchaseDocument.setCreatedAt(LocalDateTime.now());
        purchaseDocument.setUpdatedAt(LocalDateTime.now());
        
        return purchaseDocumentRepository.save(purchaseDocument);
    }

    public PurchaseDocument updatePurchaseDocument(Long id, PurchaseDocument documentDetails) {
        PurchaseDocument purchaseDocument = getPurchaseDocumentById(id);
        
        purchaseDocument.setDocumentDate(documentDetails.getDocumentDate());
        purchaseDocument.setDueDate(documentDetails.getDueDate());
        purchaseDocument.setNotes(documentDetails.getNotes());
        purchaseDocument.setStatus(documentDetails.getStatus());
        
        // Mise à jour des lignes si fournies
        if (documentDetails.getLines() != null) {
            purchaseDocument.getLines().clear();
            documentDetails.getLines().forEach(line -> {
                line.setPurchaseDocument(purchaseDocument);
                purchaseDocument.addLine(line);
            });
        }
        
        purchaseDocument.calculateTotalAmount();
        purchaseDocument.setUpdatedAt(LocalDateTime.now());
        
        return purchaseDocumentRepository.save(purchaseDocument);
    }
    
    public void deletePurchaseDocument(Long id) {
        PurchaseDocument purchaseDocument = getPurchaseDocumentById(id);
        
        // On ne peut supprimer que les documents en brouillon
        if (!"DRAFT".equals(purchaseDocument.getStatus())) {
            throw new RuntimeException("Seuls les documents en brouillon peuvent être supprimés");
        }
        
        // On ne peut pas supprimer un document dont le stock a été mis à jour
        if (purchaseDocument.getStockUpdated()) {
            throw new RuntimeException("Impossible de supprimer un document dont le stock a été mis à jour");
        }
        
        purchaseDocumentRepository.delete(purchaseDocument);
    }

    public PurchaseDocument updateStockFromDocument(Long id) {
        PurchaseDocument purchaseDocument = getPurchaseDocumentById(id);
        
        // Créer les mouvements de stock
        List<StockMovement> movements = purchaseDocument.updateStock();
        
        // Sauvegarder les mouvements
        movements.forEach(stockMovementService::createStockMovement);
        
        // Sauvegarder le document
        return purchaseDocumentRepository.save(purchaseDocument);
    }

    public PurchaseDocument changeStatus(Long id, String newStatus) {
        PurchaseDocument purchaseDocument = getPurchaseDocumentById(id);
        purchaseDocument.setStatus(newStatus);
        purchaseDocument.setUpdatedAt(LocalDateTime.now());
        
        return purchaseDocumentRepository.save(purchaseDocument);
    }
    
    public List<PurchaseDocument> getPurchaseDocumentsBySupplier(Long supplierId) {
        return purchaseDocumentRepository.findBySupplierId(supplierId);
    }
    
    public List<PurchaseDocument> getPurchaseDocumentsByType(PurchaseDocumentType type) {
        return purchaseDocumentRepository.findByType(type);
    }

    public List<PurchaseDocument> getPurchaseDocumentsByStatus(String status) {
        return purchaseDocumentRepository.findByStatus(status);
    }

    public List<PurchaseDocument> getDocumentsWithStockNotUpdated() {
        return purchaseDocumentRepository.findByStockUpdatedFalse();
    }
    
    public List<PurchaseDocument> getOverdueInvoices() {
        return purchaseDocumentRepository.findOverdueInvoices(LocalDate.now());
    }
    
    public List<PurchaseDocument> searchPurchaseDocuments(String keyword) {
        return purchaseDocumentRepository.searchDocuments(keyword);
    }
    
    public List<PurchaseDocument> getPurchaseDocumentsByDateRange(LocalDate startDate, LocalDate endDate) {
        return purchaseDocumentRepository.findByDocumentDateBetween(startDate, endDate);
    }
}