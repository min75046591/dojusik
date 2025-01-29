import { successResponseDto } from "./apiutils";
import { failedResponseDto } from "./apiutils";

const BASE_URL = "http://localhost:8080/";

export const signup = async <T>(
  accId: string,
  accPassword: string
): Promise<successResponseDto<T>> => {
  const response = await fetch(`${BASE_URL}api/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // JSON 데이터임을 명시
    },
    body: JSON.stringify({ accId, accPassword }),
    cache: "no-cache",
  });
  const result: successResponseDto<T> | failedResponseDto =
    await response.json();

  if (!response.ok) {
    return result as failedResponseDto;
  }
  console.log(result, "회원가입 성공");
  return result as successResponseDto<T>;
};

export const login = async <T>(
  accId: string,
  accPassword: string
): Promise<successResponseDto<T>> => {
  const response = await fetch(`${BASE_URL}api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // JSON 데이터임을 명시
    },
    body: JSON.stringify({ accId, accPassword }),
    cache: "no-cache",
  });
  const result: successResponseDto<T> | failedResponseDto =
    await response.json();

  if (!response.ok) {
    return result as failedResponseDto;
  }
  // TODO: 세션스토리지에 저장, 나중에 더 나은 보안방식 고민해보기
  if ("data" in result && result.data && typeof result.data === "string") {
    sessionStorage.setItem("Token", result.data);
  }
  console.log(result, "로그인 성공");
  return result as successResponseDto<T>;
};
