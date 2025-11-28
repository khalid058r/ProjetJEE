package com.projetee.sallesmangement.service.Impl;


import com.projetee.sallesmangement.dto.lignevente.LigneVenteResponse;
import com.projetee.sallesmangement.entity.LigneVente;
import com.projetee.sallesmangement.exception.ResourceNotFoundException;
import com.projetee.sallesmangement.mapper.LigneVenteMapper;
import com.projetee.sallesmangement.repository.LigneVenteRepository;
import com.projetee.sallesmangement.service.LigneVenteService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LigneVenteServiceImpl implements LigneVenteService {

    private final LigneVenteRepository repo;
    private final LigneVenteMapper mapper;

    @Override
    public LigneVenteResponse get(Long id) {
        LigneVente lv = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sale line not found"));

        return mapper.toResponse(lv);
    }
}
