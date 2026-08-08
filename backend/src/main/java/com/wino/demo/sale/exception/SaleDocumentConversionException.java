package com.wino.demo.sale.exception;

/**
 * Refus métier d'une conversion : document dans un statut terminal, conversion déjà
 * effectuée, ou enchaînement de types non autorisé. Ce n'est pas une panne serveur.
 */
public class SaleDocumentConversionException extends RuntimeException {

    public SaleDocumentConversionException(String message) {
        super(message);
    }
}
