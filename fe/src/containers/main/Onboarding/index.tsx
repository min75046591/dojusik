"use client";

import React, {} from 'react'
import { useRouter } from "next/navigation";
import Ellipse from '../../../../public/assets/icon/Ellipse'
import routes from '../../../app/routes';
import './index.css'

    export default function index() {
      const router = useRouter();

      const goToSignIn = ()=> {
        router.push(routes.login);
      }
      const goToSignUp = ()=> {
        router.push(routes.signup);
      }


  return (
    <div className='global-container-style'>
      <div className='content-box'>
                <div className='skip-button'>
                  <p>{' '}</p>
              <p>
                  Skip 
              </p>
          </div>
        {/* 차트화면 완성되면 화면 사진 추가 */}
        <div className='image-style'>
          <Ellipse/>
        </div>
        {/*  */}
        <div className='text-box'> 
          <div className='title-font'>Stock trading suit</div>
          <div className='content-font'> Streamline your investment decisions with expert guidance.</div>
        </div>
              <div className='slide-button-box'>
                  <div className='button-able'> </div>
                  <div className='button-disable'>  </div>
              </div>
      </div>

      <div className='button-box'>
        <button className='global-secondary-button-sm' onClick={goToSignIn}> Sign In </button>
        <button className='global-primary-button-sm' onClick={goToSignUp}> Sign Up </button>
      </div>
    </div>
  )
}
