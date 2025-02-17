//package com.example.dojusik.api.stock.repository;
package com.example.dojusik.api.stock.repository;

import com.example.dojusik.api.stock.entity.StockEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface StockRepository extends JpaRepository<StockEntity,Integer> {
    StockEntity findByTicker(String ticker);
    StockEntity findByStockName(String stockName);
    @Query(value = "SELECT ticker FROM stocks WHERE stock_name = :stockName", nativeQuery = true)
    String findTickerByStockName(@Param("stockName") String stockName);
}
