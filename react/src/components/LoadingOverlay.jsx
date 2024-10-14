import React from 'react';
import './LoadingOverlay.css';
import Logo from '../assets/images/gradientLogo.png'

function LoadingOverlay({ message }) {
  return (
    <div className="loading-overlay">
      <div className="logo-container">
        {/* 애니메이션이 적용된 로고 이미지 */}
        <img src={Logo} alt="loading logo" className="floating-logo" />
      </div>
      <p className="loading-message">{message}</p>
    </div>
  );
}

export default LoadingOverlay;
