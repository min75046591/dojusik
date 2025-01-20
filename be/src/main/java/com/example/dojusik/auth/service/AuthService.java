package com.example.dojusik.auth.service;

import com.example.dojusik.auth.dto.request.EmailCertificationRequestDto;
import com.example.dojusik.auth.dto.request.LoginRequestDto;
import com.example.dojusik.auth.dto.request.SignupRequestDto;
import com.example.dojusik.common.ResponseDto;
import org.springframework.http.ResponseEntity;

public interface AuthService {
    ResponseEntity<ResponseDto> signup(SignupRequestDto dto);
    ResponseEntity<ResponseDto> login(LoginRequestDto dto);
    ResponseEntity<ResponseDto> emailCertification(EmailCertificationRequestDto dto);
}
