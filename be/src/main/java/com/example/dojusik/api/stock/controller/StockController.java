package com.example.dojusik.api.stock.controller;

import com.example.dojusik.api.auth.entity.UserEntity;
import com.example.dojusik.api.stock.dto.request.StockTradeRequestDto;
import com.example.dojusik.api.stock.service.StockService;
import com.example.dojusik.common.ResponseDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/stock")
@RequiredArgsConstructor
public class StockController {

    private final StockService stockService;

    @GetMapping("/search")
    public Mono<ResponseEntity<ResponseDto>> search (@RequestParam String stockname) {
//        ResponseEntity<ResponseDto> response = stockService.search(stockname);
        return stockService.search(stockname);
    }

    @PostMapping("/buy")
    public Mono<ResponseEntity<ResponseDto>> buy (
            @AuthenticationPrincipal UserEntity user,
            @RequestBody @Valid StockTradeRequestDto requestBody) {
        return stockService.buy(user, requestBody);
    };

    @PostMapping("/sell")
    public Mono<ResponseEntity<ResponseDto>> sell (
            @AuthenticationPrincipal UserEntity user,
            @RequestBody @Valid StockTradeRequestDto requestBody) {
        return stockService.sell(user, requestBody);
    };
}

