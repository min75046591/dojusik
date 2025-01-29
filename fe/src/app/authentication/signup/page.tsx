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
import InputBox from "../../components/input";
import { login, signup } from "../../api/auth";
// import { login, signup } from "../../api/auth";

export default function Signup() {
  const router = useRouter();

  const isRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const passwordCheckRef = useRef<HTMLInputElement | null>(null);
  // const emailRef = useRef<HTMLInputElement | null>(null);
  // const certificationNumberRef = useRef<HTMLInputElement | null>(null);

  const [id, setId] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passWordCheck, setPassWordCheck] = useState<string>("");
  // const [email, setEmail] = useState<string>("");
  // const [certificationNumber, setCertificationNumber] = useState<string>("");

  const [isIdError, setIdError] = useState<boolean>(false);
  const [isPasswordError, setPasswordError] = useState<boolean>(false);
  const [isPasswordCheckError, setPasswordCheckError] =
    useState<boolean>(false);
  // const [isEmailError, setEmailError] = useState<boolean>(false);
  // const [isCertificationNumberError, setCertificationNumberError] =
  useState<boolean>(false);

  const [idMessage, setIdMessage] = useState<string>("");
  const [passwordMessage, setPasswordMessage] = useState<string>("");
  const [passwordCheckMessage, setPasswordCheckMessage] = useState<string>("");
  // const [emailMessage, setEmailMessage] = useState<string>("");
  // const [certificationMessage, setCertificationMessage] = useState<string>("");

  const signupButtonClass =
    id && password && passWordCheck ? "primary-button-lg" : "button-lg-diable";

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
  const onPasswordCheckChangeHandler = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = event?.target;
    setPassWordCheck(value);
    setPasswordCheckMessage("");
  };

  // 이메일 인증 관련 코드
  // const onEmailChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
  //   const { value } = event?.target;
  //   setEmail(value);
  //   setEmailMessage("");
  // };
  // const onCertificationChangeHandler = (
  //   event: ChangeEvent<HTMLInputElement>
  // ) => {
  //   const { value } = event?.target;
  //   setCertificationNumber(value);
  //   setCertificationMessage("");
  // };

  //TODO: 중복 확인 api & 이메일 인증 api
  // const onIdButtonClickHandler = () => {};
  // const onEmailButtonClickHandler = () => {};
  // const onCertificationNumberButtonClickHandler = () => {};

  // 엔터키 처리 : 버튼 클릭 또는 다음 input에 focus 맞추기
  // const onIdKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
  //   if (event.key !== "Enter") return;
  //   onIdButtonClickHandler();
  // };
  // const onPasswordKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
  //   if (event.key !== "Enter") return;
  //   if (!passwordCheckRef.current) return;
  //   passwordCheckRef.current.focus();
  // };

  // const onPasswordCheckKeyDownHandler = (
  //   event: KeyboardEvent<HTMLInputElement>
  // ) => {
  //   if (event.key !== "Enter") return;
  //   if (!emailRef.current) return;
  //   emailRef.current.focus();
  // };
  // const onEmailKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
  //   if (event.key !== "Enter") return;
  //   onEmailButtonClickHandler();
  // };
  // const onCertificationNumberKeyDownHandler = (
  //   event: KeyboardEvent<HTMLInputElement>
  // ) => {
  //   if (event.key !== "Enter") return;
  //   onCertificationNumberButtonClickHandler();
  // };

  const goToLogin = () => {
    router.push(routes.login);
  };
  const goToHome = () => {
    // 다시 로그인 페이지로 못돌아오게 replace
    router.replace(routes.home);
  };

  const onSignupButtonHandler = async () => {
    // // 비밀번호 다를 경우
    if (password !== passWordCheck) {
      setPasswordError(true);
      setPasswordMessage("작성된 비밀번호가 일치하지 않습니다");
      setPasswordCheckError(true);
      setPasswordCheckMessage("작성된 비밀번호가 일치하지 않습니다");
      return;
    }
    try {
      const res = await signup(id, password);
      if (res.message === "회원가입 성공") {
        //회원가입시 자동 로그인
        await login(id, password);
        goToHome();
      } else {
        if (res.message == "중복된 아이디입니다") {
          setIdError(true);
          setIdMessage(res.message);
        }
      }
    } catch (error) {
      console.error;
    }
  };

  return (
    <div id="signup-wrapper">
      {/* <div className="signup-image"></div> */}
      <div className="signup-container">
        <div className="signup-box">
          <div className="signup-title"> {"모의 주식 서비스"}</div>
          <div className="signup-content-box">
            {/* sns로그인 */}
            {/* <div className="signup-content-sns-login-box">
              <div className="signup-content-sns-login-title">
                {"SNS 로그인"}
              </div>
              <div className="signup-content-sns-login-button-box">
                <div className="kakao-login-button">
                  <p> 카카오 로그인</p>
                </div>
                <div className="naver-login-button">
                  <p> 네이버 로그인</p>
                </div>
              </div>
            </div> */}
            {/* 일반로그인 */}
            <div className="signup-content-divider"></div>
            <div className="signup-content-input-box">
              <InputBox
                ref={isRef}
                title="아이디"
                placeholder="아이디를 입력해 주세요"
                type="text"
                value={id}
                isErrorMessage={isIdError}
                onChange={onIdChangeHandler}
                // onButtonClick={onIdButtonClickHandler}
                // buttonTitle="중복 확인"
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
              <InputBox
                ref={passwordCheckRef}
                title="비밀번호 확인"
                placeholder="비밀번호를 입력해 주세요"
                type="password"
                value={passWordCheck}
                isErrorMessage={isPasswordCheckError}
                onChange={onPasswordCheckChangeHandler}
                message={passwordCheckMessage}
                // onKeyDown={onPasswordCheckKeyDownHandler}
              ></InputBox>

              {/* 이메일 인증 나중에 추가  */}
              {/* <InputBox
                ref={emailRef}
                title="이메일"
                placeholder="이메일 주소를 입력해 주세요"
                type="text"
                value={email}
                isErrorMessage={isEmailError}
                onButtonClick={onEmailButtonClickHandler}
                buttonTitle="이메일 인증"
                onChange={onEmailChangeHandler}
                message={emailMessage}
                onKeyDown={onEmailKeyDownHandler}
              ></InputBox>
              <InputBox
                ref={certificationNumberRef}
                title="인증번호"
                placeholder="인증번호 4자리를 입력해 주세요"
                type="text"
                value={certificationNumber}
                isErrorMessage={isCertificationNumberError}
                onChange={onCertificationChangeHandler}
                onButtonClick={onCertificationNumberButtonClickHandler}
                buttonTitle="인증 확인"
                message={certificationMessage}
                onKeyDown={onCertificationNumberKeyDownHandler}
              ></InputBox> */}
            </div>
            <div className="signup-content-button-box">
              <div
                className={`${signupButtonClass} full-width`}
                onClick={onSignupButtonHandler}
              >
                {"회원가입"}
              </div>
              <div className="link-button-lg full-width" onClick={goToLogin}>
                {"로그인"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
