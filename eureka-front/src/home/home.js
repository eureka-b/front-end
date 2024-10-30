import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios'; // Axios 사용
import { useNavigate } from 'react-router-dom';
import './home.css';
import Logo from './logo'; // 로고 컴포넌트

function Home() {
  const [stocks, setStocks] = useState([]); // 주식 목록을 저장하는 상태
  const [selectedStock, setSelectedStock] = useState(''); // 선택된 주식 상태
  const [showOptions, setShowOptions] = useState(false); // 옵션을 보여줄지 결정하는 상태
  const [selectedItem, setSelectedItem] = useState(''); // 선택된 세부 항목 저장
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 관리
  const [progress, setProgress] = useState(0); // 진행률
  const [loadingMessage, setLoadingMessage] = useState(''); // 로딩 메시지

  const [visibleStocks, setVisibleStocks] = useState([]); // 렌더링할 주식 목록
  const [page, setPage] = useState(1); // 현재 페이지 번호
  const stocksPerPage = 5; // 한 페이지에 표시할 주식 수
  const listRef = useRef(null); // 스크롤 이벤트 감지를 위한 Ref
  const [openCategory, setOpenCategory] = useState(null); // 열려 있는 카테고리 상태



  // 페이지가 변경될 때마다 새 주식 데이터를 렌더링
  useEffect(() => {
    const startIndex = (page - 1) * stocksPerPage;
    const endIndex = startIndex + stocksPerPage;
    setVisibleStocks((prevStocks) => [
      ...prevStocks,
      ...stocks.slice(startIndex, endIndex),
    ]);
    console.log(visibleStocks)
  }, [page]);

  // 스크롤 이벤트 핸들러
  const handleScroll = () => {
    if (
      listRef.current &&
      listRef.current.scrollTop + listRef.current.clientHeight >= listRef.current.scrollHeight
    ) {
      setPage((prevPage) => prevPage + 1); // 다음 페이지로 이동
    }
    console.log("scroll!!")
  };

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/likedSector`)
      .then(response => {
        setStocks(response.data); // 받아온 데이터를 상태로 저장
        console.log(stocks)
      })
      .catch(error => {
        console.error('Error fetching stocks:', error);
      });

    console.log('stocks: ', stocks)

    const listElement = listRef.current;
    if (listElement) {
      listElement.addEventListener('scroll', handleScroll); // 스크롤 이벤트 리스너 추가

      console.log(listElement)
      return () => listElement.removeEventListener('scroll', handleScroll); // 정리
    }
  }, []);


  const loadingMessages = [
    '"주식 시장에서 가장 큰 위험은 주식을 전혀 사지 않는 것이다." | - 피터 린치, 월스트리트 역사상 가장 성공한 펀드매니저 📊',
    '"천체의 움직임은 계산할 수 있지만, 인간들의 광기는 계산하지 못하겠다" | - 아이작 뉴턴, 주식 투자에 실패한 천재 과학자 🤖',
    '"옥수수, 밀, 그리고 주식의 차이는 무엇인가? 옥수수와 밀은 결국 자라지만, 주식은 그렇지 않을 수도 있다." | -마크 트웨인, 소설가 🕒',
    '"돈이 걱정된다면, 주식 시장에 돈을 넣지 말고 그냥 잠을 자세요." | -앙드레 코스톨라니, 유럽의 워렌 버핏 💼',
    "투자는 개인의 판단입니다. GPT를 맹신하지 마세요. 단지 추천만 해 줄 뿐입니다.🚀| ",
    '"오늘 주식을 샀다고 내일 부자가 되길 원한다면, 다른 곳을 찾아보세요." | - 피터 린치, 월스트리트 역사상 가장 성공한 펀드매니저 📊',
    '"내가 틀릴 때를 제외하면 항상 옳다." | - 조지 소로스, 매크로 분석의 귀재로 평가받는 펀드매니저',
    '"이번에는 다르다라는 말만큼 투자자를 망치는 말은 없다." | - 존 템플턴, 월스트리트의 살아 있는 전설로 불리는 투자가'
  ];

  // 주식 목록을 불러오는 함수
  // useEffect(() => {
  //   axios.get(`${process.env.REACT_APP_API_URL}/likedSector`)
  //     .then(response => {
  //       setStocks(response.data); // 받아온 데이터를 상태로 저장
  //       console.log(stocks)
  //     })
  //     .catch(error => {
  //       console.error('Error fetching stocks:', error);
  //     });
  // }, []);




  useEffect(() => {
    if (isLoading) {
      let messageIndex = 0;
      let count = 0;
      const interval = setInterval(() => {
        setProgress((prev) => Math.random() * 5 + prev); // 초당 약 5%씩 진행률 증가



        if (count > 6) {
          messageIndex = Math.floor(Math.random() * 8);
          count = 0;
        } else {
          count++
        }

        setLoadingMessage(loadingMessages[messageIndex]); // 메시지 변경
      }, 500); // 1초마다 실행

      return () => clearInterval(interval); // 컴포넌트 언마운트 시 정리
    }
  }, [isLoading]);


  const handleItemClick = (item) => {
    setSelectedItem(item); // 선택된 세부 항목을 저장
    setShowOptions(false); // 세부 항목 리스트 숨기기
  };

  // 주식 선택 변경 핸들러
  const handleStockChange = (event) => {
    setSelectedStock(event.target.value);
  };

  const handleCategoryClick = (index) => {
    setOpenCategory(openCategory == index ? null : index); // 이미 열려 있으면 닫고, 아니면 엽니다.
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
      axios.get(`${process.env.REACT_APP_API_URL}/likedSector/gpt?sector=${selectedItem}`)
        .then(response => {
          if (!response) {
            console.log("response 없음")
          }
          setProgress(100);
          console.log('Response:', response.data);
          // alert('get 요청 성공!');
          localStorage.setItem('gptResponse', response.data.response.choices[0].message.content);
          setTimeout(() => {
            const storedContent = localStorage.getItem('gptResponse');
            if (storedContent) {
              navigate(`/stockInfo?stock=${selectedItem}`);
            } else {
              console.error('Error: gptResponse not found in localStorage.');
            }
          }, 1000);
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


  if (stocks.length != 0) {
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
            <ul className="category-list" ref={listRef}>

              <div className="stock-list">
                {stocks.map((stock, index) => (
                  <React.Fragment key={index}>
                    <div
                      className="category-item">
                      <div
                        onClick={() => handleCategoryClick(index)}
                        className="category-title-container"
                      >
                        <span className="category-title">{stock.분류}</span>
                        <span className={`dropdown-arrow ${openCategory === index ? 'open' : ''}`}>
                          ▼
                        </span>
                      </div>
                    </div>
                    <ul className={`detail-container ${openCategory === index ? 'opendetail' : ''}`}>
                      {stock['세부 항목'].map((item, idx) => (
                        <li key={idx} className="detail-list"
                          onClick={() => handleItemClick(item)} // 세부 항목 클릭 핸들러
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </React.Fragment>
                ))}
              </div>
            </ul>
          )}


        </div>
        <div className='button-container'>
          <button onClick={handleFindDiningClick} className="find-button">
            Find Dining
          </button>
        </div>
        {isLoading && (
          <div className="loading-container">
            <div className="spinner"></div>
            <p className="loading-message">Loading...</p>
            <div className="progress-bar">
              <div className="progress" style={{ width: `${progress}%` }}></div>
            </div>

            <p className="loading-message">
              {loadingMessage && loadingMessage.split("|").map((line, index) => (
                <React.Fragment key={index}>
                  {index === 0 ? ( // 앞부분은 bold 처리
                    <span style={{ fontWeight: 'bold' }}>{line}</span>
                  ) : (
                    <span style={{ fontWeight: 'normal', fontSize: '18px' }}>{line}</span> // 뒷부분은 normal 처리
                  )}
                  <br />
                </React.Fragment>
              ))}
            </p>
          </div>
        )}
      </div>
    );
  }

  else {
    return null;
  }
}
export default Home;
