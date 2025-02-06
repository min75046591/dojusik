package com.example.dojusik.api.mystock.entity;

import com.example.dojusik.api.auth.entity.UserEntity;
import com.example.dojusik.api.stock.entity.StockEntity;
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
@Entity(name="users_stocks")
@Table(name="users_stocks")
public class UserStockEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable=false)
    private UserEntity user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "stock_id", nullable=false)
    private StockEntity stock;

    private int quantity;
    private BigDecimal purchasePrice; // 연산시 산술연산자 아닌 메서드 사용해야함

    @CreatedDate
    private LocalDateTime purchaseDate;

    public UserStockEntity sellStock(int quantity) {
        this.quantity-=quantity;
        return this;
    }
}
