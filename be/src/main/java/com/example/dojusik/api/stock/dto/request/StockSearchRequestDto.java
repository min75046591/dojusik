package com.example.dojusik.api.stock.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class StockSearchRequestDto {
    @NotBlank
    private String stockName;
}
