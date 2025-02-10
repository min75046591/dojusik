import React from 'react'
import './index.css'
import Ellipse20 from '../../../../public/assets/icon/Ellipse20'
import Planet from '../../../../public/assets/icon/Planet'
import Image from 'next/image'

export default function index() {

  const planetStyle={
    width:' 166.819px',
    height: '97.933px',
    flexShrink: '0',

    marginBottom:'500px',
  }

  return (
    <div className='global-container-style'>
    <div className='content-box'>
      {/* <Ellipse20 /> */}
      <Planet size="big" style={planetStyle}/>
      <div className='text-box'>
        <div className='title-text'>
          Hello {'민수'}! 
          <Image src="/assets/image/image 296.png" alt="Hi" width={24} height={24}/>
          <br/>
          Welcome to DoJuSik
        </div>
        <div className='content-text'>
          It's great to have you here
        </div>
      </div>
    </div>
    <div className='button-box'>
      <div className='primary-button-lg full-width' style={{borderRadius:'16px'}}>
        시작하기
      </div>
    </div>
    </div>
  )
}
