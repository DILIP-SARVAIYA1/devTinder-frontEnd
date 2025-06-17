import React, { useEffect, useState, useRef } from "react";
import Card from "./Card";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

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

  // Fix: Use functional update to avoid stale state
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
    return <div className="text-center mt-10">Loading...</div>;

  if (current >= feedData.length)
    return <div className="text-center mt-10">No more profiles!</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-pink-100 via-yellow-50 to-white">
      <div className="relative w-80 h-[450px]">
        {feedData
          .slice(current, current + 2)
          .reverse()
          .map((item, idx) => {
            const isTop = idx === 0;
            return (
              <div
                key={item._id}
                ref={isTop ? cardRef : null}
                className={`absolute w-full h-full transition-transform duration-300 ${
                  isTop && drag.isDragging ? "z-20" : "z-10"
                }`}
                style={
                  isTop
                    ? {
                        transform: `translate(${drag.x}px, ${
                          drag.y
                        }px) rotate(${drag.x / 15}deg)`,
                        touchAction: "none",
                        cursor: drag.isDragging ? "grabbing" : "grab",
                      }
                    : {
                        transform: "scale(0.95) translateY(10px)",
                        filter: "blur(1px)",
                        zIndex: 0,
                      }
                }
                onMouseDown={isTop ? handleDragStart : undefined}
                onMouseMove={isTop && drag.isDragging ? handleDrag : undefined}
                onMouseUp={isTop ? handleDragEnd : undefined}
                onMouseLeave={
                  isTop && drag.isDragging ? handleDragEnd : undefined
                }
                onTouchStart={isTop ? handleDragStart : undefined}
                onTouchMove={isTop && drag.isDragging ? handleDrag : undefined}
                onTouchEnd={isTop ? handleDragEnd : undefined}
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
              </div>
            );
          })}
      </div>
      <div className="mt-6 text-gray-500">
        {current + 1} / {feedData.length}
      </div>
    </div>
  );
};

export default Feed;
