package com.example.dojusik.auth.entity;

import com.example.dojusik.auth.dto.request.SignupRequestDto;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor // 매개변수없는 생성자 자동만듦
@AllArgsConstructor // 모든필드에 생성자 만들어줌
@Entity(name="users")
@Table(name="users")
public class UserEntity {
        @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
        private int id;
        @NotBlank(message = "아이디는 필수 입력값입니다.")
        @Size(min = 4, max = 20, message = "아이디는 4자 이상 20자 이하로 입력해주세요.")
//    @Pattern(
//            regexp = "^[a-zA-Z0-9_]+$",
//            message = "아이디는 영문자, 숫자, 언더스코어(_)만 사용 가능합니다."
//    )
        @NotBlank
        private String accId;
        @NotBlank
        private String accPassword;
        private Long cash;

        // 임의 추가함
        private String nickname;
        private String email;
        private LocalDateTime createdAt;
        private String role;

        // 엔티티 저장 전 호출
        @PrePersist
        protected void onCreate() {
                this.cash = 0L;
                this.createdAt = LocalDateTime.now();
                this.role = "ROLE_USER";
        }
        // 생성자 오버로드
        public UserEntity(SignupRequestDto dto){
                this.accId = dto.getAccId();
                this.accPassword = dto.getAccPassword();
        }
}

