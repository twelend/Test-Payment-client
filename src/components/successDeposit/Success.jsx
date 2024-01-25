import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import './success.css'

const CountdownComponent = ({ onComplete, message, isError}) => {
    const [countdown, setCountdown] = useState(3);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prevCountdown) => prevCountdown - 1);
        }, 1000);

        if (countdown === 0) {
            clearInterval(timer);
            onComplete();
        }

        return () => clearInterval(timer);
    }, [countdown, onComplete]);

    return (
        <div className="success">
            <h1>{message}</h1>
            <h2>Перенаправление через: <span>{countdown}</span></h2>
        </div>
    );
};

const Success = ({ message, isError }) => {
    const history = useNavigate();

    const handleCountdownComplete = () => {
        isError ? history('/send') : history('/');
    };

    return (
        <div>
            <CountdownComponent message={message} isError={isError} onComplete={handleCountdownComplete} />
        </div>
    );
};

export default Success;