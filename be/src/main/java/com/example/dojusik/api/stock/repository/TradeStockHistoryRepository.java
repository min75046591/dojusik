package com.example.dojusik.api.stock.repository;

import com.example.dojusik.api.stock.entity.TradeStockEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TradeStockHistoryRepository extends JpaRepository<TradeStockEntity,Integer> {
}
