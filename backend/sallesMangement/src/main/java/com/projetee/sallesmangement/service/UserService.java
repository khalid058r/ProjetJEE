package com.projetee.sallesmangement.service;



import com.projetee.sallesmangement.dto.user.UserRequest;
import com.projetee.sallesmangement.dto.user.UserResponse;

import java.util.List;

public interface UserService {

    UserResponse create(UserRequest request);

    UserResponse get(Long id);

    List<UserResponse> getAll();

    UserResponse update(Long id, UserRequest request);

    void delete(Long id);
}
