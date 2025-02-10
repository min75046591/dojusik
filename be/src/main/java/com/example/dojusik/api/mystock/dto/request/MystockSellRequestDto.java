package com.example.dojusik.api.mystock.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
public class MystockSellRequestDto {

    private String ticker;

    @NotNull(message = "유효한 값을 입력하세요")
    @Min(value = 1, message = "입력 값이 0보다 커야 합니다")
    private int quantity;

    @NotNull(message = "유효한 값을 입력하세요")
    @Min(value = 1, message = "입력 값이 0보다 커야 합니다")
    private BigDecimal pricePerUnit;
}
