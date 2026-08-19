package com.wino.demo.sale.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

@RestControllerAdvice
public class SaleDocumentExceptionHandler {

    @ExceptionHandler(SaleDocumentNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleNotFound(SaleDocumentNotFoundException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
    }

    @ExceptionHandler(SaleDocumentConversionException.class)
    public ResponseEntity<Map<String, String>> handleConversionRefused(SaleDocumentConversionException e) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", e.getMessage()));
    }
}
