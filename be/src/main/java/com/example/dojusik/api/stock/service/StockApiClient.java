package com.example.dojusik.api.stock.service;

import com.example.dojusik.api.auth.entity.UserEntity;
import com.example.dojusik.api.stock.dto.request.StockTradeRequestDto;
import com.example.dojusik.config.EnvConfig;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.util.UriComponentsBuilder;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class StockApiClient {

    private final WebClient.Builder webClientBuilder;
    private final EnvConfig envConfig;
    private final WebClient webClient;

    private String accessToken;
    private String appKey;
    private String appSecretKey;
    private String cano;

    @Autowired
    public StockApiClient(WebClient.Builder webClientBuilder ,EnvConfig envConfig) {
        this.webClientBuilder = webClientBuilder;
        this.envConfig = envConfig;
        this.accessToken = envConfig.getAccessToken();
        this.appKey = envConfig.getDemoAppKey();
        this.appSecretKey = envConfig.getDemoAppSecretKey();
        this.cano = envConfig.getCano();
        this.webClient = webClientBuilder.baseUrl("https://openapivts.koreainvestment.com:29443")
                .defaultHeader("content-type", "application/json")
//                .defaultHeader("authorization","Bearer " + accessToken)
                .defaultHeader("appkey", appKey)
                .defaultHeader("appsecret", appSecretKey)
                .build();
    }

    public Mono<JsonNode> fetchSearchData(String ticker) {
        String uri = UriComponentsBuilder.fromUriString("/uapi/domestic-stock/v1/quotations/inquire-price")
                .queryParam("fid_cond_mrkt_div_code", "J")
                .queryParam("fid_input_iscd", ticker)
                .build()
                .toUriString();

        return webClient.get()
                .uri("https://openapivts.koreainvestment.com:29443"+uri)
                .header("tr_id", "FHKST01010100")
                .header("authorization","Bearer " + accessToken)
                .retrieve()
                .onStatus(status -> HttpStatus.valueOf(status.value()).is4xxClientError(), clientResponse -> {
                    return clientResponse.bodyToMono(String.class)
                            .map(errorBody -> new RuntimeException("Client error: " + errorBody));
                })
                .onStatus(status -> HttpStatus.valueOf(status.value()).is5xxServerError(), clientResponse -> {
                    return clientResponse.bodyToMono(String.class)
                            .map(errorBody -> new RuntimeException("Client error: " + errorBody));
                })
                .bodyToMono(JsonNode.class);
    }

    public Mono<JsonNode>fetchBuyData(UserEntity user, StockTradeRequestDto dto) {
        String uri = "/uapi/domestic-stock/v1/trading/order-cash";
        String ticker = dto.getTicker();
        String amount = String.valueOf(dto.getAmount());
        String price = String.valueOf(dto.getPrice());

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("CANO", cano);
        requestBody.put("ACNT_PRDT_CD", "01");
        requestBody.put("PDNO", ticker);
        requestBody.put("ORD_DVSN", "00");
        requestBody.put("ORD_QTY", amount);
        requestBody.put("ORD_UNPR", price);

        return webClient.post()
                .uri("https://openapivts.koreainvestment.com:29443" + uri)
                .headers(httpHeaders -> {
                    httpHeaders.add("tr_id", "VTTC0802U");
                    httpHeaders.add("authorization","Bearer " + accessToken);
                })
                .bodyValue(requestBody)
                .retrieve()
                .onStatus(status -> HttpStatus.valueOf(status.value()).is4xxClientError(), clientResponse -> {
                    return clientResponse.bodyToMono(String.class)
                            .map(errorBody -> new RuntimeException("Client error: " + errorBody));
                })
                .onStatus(status -> HttpStatus.valueOf(status.value()).is5xxServerError(), clientResponse -> {
                    return clientResponse.bodyToMono(String.class)
                            .map(errorBody -> new RuntimeException("Client error: " + errorBody));
                })
                .bodyToMono(JsonNode.class);
    }

    public Mono<JsonNode>fetchSellData(UserEntity user, StockTradeRequestDto dto) {
        String uri = "/uapi/domestic-stock/v1/trading/order-cash";
        String ticker = dto.getTicker();
        String amount = String.valueOf(dto.getAmount());
        String price = String.valueOf(dto.getPrice());

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("CANO", cano);
        requestBody.put("ACNT_PRDT_CD", "01");
        requestBody.put("PDNO", ticker);
        requestBody.put("ORD_DVSN", "00");
        requestBody.put("ORD_QTY", amount);
        requestBody.put("ORD_UNPR", price);

        return webClient.post()
                .uri("https://openapivts.koreainvestment.com:29443" + uri)
                .headers(httpHeaders -> {
                    httpHeaders.add("tr_id", "VTTC0801U");
                    httpHeaders.add("authorization","Bearer " + accessToken);
                })
                .bodyValue(requestBody)
                .retrieve()
                .onStatus(status -> HttpStatus.valueOf(status.value()).is4xxClientError(), clientResponse -> {
                    return clientResponse.bodyToMono(String.class)
                            .map(errorBody -> new RuntimeException("Client error: " + errorBody));
                })
                .onStatus(status -> HttpStatus.valueOf(status.value()).is5xxServerError(), clientResponse -> {
                    return clientResponse.bodyToMono(String.class)
                            .map(errorBody -> new RuntimeException("Client error: " + errorBody));
                })
                .bodyToMono(JsonNode.class);
    }
}