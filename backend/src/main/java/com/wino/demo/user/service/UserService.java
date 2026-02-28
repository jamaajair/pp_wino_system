package com.wino.demo.user.service;

import com.wino.demo.user.entity.Role;
import com.wino.demo.user.entity.User;
import com.wino.demo.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class UserService {
    
    private final UserRepository userRepository;
    
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    
    /**
     * Récupérer tous les utilisateurs
     */
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    
    /**
     * Récupérer les utilisateurs actifs
     */
    public List<User> getActiveUsers() {
        return userRepository.findByActiveTrue();
    }
    
    /**
     * Récupérer un utilisateur par ID
     */
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé avec l'ID: " + id));
    }
    
    /**
     * Récupérer un utilisateur par username
     */
    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé: " + username));
    }
    
    /**
     * Créer un nouvel utilisateur
     */
    public User createUser(User user) {
        // Vérifier que le username n'existe pas déjà
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new RuntimeException("Un utilisateur avec ce username existe déjà: " + user.getUsername());
        }
        
        // Vérifier que l'email n'existe pas déjà
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Un utilisateur avec cet email existe déjà: " + user.getEmail());
        }
        
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        return userRepository.save(user);
    }
    
    /**
     * Mettre à jour un utilisateur
     */
    public User updateUser(Long id, User userDetails) {
        User user = getUserById(id);
        
        // Vérifier unicité du username si changé
        if (!user.getUsername().equals(userDetails.getUsername()) 
            && userRepository.existsByUsername(userDetails.getUsername())) {
            throw new RuntimeException("Un utilisateur avec ce username existe déjà");
        }
        
        // Vérifier unicité de l'email si changé
        if (!user.getEmail().equals(userDetails.getEmail()) 
            && userRepository.existsByEmail(userDetails.getEmail())) {
            throw new RuntimeException("Un utilisateur avec cet email existe déjà");
        }
        
        user.setUsername(userDetails.getUsername());
        user.setEmail(userDetails.getEmail());
        user.setFirstName(userDetails.getFirstName());
        user.setLastName(userDetails.getLastName());
        user.setPhone(userDetails.getPhone());
        user.setRole(userDetails.getRole());
        user.setActive(userDetails.getActive());
        
        // Ne pas mettre à jour le mot de passe ici (on fera une méthode séparée)
        
        user.setUpdatedAt(LocalDateTime.now());
        return userRepository.save(user);
    }
    
    /**
     * Supprimer un utilisateur
     */
    public void deleteUser(Long id) {
        User user = getUserById(id);
        userRepository.delete(user);
    }
    
    /**
     * Désactiver un utilisateur (soft delete)
     */
    public User deactivateUser(Long id) {
        User user = getUserById(id);
        user.setActive(false);
        user.setUpdatedAt(LocalDateTime.now());
        return userRepository.save(user);
    }
    
    /**
     * Activer un utilisateur
     */
    public User activateUser(Long id) {
        User user = getUserById(id);
        user.setActive(true);
        user.setUpdatedAt(LocalDateTime.now());
        return userRepository.save(user);
    }
    
    /**
     * Récupérer utilisateurs par rôle
     */
    public List<User> getUsersByRole(Role role) {
        return userRepository.findByRole(role);
    }
    
    /**
     * Rechercher des utilisateurs
     */
    public List<User> searchUsers(String keyword) {
        return userRepository.searchByName(keyword);
    }
    
    /**
     * Changer le mot de passe
     * TODO: Ajouter le hash avec BCrypt plus tard
     */
    public User changePassword(Long id, String newPassword) {
        User user = getUserById(id);
        user.setPassword(newPassword);
        user.setUpdatedAt(LocalDateTime.now());
        return userRepository.save(user);
    }
}