package com.projetee.sallesmangement.dto.sale;

import com.projetee.sallesmangement.dto.lignevente.LigneVenteRequest;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class SaleRequest {

    @NotNull
    private Long userId;

    @NotNull
    private String saleDate;

    @NotNull
    private Double totalAmount;
    private List<LigneVenteRequest> lignes;
}
