package com.wino.demo.sale.exception;

public class SaleDocumentNotFoundException extends RuntimeException {

    public SaleDocumentNotFoundException(String documentNumber) {
        super("Document non trouvé : " + documentNumber);
    }
}
