package com.wino.demo.payment.service;

import com.wino.demo.payment.entity.Payment;
import com.wino.demo.payment.entity.PaymentType;
import com.wino.demo.payment.repository.PaymentRepository;
import com.wino.demo.customer.service.CustomerService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@Transactional
public class PaymentService {
    
    private final PaymentRepository paymentRepository;
    private final CustomerService customerService;
    
    public PaymentService(PaymentRepository paymentRepository,
                         CustomerService customerService) {
        this.paymentRepository = paymentRepository;
        this.customerService = customerService;
    }
    
    /**
     * Générer un numéro de paiement unique
     */
    private String generatePaymentNumber() {
        String prefix = "PAY";
        String date = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        
        long count = paymentRepository.count();
        
        return String.format("%s%s-%04d", prefix, date, count + 1);
    }
    
    /**
     * Récupérer tous les paiements
     */
    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }
    
    /**
     * Récupérer un paiement par ID
     */
    public Payment getPaymentById(Long id) {
        return paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Paiement non trouvé avec l'ID: " + id));
    }
    
    /**
     * Récupérer un paiement par numéro
     */
    public Payment getPaymentByPaymentNumber(String paymentNumber) {
        return paymentRepository.findByPaymentNumber(paymentNumber)
                .orElseThrow(() -> new RuntimeException("Paiement non trouvé avec le numéro: " + paymentNumber));
    }
    
    /**
     * Créer un nouveau paiement
     */
    public Payment createPayment(Payment payment) {
        // Générer le numéro de paiement
        payment.setPaymentNumber(generatePaymentNumber());
        
        // Valider le client si fourni
        if (payment.getCustomer() != null && payment.getCustomer().getId() != null) {
            payment.setCustomer(customerService.getCustomerById(payment.getCustomer().getId()));
        }
        
        // Valider le paiement
        if (!payment.isValid()) {
            throw new RuntimeException("Les données du paiement sont invalides");
        }
        
        payment.setCreatedAt(LocalDateTime.now());
        payment.setUpdatedAt(LocalDateTime.now());
        
        return paymentRepository.save(payment);
    }
    
    /**
     * Mettre à jour un paiement
     */
    public Payment updatePayment(Long id, Payment paymentDetails) {
        Payment payment = getPaymentById(id);
        
        // On ne peut modifier que les paiements non validés
        if (payment.getValidated()) {
            throw new RuntimeException("Impossible de modifier un paiement déjà validé");
        }
        
        payment.setPaymentType(paymentDetails.getPaymentType());
        payment.setAmount(paymentDetails.getAmount());
        payment.setPaymentDate(paymentDetails.getPaymentDate());
        payment.setReference(paymentDetails.getReference());
        payment.setNotes(paymentDetails.getNotes());
        
        payment.setUpdatedAt(LocalDateTime.now());
        return paymentRepository.save(payment);
    }
    
    /**
     * Supprimer un paiement
     */
    public void deletePayment(Long id) {
        Payment payment = getPaymentById(id);
        
        // On ne peut supprimer que les paiements non validés
        if (payment.getValidated()) {
            throw new RuntimeException("Impossible de supprimer un paiement déjà validé");
        }
        
        paymentRepository.delete(payment);
    }
    
    /**
     * Valider un paiement
     */
    public Payment validatePayment(Long id) {
        Payment payment = getPaymentById(id);
        
        if (payment.getValidated()) {
            throw new RuntimeException("Le paiement est déjà validé");
        }
        
        payment.validate();
        payment.setUpdatedAt(LocalDateTime.now());
        
        // Si le paiement a un client, mettre à jour son solde
        if (payment.getCustomer() != null) {
            customerService.updateBalance(
                payment.getCustomer().getId(), 
                payment.getAmount().negate() // Réduire la dette du client
            );
        }
        
        return paymentRepository.save(payment);
    }
    
    /**
     * Paiements par client
     */
    public List<Payment> getPaymentsByCustomer(Long customerId) {
        return paymentRepository.findByCustomerId(customerId);
    }
    
    /**
     * Paiements par type
     */
    public List<Payment> getPaymentsByType(PaymentType paymentType) {
        return paymentRepository.findByPaymentType(paymentType);
    }
    
    /**
     * Paiements validés
     */
    public List<Payment> getValidatedPayments() {
        return paymentRepository.findByValidatedTrue();
    }
    
    /**
     * Paiements non validés
     */
    public List<Payment> getPendingPayments() {
        return paymentRepository.findByValidatedFalse();
    }
    
    /**
     * Paiements entre deux dates
     */
    public List<Payment> getPaymentsByDateRange(LocalDate startDate, LocalDate endDate) {
        return paymentRepository.findByPaymentDateBetween(startDate, endDate);
    }
    
    /**
     * Somme des paiements d'un client
     */
    public BigDecimal getTotalPaymentsByCustomer(Long customerId) {
        BigDecimal total = paymentRepository.sumPaymentsByCustomer(customerId);
        return total != null ? total : BigDecimal.ZERO;
    }
    
    /**
     * Somme des paiements par type
     */
    public BigDecimal getTotalPaymentsByType(PaymentType paymentType) {
        BigDecimal total = paymentRepository.sumPaymentsByType(paymentType);
        return total != null ? total : BigDecimal.ZERO;
    }
    
    /**
     * Rechercher par référence
     */
    public List<Payment> searchByReference(String reference) {
        return paymentRepository.findByReferenceContainingIgnoreCase(reference);
    }
}