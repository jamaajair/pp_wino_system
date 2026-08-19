package com.wino.demo.stock.repository;

import com.wino.demo.stock.entity.MovementType;
import com.wino.demo.stock.entity.StockMovement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface StockMovementRepository extends JpaRepository<StockMovement, Long> {
    
    List<StockMovement> findByProductId(Long productId);
    
    List<StockMovement> findByType(MovementType type);
    
    List<StockMovement> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
    
    List<StockMovement> findByProductIdAndType(Long productId, MovementType type);
    
    @Query("SELECT sm FROM StockMovement sm ORDER BY sm.createdAt DESC")
    List<StockMovement> findRecentMovements();
}