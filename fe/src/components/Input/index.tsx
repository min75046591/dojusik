import React from "react";
import { forwardRef,ChangeEvent, KeyboardEvent } from "react";
import './index.css'

interface Props{
    title:string;
    placeholder:string;
    type: 'text' | 'password';
    value: string;
    isErrorMessage?: boolean; // 메세지 에러 여부 
    buttonTitle?: string; // 버튼 없을 수도 있음
    onChange: (event: ChangeEvent<HTMLInputElement>) =>void;
    onKeyDown?: (event:KeyboardEvent<HTMLInputElement>) => void;
    onButtonClick? : () => void;
    message?:string;
}

const InputBox = forwardRef<HTMLInputElement, Props>((props: Props,ref)=>{
    
    const {title,placeholder,value,type,isErrorMessage,buttonTitle,onChange,onButtonClick,onKeyDown,message} =props;

    // value 확인해서 버튼 활성 비활성 
    const buttonClass = value === '' ? 'input-box-button-disable' : "input-box-button";
    const messageClass = isErrorMessage ? 'input-box-message-error' :'input-box-message';

    return(
        <div className="input-box">
            <div className="input-box-title">{title}</div>
            <div className="input-box-content">
                <input ref={ref} className="input-box-input"
                placeholder={placeholder} type={type} value={value} 
                onChange={onChange} onKeyDown={onKeyDown}></input>

                {/* 버튼 title 과 buttonclick event 있을때만 버튼div 있음 */}
                {buttonTitle !== undefined && onButtonClick!== undefined &&
                <div className={buttonClass} onClick={onButtonClick} >{buttonTitle}</div>
                }
            </div>
            {message !== undefined && <div className={messageClass}>{message}</div>
            }
        </div>
    );
}); 

export default InputBox;