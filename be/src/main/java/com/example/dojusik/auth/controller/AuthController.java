package com.example.dojusik.auth.controller;

import com.example.dojusik.auth.dto.request.EmailCertificationRequestDto;
import com.example.dojusik.auth.dto.request.LoginRequestDto;
import com.example.dojusik.auth.dto.request.SignupRequestDto;
import com.example.dojusik.auth.service.AuthService;
import com.example.dojusik.common.ResponseDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<ResponseDto> signup(
            @RequestBody @Valid SignupRequestDto requestBody
    ) {
        ResponseEntity<ResponseDto> response = authService.signup(requestBody);
        return response;
    }

    @PostMapping("/login") // @ResponseBody ResponseDto도 가능
    public ResponseEntity<ResponseDto> login(
            @RequestBody @Valid LoginRequestDto requestBody
    ) {
        ResponseEntity<ResponseDto> response = authService.login(requestBody);
        return response;
    }

    @PostMapping("email-certification")
    public ResponseEntity<ResponseDto> emailCertification (
            @RequestBody @Valid EmailCertificationRequestDto requestBody
    ){
        ResponseEntity<ResponseDto> response = authService.emailCertification(requestBody);
        return response;
    }
}
