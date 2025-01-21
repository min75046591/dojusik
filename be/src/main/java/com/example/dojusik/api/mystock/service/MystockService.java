package com.example.dojusik.api.mystock.service;

import com.example.dojusik.api.auth.entity.UserEntity;
import com.example.dojusik.api.mystock.dto.request.MystockSellRequestDto;
import com.example.dojusik.common.ResponseDto;
import org.springframework.http.ResponseEntity;

public interface MystockService {
    ResponseEntity<ResponseDto> getMyStock(UserEntity user);
    ResponseEntity<ResponseDto> sellStock(UserEntity user, MystockSellRequestDto dto);
}
