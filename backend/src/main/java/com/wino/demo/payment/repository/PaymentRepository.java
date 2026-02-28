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
    
    // Recherche par numéro de paiement
    Optional<Payment> findByPaymentNumber(String paymentNumber);
    
    // Vérifier si numéro existe
    boolean existsByPaymentNumber(String paymentNumber);
    
    // Paiements par client
    List<Payment> findByCustomerId(Long customerId);
    
    // Paiements par type
    List<Payment> findByPaymentType(PaymentType paymentType);
    
    // Paiements validés
    List<Payment> findByValidatedTrue();
    
    // Paiements non validés
    List<Payment> findByValidatedFalse();
    
    // Paiements entre deux dates
    List<Payment> findByPaymentDateBetween(LocalDate startDate, LocalDate endDate);
    
    // Paiements par client entre deux dates
    List<Payment> findByCustomerIdAndPaymentDateBetween(Long customerId, LocalDate startDate, LocalDate endDate);
    
    // Somme des paiements par client
    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.customer.id = :customerId AND p.validated = true")
    BigDecimal sumPaymentsByCustomer(@Param("customerId") Long customerId);
    
    // Somme des paiements par type
    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.paymentType = :paymentType AND p.validated = true")
    BigDecimal sumPaymentsByType(@Param("paymentType") PaymentType paymentType);
    
    // Recherche par référence
    List<Payment> findByReferenceContainingIgnoreCase(String reference);
}