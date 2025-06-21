import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import Card from "./Card";

const Feed = () => {
  const [feedData, setFeedData] = useState([]);
  const [current, setCurrent] = useState(0);
  const [drag, setDrag] = useState({ x: 0, y: 0, isDragging: false });
  const cardRef = useRef(null);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const res = await axios.get(BASE_URL + "/feed", {
          withCredentials: true,
        });
        setFeedData(res.data.data);
      } catch (error) {
        console.error("Failed to fetch feed:", error);
      }
    };
    fetchFeed();
  }, []);

  // Keyboard controls: left/right arrow for swipe
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (current >= feedData.length) return;
      if (e.key === "ArrowLeft") {
        // Dislike
        setDrag({ x: -200, y: 0, isDragging: false });
        setTimeout(() => {
          setCurrent((prev) => Math.min(prev + 1, feedData.length));
          setDrag({ x: 0, y: 0, isDragging: false });
        }, 200);
      } else if (e.key === "ArrowRight") {
        // Like
        setDrag({ x: 200, y: 0, isDragging: false });
        setTimeout(() => {
          setCurrent((prev) => Math.min(prev + 1, feedData.length));
          setDrag({ x: 0, y: 0, isDragging: false });
        }, 200);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [current, feedData.length]);

  // Handle drag events for swipe
  const handleDragStart = (e) => {
    setDrag((prev) => ({
      ...prev,
      isDragging: true,
      startX: e.type === "touchstart" ? e.touches[0].clientX : e.clientX,
      startY: e.type === "touchstart" ? e.touches[0].clientY : e.clientY,
    }));
  };

  const handleDrag = (e) => {
    if (!drag.isDragging) return;
    const clientX = e.type === "touchmove" ? e.touches[0].clientX : e.clientX;
    const clientY = e.type === "touchmove" ? e.touches[0].clientY : e.clientY;
    setDrag((prev) => ({
      ...prev,
      x: clientX - prev.startX,
      y: clientY - prev.startY,
    }));
  };

  const handleDragEnd = () => {
    if (!drag.isDragging) return;
    // If swiped far enough, go to next card
    if (drag.x > 120 || drag.x < -120) {
      setCurrent((prev) => Math.min(prev + 1, feedData.length));
    }
    setDrag({ x: 0, y: 0, isDragging: false });
  };

  if (!feedData.length)
    return (
      <div className="flex flex-col items-center justify-center w-3/4 min-h-[500px] h-[500px] mx-auto">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mb-4"></div>
        <div className="text-lg text-gray-500">Loading profiles...</div>
      </div>
    );

  if (current >= feedData.length)
    return (
      <div className="flex flex-col items-center justify-center w-3/4 min-h-[500px] h-[500px] mx-auto">
        <div className="text-2xl font-semibold text-gray-600 mb-2">
          No more profiles!
        </div>
        <div className="text-gray-400">Check back later for more matches.</div>
      </div>
    );

  return (
    <div className="flex flex-col items-center justify-center bg-black w-full min-h-[100vh] mx-auto">
      <div className="flex flex-col items-center justify-center w-3/4 mx-auto h-full">
        <div className="relative w-80 h-[450px] flex items-center justify-center">
          {feedData
            .slice(current, current + 2)
            .reverse()
            .map((item, idx) => {
              const isTop = idx === 0;
              return (
                <div
                  key={item.id}
                  ref={isTop ? cardRef : null}
                  className={`absolute w-full h-full transition-transform duration-300 rounded-3xl ${
                    isTop && drag.isDragging ? "z-20" : "z-10"
                  } focus:outline-none shadow-xl flex items-center justify-center`}
                  style={
                    isTop
                      ? {
                          transform: `translate(${drag.x}px, ${
                            drag.y
                          }px) rotate(${drag.x / 15}deg)`,
                          touchAction: "none",
                          cursor: drag.isDragging ? "grabbing" : "grab",
                          boxShadow:
                            drag.x > 100
                              ? "0 0 32px 4px #22c55e88"
                              : drag.x < -100
                              ? "0 0 32px 4px #ef444488"
                              : "0 8px 32px rgba(0,0,0,0.18)",
                          border:
                            drag.x > 100
                              ? "2px solid #22c55e"
                              : drag.x < -100
                              ? "2px solid #ef4444"
                              : "2px solid #fff",
                          transition: drag.isDragging
                            ? "none"
                            : "transform 0.3s cubic-bezier(.25,.8,.25,1), box-shadow 0.2s, border 0.2s",
                        }
                      : {
                          transform: "scale(0.93) translateY(24px)",
                          filter: "blur(1.5px)",
                          zIndex: 0,
                        }
                  }
                  onMouseDown={isTop ? handleDragStart : undefined}
                  onMouseMove={
                    isTop && drag.isDragging ? handleDrag : undefined
                  }
                  onMouseUp={isTop ? handleDragEnd : undefined}
                  onMouseLeave={
                    isTop && drag.isDragging ? handleDragEnd : undefined
                  }
                  onTouchStart={isTop ? handleDragStart : undefined}
                  onTouchMove={
                    isTop && drag.isDragging ? handleDrag : undefined
                  }
                  onTouchEnd={isTop ? handleDragEnd : undefined}
                  tabIndex={isTop ? 0 : -1}
                >
                  <Card
                    firstName={item.firstName}
                    lastName={item.lastName}
                    name={`${item.firstName} ${item.lastName}`}
                    gender={item.gender}
                    age={item.age}
                    about={item.about}
                    profilePic={item.profilePic}
                    skills={item.skills}
                  />
                  {/* Swipe direction indicator */}
                  {isTop && drag.x > 100 && (
                    <div className="absolute top-10 left-6 text-green-500 text-4xl font-bold rotate-[-20deg] pointer-events-none select-none drop-shadow-lg">
                      LIKE
                    </div>
                  )}
                  {isTop && drag.x < -100 && (
                    <div className="absolute top-10 right-6 text-red-500 text-4xl font-bold rotate-[20deg] pointer-events-none select-none drop-shadow-lg">
                      NOPE
                    </div>
                  )}
                </div>
              );
            })}
        </div>
        <div className="mt-8 text-gray-500 text-lg tracking-wide">
          {current + 1} / {feedData.length}
        </div>
        {/* Keyboard input hint */}
        <div className="mt-4 flex items-center gap-4">
          <span className="flex items-center gap-1 text-gray-400 text-sm">
            <kbd className="px-2 py-1 rounded bg-gray-200 border border-gray-300 shadow-inner">
              ←
            </kbd>
            Dislike
          </span>
          <span className="flex items-center gap-1 text-gray-400 text-sm">
            <kbd className="px-2 py-1 rounded bg-gray-200 border border-gray-300 shadow-inner">
              →
            </kbd>
            Like
          </span>
        </div>
      </div>
    </div>
  );
};

export default Feed;
