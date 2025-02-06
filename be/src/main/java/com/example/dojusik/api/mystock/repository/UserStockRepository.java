package com.example.dojusik.api.mystock.repository;

import com.example.dojusik.api.mystock.entity.UserStockEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserStockRepository extends JpaRepository<UserStockEntity, Integer> {
//    @Query("SELECT u FROM UserStockEntity u WHERE u.user.id = :userId")
    List<UserStockEntity> findAllByUserId(int userId);

    // 쿼리: 사용자가 userId, ticker 주면 주식테이블에서 주식id 찾고 userstock 테이블에서 회원id와 주식id로 유저stock찾기
    @Query("SELECT us FROM users_stocks us JOIN stocks s ON us.stock.id = s.id WHERE s.ticker =: ticker AND us.user.id =: userId")
    UserStockEntity findByUserIdAndTicker(@Param("userId") int userId, @Param("ticker") String ticker);

}
