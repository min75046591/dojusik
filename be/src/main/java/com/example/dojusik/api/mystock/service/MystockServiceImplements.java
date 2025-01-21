package com.example.dojusik.api.mystock.service;

import com.example.dojusik.api.auth.entity.UserEntity;
import com.example.dojusik.api.auth.repository.UserRepository;
import com.example.dojusik.api.mystock.entity.LikeStockEntity;
import com.example.dojusik.api.mystock.entity.UserStockEntity;
import com.example.dojusik.api.mystock.repository.LikeStockRepository;
import com.example.dojusik.api.mystock.repository.UserStockRepository;
import com.example.dojusik.api.mystock.dto.request.MystockSellRequestDto;
import com.example.dojusik.api.stock.entity.StockEntity;
import com.example.dojusik.api.stock.entity.TradeStockEntity;
import com.example.dojusik.api.stock.repository.StockRepository;
import com.example.dojusik.api.stock.repository.TradeStockHistoryRepository;
import com.example.dojusik.common.ResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MystockServiceImplements implements MystockService {

    private final StockRepository stockRepository;
    private final UserRepository userRepository;
    private final UserStockRepository userStockRepository;
    private final TradeStockHistoryRepository tradeStockHistoryRepository;
    private final LikeStockRepository likeStockRepository;

    @Override
    public ResponseEntity<ResponseDto> getMyStock(UserEntity user)
    {
        try{
            List<UserStockEntity> userStocks = userStockRepository.findAllByUserId(user.getId());
            return ResponseDto.success("보유한 주식 정보 전체 조회",userStocks);
        }catch (Exception e){
            e.printStackTrace();
            return ResponseDto.serverError();
        }
    }

    @Override
    public ResponseEntity<ResponseDto> sellStock(UserEntity user, MystockSellRequestDto dto) {
//        return null;
        try{
            UserStockEntity userStock = userStockRepository.findByUserIdAndTicker(user.getId(),dto.getTicker());
            if(userStock ==null) return ResponseDto.error(HttpStatus.BAD_REQUEST, "해당 주식을 보유하고 있지 않습니다");
            int quantity = dto.getQuantity();
            BigDecimal pricePerUnit = dto.getPricePerUnit();

            // 2. 판매 수량 검증
            if (userStock.getQuantity() < quantity)
                  return ResponseDto.error(HttpStatus.BAD_REQUEST, "판매 요청 수량이 보유 수량을 초과하였습니다");

            // stock 판매시
            // 1. userstock 에서 보유수량 정정
            userStock = userStock.sellStock(quantity);
            userStockRepository.save(userStock);

            StockEntity stock = stockRepository.findByTicker(dto.getTicker());
            //2. tradeHistory에서 판매기록 생성
            TradeStockEntity tradeStock = TradeStockEntity.create(user, dto, stock);
            tradeStockHistoryRepository.save(tradeStock);
//
            //3. UserEntity에서 quantity * priceperunit 만큼 cash 증가
            user = user.updateCash(quantity, pricePerUnit,"sell");
            userRepository.save(user);
//
            return ResponseDto.success("주식 판매 내역", tradeStock);

        }catch (Exception e){
            e.printStackTrace();
            return ResponseDto.serverError();
        }
    }

    @Override
    public ResponseEntity<ResponseDto> getLikeStocks(UserEntity user) {
        try{
            if (user ==null) return ResponseDto.error(HttpStatus.NOT_FOUND, "존재하지 않는 사용자입니다");
            List<LikeStockEntity> likeStocks = likeStockRepository.findAllByUserId(user.getId());
            if (likeStocks == null) return ResponseDto.success("관심 설정한 주식이 없습니다",null);
            return ResponseDto.success("관심 설정한 주식은 다음과 같습니다", likeStocks);

        }catch (Exception e){
            e.printStackTrace();
            return ResponseDto.serverError();
        }
    }

    @Override
    public ResponseEntity<ResponseDto> setLikeStock(UserEntity user, String ticker) {
        try{
            StockEntity stock = stockRepository.findByTicker(ticker);
            if (stock == null) return ResponseDto.error(HttpStatus.BAD_REQUEST, "존재하지 않는 주식입니다");

            LikeStockEntity likeStock = likeStockRepository.findByUserIdAndStockId(user.getId(), stock.getId());

            if (likeStock == null){
                LikeStockEntity newLikeStock = LikeStockEntity.create(user, stock);
                likeStockRepository.save(newLikeStock);
                return ResponseDto.success("관심 주식이 설정되었습니다", null);
            } else{
                likeStockRepository.delete(likeStock);
                return ResponseDto.success("관심 주식이 설정이 취소되었습니다", null);
            }


        }catch (Exception e){
            e.printStackTrace();
            return ResponseDto.serverError();
        }
    }
}
