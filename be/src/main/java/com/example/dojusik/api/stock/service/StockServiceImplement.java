package com.example.dojusik.api.stock.service;

import com.example.dojusik.api.auth.entity.UserEntity;
import com.example.dojusik.api.auth.repository.UserRepository;
import com.example.dojusik.api.stock.dto.request.StockTradeRequestDto;
import com.example.dojusik.api.stock.repository.StockRepository;
import com.example.dojusik.common.ResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

@Service
@RequiredArgsConstructor
public class StockServiceImplement implements StockService{

    private final StockRepository stockRepository;
    private final StockApiClient stockApiClient;
    private final UserRepository userRepository;

    @Override
    public Mono<ResponseEntity<ResponseDto>> search(String stockname) {
        String ticker = stockRepository.findTickerByStockName(stockname);
        if (ticker == null) {
            return Mono.just(ResponseDto.error(HttpStatus.BAD_REQUEST, "해당 주식을 찾을 수 없습니다."));
        }
        return stockApiClient.fetchSearchData(ticker)
                .map(response -> ResponseDto.success("검색", response));
    };

    @Override
    public Mono<ResponseEntity<ResponseDto>> buy(UserEntity user, StockTradeRequestDto dto) {
        Long totalCost = ((long) dto.getAmount() * dto.getPrice());

        if (user.getCash() < totalCost) {
            return Mono.just(ResponseDto.error(HttpStatus.BAD_REQUEST, "주문가격이 소지금보다 많습니다."));
        }
        return stockApiClient.fetchBuyData(user, dto)
                .flatMap(response -> {
                    user.setCash(user.getCash() - totalCost);
                    return Mono.fromCallable(() -> userRepository.save(user))
                            .subscribeOn(Schedulers.boundedElastic())
                            .map(savedUser -> ResponseDto.success("매수",response));
                });
    };

    @Override
    public Mono<ResponseEntity<ResponseDto>> sell(UserEntity user, StockTradeRequestDto dto) {
        Long totalCost = ((long) dto.getAmount() * dto.getPrice());

        return stockApiClient.fetchSellData(user, dto)
                .flatMap(response -> {
                    user.setCash(user.getCash() + totalCost);
                    return Mono.fromCallable(() -> userRepository.save(user))
                            .subscribeOn(Schedulers.boundedElastic())
                            .map(savedUser -> ResponseDto.success("매도",response));
                });
    };
}
