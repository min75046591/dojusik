package com.example.dojusik.api.assets.service;

import com.example.dojusik.api.assets.dto.request.AssetsRechargeRequestDto;
import com.example.dojusik.api.assets.dto.request.AssetsWithdrawRequestDto;
import com.example.dojusik.api.auth.entity.UserEntity;
import com.example.dojusik.common.ResponseDto;
import org.springframework.http.ResponseEntity;

public interface AssetService {
    ResponseEntity<ResponseDto> getMyAssets(UserEntity user);
    ResponseEntity<ResponseDto> rechargeAssets(UserEntity user, AssetsRechargeRequestDto dto);
    ResponseEntity<ResponseDto> withdrawAssets(UserEntity user, AssetsWithdrawRequestDto dto);
}
