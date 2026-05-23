package com.wino.demo.sale.dto;

import java.util.List;

import com.wino.demo.sale.entity.SaleDocumentStatus;
import com.wino.demo.sale.entity.SaleDocumentType;

public record SaleDocumentDto(
    String documentNumber,
    SaleDocumentType type,
    Long customerId,
    String documentDate,
    String dueDate,
    String notes,
    SaleDocumentStatus status,
    List<SaleDocumentLineDto> lines,
    String createdAt,
    String updatedAt,
    String convertedFromDocumentNumber
) {

}
