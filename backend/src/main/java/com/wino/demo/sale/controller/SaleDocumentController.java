package com.wino.demo.sale.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.wino.demo.sale.service.SaleDocumentService;



@RestController
@RequestMapping("/api/sale-documents")
@CrossOrigin(origins = "*")
public class SaleDocumentController {

    private final SaleDocumentService saleDocumentService;
    public SaleDocumentController(SaleDocumentService saleDocumentService) {
        this.saleDocumentService = saleDocumentService;
    }

    public String test() {
        return "SaleDocumentController is working!";
    }
}
                                                                                      
 