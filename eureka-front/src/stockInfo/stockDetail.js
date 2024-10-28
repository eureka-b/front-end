import React from 'react';
import './stockDetail.css'; // 스타일을 위한 CSS 파일 임포트
import { Line } from 'react-chartjs-2'; // Line 차트 가져오기
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function getPastDates(days) {
    const dates = [];
    const today = new Date();

    for (let i = 0; i < days; i++) {
        const pastDate = new Date(today);
        pastDate.setDate(today.getDate() - i); // n일 전 날짜 계산
        const formattedDate = `${pastDate.getMonth() + 1}/${pastDate.getDate()}`; // MM/DD 형식
        dates.push(formattedDate);
    }

    return dates.reverse(); // 최신 날짜부터 정렬
}

function StockDetail({ stock, onClose }) {
    if (!stock || !stock.priceData.length) return null; // stock 데이터가 없으면 아무것도 렌더링하지 않음
    // console.log('stock : ', stock)
    // 차트 데이터
    const chartData = {
        labels: getPastDates(90), // 5일 전부터 오늘까지의 날짜로 레이블 설정
        datasets: [
            {
                label: `${stock.name} 주가`,
                data: stock.priceData, // 주식 가격 데이터
                borderColor: 'rgba(231, 76, 60, 1)',
                backgroundColor: 'rgba(231, 76, 60, 0.2)',
                tension: 0.4, // 선의 곡률 설정 (부드럽게)
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { display: true, position: 'top' },
            title: { display: true, text: `${stock.name} 주가 그래프` },
        },
    };


    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-button" onClick={onClose}>❌</button>
                <h1>{stock.name} 가격 그래프</h1>
                <p>{stock.description}</p>
                <div>
                    <Line data={chartData} options={chartOptions} /> {/* 차트 렌더링 */}
                </div>
            </div>
        </div>
    );
}

export default StockDetail;
