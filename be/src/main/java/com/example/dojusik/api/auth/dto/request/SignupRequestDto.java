package com.example.dojusik.api.auth.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class SignupRequestDto {
    @NotBlank
    private String accId;
    @NotBlank
    private String accPassword;

    // 임의 추가함
    private String nickname;
    private String email;
}
