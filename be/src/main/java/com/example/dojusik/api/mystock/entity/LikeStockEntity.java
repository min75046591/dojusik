package com.example.dojusik.api.mystock.entity;
import com.example.dojusik.api.auth.entity.UserEntity;
import com.example.dojusik.api.stock.entity.StockEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "users_likes")
@Table(name = "users_likes")
@IdClass(LikeStockPK.class)
public class LikeStockEntity {
    @Id
    @Column(name = "user_id")
    private int userId;
    @Id
    @Column(name = "stock_id")
    private int stockId;

    // Many-to-Many 관계 설정
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private UserEntity user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "stock_id", insertable = false, updatable = false)
    private StockEntity stock;

    public static LikeStockEntity create(UserEntity user, StockEntity stock) {
        LikeStockEntity likeStock = new LikeStockEntity();
        likeStock.userId = user.getId();
        likeStock.stockId = stock.getId();
        return likeStock;
    }
}
