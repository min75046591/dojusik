package com.example.dojusik.entity.auth;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor // 매개변수없는 생성자 자동만듦
@AllArgsConstructor // 모든필드에 생성자 만들어줌
@Entity(name="user")
@Table(name="user")
public class UserEntity {
        @Id
        private String userId;
        private String password;
        private String email;
        private String type;
        private String role;
    }

