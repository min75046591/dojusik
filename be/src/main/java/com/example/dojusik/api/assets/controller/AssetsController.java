package com.example.dojusik.api.assets.controller;

import com.example.dojusik.api.assets.dto.request.AssetsRechargeRequestDto;
import com.example.dojusik.api.assets.dto.request.AssetsWithdrawRequestDto;
import com.example.dojusik.api.assets.service.AssetService;
import com.example.dojusik.api.auth.entity.UserEntity;
import com.example.dojusik.common.ResponseDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/assets")
@RequiredArgsConstructor
public class AssetsController {

    private final AssetService assetService;

    // 자산 조회
    @GetMapping("")
    public ResponseEntity<ResponseDto> getMyAssets(
        @AuthenticationPrincipal UserEntity user // 내 자산조회
    ) {
        ResponseEntity<ResponseDto> response = assetService.getMyAssets(user);
        return response;
    }

    // 자산 추가
    @PatchMapping("/recharge") // @ResponseBody ResponseDto도 가능
    public ResponseEntity<ResponseDto> rechargeAssets(
            @AuthenticationPrincipal UserEntity user, // 내 자산조회
            @RequestBody @Valid AssetsRechargeRequestDto requestBody
    ) {
        ResponseEntity<ResponseDto> response = assetService.rechargeAssets(user,requestBody);
        return response;
    }

    // 자산 인출
    @PatchMapping("/withdraw")
    public ResponseEntity<ResponseDto> withdrawAssets (
            @AuthenticationPrincipal UserEntity user,
            @RequestBody @Valid AssetsWithdrawRequestDto requestBody
    ){
        ResponseEntity<ResponseDto> response = assetService.withdrawAssets(user,requestBody);
        return response;
    }
}
