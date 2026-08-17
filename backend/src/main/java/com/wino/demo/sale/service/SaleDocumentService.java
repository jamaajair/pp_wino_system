package com.wino.demo.sale.service;

import com.wino.demo.sale.dto.SaleDocumentDto;
import com.wino.demo.sale.dto.SaleDocumentLineDto;
import com.wino.demo.sale.dto.SaleDocumentResult;
import com.wino.demo.stock.service.StockMovementService;
import com.wino.demo.sale.entity.SaleDocument;
import com.wino.demo.sale.entity.SaleDocumentLine;
import com.wino.demo.sale.entity.SaleDocumentStatus;
import com.wino.demo.sale.entity.SaleDocumentType;
import com.wino.demo.sale.exception.SaleDocumentNotFoundException;
import com.wino.demo.sale.repository.SaleDocumentRepository;
import com.wino.demo.customer.service.CustomerService;
import com.wino.demo.products.entity.Product;
import com.wino.demo.products.service.ProductService;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class SaleDocumentService {
    
    private final SaleDocumentRepository saleDocumentRepository;
    private final CustomerService customerService;
    private final ProductService productService;
    private final StockMovementService stockMovementService;

    public SaleDocumentService(SaleDocumentRepository saleDocumentRepository,
                              CustomerService customerService,
                              ProductService productService,
                              StockMovementService stockMovementService) {
        this.saleDocumentRepository = saleDocumentRepository;
        this.customerService = customerService;
        this.productService = productService;
        this.stockMovementService = stockMovementService;
    }

    /**
     * Sort du stock la marchandise d'un document de vente.
     *
     * Seuls la facture et le bon de livraison mouvementent le stock : un devis ou une
     * commande ne sont que des engagements, la marchandise n'a pas quitté l'entrepôt.
     *
     * @return la liste des ruptures constatées, vide si tout était disponible
     */
    private List<String> applyStockOut(SaleDocument document) {
        if (document.getType() != SaleDocumentType.INVOICE
                && document.getType() != SaleDocumentType.DELIVERY_NOTE) {
            return List.of();
        }

        List<String> shortages = new ArrayList<>();
        for (SaleDocumentLine line : document.getLines()) {
            int requested = line.getQuantity() == null ? 0 : line.getQuantity().intValue();
            if (requested <= 0) {
                continue;
            }
            int missing = stockMovementService.stockOutForSale(
                    line.getProduct().getId(),
                    requested,
                    "Vente " + document.getDocumentNumber(),
                    document.getDocumentNumber());
            if (missing > 0) {
                shortages.add(line.getProduct().getName() + " : " + missing + " manquant(s)");
            }
        }
        return shortages;
    }
    
    /**
     * Générer un numéro de document unique
     */
    private String generateDocumentNumber(SaleDocumentType type) {
        String prefix;
        switch (type) {
            case QUOTE:
                prefix = "QUO";
                break;
            case ORDER:
                prefix = "ORD";
                break;
            case DELIVERY_NOTE:
                prefix = "DEL";
                break;
            case INVOICE:
                prefix = "INV";
                break;
            case CREDIT_NOTE:
                prefix = "CN";
                break;
            default:
                throw new IllegalArgumentException("Type de document inconnu : " + type);
        }
        
        String date = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        long count = saleDocumentRepository.count();
        
        return String.format("%s%s-%04d", prefix, date, count + 1);
    }
    
    /**
    * Créer un nouveau document Validated By Jamaa
    */
    public SaleDocumentResult createSaleDocument(SaleDocumentDto request) {
        SaleDocument doc = new SaleDocument();
        doc.setType(request.type());
        doc.setDocumentNumber(generateDocumentNumber(request.type()));
        doc.setCustomer(customerService.getCustomerById(request.customerId()));
        if (request.documentDate() != null) {
            doc.setDocumentDate(LocalDate.parse(request.documentDate()));
        } else {
            doc.setDocumentDate(LocalDate.now());
            
        }
        if (request.dueDate() != null) {
            doc.setDueDate(LocalDate.parse(request.dueDate()));
        }
        doc.setNotes(request.notes());
        if (request.status() != null) {
            doc.setStatus(request.status());
        }
        doc.setCreatedAt(LocalDateTime.now());
        doc.setUpdatedAt(LocalDateTime.now());

        for (SaleDocumentLineDto lineDto : request.lines()) {
            Product product = productService.getProductById(lineDto.productId());
            SaleDocumentLine line = new SaleDocumentLine();                                                                                                                           
            line.setProduct(product);
            line.setQuantity(lineDto.quantity());                                                                                                                                     
            line.setUnitPrice(product.getSalePrice());
            line.setDiscountPercent(BigDecimal.ZERO);
            line.calculateLineTotal();

            doc.addLine(line);
        }
        doc.calculateTotalAmount();
        saleDocumentRepository.save(doc);

        return new SaleDocumentResult(createSaleDocumentDto(doc), applyStockOut(doc));
    }

    // /**
    //  * Récupérer tous les documents
    //  */
    public List<SaleDocumentDto> getAllSaleDocuments() {
        return saleDocumentRepository.findAll().stream()
                .map(this::createSaleDocumentDto)
                .collect(Collectors.toList());
    }
    
    // /**
    //  * Récupérer un document par ID
    //  */
    // public SaleDocument getSaleDocumentById(Long id) {
    //     return saleDocumentRepository.findById(id)
    //             .orElseThrow(() -> new RuntimeException("Document de vente non trouvé avec l'ID: " + id));
    // }
    
    // /**
    //  * Récupérer un document par numéro
    //  */
    // public SaleDocument getSaleDocumentByDocumentNumber(String documentNumber) {
    //     return saleDocumentRepository.findByDocumentNumber(documentNumber)
    //             .orElseThrow(() -> new RuntimeException("Document non trouvé avec le numéro: " + documentNumber));
    // }
    
    // /**
    //  * Mettre à jour un document
    //  */
    // public SaleDocument updateSaleDocument(Long id, SaleDocument documentDetails) {
    //     SaleDocument saleDocument = getSaleDocumentById(id);
        
    //     saleDocument.setDocumentDate(documentDetails.getDocumentDate());
    //     saleDocument.setDueDate(documentDetails.getDueDate());
    //     saleDocument.setNotes(documentDetails.getNotes());
    //     saleDocument.setStatus(documentDetails.getStatus());
        
    //     // Mise à jour des lignes si fournies
    //     if (documentDetails.getLines() != null) {
    //         saleDocument.getLines().clear();
    //         documentDetails.getLines().forEach(line -> {
    //             line.setSaleDocument(saleDocument);
    //             saleDocument.addLine(line);
    //         });
    //     }
        
    //     saleDocument.calculateTotalAmount();
    //     saleDocument.setUpdatedAt(LocalDateTime.now());
        
    //     return saleDocumentRepository.save(saleDocument);
    // }
    
    // /**
    //  * Supprimer un document
    //  */
    // public void deleteSaleDocument(Long id) {
    //     SaleDocument saleDocument = getSaleDocumentById(id);
        
    //     // On ne peut supprimer que les documents en brouillon
    //     if (!"DRAFT".equals(saleDocument.getStatus())) {
    //         throw new RuntimeException("Seuls les documents en brouillon peuvent être supprimés");
    //     }
        
    //     saleDocumentRepository.delete(saleDocument);
    // }
    
    /**
     * Convertir un document en un autre type
     */
    public SaleDocumentResult convertDocument(String documentNumber, SaleDocumentType newType) {
        SaleDocument original = saleDocumentRepository.findByDocumentNumber(documentNumber)
                .orElseThrow(() -> new SaleDocumentNotFoundException(documentNumber));
        SaleDocument newDoc = original.convertTo(newType);
        newDoc.setDocumentNumber(generateDocumentNumber(newType));
        saleDocumentRepository.save(newDoc);

        // La marchandise d'un bon de livraison a déjà quitté le stock : la facture
        // qui en découle ne doit pas la décompter une seconde fois.
        List<String> shortages = original.getType() == SaleDocumentType.DELIVERY_NOTE
                ? List.of()
                : applyStockOut(newDoc);

        return new SaleDocumentResult(createSaleDocumentDto(newDoc), shortages);
    }

    public SaleDocumentDto createSaleDocumentDto(SaleDocument document) {
        return new SaleDocumentDto(
            document.getDocumentNumber(),
            document.getType(),
            document.getCustomer().getId(),
            document.getDocumentDate().toString(),
            document.getDueDate() != null ? document.getDueDate().toString() : null,
            document.getNotes(),
            document.getStatus() != null ? document.getStatus() : null,
            document.getLines().stream().map(line -> new SaleDocumentLineDto(
                line.getProduct().getId(),
                line.getProduct().getName(),
                line.getProduct().getDescription(),
                line.getQuantity(),
                line.getUnitPrice(),
                line.getLineTotal()
            )).collect(Collectors.toList()),
            document.getCreatedAt().toString(),
            document.getUpdatedAt().toString(),
            document.getConvertedFromDocumentNumber()
        );
    }
    
    // /**
    //  * Envoyer un document par email
    //  */
    // public SaleDocument sendDocumentByEmail(Long id) {
    //     SaleDocument saleDocument = getSaleDocumentById(id);
    //     saleDocument.sendByEmail();
    //     saleDocument.setUpdatedAt(LocalDateTime.now());
        
    //     return saleDocumentRepository.save(saleDocument);
    // }
    
    // /**
    //  * Changer le statut
    //  */
    // public SaleDocument changeStatus(Long id, String newStatus) {
    //     SaleDocument saleDocument = getSaleDocumentById(id);
    //     saleDocument.setStatus(newStatus);
    //     saleDocument.setUpdatedAt(LocalDateTime.now());
        
    //     return saleDocumentRepository.save(saleDocument);
    // }
    
    // /**
    //  * Documents par client
    //  */
    // public List<SaleDocument> getSaleDocumentsByCustomer(Long customerId) {
    //     return saleDocumentRepository.findByCustomerId(customerId);
    // }
    
    // /**
    //  * Documents par type
    //  */
    // public List<SaleDocument> getSaleDocumentsByType(SaleDocumentType type) {
    //     return saleDocumentRepository.findByType(type);
    // }
    
    // /**
    //  * Documents par statut
    //  */
    // public List<SaleDocument> getSaleDocumentsByStatus(String status) {
    //     return saleDocumentRepository.findByStatus(status);
    // }
    
    // /**
    //  * Factures en retard
    //  */
    // public List<SaleDocument> getOverdueInvoices() {
    //     return saleDocumentRepository.findOverdueInvoices(LocalDate.now());
    // }
    
    // /**
    //  * Rechercher des documents
    //  */
    // public List<SaleDocument> searchSaleDocuments(String keyword) {
    //     return saleDocumentRepository.searchDocuments(keyword);
    // }
    
    // /**
    //  * Documents entre deux dates
    //  */
    // public List<SaleDocument> getSaleDocumentsByDateRange(LocalDate startDate, LocalDate endDate) {
    //     return saleDocumentRepository.findByDocumentDateBetween(startDate, endDate);
    // }
}
