package com.projetee.sallesmangement.dto.sale;

import lombok.Data;

@Data
public class SaleResponse {

    private Long id;
    private String saleDate;
    private Double totalAmount;

    private Long userId;
    private String username;
}
