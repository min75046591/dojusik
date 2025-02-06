//package com.example.dojusik.api.stock.entity;
package com.example.dojusik.api.stock.entity;

import com.example.dojusik.api.auth.entity.UserEntity;
import com.example.dojusik.api.mystock.dto.request.MystockSellRequestDto;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity(name="trade_history")
@Table(name="trade_history")
public class TradeStockEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id; // 기본 키

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id") // 유저와 다대일 관계, user_id라는외래키 생성됨
    private UserEntity user;

    @ManyToOne(fetch = FetchType.LAZY)// stock 다대일 관계, stock_id라는외래키 생성됨
    @JoinColumn(name = "stock_id")
    private StockEntity stock;

    @Enumerated(EnumType.STRING)
    private TradeType tradeType; // 거래 유형 (BUY/SELL)

    private int quantity; // 거래 수량

    private BigDecimal pricePerUnit; // 거래 당시 단가

    @CreatedDate
    private LocalDateTime tradeDate; // 거래 일시


    public enum TradeType {
        BUY, SELL // 구매와 판매 유형
    }
    public static TradeStockEntity create(UserEntity user, MystockSellRequestDto dto, StockEntity stock) {
        TradeStockEntity tradeStock = new TradeStockEntity();
        tradeStock.user = user;
        tradeStock.stock = stock;
        tradeStock.tradeType = TradeType.SELL;
        tradeStock.quantity = dto.getQuantity();
        tradeStock.pricePerUnit = dto.getPricePerUnit();
        tradeStock.tradeDate = LocalDateTime.now();
        return tradeStock;
    }
}
