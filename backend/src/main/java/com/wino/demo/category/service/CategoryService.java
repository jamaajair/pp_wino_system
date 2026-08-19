package com.wino.demo.category.service;

import com.wino.demo.category.entity.Category;
import com.wino.demo.category.repository.CategoryRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class CategoryService {
    
    private final CategoryRepository categoryRepository;
    
    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }
    

    public List<Category> getRootCategories() {
        return categoryRepository.findByParentCategoryIsNull();
    }
    

    public Category getCategoryById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Catégorie non trouvée avec l'ID: " + id));
    }
    

    public Category createCategory(Category category) {
        if (categoryRepository.existsByName(category.getName())) {
            throw new RuntimeException("Une catégorie avec ce nom existe déjà: " + category.getName());
        }
        
        if (category.getParentCategory() != null) {
            Category parent = getCategoryById(category.getParentCategory().getId());
            if (isCircularReference(parent, category)) {
                throw new RuntimeException("Référence circulaire détectée");
            }
        }
        
        category.setCreatedAt(LocalDateTime.now());
        category.setUpdatedAt(LocalDateTime.now());
        return categoryRepository.save(category);
    }
    

    public Category updateCategory(Long id, Category categoryDetails) {
        Category category = getCategoryById(id);
        
        if (!category.getName().equals(categoryDetails.getName()) 
            && categoryRepository.existsByName(categoryDetails.getName())) {
            throw new RuntimeException("Une catégorie avec ce nom existe déjà");
        }
        
        category.setName(categoryDetails.getName());
        category.setDescription(categoryDetails.getDescription());
        
        if (categoryDetails.getParentCategory() != null) {
            Category newParent = getCategoryById(categoryDetails.getParentCategory().getId());
            if (isCircularReference(newParent, category)) {
                throw new RuntimeException("Référence circulaire détectée");
            }
            category.setParentCategory(newParent);
        } else {
            category.setParentCategory(null);
        }
        
        category.setUpdatedAt(LocalDateTime.now());
        return categoryRepository.save(category);
    }
    

    public void deleteCategory(Long id) {
        Category category = getCategoryById(id);
        
        // pas suppression si elle a des sous cat
        if (category.getSubCategories() != null && !category.getSubCategories().isEmpty()) {
            throw new RuntimeException("Impossible de supprimer une catégorie avec des sous-catégories");
        }
        
        categoryRepository.delete(category);
    }
    

    public List<Category> getSubCategories(Long parentId) {
        return categoryRepository.findByParentCategoryId(parentId);
    }
    

    public List<Category> searchCategories(String keyword) {
        return categoryRepository.searchByName(keyword);
    }
    
    /**
     * Vérifier les références circulaires 
     * pour éviter qu'une catégorie devienne son propre parent ou ancêtre
     */
    private boolean isCircularReference(Category parent, Category child) {
        if (parent.getId().equals(child.getId())) {
            return true;
        }
        Category current = parent;
        while (current.getParentCategory() != null) {
            if (current.getParentCategory().getId().equals(child.getId())) {
                return true;
            }
            current = current.getParentCategory();
        }
        return false;
    }
}