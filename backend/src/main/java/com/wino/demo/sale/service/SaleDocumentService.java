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

    public List<SaleDocumentDto> getAllSaleDocuments() {
        return saleDocumentRepository.findAll().stream()
                .map(this::createSaleDocumentDto)
                .collect(Collectors.toList());
    }

    public SaleDocumentResult convertDocument(String documentNumber, SaleDocumentType newType) {
        SaleDocument original = saleDocumentRepository.findByDocumentNumber(documentNumber)
                .orElseThrow(() -> new SaleDocumentNotFoundException(documentNumber));
        SaleDocument newDoc = original.convertTo(newType);
        newDoc.setDocumentNumber(generateDocumentNumber(newType));
        saleDocumentRepository.save(newDoc);

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
}
