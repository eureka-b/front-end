import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './home/home';
import StockInfo from './stockInfo/stockInfo';
import './App.css';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/stockInfo" element={<StockInfo />} />
      </Routes>
    </Router>
    
  );
}

export default App;
