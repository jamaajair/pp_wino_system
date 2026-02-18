package com.wino.demo.products.entity;

import java.math.BigDecimal;

import com.wino.demo.category.entity.Category;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String code;
    private String name;
    private BigDecimal purchasePrice;
    private BigDecimal salePrice;
    
    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;
}