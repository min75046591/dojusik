package com.example.dojusik.api.auth.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.dojusik.api.auth.dto.request.EmailCertificationRequestDto;
import com.example.dojusik.api.auth.dto.request.LoginRequestDto;
import com.example.dojusik.api.auth.dto.request.SignupRequestDto;
import com.example.dojusik.api.auth.service.AuthService;
import com.example.dojusik.common.ResponseDto;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

   @GetMapping ("/test")
   public String test(){
       return "Helleedddddrererwo";
   }

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

    @PostMapping("/email-certification")
    public ResponseEntity<ResponseDto> emailCertification (
            @RequestBody @Valid EmailCertificationRequestDto requestBody
    ){
        ResponseEntity<ResponseDto> response = authService.emailCertification(requestBody);
        return response;
    }

}
