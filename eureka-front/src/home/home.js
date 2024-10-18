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
  const [selectedItem, setSelectedItem] = useState(''); // 선택된 세부 항목 저장
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 관리


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
    // console.log(hoveredCategory)
  };
  const handleItemClick = (item) => {
    setSelectedItem(item); // 선택된 세부 항목을 저장
    setShowOptions(false); // 세부 항목 리스트 숨기기
  };

  // 주식 선택 변경 핸들러
  const handleStockChange = (event) => {
    setSelectedStock(event.target.value);
  };

  // 버튼 클릭 핸들러
  
  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  

  const handleFindDiningClick = () => {
    if (!selectedItem) {
      alert('Please select a category first.');
      return;
    }
    
    // get 요청 보내기
    try {
      setIsLoading(true); // 로딩 시작
      axios.get(`http://localhost:8000/likedSector/gpt?sector=${selectedItem}`)
      .then(response => {
        if(!response){
          console.log("response 없음")
        }
        console.log('Response:', response.data);
        // alert('get 요청 성공!');
        localStorage.setItem('gptResponse', response.data.response.choices[0].message.content);
        navigate(`/stockInfo?stock=${selectedItem}`);
      })
      .catch(error => {
        console.error('Error:', error);
        alert('GET 요청 실패!');
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      setIsLoading(false); // 에러가 발생하면 로딩 종료
    }
    
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
          {selectedItem || 'Select a category'}
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
                {hoveredCategory?.분류 === category.분류 && ( // hover된 분류와 일치할 때만 출력
                  <div className="detail-container">
                    <ul>
                      {hoveredCategory["세부 항목"].map((item, idx) => (
                        <li key={idx}
                            className="detail-list"
                            onClick={() => handleItemClick(item)}
                        >{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}


      </div>

      <button onClick={handleFindDiningClick} className="find-button">
        Find Dining
      </button>
      {isLoading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p className="loading-message">Loading...</p>
        </div>
      )}
    </div>
  );
}

export default Home;
