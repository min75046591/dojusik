package com.example.dojusik.config;

import com.example.dojusik.api.stock.entity.StockEntity;
import com.example.dojusik.api.stock.repository.StockRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.io.InputStream;
import java.util.List;

@Component
public class StockDataInitializer {
    private final StockRepository stockRepository;
    private final ObjectMapper objectMapper;

    public StockDataInitializer(StockRepository stockRepository, ObjectMapper objectMapper) {
        this.stockRepository = stockRepository;
        this.objectMapper = objectMapper;
    }

    @Transactional
    @PostConstruct
    public void init() {
        if (stockRepository.count() == 0) {
            try {
                InputStream inputStream = getClass().getClassLoader().getResourceAsStream("stocks.json");
                if (inputStream == null) {
                    throw new RuntimeException("stocks.json 파일을 찾을 수 없습니다.");
                }

                List<StockEntity> stocks = objectMapper.readValue(inputStream, new TypeReference<List<StockEntity>>() {
                });
                stockRepository.saveAll(stocks);
                System.out.println("초기 데이터 삽입 완료!");
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

}
