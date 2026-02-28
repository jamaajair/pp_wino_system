package com.wino.demo.priceagreement.repository;

import com.wino.demo.priceagreement.entity.CustomerPriceAgreement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerPriceAgreementRepository extends JpaRepository<CustomerPriceAgreement, Long> {
    
    // Accords par client
    List<CustomerPriceAgreement> findByCustomerId(Long customerId);
    
    // Accords par produit
    List<CustomerPriceAgreement> findByProductId(Long productId);
    
    // Accord spécifique pour un client et un produit
    Optional<CustomerPriceAgreement> findByCustomerIdAndProductId(Long customerId, Long productId);
    
    // Vérifier si un accord existe pour un client et un produit
    boolean existsByCustomerIdAndProductId(Long customerId, Long productId);
    
    // Accords valides aujourd'hui pour un client
    @Query("SELECT cpa FROM CustomerPriceAgreement cpa WHERE cpa.customer.id = :customerId " +
           "AND (cpa.validFrom IS NULL OR cpa.validFrom <= :date) " +
           "AND (cpa.validUntil IS NULL OR cpa.validUntil >= :date)")
    List<CustomerPriceAgreement> findValidAgreementsForCustomer(
            @Param("customerId") Long customerId, 
            @Param("date") LocalDate date);
    
    // Accords valides pour un client et un produit à une date donnée
    @Query("SELECT cpa FROM CustomerPriceAgreement cpa WHERE cpa.customer.id = :customerId " +
           "AND cpa.product.id = :productId " +
           "AND (cpa.validFrom IS NULL OR cpa.validFrom <= :date) " +
           "AND (cpa.validUntil IS NULL OR cpa.validUntil >= :date)")
    Optional<CustomerPriceAgreement> findValidAgreement(
            @Param("customerId") Long customerId, 
            @Param("productId") Long productId, 
            @Param("date") LocalDate date);
    
    // Accords expirés
    @Query("SELECT cpa FROM CustomerPriceAgreement cpa WHERE cpa.validUntil < :date")
    List<CustomerPriceAgreement> findExpiredAgreements(@Param("date") LocalDate date);
}