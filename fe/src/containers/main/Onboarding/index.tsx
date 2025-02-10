"use client";
import React, {} from 'react'
import { useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
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
      <Swiper  pagination={{
          el: ".slide-button-box", // 불렛 렌더링할 컴포넌트 클래스 이름
          renderBullet: (index, className) => {
            return `<span class="${className} ${
              className.includes("swiper-pagination-bullet-active")
                ? "button-disable"
                : "button-able"
            }"></span>`;
          },
        }} modules={[Pagination]} className="mySwiper">
        <SwiperSlide>
                <div className='content-box'>
        {/* 차트화면 완성되면 화면 사진 추가 */}
        <div className='image-style'>
          <Ellipse/>
        </div>
        {/*  */}
        <div className='text-box'> 
          <div className='title-font'>Stock trading suit</div>
          <div className='content-font'> Streamline your investment decisions with expert guidance.
          <p> 슬라이드 1</p>
          </div>
        </div>
      </div>
        </SwiperSlide>
        <SwiperSlide>
                          <div className='content-box'>
        {/* 차트화면 완성되면 화면 사진 추가 */}
        <div className='image-style'>
          <Ellipse/>
        </div>
        {/*  */}
        <div className='text-box'> 
          <div className='title-font'>Stock trading suit</div>
          <div className='content-font'> Streamline your investment decisions with expert guidance.
          <p> 슬라이드 2</p>
          </div>
        </div>
      </div>
        </SwiperSlide>
      </Swiper>
      <div className="slide-button-box"></div>
      <div className='button-box'>
        <button className='global-secondary-button-sm' onClick={goToSignIn}> Sign In </button>
        <button className='global-primary-button-sm' onClick={goToSignUp}> Sign Up </button>
      </div>
    </div>
  )
}
