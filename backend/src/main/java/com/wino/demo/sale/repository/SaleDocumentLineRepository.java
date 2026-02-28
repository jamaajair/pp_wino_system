package com.wino.demo.sale.repository;

import com.wino.demo.sale.entity.SaleDocumentLine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SaleDocumentLineRepository extends JpaRepository<SaleDocumentLine, Long> {
    
    // Lignes par document
    List<SaleDocumentLine> findBySaleDocumentId(Long saleDocumentId);
    
    // Lignes par produit
    List<SaleDocumentLine> findByProductId(Long productId);
}