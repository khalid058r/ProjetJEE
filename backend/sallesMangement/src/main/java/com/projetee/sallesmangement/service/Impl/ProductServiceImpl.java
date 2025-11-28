package com.projetee.sallesmangement.service.Impl;

import com.projetee.sallesmangement.dto.product.ProductRequest;
import com.projetee.sallesmangement.dto.product.ProductResponse;
import com.projetee.sallesmangement.entity.Category;
import com.projetee.sallesmangement.entity.Product;
import com.projetee.sallesmangement.exception.BadRequestException;
import com.projetee.sallesmangement.exception.DuplicateResourceException;
import com.projetee.sallesmangement.exception.ResourceNotFoundException;
import com.projetee.sallesmangement.mapper.ProductMapper;
import com.projetee.sallesmangement.repository.CategoryRepository;
import com.projetee.sallesmangement.repository.ProductRepository;
import com.projetee.sallesmangement.service.ProductService;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository repo;
    private final CategoryRepository categoryRepo;
    private final ProductMapper mapper;

    @Override
    public ProductResponse create(ProductRequest request) {

        // Vérification catégorie
        Category category = categoryRepo.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        // Vérifier duplicat de titre
        if (repo.existsByTitleIgnoreCase(request.getTitle())) {
            throw new DuplicateResourceException("Product title already exists");
        }

        if (request.getPrice() <= 0) {
            throw new BadRequestException("Invalid price");
        }

        Product product = mapper.toEntity(request);
        product.setCategory(category);

        Product saved = repo.save(product);
        return mapper.toResponse(saved);
    }

    @Override
    public ProductResponse get(Long id) {
        Product product = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        return mapper.toResponse(product);
    }

    @Override
    public List<ProductResponse> getAll() {
        return repo.findAll().stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Override
    public Page<ProductResponse> getPaginated(int page, int size) {

        Pageable pageable = PageRequest.of(page, size);
        return repo.findAll(pageable).map(mapper::toResponse);
    }

    @Override
    public ProductResponse update(Long id, ProductRequest request) {

        Product product = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        Category category = categoryRepo.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        if (!product.getTitle().equalsIgnoreCase(request.getTitle()) &&
                repo.existsByTitleIgnoreCase(request.getTitle())) {
            throw new DuplicateResourceException("Product title already used");
        }

        if (request.getPrice() <= 0) {
            throw new BadRequestException("Invalid price");
        }

        product.setTitle(request.getTitle());
        product.setPrice(request.getPrice());
        product.setRating(request.getRating());
        product.setReviewCount(request.getReviewCount());
        product.setCategory(category);

        return mapper.toResponse(repo.save(product));
    }

    @Override
    public void delete(Long id) {
        Product product = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        if (!product.getLignesVente().isEmpty()) {
            throw new BadRequestException("Cannot delete product used in sales");
        }

        repo.delete(product);
    }
}
