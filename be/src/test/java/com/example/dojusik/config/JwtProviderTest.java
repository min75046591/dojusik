package com.example.dojusik.config;

import io.jsonwebtoken.JwtException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class JwtProviderTest {
    @Autowired
    private JwtProvider jwtProvider;

    @Test
    public void jwtIntegrationTest(){
        String token = jwtProvider.create("whyuan00");
        String subject = jwtProvider.validate(token);
        assertNotNull(subject);

    }



//    @Test
//    void create() {
//        String token = jwtProvider.create("whyuan00");
//        System.out.println(token);
//        assertNotNull(token);
//    }

//    @Test
//    void validate() {
//        String token = jwtProvider.create("whyuan");
//        String subject = jwtProvider.validate(token);
//        assertNotNull(subject);
//    }

//    @Test
//    public void testInvalidToken(){
//        String invalidToken = "invalid.token";
//
//        assertThrows(JwtException.class, ()->{
//        jwtProvider.validate(invalidToken);
//        });
//    }
}