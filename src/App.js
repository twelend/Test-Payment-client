import React, { useEffect, useState } from 'react';
import './App.css';
import Operators from './components/Operators/Operators.jsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SendForm from './components/sendForm/SendForm.jsx';

import axios from 'axios';
import Success from './components/successDeposit/Success.jsx';


function App() {

  const [id, setId] = useState()
  const [ballance, setBallance] = useState(0)
  const [operData, setOperData] = useState({})
  const [isLoaded, setIsloaded] = useState(false)

  const [isError, setIsError] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetch('https://643165603adb1596516b77dd.mockapi.io/data')
      .then(res => res.json()
        .then(json => {
          setOperData(json)
          setIsloaded(true)
        }))
      .catch((error) => console.warn(error))
  }, [])

  function getMoney() {
    axios.get('http://localhost:4242/').then((res) => setBallance(res.data.ballance))
      .catch((error) => console.warn(error))
  }

  useEffect(() => {
    getMoney()
  }, [])

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Operators operData={operData} setId={setId} isLoaded={isLoaded}/>} />
          <Route path="/send" element={<SendForm setIsError={setIsError} setMessage={setMessage} ballance={ballance} setBallance={setBallance} getMoney={getMoney} operData={operData} />} />
          <Route path='/success' element={<Success message={message} isError={isError}/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
