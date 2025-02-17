package com.example.dojusik.config;

import io.github.cdimascio.dotenv.Dotenv;
import lombok.Getter;
import org.springframework.stereotype.Component;

@Component
@Getter
public class EnvConfig {

    Dotenv dotenv = Dotenv.load();

    String appKey = dotenv.get("APP_KEY");
    String appSecretKey = dotenv.get("APP_SECRET_KEY");
    String demoAppKey = dotenv.get("DEMO_APP_KEY");
    String demoAppSecretKey = dotenv.get("DEMO_APP_SECRET_KEY");
    String cano = dotenv.get("CANO");
    String accessToken = dotenv.get("ACCESS_TOKEN");
}

