package com.projetee.sallesmangement.service;

import com.projetee.sallesmangement.dto.sale.SaleRequest;
import com.projetee.sallesmangement.dto.sale.SaleResponse;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.util.List;

public interface SaleService {

    SaleResponse create(SaleRequest request);

    SaleResponse get(Long id);

    List<SaleResponse> getAll();

    Page<SaleResponse> getPaginated(int page, int size);

    SaleResponse cancel(Long id);

    void delete(Long id);
}
