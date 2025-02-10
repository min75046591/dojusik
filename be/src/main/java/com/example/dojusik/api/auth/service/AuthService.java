package com.example.dojusik.api.auth.service;

import com.example.dojusik.api.auth.dto.request.EmailCertificationRequestDto;
import com.example.dojusik.api.auth.dto.request.LoginRequestDto;
import com.example.dojusik.api.auth.dto.request.SignupRequestDto;
import com.example.dojusik.common.ResponseDto;
import org.springframework.http.ResponseEntity;

public interface AuthService {
    ResponseEntity<ResponseDto> signup(SignupRequestDto dto);
    ResponseEntity<ResponseDto> login(LoginRequestDto dto);
    ResponseEntity<ResponseDto> emailCertification(EmailCertificationRequestDto dto);
}
