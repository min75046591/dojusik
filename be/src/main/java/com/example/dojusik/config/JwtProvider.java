package com.example.dojusik.config;

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

    public String create(String userId){
    Date expiredDate = Date.from(Instant.now().plus(24, ChronoUnit.HOURS));//24시간설정
    Key key = Keys.hmacShaKeyFor(secretkey.getBytes(StandardCharsets.UTF_8));

        String jwt = Jwts.builder()
                .signWith(SignatureAlgorithm.HS256,key) //TODO: 키생성방법 확인
                .setSubject(userId).setIssuedAt(new Date()).setExpiration(expiredDate)
                .compact();
        return jwt;
    }

    public String validate (String jwt){
        String subject = null;
        Key key = Keys.hmacShaKeyFor(secretkey.getBytes(StandardCharsets.UTF_8));
        try{
            subject = Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(jwt)
                    .getBody()
                    .getSubject();

        } catch(Exception e){
            e.printStackTrace();
            return null;
        }
        return subject;
    }
}
