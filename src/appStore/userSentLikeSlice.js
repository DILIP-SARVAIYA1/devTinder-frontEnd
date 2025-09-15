import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

// Async thunk for fetching sent likes with pagination
export const fetchUserSentLikes = createAsyncThunk(
  "userSentLikes/fetchUserSentLikes",
  async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${BASE_URL}/usersSentLikes?page=${page}&limit=${limit}`,
        { withCredentials: true }
      );
      return {
        likes: res.data.data,
        pagination: res.data.pagination,
      };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch sent likes"
      );
    }
  }
);

const userSentLikesSlice = createSlice({
  name: "userSentLikes",
  initialState: {
    likes: [],
    pagination: { total: 0, page: 1, limit: 10 },
    loading: false,
    error: null,
  },
  reducers: {
    updateUser(state, action) {
      state.user = { ...state.user, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserSentLikes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserSentLikes.fulfilled, (state, action) => {
        state.loading = false;
        state.likes = action.payload.likes;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchUserSentLikes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { updateUser } = userSentLikesSlice.actions;

export default userSentLikesSlice.reducer;
