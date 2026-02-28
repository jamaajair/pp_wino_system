package com.wino.demo.customer.repository;

import com.wino.demo.customer.entity.Customer;
import com.wino.demo.customer.entity.CustomerType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    
    // Recherche par code
    Optional<Customer> findByCode(String code);
    
    // Recherche par email
    Optional<Customer> findByEmail(String email);
    
    // Vérifier si code existe
    boolean existsByCode(String code);
    
    // Vérifier si email existe
    boolean existsByEmail(String email);
    
    // Clients actifs uniquement
    List<Customer> findByActiveTrue();
    
    // Clients par type
    List<Customer> findByCustomerType(CustomerType customerType);
    
    // Clients avec solde positif (débiteurs)
    @Query("SELECT c FROM Customer c WHERE c.balance > 0")
    List<Customer> findCustomersWithDebt();
    
    // Clients qui dépassent leur limite de crédit
    @Query("SELECT c FROM Customer c WHERE c.balance > c.creditLimit")
    List<Customer> findCustomersExceedingCreditLimit();
    
    // Recherche par nom, email ou code
    @Query("SELECT c FROM Customer c WHERE LOWER(c.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(c.email) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(c.code) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Customer> searchCustomers(@Param("keyword") String keyword);
    
    // Clients par ville
    List<Customer> findByCity(String city);
}