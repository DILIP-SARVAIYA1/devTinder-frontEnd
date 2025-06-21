import React from "react";

const Card = ({
  firstName,
  lastName,
  name,
  age,
  gender,
  about,
  imgSrc,
  profilePic,
  skills = [],
}) => {
  return (
    <div className="relative w-80 h-[450px] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col justify-end transition-transform duration-300 hover:scale-105 select-none">
      {/* Full background image behind all content */}
      <img
        className="absolute inset-0 w-full h-full object-cover z-0"
        src={imgSrc || profilePic}
        alt={`${firstName || name}'s profile`}
        draggable={false}
      />
      {/* Overlay for better text visibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-10" />
      {/* Info Section at the bottom */}
      <div className="relative z-20 p-5 w-full">
        <h2 className="text-2xl font-bold text-white drop-shadow">
          {firstName || name}
          {age && <span className="font-normal text-gray-200">, {age}</span>}
        </h2>
        {gender && (
          <p className="text-pink-200 text-xs mt-1 capitalize">{gender}</p>
        )}
        <p className="text-gray-100 text-sm mt-2">{about}</p>
        {skills.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {skills.map((skill, idx) => (
              <span
                key={idx}
                className="bg-pink-200/80 text-pink-800 px-2 py-0.5 rounded-full text-xs"
              >
                {skill}
              </span>
            ))}
          </div>
        )}
        {/* Action Buttons */}
        <div className="flex justify-between mt-6 px-4">
          <button
            className="bg-white/80 border-2 border-red-500 hover:bg-red-500 hover:text-white text-red-500 rounded-full w-14 h-14 flex items-center justify-center text-2xl shadow transition duration-200 active:scale-90"
            aria-label="Dislike"
          >
            <span role="img" aria-label="dislike">
              ✖️
            </span>
          </button>
          <button
            className="bg-white/80 border-2 border-green-500 hover:bg-green-500 hover:text-white text-green-500 rounded-full w-14 h-14 flex items-center justify-center text-2xl shadow transition duration-200 active:scale-90"
            aria-label="Like"
          >
            <span role="img" aria-label="like">
              ❤️
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;
