package com.wino.demo.products.service;

import com.wino.demo.products.entity.Product;
import com.wino.demo.products.repo.ProductRepository;
import com.wino.demo.category.service.CategoryService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class ProductService {
    
    private final ProductRepository productRepository;
    private final CategoryService categoryService;
    
    public ProductService(ProductRepository productRepository, CategoryService categoryService) {
        this.productRepository = productRepository;
        this.categoryService = categoryService;
    }
    
    /**
     * Récupérer tous les produits
     */
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }
    
    /**
     * Récupérer les produits actifs
     */
    public List<Product> getActiveProducts() {
        return productRepository.findByActiveTrue();
    }
    
    /**
     * Récupérer un produit par ID
     */
    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produit non trouvé avec l'ID: " + id));
    }
    
    /**
     * Créer un nouveau produit
     */
    public Product createProduct(Product product) {
        // Vérifier que le code n'existe pas déjà
        if (productRepository.existsByCode(product.getCode())) {
            throw new RuntimeException("Un produit avec ce code existe déjà: " + product.getCode());
        }
        
        // Valider la catégorie si fournie
        if (product.getCategory() != null && product.getCategory().getId() != null) {
            categoryService.getCategoryById(product.getCategory().getId());
        }
        
        product.setCreatedAt(LocalDateTime.now());
        product.setUpdatedAt(LocalDateTime.now());
        return productRepository.save(product);
    }
    
    /**
     * Mettre à jour un produit
     */
    public Product updateProduct(Long id, Product productDetails) {
        Product product = getProductById(id);
        
        // Vérifier unicité du code si changé
        if (!product.getCode().equals(productDetails.getCode()) 
            && productRepository.existsByCode(productDetails.getCode())) {
            throw new RuntimeException("Un produit avec ce code existe déjà");
        }
        
        product.setCode(productDetails.getCode());
        product.setName(productDetails.getName());
        product.setDescription(productDetails.getDescription());
        product.setPurchasePrice(productDetails.getPurchasePrice());
        product.setSalePrice(productDetails.getSalePrice());
        product.setStockQuantity(productDetails.getStockQuantity());
        product.setMinStockLevel(productDetails.getMinStockLevel());
        product.setMaxStockLevel(productDetails.getMaxStockLevel());
        product.setUnit(productDetails.getUnit());
        product.setBarcode(productDetails.getBarcode());
        product.setActive(productDetails.getActive());
        
        // Mise à jour de la catégorie si fournie
        if (productDetails.getCategory() != null && productDetails.getCategory().getId() != null) {
            product.setCategory(categoryService.getCategoryById(productDetails.getCategory().getId()));
        }
        
        product.setUpdatedAt(LocalDateTime.now());
        return productRepository.save(product);
    }
    
    /**
     * Supprimer un produit
     */
    public void deleteProduct(Long id) {
        Product product = getProductById(id);
        productRepository.delete(product);
    }
    
    /**
     * Récupérer produits par catégorie
     */
    public List<Product> getProductsByCategory(Long categoryId) {
        return productRepository.findByCategoryId(categoryId);
    }
    
    /**
     * Produits en stock faible
     */
    public List<Product> getLowStockProducts() {
        return productRepository.findLowStockProducts();
    }
    
    /**
     * Rechercher des produits
     */
    public List<Product> searchProducts(String keyword) {
        return productRepository.searchByName(keyword);
    }
}