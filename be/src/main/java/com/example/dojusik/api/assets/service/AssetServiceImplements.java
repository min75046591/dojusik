package com.example.dojusik.api.assets.service;

import com.example.dojusik.api.assets.dto.request.AssetsRechargeRequestDto;
import com.example.dojusik.api.assets.dto.request.AssetsWithdrawRequestDto;
import com.example.dojusik.api.auth.entity.UserEntity;
import com.example.dojusik.api.auth.repository.UserRepository;
import com.example.dojusik.common.ResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AssetServiceImplements implements AssetService{

    private final UserRepository userRepository;

    @Override
    public ResponseEntity<ResponseDto> getMyAssets(UserEntity user) {
        try{
            return ResponseDto.success("현재 자산 조회",user.getCash());
        } catch (Exception e){
            e.printStackTrace();
            return ResponseDto.serverError();
        }
    }

    @Override
    public ResponseEntity<ResponseDto> rechargeAssets(UserEntity user, AssetsRechargeRequestDto dto) {
        try{
//            user = userRepository.findByAccId(user.getAccId());
            if(user==null)return ResponseDto.error(HttpStatus.NOT_FOUND,"사용자가 존재하지 않습니다");

            long rechargeCash = dto.getCash(); // TODO: 필요시 일일 충전 금액 횟수 제한
            user.recharge(rechargeCash);
            userRepository.save(user);

            return ResponseDto.success("입금 후 현재 총 자산",user.getCash());
        } catch (Exception e){
            e.printStackTrace();
            return ResponseDto.serverError();
        }
    }

    @Override
    public ResponseEntity<ResponseDto> withdrawAssets(UserEntity user, AssetsWithdrawRequestDto dto) {
        try{
//            user = userRepository.findByAccId(user.getAccId());
            if(user==null)return ResponseDto.error(HttpStatus.NOT_FOUND,"사용자가 존재하지 않습니다");

            long withdrawCash = dto.getCash();
            if(user.getCash() < withdrawCash) return ResponseDto.error(HttpStatus.BAD_REQUEST, "현재 인출 가능한 금액보다 큽니다");

            user.withdraw(withdrawCash);
            userRepository.save(user);

            return ResponseDto.success("인출 후 현재 총 자산",user.getCash());
        } catch (Exception e){
            e.printStackTrace();
            return ResponseDto.serverError();
        }
    }
}
