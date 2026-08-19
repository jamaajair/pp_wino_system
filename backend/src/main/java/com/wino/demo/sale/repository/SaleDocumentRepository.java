package com.wino.demo.sale.repository;

import com.wino.demo.sale.entity.SaleDocument;
import com.wino.demo.sale.entity.SaleDocumentType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface SaleDocumentRepository extends JpaRepository<SaleDocument, Long> {
    
    Optional<SaleDocument> findByDocumentNumber(String documentNumber);
    
    boolean existsByDocumentNumber(String documentNumber);
    
    List<SaleDocument> findByCustomerId(Long customerId);
    
    List<SaleDocument> findByType(SaleDocumentType type);
    
    List<SaleDocument> findByStatus(String status);
    
    List<SaleDocument> findByDocumentDateBetween(LocalDate startDate, LocalDate endDate);
    
    List<SaleDocument> findByCustomerIdAndType(Long customerId, SaleDocumentType type);
    
    @Query("SELECT sd FROM SaleDocument sd WHERE sd.type = 'INVOICE' AND sd.dueDate < :currentDate AND sd.status != 'PAID'")
    List<SaleDocument> findOverdueInvoices(@Param("currentDate") LocalDate currentDate);
    
    @Query("SELECT sd FROM SaleDocument sd WHERE LOWER(sd.documentNumber) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(sd.notes) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<SaleDocument> searchDocuments(@Param("keyword") String keyword);
}