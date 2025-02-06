//package com.example.dojusik.api.stock.entity;
package com.example.dojusik.api.stock.entity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity(name="stocks")
@Table(name="stocks")
public class StockEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private int id;
    @Column(name = "ticker", length = 20, nullable = false)
    private String ticker;
    @Column(name = "stock_name", length = 100, nullable = false)
    private String stockName;

    @OneToMany(mappedBy = "stock", fetch = FetchType.LAZY)
    private List<TradeStockEntity> tradeHistory = new ArrayList<>();

}
