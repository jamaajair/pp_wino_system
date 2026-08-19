package com.wino.demo.payment.repository;

import com.wino.demo.payment.entity.Payment;
import com.wino.demo.payment.entity.PaymentType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    
    Optional<Payment> findByPaymentNumber(String paymentNumber);
    
    boolean existsByPaymentNumber(String paymentNumber);
    
    List<Payment> findByCustomerId(Long customerId);
    
    List<Payment> findByPaymentType(PaymentType paymentType);
    
    List<Payment> findByValidatedTrue();
    
    List<Payment> findByValidatedFalse();
    
    List<Payment> findByPaymentDateBetween(LocalDate startDate, LocalDate endDate);
    
    List<Payment> findByCustomerIdAndPaymentDateBetween(Long customerId, LocalDate startDate, LocalDate endDate);
    
    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.customer.id = :customerId AND p.validated = true")
    BigDecimal sumPaymentsByCustomer(@Param("customerId") Long customerId);
    
    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.paymentType = :paymentType AND p.validated = true")
    BigDecimal sumPaymentsByType(@Param("paymentType") PaymentType paymentType);
    
    List<Payment> findByReferenceContainingIgnoreCase(String reference);
}