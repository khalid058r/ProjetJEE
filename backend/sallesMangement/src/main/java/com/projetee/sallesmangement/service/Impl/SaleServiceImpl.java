package com.projetee.sallesmangement.service.Impl;

import com.projetee.sallesmangement.dto.lignevente.LigneVenteRequest;
import com.projetee.sallesmangement.dto.sale.SaleRequest;
import com.projetee.sallesmangement.dto.sale.SaleResponse;
import com.projetee.sallesmangement.entity.*;
import com.projetee.sallesmangement.exception.BadRequestException;
import com.projetee.sallesmangement.exception.ResourceNotFoundException;
import com.projetee.sallesmangement.mapper.LigneVenteMapper;
import com.projetee.sallesmangement.mapper.SaleMapper;
import com.projetee.sallesmangement.repository.LigneVenteRepository;
import com.projetee.sallesmangement.repository.ProductRepository;
import com.projetee.sallesmangement.repository.SaleRepository;
import com.projetee.sallesmangement.repository.UserRepository;
import com.projetee.sallesmangement.service.SaleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SaleServiceImpl implements SaleService {

    private final SaleRepository saleRepo;
    private final UserRepository userRepo;
    private final ProductRepository productRepo;
    private final LigneVenteRepository ligneRepo;
    private final SaleMapper saleMapper;
    private final LigneVenteMapper ligneMapper;

    @Override
    public SaleResponse create(SaleRequest request) {

        // Vérifier user
        User user = userRepo.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Rôle
        if (user.getRole() != Role.ADMIN && user.getRole() != Role.VENDEUR) {
            throw new BadRequestException("User not allowed to create sales");
        }

        // Création de la vente
        Sale sale = new Sale();
        sale.setUser(user);
        sale.setSaleDate(LocalDate.now());

        Sale savedSale = saleRepo.save(sale);

        double total = 0;

        // Ajouter lignes
        for (LigneVenteRequest lineRequest : request.getLignes()) {

            Product product = productRepo.findById(lineRequest.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

            if (lineRequest.getQuantity() <= 0) {
                throw new BadRequestException("Invalid quantity");
            }

            LigneVente lv = new LigneVente();
            lv.setSale(savedSale);
            lv.setProduct(product);
            lv.setQuantity(lineRequest.getQuantity());
            lv.setUnitPrice(product.getPrice());
            lv.setLineTotal(product.getPrice() * lineRequest.getQuantity());

            total += lv.getLineTotal();

            ligneRepo.save(lv);
        }

        savedSale.setTotalAmount(total);
        saleRepo.save(savedSale);

        return saleMapper.toResponse(savedSale);
    }

    @Override
    public SaleResponse get(Long id) {
        Sale sale = saleRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sale not found"));

        return saleMapper.toResponse(sale);
    }

    @Override
    public List<SaleResponse> getAll() {
        return saleRepo.findAll().stream()
                .map(saleMapper::toResponse)
                .toList();
    }

    @Override
    public void delete(Long id) {
        Sale sale = saleRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sale not found"));

        saleRepo.delete(sale);
    }
}
