package com.example.dojusik.common;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@Getter
//@AllArgsConstructor
public class ResponseDto {
    private HttpStatus status;
    private String message;
    private Object data;

    // 모든 필드를 사용하는 생성자
    public ResponseDto(HttpStatus status, String message, Object data) {
        this.status = status;
        this.message = message;
        this.data = data;
    }
    // data 필드를 제외한 생성자
    public ResponseDto(HttpStatus status, String message) {
        this.status = status;
        this.message = message;
    }

    public static ResponseEntity<ResponseDto> success (String message, Object data) {
        ResponseDto responseBody = new ResponseDto(HttpStatus.OK, message, data);
        return ResponseEntity.status(HttpStatus.OK).body(responseBody);
    }
//    return ResponseDto.success("로그인성공", null)
// {
//  "status": ok,
//  "message": "로그인 성공",
//  "data": null
//}
    public static ResponseEntity<ResponseDto> error(HttpStatus status, String message) {
        ResponseDto responseBody = new ResponseDto(status, message);
        return ResponseEntity.status(status).body(responseBody);
    }
    //    return ResponseDto.error(HttpStatus.500.value(), "서버 연결 실패")
// {
//  "status": internal server error,
//  "message": "서버연결실패",
//}
    // 자주 쓰는 에러 만들어 두기
    public static ResponseEntity<ResponseDto> serverError() {
        ResponseDto responseBody = new ResponseDto(HttpStatus.INTERNAL_SERVER_ERROR,"서버 에러");
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(responseBody);
    }
}
