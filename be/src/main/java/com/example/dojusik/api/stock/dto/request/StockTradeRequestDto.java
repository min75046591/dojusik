package com.example.dojusik.api.stock.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class StockTradeRequestDto {
    @NotBlank
    private String ticker;
    @Min(value = 1, message = "입력 값이 0보다 커야 합니다")
    private Integer price;
    @Min(value = 1, message = "입력 값이 0보다 커야 합니다")
    private Integer amount;
}
