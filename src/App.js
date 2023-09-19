// App.js
import React, { useState, useEffect, useMemo } from 'react';
import { BsMic, BsMicMute } from "react-icons/bs";
import Navbar from './components/Navbar';
import Timer from './components/Timer'
import axios from 'axios';
import './App.css';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

function App() {
  const [imgArr, setImgArr] = useState(null);
  const [text, setText] = useState(null);
  const [loading, setLoading] = useState(false);
  const [count,setCount] = useState(0);
  const [mytranscript, setmytranscript] = useState(null)
  

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  const [mic,setMic] = useState(!listening)

  useEffect(()=>{
    if(transcript !== '')
    setmytranscript(transcript)
  },[transcript])

  useEffect(()=>{
    if(imgArr){
    let imageURL = imgArr[0]?.url;
    console.log("img",imgArr)
    const image = new Image();
    image.src = imageURL;
    image.onload = () => setLoading(false)
    }
  },[imgArr])

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  const handleTextChange = (e) => {
    setText(e.target.value);
  }

  

  const searchGPT = () => {
    if(loading) return;
    setLoading(true);
    const url = "https://api.openai.com/v1/images/generations";
    const postData = {
      prompt: text ? text : mytranscript,
      n: 1,
      size: "512x512"
    };
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.REACT_APP_CHATGPT_KEY}`
    };
    setImgArr(null)
    axios.post(url, postData, { headers: headers })
      .then((res) => {
        setImgArr(res.data.data);
        setText('');
        // setLoading(false);
        setmytranscript(null)
      })
      .catch((err) => {
        console.log("err", err);
        setText('');
        setLoading(false);
        setCount(1);
        setImgArr(null);
        setmytranscript(null);
      });
  }
  
  const handleVoiceStart = () =>{
    // if(loading) return;
    SpeechRecognition.startListening();
    
    setMic(prev => !prev)
  }
  const handleVoiceStop = () =>{
    // if(loading) return;
    SpeechRecognition.stopListening();
    setMic(prev => !prev)
    if(transcript.length)
    searchGPT();
  }

 
  console.log(transcript)
  return (
    <div className="App">
      <Navbar />
      <div className="container">
        <div className="search-container">
          <input
            type="text"
            placeholder={"Enter here"}
            value={text?text:mytranscript}
            onChange={handleTextChange}
            className="search-input"
          />
          {mic ? <BsMic className="search-button" style={{padding:"13px"}}  onClick={handleVoiceStart}/> : <BsMicMute  className="search-button" style={{padding:"13px"}} onClick={handleVoiceStop}/>}
          <button className="search-button" style={{marginLeft: "10px", padding: "11px 20px"}} onClick={searchGPT}>
            Search
          </button>
          
        </div>
        {!mic && <span style={{margin: "10px"}}>Listening...</span> }
        <div>{count ? <Timer initialMinute={count}/> : null}</div>

        {loading ? <div className="result-images"><Skeleton height={512} width={512}/></div> :
        <div className="result-images">
          {imgArr?.map((img, index) => (
            <img
              src={img.url}
              alt={`Generated Image ${index + 1}`}
              key={index}
              onLoad={()=>{setLoading(false)}}
            />
          ))}
        </div>}
      </div>
    </div>
  );
}

export default App;
