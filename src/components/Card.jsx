import React from "react";

const Card = ({ name, age, bio, imgSrc }) => {
  return (
    <div className="relative w-80 h-[450px] rounded-3xl shadow-2xl overflow-hidden flex flex-col items-center transition-transform duration-300 ">
      {/* Profile Image */}
      <img
        className="w-full h-3/5 object-cover"
        src={imgSrc}
        alt={`${name}'s profile`}
      />
      {/* Info Section */}
      <div className="p-5 w-full flex-1 flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            {name}, <span className="font-normal text-gray-500">{age}</span>
          </h2>
          <p className="text-gray-500 text-sm mt-2">{bio}</p>
        </div>
        {/* Action Buttons */}
        <div className="flex justify-between mt-6">
          <button
            className="bg-white border-2 border-red-500 hover:bg-red-500 hover:text-white text-red-500 rounded-full w-14 h-14 flex items-center justify-center text-2xl shadow transition duration-200"
            aria-label="Dislike"
          >
            <span role="img" aria-label="dislike">
              ✖️
            </span>
          </button>
          <button
            className="bg-white border-2 border-green-500 hover:bg-green-500 hover:text-white text-green-500 rounded-full w-14 h-14 flex items-center justify-center text-2xl shadow transition duration-200"
            aria-label="Like"
          >
            <span role="img" aria-label="like">
              ❤️
            </span>
          </button>
        </div>
      </div>
      {/* Tinder-style gradient overlay */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white via-transparent to-transparent pointer-events-none" />
    </div>
  );
};

export default Card;
