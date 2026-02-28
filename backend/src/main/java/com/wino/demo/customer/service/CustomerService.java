package com.wino.demo.customer.service;

import com.wino.demo.customer.entity.Customer;
import com.wino.demo.customer.entity.CustomerType;
import com.wino.demo.customer.repository.CustomerRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class CustomerService {
    
    private final CustomerRepository customerRepository;
    
    public CustomerService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }
    
    /**
     * Récupérer tous les clients
     */
    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }
    
    /**
     * Récupérer les clients actifs
     */
    public List<Customer> getActiveCustomers() {
        return customerRepository.findByActiveTrue();
    }
    
    /**
     * Récupérer un client par ID
     */
    public Customer getCustomerById(Long id) {
        return customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Client non trouvé avec l'ID: " + id));
    }
    
    /**
     * Récupérer un client par code
     */
    public Customer getCustomerByCode(String code) {
        return customerRepository.findByCode(code)
                .orElseThrow(() -> new RuntimeException("Client non trouvé avec le code: " + code));
    }
    
    /**
     * Créer un nouveau client
     */
    public Customer createCustomer(Customer customer) {
        // Vérifier que le code n'existe pas déjà
        if (customerRepository.existsByCode(customer.getCode())) {
            throw new RuntimeException("Un client avec ce code existe déjà: " + customer.getCode());
        }
        
        // Vérifier que l'email n'existe pas déjà (si fourni)
        if (customer.getEmail() != null && !customer.getEmail().isEmpty() 
            && customerRepository.existsByEmail(customer.getEmail())) {
            throw new RuntimeException("Un client avec cet email existe déjà: " + customer.getEmail());
        }
        
        customer.setCreatedAt(LocalDateTime.now());
        customer.setUpdatedAt(LocalDateTime.now());
        
        if (customer.getBalance() == null) {
            customer.setBalance(BigDecimal.ZERO);
        }
        
        return customerRepository.save(customer);
    }
    
    /**
     * Mettre à jour un client
     */
    public Customer updateCustomer(Long id, Customer customerDetails) {
        Customer customer = getCustomerById(id);
        
        // Vérifier unicité du code si changé
        if (!customer.getCode().equals(customerDetails.getCode()) 
            && customerRepository.existsByCode(customerDetails.getCode())) {
            throw new RuntimeException("Un client avec ce code existe déjà");
        }
        
        // Vérifier unicité de l'email si changé
        if (customerDetails.getEmail() != null && !customerDetails.getEmail().isEmpty()
            && !customer.getEmail().equals(customerDetails.getEmail()) 
            && customerRepository.existsByEmail(customerDetails.getEmail())) {
            throw new RuntimeException("Un client avec cet email existe déjà");
        }
        
        customer.setCode(customerDetails.getCode());
        customer.setName(customerDetails.getName());
        customer.setEmail(customerDetails.getEmail());
        customer.setPhone(customerDetails.getPhone());
        customer.setAddress(customerDetails.getAddress());
        customer.setCity(customerDetails.getCity());
        customer.setPostalCode(customerDetails.getPostalCode());
        customer.setCountry(customerDetails.getCountry());
        customer.setTaxId(customerDetails.getTaxId());
        customer.setCustomerType(customerDetails.getCustomerType());
        customer.setCreditLimit(customerDetails.getCreditLimit());
        customer.setActive(customerDetails.getActive());
        
        customer.setUpdatedAt(LocalDateTime.now());
        return customerRepository.save(customer);
    }
    
    /**
     * Supprimer un client
     */
    public void deleteCustomer(Long id) {
        Customer customer = getCustomerById(id);
        customerRepository.delete(customer);
    }
    
    /**
     * Désactiver un client
     */
    public Customer deactivateCustomer(Long id) {
        Customer customer = getCustomerById(id);
        customer.setActive(false);
        customer.setUpdatedAt(LocalDateTime.now());
        return customerRepository.save(customer);
    }
    
    /**
     * Activer un client
     */
    public Customer activateCustomer(Long id) {
        Customer customer = getCustomerById(id);
        customer.setActive(true);
        customer.setUpdatedAt(LocalDateTime.now());
        return customerRepository.save(customer);
    }
    
    /**
     * Clients par type
     */
    public List<Customer> getCustomersByType(CustomerType customerType) {
        return customerRepository.findByCustomerType(customerType);
    }
    
    /**
     * Clients avec des dettes
     */
    public List<Customer> getCustomersWithDebt() {
        return customerRepository.findCustomersWithDebt();
    }
    
    /**
     * Clients qui dépassent leur limite de crédit
     */
    public List<Customer> getCustomersExceedingCreditLimit() {
        return customerRepository.findCustomersExceedingCreditLimit();
    }
    
    /**
     * Rechercher des clients
     */
    public List<Customer> searchCustomers(String keyword) {
        return customerRepository.searchCustomers(keyword);
    }
    
    /**
     * Clients par ville
     */
    public List<Customer> getCustomersByCity(String city) {
        return customerRepository.findByCity(city);
    }
    
    /**
     * Mettre à jour le solde d'un client
     */
    public Customer updateBalance(Long id, BigDecimal amount) {
        Customer customer = getCustomerById(id);
        customer.setBalance(customer.getBalance().add(amount));
        customer.setUpdatedAt(LocalDateTime.now());
        return customerRepository.save(customer);
    }
}