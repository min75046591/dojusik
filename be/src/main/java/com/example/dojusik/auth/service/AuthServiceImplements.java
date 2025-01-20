package com.example.dojusik.auth.service;

import com.example.dojusik.auth.dto.request.EmailCertificationRequestDto;
import com.example.dojusik.auth.dto.request.LoginRequestDto;
import com.example.dojusik.auth.dto.request.SignupRequestDto;
import com.example.dojusik.auth.entity.CertificationEntity;
import com.example.dojusik.auth.entity.UserEntity;
import com.example.dojusik.auth.respository.CertificationRepository;
import com.example.dojusik.auth.respository.UserRepository;
import com.example.dojusik.common.CertificationNumber;
import com.example.dojusik.common.ResponseDto;
import com.example.dojusik.config.CustomUser;
import com.example.dojusik.config.EmailProvider;
import com.example.dojusik.config.JwtProvider;
import lombok.RequiredArgsConstructor;
import org.apache.catalina.User;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthServiceImplements implements AuthService{

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private final JwtProvider jwtProvider;
    private final EmailProvider emailProvider;
    private final CertificationRepository certificationRepository;

    @Override
    public ResponseEntity<ResponseDto> signup(SignupRequestDto dto) {
        try{
            // 중복 아이디 처리
            String accId = dto.getAccId();
            boolean isExist = userRepository.existsByAccId(accId);
            if(isExist) return ResponseDto.error(HttpStatus.BAD_REQUEST, "중복된 아이디입니다");

            String accPassword = dto.getAccPassword();
            String encodedPassword = passwordEncoder.encode(accPassword);
            dto.setAccPassword(encodedPassword);

            UserEntity user = new UserEntity(dto);
            userRepository.save(user);

            return ResponseDto.success("회원가입 성공",user);

        } catch (Exception e){
            e.printStackTrace();
            return ResponseDto.serverError();
        }
    }

    @Override
    public ResponseEntity<ResponseDto> login(LoginRequestDto dto) {
        try{
            String accId = dto.getAccId();
            UserEntity user = userRepository.findByAccId(accId);
            if(user==null) return ResponseDto.error(HttpStatus.NOT_FOUND, "존재하지 않는 아이디입니다");

            String accPassword = dto.getAccPassword();
            String encodedPassword = user.getAccPassword();

            // 암호화된 비번이랑 입력된 비번 비교
            boolean isMatched = passwordEncoder.matches(accPassword, encodedPassword);
            if (!isMatched) return ResponseDto.error(HttpStatus.BAD_REQUEST,"비밀번호가 틀렸습니다");

            String token = null;
            token = jwtProvider.create(accId); // 토큰 생성

            return ResponseDto.success("로그인 성공",token);
        } catch (Exception e){
            e.printStackTrace();
            return ResponseDto.serverError();
        }
    }

    @Override
    public ResponseEntity<ResponseDto> emailCertification(EmailCertificationRequestDto dto) {
        try{
            String email = dto.getEmail();
            if (email == null || !email.matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
                return ResponseDto.error(HttpStatus.BAD_REQUEST,"잘못된 이메일 형식입니다");
            }

            boolean isExistId = userRepository.existsByEmail(email);
            if (isExistId) return ResponseDto.error(HttpStatus.BAD_REQUEST,"이미 가입된 유저 입니다");

            // 인증번호 랜덤 4자리로만 되어있음
            String certificationNumber = CertificationNumber.getCertificationNumber();
            boolean isSuccessed = emailProvider.sendCertificationMail(email,certificationNumber);
            if (!isSuccessed) return ResponseDto.error(HttpStatus.INTERNAL_SERVER_ERROR,"메일이 정상적으로 발송되지 않았습니다");

            CertificationEntity certificationEntity = new CertificationEntity(email, certificationNumber);
            certificationRepository.save(certificationEntity);

            return ResponseDto.success("이메일 전송 완료", email);

        } catch(Exception e){
            e.printStackTrace();
            return ResponseDto.serverError();
        }
    }
}
