package com.wino.demo.sale.dto;

import java.util.List;

/**
 * Résultat d'une création ou d'une conversion de document de vente.
 *
 * Les ruptures ne sont pas des erreurs : le document est bien créé même si le stock
 * était insuffisant. Elles sont remontées à part pour que le front puisse les afficher
 * sans confondre avec un échec.
 */
public record SaleDocumentResult(
    SaleDocumentDto document,
    List<String> stockWarnings
) {}
