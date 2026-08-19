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
    
    List<CustomerPriceAgreement> findByCustomerId(Long customerId);
    
    List<CustomerPriceAgreement> findByProductId(Long productId);
    
    Optional<CustomerPriceAgreement> findByCustomerIdAndProductId(Long customerId, Long productId);
    
    boolean existsByCustomerIdAndProductId(Long customerId, Long productId);
    
    @Query("SELECT cpa FROM CustomerPriceAgreement cpa WHERE cpa.customer.id = :customerId " +
           "AND (cpa.validFrom IS NULL OR cpa.validFrom <= :date) " +
           "AND (cpa.validUntil IS NULL OR cpa.validUntil >= :date)")
    List<CustomerPriceAgreement> findValidAgreementsForCustomer(
            @Param("customerId") Long customerId, 
            @Param("date") LocalDate date);
    
    @Query("SELECT cpa FROM CustomerPriceAgreement cpa WHERE cpa.customer.id = :customerId " +
           "AND cpa.product.id = :productId " +
           "AND (cpa.validFrom IS NULL OR cpa.validFrom <= :date) " +
           "AND (cpa.validUntil IS NULL OR cpa.validUntil >= :date)")
    Optional<CustomerPriceAgreement> findValidAgreement(
            @Param("customerId") Long customerId, 
            @Param("productId") Long productId, 
            @Param("date") LocalDate date);
    
    @Query("SELECT cpa FROM CustomerPriceAgreement cpa WHERE cpa.validUntil < :date")
    List<CustomerPriceAgreement> findExpiredAgreements(@Param("date") LocalDate date);
}