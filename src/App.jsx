import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import React, { useState, useEffect, useCallback } from "react"; // Added useCallback

import Body from "./components/Body";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import store from "./appStore/store"; // Grouped imports for better readability

// ---
// ## AppLoader Component
// A component that displays a heart-shaped loading animation with a fade-in effect.
// ---
const AppLoader = ({ onFinish }) => {
  // `isFaded` tracks whether the fade-in animation should start.
  const [isFaded, setIsFaded] = useState(false);

  useEffect(() => {
    // Start the fade animation slightly after component mounts to allow initial render.
    const fadeTimer = setTimeout(() => setIsFaded(true), 100); // Reduced delay slightly

    // Call onFinish after the animation completes.
    const finishTimer = setTimeout(() => {
      // Ensure onFinish is a function before calling it.
      if (typeof onFinish === "function") {
        onFinish();
      }
    }, 900); // Matches animation duration

    // Cleanup timers on component unmount to prevent memory leaks.
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]); // Dependency array: re-run if onFinish changes

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center transition-colors duration-700"
      style={{
        // The background gradient remains consistent, simplifying the style logic.
        background: "linear-gradient(135deg, #18181b 0%, #312e81 100%)",
      }}
      aria-live="polite" // Announce content changes for accessibility
      aria-busy={true} // Indicate that content is loading
    >
      <div className="flex items-center justify-center">
        <svg
          className={`w-24 h-24 transition-all duration-700 ease-in-out ${
            isFaded ? "animate-heart-fade-in" : ""
          }`}
          viewBox="0 0 100 100"
          fill="none"
          role="img" // Indicate that this is an image
          aria-label="Loading heart animation" // Provide a text alternative for accessibility
        >
          <path
            d="M50 80C50 80 20 60 20 40C20 25 35 20 50 35C65 20 80 25 80 40C80 60 50 80 50 80Z"
            fill="#fff"
            opacity="0.95"
          />
        </svg>
        {/*
          Using a separate <style> block for global CSS or keyframe animations
          is generally acceptable within a component if the styles are
          highly specific to that component and not meant for global use.
          For larger projects, consider CSS modules or a styling library.
        */}
        <style jsx="true">
          {" "}
          {/* Added jsx="true" for potential tooling benefits */}
          {`
            @keyframes heart-fade-in {
              0% {
                transform: scale(3.5);
                opacity: 0;
                filter: drop-shadow(0 0 0px #fff0)
                  drop-shadow(0 0 0px #f472b600);
              }
              60% {
                transform: scale(1.2);
                opacity: 0.7;
                filter: drop-shadow(0 0 32px #fff9)
                  drop-shadow(0 0 16px #f472b6cc);
              }
              100% {
                transform: scale(1);
                opacity: 1;
                filter: drop-shadow(0 0 16px #fff6)
                  drop-shadow(0 0 8px #f472b6cc);
              }
            }
            .animate-heart-fade-in {
              animation: heart-fade-in 0.7s cubic-bezier(0.4, 0, 0.2, 1)
                forwards;
              /* The final state filter is applied directly here to ensure consistency
                 after the animation, although the keyframes also reach this state. */
              filter: drop-shadow(0 0 16px #fff6) drop-shadow(0 0 8px #f472b6cc);
            }
          `}
        </style>
      </div>
    </div>
  );
};

// ---
// ## App Component
// The main application component that manages loading state and routing.
// ---
function App() {
  // `isLoading` controls the visibility of the AppLoader.
  const [isLoading, setIsLoading] = useState(true);

  // `handleLoaderFinish` is memoized to prevent unnecessary re-renders of AppLoader.
  const handleLoaderFinish = useCallback(() => {
    setIsLoading(false);
  }, []); // Empty dependency array means this function is created once.

  return (
    // Redux Provider wraps the entire application to make the store available.
    <Provider store={store}>
      <div className="select-none">
        {/* Conditionally render the loader or the main application content */}
        {isLoading ? (
          <AppLoader onFinish={handleLoaderFinish} />
        ) : (
          <BrowserRouter basename="/">
            <Routes>
              {/* Define application routes */}
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
