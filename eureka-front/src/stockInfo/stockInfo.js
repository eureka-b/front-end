import React, { useEffect, useState } from 'react';
import './stockInfo.css'; // 스타일을 위한 CSS 파일 임포트



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
  } while (checkCollision(newPos, positions, size) && attempts < 100);
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

function StockInfo() {
  console.log("reload...")
  const gptResponse = JSON.parse(localStorage.getItem('gptResponse'));
  const fontClasses = ['stock-large', 'stock-medium', 'stock-small'];
  const [selectedInfo, setSelectedInfo] = useState(null); // 선택된 정보 저장

  console.log(Object.entries(gptResponse));

  const [positions, setPositions] = useState([]);
  useEffect(() => {
    const radius = 150; // 원의 반지름
    const newPositions = [];

    // 각 텍스트의 위치를 계산하고 충돌을 피하도록 배치
    Object.entries(gptResponse).forEach(stock => {
    const pos = getNonOverlappingPosition(radius, newPositions, 200
    );
    newPositions.push(pos);
    });
    setPositions(newPositions); // 랜덤 좌표 저장
    console.log(newPositions);
  }, []);

  const handleStockClick = (index) => {
    // 주식이 클릭되면 해당 정보를 선택
    const stockInfo = Object.entries(gptResponse)[index][1];
    setSelectedInfo(stockInfo);
  };

  
  return (
    <div className="stocks-container">
      <h1 className="stocks-title">TODAY’S STOCKS</h1>

      <div className="stocks-list">
        {Object.entries(gptResponse).map((value, index)=> (
          <span key={value} 
                className={`stocks ${fontClasses[index] || 'stock-large'}`}
                style={{
                  position: 'absolute', // 절대 위치 설정
                  left: `calc(50% + ${positions[index]?.x || 0}px)`, // 부모 컨테이너의 중심을 기준으로 배치
                  top: `calc(50% + ${positions[index]?.y || 0}px)`, // 부모 컨테이너의 중심을 기준으로 배치
                  transform: 'translate(-50%, -50%)', // 정확한 중앙 정렬 보정
                  }}
                onClick={() => handleStockClick(index)} // 클릭 핸들러 추가
                >
            {value[0]}
          </span>
        ))}
      </div>

      <div className="description">
        {selectedInfo ? (
          <p>{selectedInfo}</p> // 선택된 주식의 정보 표시
        ) : (
          <p>주식을 클릭하면 해당 주식의 ChatGPT의 추천 이유가 표시됩니다.</p>
        )}
      </div>
    </div>
  );
}

export default StockInfo;
