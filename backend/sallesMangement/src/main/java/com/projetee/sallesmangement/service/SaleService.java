package com.projetee.sallesmangement.service;

import com.projetee.sallesmangement.dto.sale.SaleRequest;
import com.projetee.sallesmangement.dto.sale.SaleResponse;
import jakarta.validation.constraints.NotBlank;

import java.util.List;

public interface SaleService {
    SaleResponse create(SaleRequest saleRequest);
//    SaleResponse update(SaleRequest saleRequest);
    void delete(Long id);
    List<SaleResponse> getAll();
//    SaleResponse getById(@NotBlank String id);
    SaleResponse get(Long id);
}
