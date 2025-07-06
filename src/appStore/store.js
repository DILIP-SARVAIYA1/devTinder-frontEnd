import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import userSentLikesSlice from "./userSentLikeSlice";

const store = configureStore({
  reducer: {
    user: userSlice,
    userSentLikes: userSentLikesSlice,
  },
});

export default store;
