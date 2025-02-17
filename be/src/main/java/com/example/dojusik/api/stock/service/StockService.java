package com.example.dojusik.api.stock.service;

import com.example.dojusik.api.auth.entity.UserEntity;
import com.example.dojusik.api.mystock.dto.request.MystockSellRequestDto;
import com.example.dojusik.api.stock.dto.request.StockSearchRequestDto;
import com.example.dojusik.api.stock.dto.request.StockTradeRequestDto;
import com.example.dojusik.common.ResponseDto;
import org.springframework.http.ResponseEntity;
import reactor.core.publisher.Mono;

public interface StockService {
    Mono<ResponseEntity<ResponseDto>> search(String stockname);
    Mono<ResponseEntity<ResponseDto>> buy(UserEntity user, StockTradeRequestDto dto);
    Mono<ResponseEntity<ResponseDto>> sell(UserEntity user, StockTradeRequestDto dto);
}
