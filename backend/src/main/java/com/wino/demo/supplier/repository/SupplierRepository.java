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
    
    Optional<Supplier> findByCode(String code);
    
    Optional<Supplier> findByEmail(String email);
    
    boolean existsByCode(String code);
    
    boolean existsByEmail(String email);
    
    List<Supplier> findByActiveTrue();
    
    List<Supplier> findByCity(String city);
    
    List<Supplier> findByCountry(String country);
    
    @Query("SELECT s FROM Supplier s WHERE LOWER(s.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(s.email) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(s.code) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Supplier> searchSuppliers(@Param("keyword") String keyword);
    
    List<Supplier> findByPaymentTerms(Integer paymentTerms);
}