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
    
    // Recherche par numéro de document
    Optional<PurchaseDocument> findByDocumentNumber(String documentNumber);
    
    // Vérifier si numéro existe
    boolean existsByDocumentNumber(String documentNumber);
    
    // Documents par fournisseur
    List<PurchaseDocument> findBySupplierId(Long supplierId);
    
    // Documents par type
    List<PurchaseDocument> findByType(PurchaseDocumentType type);
    
    // Documents par statut
    List<PurchaseDocument> findByStatus(String status);
    
    // Documents entre deux dates
    List<PurchaseDocument> findByDocumentDateBetween(LocalDate startDate, LocalDate endDate);
    
    // Documents par fournisseur et type
    List<PurchaseDocument> findBySupplierIdAndType(Long supplierId, PurchaseDocumentType type);
    
    // Documents avec stock non mis à jour
    List<PurchaseDocument> findByStockUpdatedFalse();
    
    // Documents en retard (factures impayées)
    @Query("SELECT pd FROM PurchaseDocument pd WHERE pd.type = 'INVOICE' AND pd.dueDate < :currentDate AND pd.status != 'PAID'")
    List<PurchaseDocument> findOverdueInvoices(@Param("currentDate") LocalDate currentDate);
    
    // Recherche par numéro ou notes
    @Query("SELECT pd FROM PurchaseDocument pd WHERE LOWER(pd.documentNumber) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(pd.notes) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<PurchaseDocument> searchDocuments(@Param("keyword") String keyword);
}