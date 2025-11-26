package com.projetee.sallesmangement.mapper;

import com.projetee.sallesmangement.dto.sale.SaleRequest;
import com.projetee.sallesmangement.dto.sale.SaleResponse;
import com.projetee.sallesmangement.entity.Sale;
import com.projetee.sallesmangement.entity.User;
import com.projetee.sallesmangement.repository.UserRepository;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class SaleMapper {

    private final UserRepository userRepository;

    public SaleMapper(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public Sale toEntity(SaleRequest dto) {
        Sale entity = new Sale();

        entity.setSaleDate(LocalDate.parse(dto.getSaleDate()));
        entity.setTotalAmount(dto.getTotalAmount());

        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        entity.setUser(user);

        return entity;
    }

    public SaleResponse toResponse(Sale entity) {
        SaleResponse dto = new SaleResponse();

        dto.setId(entity.getId());
        dto.setSaleDate(String.valueOf(entity.getSaleDate()));
        dto.setTotalAmount(entity.getTotalAmount());
        dto.setUserId(entity.getUser().getId());
        dto.setUsername(entity.getUser().getUsername());

        return dto;
    }
}
