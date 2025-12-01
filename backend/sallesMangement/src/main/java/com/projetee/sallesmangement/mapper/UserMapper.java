package com.projetee.sallesmangement.mapper;

import com.projetee.sallesmangement.dto.user.UserRequest;
import com.projetee.sallesmangement.dto.user.UserResponse;
import com.projetee.sallesmangement.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public User toEntity(UserRequest dto) {
        return User.builder()
                .username(dto.getUsername())
                .email(dto.getEmail())
                .password(dto.getPassword())
                .role(dto.getRole())
                .active(true)
                .build();
    }

    public UserResponse toResponse(User user) {
        UserResponse dto = new UserResponse();

        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole());
        dto.setActive(user.isActive());

        return dto;
    }
}
