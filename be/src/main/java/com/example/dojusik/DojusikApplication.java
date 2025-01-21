package com.example.dojusik;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;


@SpringBootApplication // (scanBasePackages = "com.example.dojusik") // 명시적으로 스캔범위 설정
public class DojusikApplication {

	public static void main(String[] args) {
		SpringApplication.run(DojusikApplication.class, args);
	}

}
