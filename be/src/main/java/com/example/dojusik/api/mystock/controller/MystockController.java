package com.example.dojusik.api.mystock.controller;

import com.example.dojusik.api.mystock.dto.request.MystockSellRequestDto;
import com.example.dojusik.api.auth.entity.UserEntity;
import com.example.dojusik.api.mystock.service.MystockService;
import com.example.dojusik.common.ResponseDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/mystock")
@RequiredArgsConstructor
public class MystockController {

    private final MystockService mystockService;
    // 주식 조회
    @GetMapping("")
    public ResponseEntity<ResponseDto> getMystock(
        @AuthenticationPrincipal UserEntity user
    ) {
        ResponseEntity<ResponseDto> response = mystockService.getMyStock(user);
        return response;
    }

    // 주식 판매
    @PatchMapping("/sell") // @ResponseBody ResponseDto도 가능
    public ResponseEntity<ResponseDto> sellStock(
            @AuthenticationPrincipal UserEntity user,
            @RequestBody @Valid MystockSellRequestDto requestBody
            ) {
        ResponseEntity<ResponseDto> response = mystockService.sellStock(user,requestBody);
        return response;
    }

}
