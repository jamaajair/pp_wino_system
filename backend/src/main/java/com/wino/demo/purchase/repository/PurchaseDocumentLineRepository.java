package com.wino.demo.purchase.repository;

import com.wino.demo.purchase.entity.PurchaseDocumentLine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PurchaseDocumentLineRepository extends JpaRepository<PurchaseDocumentLine, Long> {
    
    List<PurchaseDocumentLine> findByPurchaseDocumentId(Long purchaseDocumentId);
    
    List<PurchaseDocumentLine> findByProductId(Long productId);
}