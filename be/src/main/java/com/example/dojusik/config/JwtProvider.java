package com.example.dojusik.config;

import com.example.dojusik.api.auth.entity.UserEntity;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;

@Component
public class JwtProvider {

    @Value("${secret-key}")
    private String secretkey;

    public String create(String accId) {
        Date expiredDate = Date.from(Instant.now().plus(24, ChronoUnit.HOURS));//24시간설정
        Key key = Keys.hmacShaKeyFor(secretkey.getBytes(StandardCharsets.UTF_8));

        String jwt = Jwts.builder()
                .signWith(key, SignatureAlgorithm.HS256)//TODO: 키생성방법 확인
                .setSubject(accId).setIssuedAt(new Date()).setExpiration(expiredDate)
                .compact();
        return jwt;
    }

    public String validate(String jwt) {
        Key key = Keys.hmacShaKeyFor(secretkey.getBytes(StandardCharsets.UTF_8));
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(jwt)
                    .getBody();

            return claims.getSubject(); // accId를 반환
        } catch (Exception e) {
            System.err.println("JWT validation error: " + e.getMessage());
            return null;
        }
    }
}