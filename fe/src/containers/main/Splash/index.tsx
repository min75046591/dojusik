import React from 'react'
import Planet from '../../../../public/assets/icon/Planet'
export default function index() {

    const titleStyle = {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      marginLeft:'-7px',
    }

    const planetStyle= {
      width: '62.963px',
      height: '36.963px',
      flexShrink: '0'
    }

  return (
    <div className='global-container-style'>
      <div style={titleStyle}>
        <Planet size="small" style={planetStyle}/>
        <p className='title-font'>DoJuSick</p>
      </div>
    </div>
  )
}
