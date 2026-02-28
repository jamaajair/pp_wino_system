package com.wino.demo.supplier.repository;

import com.wino.demo.supplier.entity.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SupplierRepository extends JpaRepository<Supplier, Long> {
    
    // Recherche par code
    Optional<Supplier> findByCode(String code);
    
    // Recherche par email
    Optional<Supplier> findByEmail(String email);
    
    // Vérifier si code existe
    boolean existsByCode(String code);
    
    // Vérifier si email existe
    boolean existsByEmail(String email);
    
    // Fournisseurs actifs uniquement
    List<Supplier> findByActiveTrue();
    
    // Fournisseurs par ville
    List<Supplier> findByCity(String city);
    
    // Fournisseurs par pays
    List<Supplier> findByCountry(String country);
    
    // Recherche par nom, email ou code
    @Query("SELECT s FROM Supplier s WHERE LOWER(s.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(s.email) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(s.code) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Supplier> searchSuppliers(@Param("keyword") String keyword);
    
    // Fournisseurs avec un certain délai de paiement
    List<Supplier> findByPaymentTerms(Integer paymentTerms);
}