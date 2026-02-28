package com.wino.demo.purchase.repository;

import com.wino.demo.purchase.entity.PurchaseDocumentLine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PurchaseDocumentLineRepository extends JpaRepository<PurchaseDocumentLine, Long> {
    
    // Lignes par document
    List<PurchaseDocumentLine> findByPurchaseDocumentId(Long purchaseDocumentId);
    
    // Lignes par produit
    List<PurchaseDocumentLine> findByProductId(Long productId);
}