package com.wino.demo.priceagreement.service;

import com.wino.demo.priceagreement.entity.CustomerPriceAgreement;
import com.wino.demo.priceagreement.repository.CustomerPriceAgreementRepository;
import com.wino.demo.customer.service.CustomerService;
import com.wino.demo.products.service.ProductService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class CustomerPriceAgreementService {
    
    private final CustomerPriceAgreementRepository agreementRepository;
    private final CustomerService customerService;
    private final ProductService productService;
    
    public CustomerPriceAgreementService(CustomerPriceAgreementRepository agreementRepository,
                                        CustomerService customerService,
                                        ProductService productService) {
        this.agreementRepository = agreementRepository;
        this.customerService = customerService;
        this.productService = productService;
    }
    
    /**
     * Récupérer tous les accords
     */
    public List<CustomerPriceAgreement> getAllAgreements() {
        return agreementRepository.findAll();
    }
    
    /**
     * Récupérer un accord par ID
     */
    public CustomerPriceAgreement getAgreementById(Long id) {
        return agreementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Accord de prix non trouvé avec l'ID: " + id));
    }
    
    /**
     * Créer un nouvel accord
     */
    public CustomerPriceAgreement createAgreement(CustomerPriceAgreement agreement) {
        // Valider le client
        if (agreement.getCustomer() != null && agreement.getCustomer().getId() != null) {
            agreement.setCustomer(customerService.getCustomerById(agreement.getCustomer().getId()));
        } else {
            throw new RuntimeException("Le client est requis");
        }
        
        // Valider le produit
        if (agreement.getProduct() != null && agreement.getProduct().getId() != null) {
            agreement.setProduct(productService.getProductById(agreement.getProduct().getId()));
        } else {
            throw new RuntimeException("Le produit est requis");
        }
        
        // Vérifier qu'un accord n'existe pas déjà pour ce client et ce produit
        if (agreementRepository.existsByCustomerIdAndProductId(
                agreement.getCustomer().getId(), 
                agreement.getProduct().getId())) {
            throw new RuntimeException("Un accord existe déjà pour ce client et ce produit");
        }
        
        // Valider le prix
        if (agreement.getSpecialPrice() == null || agreement.getSpecialPrice().compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Le prix spécial doit être positif");
        }
        
        // Valider les dates
        if (agreement.getValidFrom() != null && agreement.getValidUntil() != null) {
            if (agreement.getValidFrom().isAfter(agreement.getValidUntil())) {
                throw new RuntimeException("La date de début doit être avant la date de fin");
            }
        }
        
        agreement.setCreatedAt(LocalDateTime.now());
        agreement.setUpdatedAt(LocalDateTime.now());
        
        return agreementRepository.save(agreement);
    }
    
    /**
     * Mettre à jour un accord
     */
    public CustomerPriceAgreement updateAgreement(Long id, CustomerPriceAgreement agreementDetails) {
        CustomerPriceAgreement agreement = getAgreementById(id);
        
        agreement.setSpecialPrice(agreementDetails.getSpecialPrice());
        agreement.setValidFrom(agreementDetails.getValidFrom());
        agreement.setValidUntil(agreementDetails.getValidUntil());
        
        // Valider les dates
        if (agreement.getValidFrom() != null && agreement.getValidUntil() != null) {
            if (agreement.getValidFrom().isAfter(agreement.getValidUntil())) {
                throw new RuntimeException("La date de début doit être avant la date de fin");
            }
        }
        
        agreement.setUpdatedAt(LocalDateTime.now());
        return agreementRepository.save(agreement);
    }
    
    /**
     * Supprimer un accord
     */
    public void deleteAgreement(Long id) {
        CustomerPriceAgreement agreement = getAgreementById(id);
        agreementRepository.delete(agreement);
    }
    
    /**
     * Accords par client
     */
    public List<CustomerPriceAgreement> getAgreementsByCustomer(Long customerId) {
        return agreementRepository.findByCustomerId(customerId);
    }
    
    /**
     * Accords par produit
     */
    public List<CustomerPriceAgreement> getAgreementsByProduct(Long productId) {
        return agreementRepository.findByProductId(productId);
    }
    
    /**
     * Accords valides pour un client aujourd'hui
     */
    public List<CustomerPriceAgreement> getValidAgreementsForCustomer(Long customerId) {
        return agreementRepository.findValidAgreementsForCustomer(customerId, LocalDate.now());
    }
    
    /**
     * Obtenir le prix spécial pour un client et un produit
     */
    public Optional<BigDecimal> getSpecialPrice(Long customerId, Long productId) {
        Optional<CustomerPriceAgreement> agreement = 
                agreementRepository.findValidAgreement(customerId, productId, LocalDate.now());
        
        return agreement.map(CustomerPriceAgreement::getSpecialPrice);
    }
    
    /**
     * Accords expirés
     */
    public List<CustomerPriceAgreement> getExpiredAgreements() {
        return agreementRepository.findExpiredAgreements(LocalDate.now());
    }
    
    /**
     * Vérifier si un accord est valide
     */
    public boolean isAgreementValid(Long id) {
        CustomerPriceAgreement agreement = getAgreementById(id);
        return agreement.isValid();
    }
}