package com.projetee.sallesmangement.service;

import com.projetee.sallesmangement.dto.category.CategoryRequest;
import com.projetee.sallesmangement.dto.category.CategoryResponse;
import org.springframework.data.domain.Page;

import java.util.List;

public interface CategoryService {

    CategoryResponse create(CategoryRequest request);

    CategoryResponse get(Long id);

    List<CategoryResponse> getAll();

    Page<CategoryResponse> getPaginated(int page, int size, String sortBy);

    CategoryResponse update(Long id, CategoryRequest request);

    void delete(Long id);
}

