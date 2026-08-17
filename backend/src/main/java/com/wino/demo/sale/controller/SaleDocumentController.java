package com.wino.demo.sale.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.wino.demo.sale.dto.SaleDocumentDto;
import com.wino.demo.sale.dto.SaleDocumentResult;
import com.wino.demo.sale.entity.SaleDocumentType;
import com.wino.demo.sale.service.SaleDocumentService;
import org.springframework.web.bind.annotation.RequestParam;




@RestController
@RequestMapping("/api/sale-documents")
@CrossOrigin(origins = "*")
public class SaleDocumentController {

    private final SaleDocumentService saleDocumentService;
    public SaleDocumentController(SaleDocumentService saleDocumentService) {
        this.saleDocumentService = saleDocumentService;
    }

    @PostMapping
    public ResponseEntity<SaleDocumentResult> create(@RequestBody SaleDocumentDto saleDocument) {
        return ResponseEntity.ok(saleDocumentService.createSaleDocument(saleDocument));
    }

    @GetMapping
    public ResponseEntity<List<SaleDocumentDto>> getAllSaleDocuments() {
        return ResponseEntity.ok(saleDocumentService.getAllSaleDocuments());
    }

    @PostMapping("/convert")
    public ResponseEntity<SaleDocumentResult> convertDoc(@RequestParam String documentNumber,
                                                         @RequestParam SaleDocumentType targetType) {
        return ResponseEntity.ok(saleDocumentService.convertDocument(documentNumber, targetType));
    }
}
                                                                                      
 