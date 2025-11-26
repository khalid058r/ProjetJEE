package com.projetee.sallesmangement.dto.sale;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SaleRequest {

    @NotNull
    private Long userId;

    @NotNull
    private String saleDate;

    @NotNull
    private Double totalAmount;
}
