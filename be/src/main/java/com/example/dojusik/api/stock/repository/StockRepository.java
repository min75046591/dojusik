//package com.example.dojusik.api.stock.repository;
package com.example.dojusik.api.stock.repository;

import com.example.dojusik.api.stock.entity.StockEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StockRepository extends JpaRepository<StockEntity,Integer> {
    StockEntity findByTicker(String ticker);
}
