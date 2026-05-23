package com.wino.demo.sale.entity;

// pour un Quote : DRAFT, SENT, ACCEPTED, REJECTED, EXPIRED
// pour une Invoice : DRAFT, SENT, PAID, CANCELLED, PARTIALLY_PAID, OVERDUE, REFUNDED
// pour une Delivery : IN_PREPARATION, SHIPPED, DELIVERED
// pour un Order : DRAFT, CONFIRMED, CANCELLED
public enum SaleDocumentStatus {
    DRAFT,
    SENT,
    PAID,
    CANCELLED,
    PARTIALLY_PAID,
    OVERDUE,
    REFUNDED,
    SHIPPED,
    DELIVERED,
    ACCEPTED,
    REJECTED,
    EXPIRED,
    CONFIRMED,
    IN_PREPARATION,
    FINALIZED
}
