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
    
    // Recherche par numéro de document
    Optional<SaleDocument> findByDocumentNumber(String documentNumber);
    
    // Vérifier si numéro existe
    boolean existsByDocumentNumber(String documentNumber);
    
    // Documents par client
    List<SaleDocument> findByCustomerId(Long customerId);
    
    // Documents par type
    List<SaleDocument> findByType(SaleDocumentType type);
    
    // Documents par statut
    List<SaleDocument> findByStatus(String status);
    
    // Documents entre deux dates
    List<SaleDocument> findByDocumentDateBetween(LocalDate startDate, LocalDate endDate);
    
    // Documents par client et type
    List<SaleDocument> findByCustomerIdAndType(Long customerId, SaleDocumentType type);
    
    // Documents en retard (factures impayées)
    @Query("SELECT sd FROM SaleDocument sd WHERE sd.type = 'INVOICE' AND sd.dueDate < :currentDate AND sd.status != 'PAID'")
    List<SaleDocument> findOverdueInvoices(@Param("currentDate") LocalDate currentDate);
    
    // Recherche par numéro ou notes
    @Query("SELECT sd FROM SaleDocument sd WHERE LOWER(sd.documentNumber) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(sd.notes) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<SaleDocument> searchDocuments(@Param("keyword") String keyword);
}