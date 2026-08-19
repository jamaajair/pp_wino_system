package com.wino.demo.sale.repository;

import com.wino.demo.sale.entity.SaleDocumentLine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SaleDocumentLineRepository extends JpaRepository<SaleDocumentLine, Long> {
    
    List<SaleDocumentLine> findBySaleDocumentId(Long saleDocumentId);
    
    List<SaleDocumentLine> findByProductId(Long productId);
}