// src/main/java/com/graduationproject/backend/service/CustomOAuth2UserService.java
package com.graduationproject.backend.service;

import com.graduationproject.backend.util.CustomUserDetails;
import com.graduationproject.backend.entity.User;
import com.graduationproject.backend.exception.OAuth2AuthenticationProcessingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    @Autowired
    private UserService userService; // Inject UserService để xử lý user

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oauth2User = super.loadUser(userRequest);
        try {
            // Gọi hàm xử lý user trong UserService
            User user = userService.processOAuth2User(
                    userRequest.getClientRegistration().getRegistrationId(), // providerId (vd: "google")
                    oauth2User
            );
            // Trả về CustomUserDetails chứa User entity và attributes gốc
            return new CustomUserDetails(user, oauth2User.getAttributes());
        } catch (Exception ex) {
            // Xử lý lỗi nếu có trong quá trình xử lý user
            throw new OAuth2AuthenticationProcessingException(ex.getMessage(), ex.getCause());
        }
    }
}