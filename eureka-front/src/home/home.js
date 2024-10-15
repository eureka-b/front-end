import React from 'react';
import { useNavigate } from 'react-router-dom';
import './home.css';
import Logo from './logo.js'; // 로고 컴포넌트

function Home() {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate('/stockInfo'); // stockInfo 페이지로 이동
  };

  return (
    <div className="home-container">
      <div className="logo-container">
        <Logo /> {/* 로고 컴포넌트 */}
        <h1 className="title">STOCK DINING</h1>
      </div>
      
      <input type="text" placeholder="Select your stocks" className="stock-input" />
      
      <button onClick={handleButtonClick} className="find-button">Find Dining</button>
    </div>
  );
}

export default Home;
