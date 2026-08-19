package com.wino.demo.purchase.repository;

import com.wino.demo.purchase.entity.PurchaseDocument;
import com.wino.demo.purchase.entity.PurchaseDocumentType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface PurchaseDocumentRepository extends JpaRepository<PurchaseDocument, Long> {
    
    Optional<PurchaseDocument> findByDocumentNumber(String documentNumber);
    
    boolean existsByDocumentNumber(String documentNumber);
    
    List<PurchaseDocument> findBySupplierId(Long supplierId);
    
    List<PurchaseDocument> findByType(PurchaseDocumentType type);
    
    List<PurchaseDocument> findByStatus(String status);
    
    List<PurchaseDocument> findByDocumentDateBetween(LocalDate startDate, LocalDate endDate);
    
    List<PurchaseDocument> findBySupplierIdAndType(Long supplierId, PurchaseDocumentType type);
    
    List<PurchaseDocument> findByStockUpdatedFalse();
    
    @Query("SELECT pd FROM PurchaseDocument pd WHERE pd.type = 'INVOICE' AND pd.dueDate < :currentDate AND pd.status != 'PAID'")
    List<PurchaseDocument> findOverdueInvoices(@Param("currentDate") LocalDate currentDate);
    
    @Query("SELECT pd FROM PurchaseDocument pd WHERE LOWER(pd.documentNumber) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(pd.notes) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<PurchaseDocument> searchDocuments(@Param("keyword") String keyword);
}