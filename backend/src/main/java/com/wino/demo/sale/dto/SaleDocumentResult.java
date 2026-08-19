package com.wino.demo.sale.dto;

import java.util.List;

public record SaleDocumentResult(
    SaleDocumentDto document,
    List<String> stockWarnings
) {}
