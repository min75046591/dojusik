package com.example.dojusik.config;

import io.jsonwebtoken.*;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.io.InputStream;

import java.security.*;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;
import java.util.Date;

@Slf4j
@Component
public class JwtProvider {
    private PrivateKey privateKey;
    private PublicKey publicKey;
    private final long EXPIRATION_TIME = 1000 * 60 * 60 * 24; //


//   스프링 세큐리티에서 privateKey, publicKey, keyFactory 모듈제공
    @PostConstruct
    public void init() {
        try {
            InputStream publicInputStream = getClass().getClassLoader().getResourceAsStream("public_key.pem");
            InputStream privateInputStream = getClass().getClassLoader().getResourceAsStream("private_key.pem");

            // 1. 비공개 키 로드 (private_key.pem)
            String privateKeyString = new String(privateInputStream.readAllBytes());
            privateKeyString = privateKeyString.replace("-----BEGIN PRIVATE KEY-----", "")
                    .replace("-----END PRIVATE KEY-----", "")
                    .replace("\s", "")
                    .replace("\r", "")
                    .replace("\n", "");

            byte[] privateKeyBytes = Base64.getDecoder().decode(privateKeyString);
            PKCS8EncodedKeySpec privateKeySpec = new PKCS8EncodedKeySpec(privateKeyBytes);
            KeyFactory keyFactory = KeyFactory.getInstance("RSA");
            this.privateKey = keyFactory.generatePrivate(privateKeySpec);

            // 2. 공개 키 로드 (public_key.pem)
            String publicKeyString = new String(publicInputStream.readAllBytes());
            publicKeyString = publicKeyString.replace("-----BEGIN PUBLIC KEY-----", "")
                    .replace("-----END PUBLIC KEY-----", "")
                    .replace("\s", "")
                    .replace("\r", "")
                    .replace("\n", "");

            byte[] publicKeyBytes = Base64.getDecoder().decode(publicKeyString);
            X509EncodedKeySpec publicKeySpec = new X509EncodedKeySpec(publicKeyBytes);
            this.publicKey = keyFactory.generatePublic(publicKeySpec);
        } catch (Exception e) {
            log.error("키 파일 로드 실패", e);
            throw new RuntimeException("키 파일 로드 실패", e);
        }
    }

    // JWT 생성
    public String create(String accId) {
        return Jwts.builder()
                .subject(accId)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(privateKey, Jwts.SIG.RS256) // RS256 사용
                .compact();
    }

    // 유효성 검증
    public String validate(String token) {
        try {
            Claims claims = Jwts.parser()
                    .verifyWith(publicKey)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

            if (claims.getExpiration().before(new Date())) {
                throw new JwtException("JWT expired");
//                System.err.println("JWT expired");
//                return null;  // 만료된 토큰은 null 반환
            }
            // 필수 클레임(예: subject)가 존재하는지 확인
            String subject = claims.getSubject();
            if (subject == null) {
                throw new JwtException("JWT subject does not exist");
//                System.err.println("Subject(accId) is missing");
//                return null;  // subject가 없으면 null 반환
            }
            return subject;

        } catch (Exception e) {
            throw new JwtException("Invalid JWT", e); // 모든 예외를 JwtException으로 변환
        }
    }
}
