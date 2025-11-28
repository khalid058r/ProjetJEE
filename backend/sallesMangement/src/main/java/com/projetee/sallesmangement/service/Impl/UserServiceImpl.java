package com.projetee.sallesmangement.service.Impl;

import com.projetee.sallesmangement.dto.user.UserRequest;
import com.projetee.sallesmangement.dto.user.UserResponse;
import com.projetee.sallesmangement.entity.User;
import com.projetee.sallesmangement.exception.BadRequestException;
import com.projetee.sallesmangement.exception.DuplicateResourceException;
import com.projetee.sallesmangement.exception.ResourceNotFoundException;
import com.projetee.sallesmangement.mapper.UserMapper;
import com.projetee.sallesmangement.repository.UserRepository;
import com.projetee.sallesmangement.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository repo;
    private final UserMapper mapper;

    @Override
    public UserResponse create(UserRequest request) {

        if (repo.existsByEmailIgnoreCase(request.getEmail())) {
            throw new DuplicateResourceException("Email already used");
        }

        User user = mapper.toEntity(request);
        User saved = repo.save(user);

        return mapper.toResponse(saved);
    }

    @Override
    public UserResponse get(Long id) {
        User user = repo.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found")
                );
        return mapper.toResponse(user);
    }

    @Override
    public List<UserResponse> getAll() {
        return repo.findAll()
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Override
    public UserResponse update(Long id, UserRequest request) {

        User user = repo.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found")
                );

        if (!user.getEmail().equalsIgnoreCase(request.getEmail()) &&
                repo.existsByEmailIgnoreCase(request.getEmail())) {
            throw new DuplicateResourceException("Email already used");
        }

        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setRole(request.getRole());

        return mapper.toResponse(repo.save(user));
    }

    @Override
    public void delete(Long id) {
        User user = repo.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found")
                );

        if (!user.getSales().isEmpty()) {
            throw new BadRequestException("User has sales and cannot be deleted");
        }

        repo.delete(user);
    }
}
