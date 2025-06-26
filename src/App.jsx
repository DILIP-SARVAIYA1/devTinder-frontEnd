import { BrowserRouter, Route, Routes } from "react-router-dom";
import Body from "./components/Body";
import Login from "./components/Login";
import { Provider } from "react-redux";
import store from "./appStore/store";
import SignUp from "./components/SignUp";
import React, { useState, useEffect } from "react";

// Animated loader: only heart fade-in animation, improved with darker gradient and cleaner logic
const AppLoader = ({ onFinish }) => {
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const fadeTimeout = setTimeout(() => setFade(true), 200);
    const finishTimeout = setTimeout(() => onFinish && onFinish(), 900);
    return () => {
      clearTimeout(fadeTimeout);
      clearTimeout(finishTimeout);
    };
  }, [onFinish]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center transition-colors duration-700"
      style={{
        background: fade
          ? "linear-gradient(135deg, #18181b 0%, #312e81 100%)"
          : "linear-gradient(135deg, #18181b 0%, #312e81 100%)",
      }}
    >
      <div className="flex items-center justify-center">
        <svg
          className={`w-24 h-24 transition-all duration-700 ease-in-out
            ${fade ? "animate-heart-fade-in" : ""}
          `}
          viewBox="0 0 100 100"
          fill="none"
        >
          <path
            d="M50 80C50 80 20 60 20 40C20 25 35 20 50 35C65 20 80 25 80 40C80 60 50 80 50 80Z"
            fill="#fff"
            opacity="0.95"
          />
        </svg>
        <style>
          {`
            @keyframes heart-fade-in {
              0% {
                transform: scale(3.5);
                opacity: 0;
                filter: drop-shadow(0 0 0px #fff0) drop-shadow(0 0 0px #f472b600);
              }
              60% {
                transform: scale(1.2);
                opacity: 0.7;
                filter: drop-shadow(0 0 32px #fff9) drop-shadow(0 0 16px #f472b6cc);
              }
              100% {
                transform: scale(1);
                opacity: 1;
                filter: drop-shadow(0 0 16px #fff6) drop-shadow(0 0 8px #f472b6cc);
              }
            }
            .animate-heart-fade-in {
              animation: heart-fade-in 0.7s cubic-bezier(.4,0,.2,1) forwards;
              filter: drop-shadow(0 0 16px #fff6) drop-shadow(0 0 8px #f472b6cc);
            }
          `}
        </style>
      </div>
    </div>
  );
};

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <Provider store={store}>
      <div className="select-none">
        {loading && <AppLoader onFinish={() => setLoading(false)} />}
        {!loading && (
          <BrowserRouter basename="/">
            <Routes>
              <Route path="/" element={<Body />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
            </Routes>
          </BrowserRouter>
        )}
      </div>
    </Provider>
  );
}

export default App;
