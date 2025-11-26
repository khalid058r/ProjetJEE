package com.projetee.sallesmangement.repository;

import com.projetee.sallesmangement.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {
}
