import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../utils/API";

const login = createAsyncThunk(
  "auth/login",
  async (data, { rejectWithValue }) => {
    try {
      const res = await API.post("/auth/login", data);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data || "Network Error");
    }
  },
);

const signup = createAsyncThunk(
  "auth/signup",
  async (data, { rejectWithValue }) => {
    try {
      const res = await API.post("/auth/signup", data);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data || "Network Error");
    }
  },
);

const getMe = createAsyncThunk("auth/get-me",
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.get('/auth/get-me');
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data || "Network Error");
    }
  }
)


const logout = createAsyncThunk("auth/logout",async (_,{rejectWithValue})=>{
  try{
        const res = await API.post('/auth/logout');
        return res.data;
  }
  catch(error)  
  {
    return rejectWithValue(error.response?.data)
  }
})

export { login,signup,logout, getMe};
