package com.wino.demo.supplier.service;

import com.wino.demo.supplier.entity.Supplier;
import com.wino.demo.supplier.repository.SupplierRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class SupplierService {
    
    private final SupplierRepository supplierRepository;
    
    public SupplierService(SupplierRepository supplierRepository) {
        this.supplierRepository = supplierRepository;
    }
    
    /**
     * Récupérer tous les fournisseurs
     */
    public List<Supplier> getAllSuppliers() {
        return supplierRepository.findAll();
    }
    
    /**
     * Récupérer les fournisseurs actifs
     */
    public List<Supplier> getActiveSuppliers() {
        return supplierRepository.findByActiveTrue();
    }
    
    /**
     * Récupérer un fournisseur par ID
     */
    public Supplier getSupplierById(Long id) {
        return supplierRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Fournisseur non trouvé avec l'ID: " + id));
    }
    
    /**
     * Récupérer un fournisseur par code
     */
    public Supplier getSupplierByCode(String code) {
        return supplierRepository.findByCode(code)
                .orElseThrow(() -> new RuntimeException("Fournisseur non trouvé avec le code: " + code));
    }
    
    /**
     * Créer un nouveau fournisseur
     */
    public Supplier createSupplier(Supplier supplier) {
        // Vérifier que le code n'existe pas déjà
        if (supplierRepository.existsByCode(supplier.getCode())) {
            throw new RuntimeException("Un fournisseur avec ce code existe déjà: " + supplier.getCode());
        }
        
        // Vérifier que l'email n'existe pas déjà (si fourni)
        if (supplier.getEmail() != null && !supplier.getEmail().isEmpty() 
            && supplierRepository.existsByEmail(supplier.getEmail())) {
            throw new RuntimeException("Un fournisseur avec cet email existe déjà: " + supplier.getEmail());
        }
        
        supplier.setCreatedAt(LocalDateTime.now());
        supplier.setUpdatedAt(LocalDateTime.now());
        return supplierRepository.save(supplier);
    }
    
    /**
     * Mettre à jour un fournisseur
     */
    public Supplier updateSupplier(Long id, Supplier supplierDetails) {
        Supplier supplier = getSupplierById(id);
        
        // Vérifier unicité du code si changé
        if (!supplier.getCode().equals(supplierDetails.getCode()) 
            && supplierRepository.existsByCode(supplierDetails.getCode())) {
            throw new RuntimeException("Un fournisseur avec ce code existe déjà");
        }
        
        // Vérifier unicité de l'email si changé
        if (supplierDetails.getEmail() != null && !supplierDetails.getEmail().isEmpty()
            && !supplier.getEmail().equals(supplierDetails.getEmail()) 
            && supplierRepository.existsByEmail(supplierDetails.getEmail())) {
            throw new RuntimeException("Un fournisseur avec cet email existe déjà");
        }
        
        supplier.setCode(supplierDetails.getCode());
        supplier.setName(supplierDetails.getName());
        supplier.setEmail(supplierDetails.getEmail());
        supplier.setPhone(supplierDetails.getPhone());
        supplier.setAddress(supplierDetails.getAddress());
        supplier.setCity(supplierDetails.getCity());
        supplier.setPostalCode(supplierDetails.getPostalCode());
        supplier.setCountry(supplierDetails.getCountry());
        supplier.setTaxId(supplierDetails.getTaxId());
        supplier.setContactPerson(supplierDetails.getContactPerson());
        supplier.setPaymentTerms(supplierDetails.getPaymentTerms());
        supplier.setActive(supplierDetails.getActive());
        
        supplier.setUpdatedAt(LocalDateTime.now());
        return supplierRepository.save(supplier);
    }
    
    /**
     * Supprimer un fournisseur
     */
    public void deleteSupplier(Long id) {
        Supplier supplier = getSupplierById(id);
        supplierRepository.delete(supplier);
    }
    
    /**
     * Désactiver un fournisseur
     */
    public Supplier deactivateSupplier(Long id) {
        Supplier supplier = getSupplierById(id);
        supplier.setActive(false);
        supplier.setUpdatedAt(LocalDateTime.now());
        return supplierRepository.save(supplier);
    }
    
    /**
     * Activer un fournisseur
     */
    public Supplier activateSupplier(Long id) {
        Supplier supplier = getSupplierById(id);
        supplier.setActive(true);
        supplier.setUpdatedAt(LocalDateTime.now());
        return supplierRepository.save(supplier);
    }
    
    /**
     * Rechercher des fournisseurs
     */
    public List<Supplier> searchSuppliers(String keyword) {
        return supplierRepository.searchSuppliers(keyword);
    }
    
    /**
     * Fournisseurs par ville
     */
    public List<Supplier> getSuppliersByCity(String city) {
        return supplierRepository.findByCity(city);
    }
    
    /**
     * Fournisseurs par pays
     */
    public List<Supplier> getSuppliersByCountry(String country) {
        return supplierRepository.findByCountry(country);
    }
    
    /**
     * Fournisseurs par délai de paiement
     */
    public List<Supplier> getSuppliersByPaymentTerms(Integer paymentTerms) {
        return supplierRepository.findByPaymentTerms(paymentTerms);
    }
}