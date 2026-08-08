package com.wino.demo.sale.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

/**
 * Traduit les refus métier du module vente en codes HTTP exploitables par le front.
 * Sans ça toute RuntimeException finit en 500, et le client ne peut pas distinguer
 * « conversion déjà effectuée » d'une vraie panne serveur.
 *
 * Le corps { "error": ... } reprend la forme déjà renvoyée par AuthController.
 */
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
