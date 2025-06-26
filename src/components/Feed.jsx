import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import Card from "./Card";

const SWIPE_THRESHOLD = 120;
const SWIPE_ANIMATION_DURATION = 500;

const Feed = () => {
  const [feedData, setFeedData] = useState([]);
  const [current, setCurrent] = useState(0);
  const [drag, setDrag] = useState({ x: 0, y: 0, isDragging: false });
  const [swipeDirection, setSwipeDirection] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [keyHeld, setKeyHeld] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const res = await axios.get(BASE_URL + "/usersFeed", {
          withCredentials: true,
        });
        setFeedData(res.data.data);
      } catch (error) {
        console.error("Failed to fetch feed:", error);
      }
    };
    fetchFeed();
  }, []);

  // Keyboard controls: one swipe per keydown, no repeat until keyup
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (keyHeld || current >= feedData.length || isAnimating) return;
      if (e.key === "ArrowLeft") {
        setKeyHeld(true);
        handleSwipe("left");
      } else if (e.key === "ArrowRight") {
        setKeyHeld(true);
        handleSwipe("right");
      }
    };
    const handleKeyUp = (e) => {
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") setKeyHeld(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [current, feedData.length, isAnimating, keyHeld]);

  const handleButtonAction = (status) => {
    if (isAnimating || current >= feedData.length) return;
    setSwipeDirection(status === "interested" ? "right" : "left");
    setIsAnimating(true);

    setDrag({
      x:
        status === "interested"
          ? window.innerWidth * 1.2
          : -window.innerWidth * 1.2,
      y: 0,
      isDragging: false,
    });

    setTimeout(() => {
      setCurrent((prev) => Math.min(prev + 1, feedData.length));
      setDrag({ x: 0, y: 0, isDragging: false });
      setSwipeDirection(null);
      setIsAnimating(false);
    }, SWIPE_ANIMATION_DURATION);
  };

  // Unified swipe handler (left/right)
  const handleSwipe = (direction) => {
    if (current >= feedData.length) return;
    setSwipeDirection(direction);
    setIsAnimating(true);

    // Call Card API via ref
    if (cardRef.current && cardRef.current.handleConnectionRequest) {
      cardRef.current.handleConnectionRequest(
        direction === "right" ? "interested" : "ignored"
      );
    }

    setDrag({
      x:
        direction === "right"
          ? window.innerWidth * 1.2
          : -window.innerWidth * 1.2,
      y: 0,
      isDragging: false,
    });

    setTimeout(() => {
      setCurrent((prev) => Math.min(prev + 1, feedData.length));
      setDrag({ x: 0, y: 0, isDragging: false });
      setSwipeDirection(null);
      setIsAnimating(false);
    }, SWIPE_ANIMATION_DURATION);
  };

  // Handle drag events for swipe
  const handleDragStart = (e) => {
    // Prevent drag if starting on a button
    if (e.target.closest("button") || e.target.tagName === "BUTTON") {
      return;
    }
    if (isAnimating) return;
    setDrag((prev) => ({
      ...prev,
      isDragging: true,
      startX: e.type === "touchstart" ? e.touches[0].clientX : e.clientX,
      startY: e.type === "touchstart" ? e.touches[0].clientY : e.clientY,
    }));
  };

  const handleDrag = (e) => {
    if (!drag.isDragging || isAnimating) return;
    const clientX = e.type === "touchmove" ? e.touches[0].clientX : e.clientX;
    const clientY = e.type === "touchmove" ? e.touches[0].clientY : e.clientY;
    setDrag((prev) => ({
      ...prev,
      x: clientX - prev.startX,
      y: clientY - prev.startY,
    }));
  };

  const handleDragEnd = () => {
    if (!drag.isDragging || isAnimating) return;
    if (drag.x > SWIPE_THRESHOLD) {
      handleSwipe("right");
    } else if (drag.x < -SWIPE_THRESHOLD) {
      handleSwipe("left");
    } else {
      setDrag({ x: 0, y: 0, isDragging: false });
      setSwipeDirection(null);
      setIsAnimating(false);
    }
  };
  console.log("Feed data length:", feedData.length);

  // if (!feedData.length)
  //   return (
  //     <div className="flex flex-col items-center justify-center w-3/4 min-h-[500px] h-[500px] mx-auto">
  //       <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mb-4"></div>
  //       <div className="text-lg text-gray-500">Loading profiles...</div>
  //     </div>
  //   );

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
    <div className="flex flex-col items-center justify-center overflow-hidden bg-black w-full min-h-[100vh] mx-auto">
      <div className="flex flex-col items-center justify-center w-3/4 mx-auto h-full">
        <div className="relative w-80 h-[500px] flex items-center justify-center">
          {feedData.slice(current, current + 1).map((item, idx) => {
            const isTop = idx === 0;
            return (
              <div
                key={item._id}
                ref={isTop ? cardRef : null}
                className={`absolute w-full h-full rounded-3xl shadow-2xl flex items-center justify-center
                  ${isTop ? "z-30" : "z-10 pointer-events-none"}
                  ${
                    isTop && (drag.isDragging || isAnimating)
                      ? "ring-4 ring-pink-400/40"
                      : ""
                  }
                `}
                style={
                  isTop
                    ? {
                        transform: `translate(${drag.x}px, ${
                          drag.y
                        }px) rotate(${drag.x / 12}deg)`,
                        touchAction: isAnimating ? "none" : "auto",
                        cursor: drag.isDragging ? "grabbing" : "grab",
                        boxShadow:
                          drag.x > 100
                            ? "0 0 32px 8px #22c55e88"
                            : drag.x < -100
                            ? "0 0 32px 8px #ef444488"
                            : "0 8px 32px rgba(0,0,0,0.18)",
                        opacity: swipeDirection ? 0 : 1,
                        transition: drag.isDragging
                          ? "none"
                          : swipeDirection
                          ? `transform 0.5s cubic-bezier(.23,1.12,.32,1), opacity 0.5s, box-shadow 0.25s, border 0.25s`
                          : "",
                        willChange: "transform, opacity",
                      }
                    : {
                        transform: "scale(1) translateY(0px)",
                        zIndex: 0,
                        transition:
                          "transform 0.5s cubic-bezier(.23,1.12,.32,1)",
                      }
                }
                onMouseDown={
                  isTop && !isAnimating ? handleDragStart : undefined
                }
                onMouseMove={
                  isTop && drag.isDragging && !isAnimating
                    ? handleDrag
                    : undefined
                }
                onMouseUp={isTop && !isAnimating ? handleDragEnd : undefined}
                onMouseLeave={
                  isTop && drag.isDragging && !isAnimating
                    ? handleDragEnd
                    : undefined
                }
                onTouchStart={
                  isTop && !isAnimating ? handleDragStart : undefined
                }
                onTouchMove={
                  isTop && drag.isDragging && !isAnimating
                    ? handleDrag
                    : undefined
                }
                onTouchEnd={isTop && !isAnimating ? handleDragEnd : undefined}
                tabIndex={isTop ? 0 : -1}
              >
                <Card
                  ref={cardRef}
                  _id={item._id}
                  firstName={item.firstName}
                  lastName={item.lastName}
                  name={`${item.firstName} ${item.lastName}`}
                  gender={item.gender}
                  age={item.age}
                  about={item.about}
                  profilePic={item.profilePic}
                  skills={item.skills}
                  distance={item.distance}
                  onButtonAction={handleButtonAction} // <-- add this
                />
                {/* Swipe direction indicator */}
                {isTop && drag.x > SWIPE_THRESHOLD && (
                  <div className="absolute top-12 left-8 text-green-500 text-5xl font-extrabold rotate-[-18deg] pointer-events-none select-none drop-shadow-2xl tracking-widest ">
                    LIKE
                  </div>
                )}
                {isTop && drag.x < -SWIPE_THRESHOLD && (
                  <div className="absolute top-12 right-8 text-red-500 text-5xl font-extrabold rotate-[18deg] pointer-events-none select-none drop-shadow-2xl tracking-widest ">
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
        <div className="mt-6 flex items-center text-center gap-6">
          <span className="flex items-center gap-2 text-gray-400 text-base font-medium">
            <kbd className="uppercase w-32 px-3 py-2 rounded-lg bg-gradient-to-br from-red-100 to-red-200 border-2 border-red-400 text-red-600 font-bold shadow-md shadow-red-100">
              ← Dislike
            </kbd>
          </span>
          <span className="flex items-center gap-2 text-gray-400 text-base font-medium">
            <kbd className="uppercase w-32 px-3 py-2 rounded-lg bg-gradient-to-br from-green-100 to-green-200 border-2 border-green-400 text-green-600 font-bold shadow-md shadow-green-100">
              → Like
            </kbd>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Feed;
