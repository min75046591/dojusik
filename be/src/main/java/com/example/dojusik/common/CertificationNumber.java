package com.example.dojusik.common;

import java.util.Random;

public class CertificationNumber {
    public static String getCertificationNumber() {
        Random random = new Random();
        int number = random.nextInt(10000); // 0부터 9999까지의 숫자 생성
        return String.format("%04d", number); // 4자리로 맞추기 (ex: 0057, 1234)
    }
}