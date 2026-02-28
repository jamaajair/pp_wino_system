package com.wino.demo.user.repository;

import com.wino.demo.user.entity.Role;
import com.wino.demo.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    // Recherche par username
    Optional<User> findByUsername(String username);
    
    // Recherche par email
    Optional<User> findByEmail(String email);
    
    // Vérifier si username existe
    boolean existsByUsername(String username);
    
    // Vérifier si email existe
    boolean existsByEmail(String email);
    
    // Utilisateurs actifs uniquement
    List<User> findByActiveTrue();
    
    // Utilisateurs par rôle
    List<User> findByRole(Role role);
    
    // Recherche par nom ou prénom
    @Query("SELECT u FROM User u WHERE LOWER(u.firstName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(u.lastName) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<User> searchByName(@Param("keyword") String keyword);
}