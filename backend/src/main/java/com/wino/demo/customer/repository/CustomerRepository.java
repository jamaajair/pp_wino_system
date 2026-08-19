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
    
    Optional<Customer> findByCode(String code);
    
    Optional<Customer> findByEmail(String email);
    
    boolean existsByCode(String code);
    
    boolean existsByEmail(String email);
    
    List<Customer> findByActiveTrue();
    
    List<Customer> findByCustomerType(CustomerType customerType);
    
    @Query("SELECT c FROM Customer c WHERE c.balance > 0")
    List<Customer> findCustomersWithDebt();
    
    @Query("SELECT c FROM Customer c WHERE c.balance > c.creditLimit")
    List<Customer> findCustomersExceedingCreditLimit();
    
    @Query("SELECT c FROM Customer c WHERE LOWER(c.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(c.email) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(c.code) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Customer> searchCustomers(@Param("keyword") String keyword);
    
    List<Customer> findByCity(String city);
}