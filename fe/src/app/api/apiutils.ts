//TODO: 나중에 배포 주소로 바꿔서 .env 에 넣어주기

const BASE_URL = "http://localhost:8080/";

export interface successResponseDto<T> {
  status: number;
  message: string;
  data?: T; // 데이터를 포함할 수 있음 (성공 시)
}
export interface failedResponseDto {
  status: number;
  message: string;
}

export const apiFetch = async <T>(
  url: string,
  options: RequestInit
): Promise<successResponseDto<T> | failedResponseDto> => {
  
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  // 헤더에 토큰 설정
  const token = sessionStorage.getItem("Token");
  if (token) {
    headers["Authorization"] = `Bearer ${token}`; // Authorization 헤더에 Bearer 토큰 추가
  }

  const response = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers,
  });

  const result: successResponseDto<T> | failedResponseDto =
    await response.json();

  if (!response.ok) {
    return result as failedResponseDto;
  }

  return result as successResponseDto<T>;
};
