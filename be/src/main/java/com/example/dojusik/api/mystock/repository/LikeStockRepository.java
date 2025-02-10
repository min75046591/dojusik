package com.example.dojusik.api.mystock.repository;

import com.example.dojusik.api.mystock.entity.LikeStockEntity;
import com.example.dojusik.api.mystock.entity.LikeStockPK;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LikeStockRepository extends JpaRepository<LikeStockEntity, LikeStockPK> {
    @Query("SELECT ul FROM users_likes ul WHERE ul.user.id =:userId")
   List<LikeStockEntity> findAllByUserId(@Param("userId") int userId);
   LikeStockEntity findByUserIdAndStockId(int userId, int stockId);
}
