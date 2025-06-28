import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import ProfileCard from "./ProfileCard";

const SWIPE_THRESHOLD = 120;
const SWIPE_ANIMATION_DURATION = 500;

const Feed = () => {
  const [feedData, setFeedData] = useState([]);
  const [drag, setDrag] = useState({
    x: 0,
    y: 0,
    isDragging: false,
    cardIdx: null,
  });
  const [swipeDirection, setSwipeDirection] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [loading, setLoading] = useState(true);
  const cardRefs = useRef({});

  useEffect(() => {
    axios
      .get(BASE_URL + "/usersFeed", { withCredentials: true })
      .then((res) => setFeedData(res.data.data))
      .catch((err) => console.error("Failed to fetch feed:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleDragStart = (e, idx) => {
    if (
      isAnimating ||
      e.target.closest("button") ||
      e.target.tagName === "BUTTON"
    )
      return;
    setDrag({
      isDragging: true,
      startX: e.type === "touchstart" ? e.touches[0].clientX : e.clientX,
      startY: e.type === "touchstart" ? e.touches[0].clientY : e.clientY,
      x: 0,
      y: 0,
      cardIdx: idx,
    });
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
    if (drag.x > SWIPE_THRESHOLD) handleSwipe("right", drag.cardIdx);
    else if (drag.x < -SWIPE_THRESHOLD) handleSwipe("left", drag.cardIdx);
    else {
      setDrag({ x: 0, y: 0, isDragging: false, cardIdx: null });
      setSwipeDirection(null);
      setIsAnimating(false);
    }
  };

  const handleSwipe = (direction, idx) => {
    setSwipeDirection(direction);
    setIsAnimating(true);
    const cardRef = cardRefs.current[idx];
    cardRef?.handleConnectionRequest?.(
      direction === "right" ? "interested" : "ignored"
    );
    setDrag((prev) => ({
      ...prev,
      x:
        direction === "right"
          ? window.innerWidth * 1.2
          : -window.innerWidth * 1.2,
      isDragging: false,
    }));
    setTimeout(() => {
      setFeedData((prev) => prev.filter((_, i) => i !== idx));
      setDrag({ x: 0, y: 0, isDragging: false, cardIdx: null });
      setSwipeDirection(null);
      setIsAnimating(false);
    }, SWIPE_ANIMATION_DURATION);
  };

  const handleButtonAction = (status, idx) => {
    if (isAnimating) return;
    setSwipeDirection(status === "interested" ? "right" : "left");
    setIsAnimating(true);
    setDrag({
      x:
        status === "interested"
          ? window.innerWidth * 1.2
          : -window.innerWidth * 1.2,
      y: 0,
      isDragging: false,
      cardIdx: idx,
    });
    setTimeout(() => {
      setFeedData((prev) => prev.filter((_, i) => i !== idx));
      setDrag({ x: 0, y: 0, isDragging: false, cardIdx: null });
      setSwipeDirection(null);
      setIsAnimating(false);
    }, SWIPE_ANIMATION_DURATION);
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center w-3/4 min-h-[500px] h-[500px] mx-auto">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mb-4"></div>
        <div className="text-lg text-gray-500">Loading profiles...</div>
      </div>
    );

  if (!feedData.length)
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
          {feedData.map((item, idx) => {
            const isDragging = drag.isDragging && drag.cardIdx === idx;
            const isAnimatingCard = isAnimating && drag.cardIdx === idx;
            const style =
              isDragging || isAnimatingCard
                ? {
                    transform: `translate(${drag.x}px, ${drag.y}px) rotate(${
                      drag.x / 12
                    }deg)`,
                    zIndex: 30,
                    opacity: swipeDirection ? 0 : 1,
                    transition: drag.isDragging
                      ? "none"
                      : swipeDirection
                      ? `transform 0.5s cubic-bezier(.23,1.12,.32,1), opacity 0.5s`
                      : "",
                    willChange: "transform, opacity",
                    cursor: drag.isDragging ? "grabbing" : "grab",
                    touchAction: isAnimating ? "none" : "auto",
                  }
                : { zIndex: 10, opacity: 1, transition: "none" };

            return (
              <div
                key={item._id}
                className="absolute w-full h-full rounded-3xl shadow-2xl flex items-center justify-center"
                style={style}
                onMouseDown={(e) => handleDragStart(e, idx)}
                onMouseMove={
                  drag.isDragging && drag.cardIdx === idx
                    ? handleDrag
                    : undefined
                }
                onMouseUp={handleDragEnd}
                onMouseLeave={
                  drag.isDragging && drag.cardIdx === idx
                    ? handleDragEnd
                    : undefined
                }
                onTouchStart={(e) => handleDragStart(e, idx)}
                onTouchMove={
                  drag.isDragging && drag.cardIdx === idx
                    ? handleDrag
                    : undefined
                }
                onTouchEnd={handleDragEnd}
                tabIndex={0}
              >
                <ProfileCard
                  ref={(ref) => (cardRefs.current[idx] = ref)}
                  {...item}
                  name={`${item.firstName} ${item.lastName}`}
                  onButtonAction={(status) => handleButtonAction(status, idx)}
                />
                {isDragging && drag.x > SWIPE_THRESHOLD && (
                  <div className="absolute top-12 left-8 text-green-500 text-5xl font-extrabold rotate-[-18deg] pointer-events-none select-none drop-shadow-2xl tracking-widest ">
                    LIKE
                  </div>
                )}
                {isDragging && drag.x < -SWIPE_THRESHOLD && (
                  <div className="absolute top-12 right-8 text-red-500 text-5xl font-extrabold rotate-[18deg] pointer-events-none select-none drop-shadow-2xl tracking-widest ">
                    NOPE
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="mt-8 text-gray-500 text-lg tracking-wide">
          {feedData.length} profiles left
        </div>
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
