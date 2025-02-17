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
import reactor.core.publisher.Mono;

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
//
//    // 주식 판매
//    @PatchMapping("/sell") // @ResponseBody ResponseDto도 가능
//    public ResponseEntity<ResponseDto> sellStock(
//            @AuthenticationPrincipal UserEntity user,
//            @RequestBody @Valid MystockSellRequestDto requestBody
//            ) {
//        ResponseEntity<ResponseDto> response = mystockService.sellStock(user,requestBody);
//        return response;
//    }
//
//    // 주식 구매
//    @PatchMapping("/buy") // @ResponseBody ResponseDto도 가능
//    public ResponseEntity<ResponseDto> buyStock(
//            @AuthenticationPrincipal UserEntity user,
//            @RequestBody @Valid MystockSellRequestDto requestBody
//    ) {
//        ResponseEntity<ResponseDto> response = mystockService.buyStock(user,requestBody);
//        return response;
////        return mystockService.buyStock(user,requestBody);
//    }

    // 관심 주식 조회
    @GetMapping("/likeStock")
    public ResponseEntity<ResponseDto> getLikeStocks(
            @AuthenticationPrincipal UserEntity user
    ){
        ResponseEntity<ResponseDto> response = mystockService.getLikeStocks(user);
        return response;
    }

    // 관심 주식 설정 / 취소
    @PostMapping("likeStock/post")
    public ResponseEntity<ResponseDto> setLikeStock(
            @AuthenticationPrincipal UserEntity user,
            @RequestParam String ticker
    ){
        ResponseEntity<ResponseDto> response = mystockService.setLikeStock(user,ticker);
        return response;
    }

}
