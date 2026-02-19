import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../utils/API";

const login = createAsyncThunk(
  "auth/login",
  async (data, { rejectWithValue }) => {
    try {
      const res = await API.post("/auth/login", data);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const signup = createAsyncThunk(
  "auth/signup",
  async (data, { rejectWithValue }) => {
    try {
      const res = await API.post("auth/signu", data);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export { login,signup };
