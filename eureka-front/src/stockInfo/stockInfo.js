import React, { useEffect, useState } from 'react';
import './stockInfo.css'; // 스타일을 위한 CSS 파일 임포트
import StockDetail from './stockDetail';
import axios from 'axios'; // Axios 사용



function getRandomPosition(radius) {
  // 원의 반지름 내에서 랜덤한 위치 계산
  const angle = Math.random() * 2 * Math.PI; // 0 ~ 360도 각도
  const distance = Math.sqrt(Math.random()) * radius; // 원 안의 랜덤 거리

  const x = Math.cos(angle) * distance; // X 좌표 계산
  const y = Math.sin(angle) * distance; // Y 좌표 계산

  return { x, y };
}

function getNonOverlappingPosition(radius, positions, size) {
  let newPos;
  let attempts = 0; // 무한 루프 방지를 위해 시도 횟수를 제한
  do {
    newPos = getRandomPosition(radius);
    attempts++;
  } while (checkCollision(newPos, positions, size) && attempts < 10000000);
  console.log("attempts : ", attempts)

  return newPos;
}

function checkCollision(newPos, positions, size) {
  // 새로운 좌표(newPos)와 기존 좌표들(positions) 간의 충돌 여부를 확인
  return positions.some(pos => {
    const distance = Math.sqrt(
      Math.pow(newPos.x - pos.x, 2) + Math.pow(newPos.y - pos.y, 2)
    );
    return distance < size; // 텍스트의 크기만큼 떨어져 있지 않으면 충돌
  });
}
const fontSize = Math.floor(30 + Math.random() * 10);

const randomDelay = Math.random() * 2;
const randomDuration = Math.random() * 10 + 10;


function StockInfo() {
  console.log("reload...")

  const [price, setPrice] = useState([]);
  const gptResponse = JSON.parse(localStorage.getItem('gptResponse'));
  // const fontClasses = ['stock-large', 'stock-medium', 'stock-small'];
  const [selectedInfo, setSelectedInfo] = useState([]); // 선택된 정보 저장
  const [detail, setDetail] = useState({});
  // console.log(Object.entries(gptResponse));

  const [positions, setPositions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 표시 여부 상태
  useEffect(() => {
    const radius = 200; // 원의 반지름
    const newPositions = [];

    // 각 텍스트의 위치를 계산하고 충돌을 피하도록 배치
    Object.entries(gptResponse).forEach(stock => {
      const pos = getNonOverlappingPosition(radius, newPositions, 130
      );
      newPositions.push(pos);
    });
    setPositions(newPositions); // 랜덤 좌표 저장
    // console.log(newPositions);
  }, []);

  const handleStockClick = async (index) => {
    // 주식이 클릭되면 해당 정보를 선택\
    
    console.log(Object.entries(gptResponse)[index][0])
    await axios.get(`${process.env.REACT_APP_API_URL}/likedSector/stockPrice/name=${Object.entries(gptResponse)[index][0]}`)
      .then(response => {
        if (!response) {
          console.log("response 없음")
        }
        console.log('Response:', response);
        setDetail({
          name: Object.entries(gptResponse)[index][0],
          description: Object.entries(gptResponse)[index][1],
          priceData: response.data
        });
        const stockInfo = Object.entries(gptResponse)[index][1];
        setSelectedInfo(stockInfo);
        setIsModalOpen(true); // 모달을 열기
        console.log('price : ', price)
        console.log('detail : ', detail);
        // alert('get 요청 성공!');
      })
      .catch(error => {
        console.error('Error:', error);
        alert('요청 실패!');
      });

  };


  const closeDetail = () => {
    setIsModalOpen(false); // 모달 닫기
  }; // 모달 닫기

  const [hoveredIndex, setHoveredIndex] = useState(null); // 어떤 항목에 마우스가 올라갔는지

  const handleMouseEnter = (index) => {
    setHoveredIndex(index); // 마우스가 올라간 항목의 인덱스 저장
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null); // 마우스가 떠나면 초기화
  };
  // console.log("selected : ", selectedInfo)



  return (
    <div className="stocks-container">
      <h1 className="stocks-title">TODAY’S STOCKS</h1>

      <div className="stocks-list">
        {Object.entries(gptResponse).map((value, index) => (
          <span key={value}
            className='stocks'
            style={{
              position: 'absolute', // 절대 위치 설정
              animation: `float${index} ${randomDuration}s linear ${randomDelay}s infinite`,
              left: `calc(50% + ${positions[index]?.x || 0}px)`, // 부모 컨테이너의 중심을 기준으로 배치
              top: `calc(50% + ${positions[index]?.y || 0}px)`, // 부모 컨테이너의 중심을 기준으로 배치
              transform: 'translate(-50%, -50%)', // 정확한 중앙 정렬 보정
              fontSize: hoveredIndex === index ? '50px' : `${fontSize}px`,
              transition: 'font-size 0.3s ease-in-out', // 부드러운 전환
            }}
            onClick={() => handleStockClick(index)} // 클릭 핸들러 추가
            onMouseEnter={() => handleMouseEnter(index)} // 마우스 진입 이벤트
            onMouseLeave={handleMouseLeave} // 마우스 나가기 이벤트
          >
            {value[0]}
          </span>
        ))}
      </div>

      {isModalOpen && (<StockDetail stock={detail} onClose={closeDetail} />)}
    </div>
  );
}


export default StockInfo;
