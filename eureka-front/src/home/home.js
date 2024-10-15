import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Axios 사용
import { useNavigate } from 'react-router-dom';
import './home.css';
import Logo from './logo'; // 로고 컴포넌트

function Home() {
  const [stocks, setStocks] = useState([]); // 주식 목록을 저장하는 상태
  const [selectedStock, setSelectedStock] = useState(''); // 선택된 주식 상태
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [showOptions, setShowOptions] = useState(false); // 옵션을 보여줄지 결정하는 상태
  const navigate = useNavigate();

  // 주식 목록을 불러오는 함수
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/likedSector`)
      .then(response => {
        setStocks(response.data); // 받아온 데이터를 상태로 저장
      })
      .catch(error => {
        console.error('Error fetching stocks:', error);
      });
  }, []);

  const handleMouseEnter = (category) => {
    setHoveredCategory(category);
  };

  // 주식 선택 변경 핸들러
  const handleStockChange = (event) => {
    setSelectedStock(event.target.value);
  };

  // 버튼 클릭 핸들러
  const handleButtonClick = () => {
    if (selectedStock) {
      navigate(`/stockInfo?stock=${selectedStock}`); // 주식이 선택되었을 때 stockInfo 페이지로 이동
    } else {
      alert('Please select a stock');
    }
  };
  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };
  return (
    <div className="home-container">
      <div className="logo-container">
        <Logo /> {/* 로고 컴포넌트 */}
        <h1 className="title">STOCK DINING</h1>
      </div>

      {/* 커스텀 select 박스 */}
      <div className="select-container">
        <div className="custom-select" onClick={toggleOptions}>
          Select a category
        </div>

        {/* 옵션 리스트 (드롭다운 메뉴) */}
        {showOptions && (
          <ul className="category-list">
            {stocks.map((category, index) => (
              <li
                key={index}
                className="category-item"
                onMouseEnter={() => handleMouseEnter(category)} // 마우스가 분류에 올라가면 세부 항목 표시
              >
                {category.분류}

                {/* 오른쪽에 세부 항목 표시 */}
                {hoveredCategory === category && ( // hover된 분류와 일치할 때만 출력
                  <div className="detail-container">
                    <ul>
                      {hoveredCategory["세부 항목"].map((item, idx) => ( // 최대 3개의 항목만 표시
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}


      </div>

      <button onClick={handleButtonClick} className="find-button">
        Find Dining
      </button>
    </div>
  );
}

export default Home;
