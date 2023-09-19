// App.js
import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import Timer from './components/Timer'
import axios from 'axios';
import './App.css';

function App() {
  const [imgArr, setImgArr] = useState(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [count,setCount] = useState(0)

  const handleTextChange = (e) => {
    setText(e.target.value);
  }

  const searchGPT = () => {
    setLoading(true);
    const url = "https://api.openai.com/v1/images/generations";
    const postData = {
      prompt: text,
      n: 1,
      size: "512x512"
    };
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.REACT_APP_CHATGPT_KEY}`
    };
    axios.post(url, postData, { headers: headers })
      .then((res) => {
        setImgArr(res.data.data);
        setText('');
        setLoading(false);
      })
      .catch((err) => {
        console.log("err", err);
        setText('');
        setLoading(false);
        setCount(1);
        setImgArr(null)
      });
  }

  return (
    <div className="App">
      <Navbar />
      <div className="container">
        <div className="search-container">
          <input
            type="text"
            placeholder="Enter here"
            value={text}
            onChange={handleTextChange}
            className="search-input"
          />
          <button className="search-button" onClick={searchGPT}>
            Search
          </button>
        </div>
        <div>{count ? <Timer initialMinute={count}/> : null}</div>
        {loading && <div className="loading-indicator"></div>}
        <div className="result-images">
          {imgArr?.map((img, index) => (
            <img
              src={img.url}
              alt={`Generated Image ${index + 1}`}
              key={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
