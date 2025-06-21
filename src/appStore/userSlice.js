import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    isLoggedIn: false,
  },
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
      state.isLoggedIn = true;
    },
    logout(state) {
      state.user = null;
      state.isLoggedIn = false;
    },
    updateUser(state, action) {
      state.userData = { ...state.userData, ...action.payload };
    },
  },
});
export const { setUser, logout, updateUser } = userSlice.actions;
export default userSlice.reducer;
