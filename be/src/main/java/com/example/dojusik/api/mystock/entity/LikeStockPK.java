package com.example.dojusik.api.mystock.entity;

import jakarta.persistence.Column;
import java.io.Serializable;

// 복합키 클래스 생성
public class LikeStockPK implements Serializable {
    private int userId;
    private int stockId;
}
