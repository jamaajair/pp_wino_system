package com.wino.demo.products.repository;

import com.wino.demo.products.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    // Recherche par code produit
    Optional<Product> findByCode(String code);
    
    // Vérifier si un code existe
    boolean existsByCode(String code);
    
    // Produits actifs uniquement
    List<Product> findByActiveTrue();
    
    // Produits par catégorie
    List<Product> findByCategoryId(Long categoryId);
    
    // Produits en stock faible
    @Query("SELECT p FROM Product p WHERE p.stockQuantity <= p.minStockLevel")
    List<Product> findLowStockProducts();
    
    // Recherche par nom
    @Query("SELECT p FROM Product p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Product> searchByName(@Param("keyword") String keyword);
}