package com.wino.demo.category.repository;

import com.wino.demo.category.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    
    // Recherche par nom
    Optional<Category> findByName(String name);
    
    // Vérifier si un nom existe déjà
    boolean existsByName(String name);
    
    // Catégories racines (sans parent)
    List<Category> findByParentCategoryIsNull();
    
    // Sous-catégories d'une catégorie parent
    List<Category> findByParentCategoryId(Long parentId);
    
    // Recherche par mot-clé dans le nom
    @Query("SELECT c FROM Category c WHERE LOWER(c.name) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Category> searchByName(@Param("keyword") String keyword);
}