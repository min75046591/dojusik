"use client"; // 클라이언트 컴포넌트 디렉티브
import "./style.css";
import React, {
  ChangeEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import routes from "../../routes";
import InputBox from "@components/input";
import { login } from "../../api/auth";

export default function Login() {
  const router = useRouter();

  const isRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);

  const [id, setId] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [isIdError, setIdError] = useState<boolean>(false);
  const [isPasswordError, setPasswordError] = useState<boolean>(false);

  const [idMessage, setIdMessage] = useState<string>("");
  const [passwordMessage, setPasswordMessage] = useState<string>("");

  const loginButtonClass =
    id && password ? "primary-button-lg" : "button-lg-diable";

  const onIdChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event?.target;
    setId(value);
    setIdMessage("");
  };
  const onPasswordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event?.target;
    setPassword(value);
    setPasswordMessage("");
  };

  // 엔터키 처리 : 버튼 클릭 또는 다음 input에 focus 맞추기
  // const onIdKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
  //   if (event.key !== "Enter") return;
  //   if (!passwordRef.current) return;
  //   passwordRef.current.focus();
  // };
  // const onPasswordKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
  //   if (event.key !== "Enter") return;
  //   //TODO: 로그인 버튼 핸들러 추가
  // };

  const goToSignup = () => {
    router.push(routes.signup);
  };
  const goToHome = () => {
    // 다시 로그인 페이지로 못돌아오게 replace
    router.replace(routes.home);
  };

  const onLoginButtonHandler = async () => {
    try {
      const res = await login(id, password);
      if (res.status == 200) {
        //TODO: 메인페이지로 넘어가기
        goToHome();
      } else {
        if(res.message === "존재하지 않는 아이디입니다"){
          setIdError(true);
          setIdMessage(res.message);
        }
        else if (res.message === "비밀번호가 틀렸습니다"){
          setPasswordError(true);
          setPasswordMessage(res.message);
        }
      }
    } catch (error) {
      console.error;
    }
  };

  return (
    <div id="login-wrapper">
      {/* <div className="login-image"></div> */}
      <div className="login-container">
        <div className="login-box">
          <div className="login-title">{"모의 주식 서비스"}</div>
          <div className="login-content-box">
            <InputBox
              ref={isRef}
              title="아이디"
              placeholder="아이디를 입력해 주세요"
              type="text"
              value={id}
              // isErrorMessage={isIdError}
              onChange={onIdChangeHandler}
              message={idMessage}
              // onKeyDown={onIdKeyDownHandler}
            ></InputBox>
            <InputBox
              ref={passwordRef}
              title="비밀번호"
              placeholder="비밀번호를 입력해 주세요"
              type="password"
              value={password}
              isErrorMessage={isPasswordError}
              onChange={onPasswordChangeHandler}
              message={passwordMessage}
              // onKeyDown={onPasswordKeyDownHandler}
            ></InputBox>
            <div className="login-content-button-box">
              <div
                className={`${loginButtonClass} full-width`}
                onClick={onLoginButtonHandler}
              >
                {"로그인"}
              </div>
              <div className="link-button-lg full-width" onClick={goToSignup}>
                {"회원가입"}
              </div>

              {/* sns 로그인 */}
              {/* <div className="login-content-sns-login-box">
              <div className="login-content-sns-login-title">
                {"SNS 로그인"}
              </div>
              <div className="login-content-sns-login-button-box">
                <div className="kakao-login-button">
                  <p> 카카오 로그인</p>
                </div>
                <div className="naver-login-button">
                  <p> 네이버 로그인</p>
                </div>
              </div>
            </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
