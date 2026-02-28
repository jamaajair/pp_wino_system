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
    
    // Mouvements par produit
    List<StockMovement> findByProductId(Long productId);
    
    // Mouvements par type
    List<StockMovement> findByType(MovementType type);
    
    // Mouvements entre deux dates
    List<StockMovement> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
    
    // Mouvements par produit et type
    List<StockMovement> findByProductIdAndType(Long productId, MovementType type);
    
    // Mouvements récents (derniers N mouvements)
    @Query("SELECT sm FROM StockMovement sm ORDER BY sm.createdAt DESC")
    List<StockMovement> findRecentMovements();
}