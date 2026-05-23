package com.wino.demo.sale.dto;

import java.math.BigDecimal;

public record SaleDocumentLineDto (
    Long productId,
    String productName,
    String description,
    BigDecimal quantity,
    BigDecimal unitPrice,
    BigDecimal totalPrice
    ) {}