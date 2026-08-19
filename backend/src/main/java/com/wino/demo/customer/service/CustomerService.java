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
    

    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }
    

    public List<Customer> getActiveCustomers() {
        return customerRepository.findByActiveTrue();
    }
    

    public Customer getCustomerById(Long id) {
        return customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Client non trouvé avec l'ID: " + id));
    }
    

    public Customer getCustomerByCode(String code) {
        return customerRepository.findByCode(code)
                .orElseThrow(() -> new RuntimeException("Client non trouvé avec le code: " + code));
    }
    

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
    

    public void deleteCustomer(Long id) {
        Customer customer = getCustomerById(id);
        customerRepository.delete(customer);
    }
    
    public Customer deactivateCustomer(Long id) {
        Customer customer = getCustomerById(id);
        customer.setActive(false);
        customer.setUpdatedAt(LocalDateTime.now());
        return customerRepository.save(customer);
    }
    

    public Customer activateCustomer(Long id) {
        Customer customer = getCustomerById(id);
        customer.setActive(true);
        customer.setUpdatedAt(LocalDateTime.now());
        return customerRepository.save(customer);
    }
    

    public List<Customer> getCustomersByType(CustomerType customerType) {
        return customerRepository.findByCustomerType(customerType);
    }
    

    public List<Customer> getCustomersWithDebt() {
        return customerRepository.findCustomersWithDebt();
    }
    

    public List<Customer> getCustomersExceedingCreditLimit() {
        return customerRepository.findCustomersExceedingCreditLimit();
    }
    

    public List<Customer> searchCustomers(String keyword) {
        return customerRepository.searchCustomers(keyword);
    }
    

    public List<Customer> getCustomersByCity(String city) {
        return customerRepository.findByCity(city);
    }
    
    public Customer updateBalance(Long id, BigDecimal amount) {
        Customer customer = getCustomerById(id);
        customer.setBalance(customer.getBalance().add(amount));
        customer.setUpdatedAt(LocalDateTime.now());
        return customerRepository.save(customer);
    }
}