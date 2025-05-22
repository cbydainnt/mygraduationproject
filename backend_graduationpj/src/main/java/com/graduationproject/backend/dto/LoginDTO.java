package com.graduationproject.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginDTO {
    @NotBlank(message = "Username cannot be blank")
    private String username;

    @NotBlank(message = "Password cannot be blank")
    private String password;

    private boolean rememberMe; // Giữ lại nếu bạn dùng Remember Me với login form truyền thống
}