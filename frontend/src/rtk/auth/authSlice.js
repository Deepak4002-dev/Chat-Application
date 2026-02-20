import {createSlice} from "@reduxjs/toolkit"
import { getMe, login, signup } from "./authAsyncThunk";
const initialState = {
  user:null,
  loading:false,
  isLoggedIn:false,
  error:null
}

export const authSlice = createSlice({
  name:"auth",
  initialState,
  reducers:{
     resetAuth: (state) => {      
      state.user = null;
      state.isLoggedIn = false;
      state.loading = false;
      state.error = null;
    }
  },
  extraReducers:(builders)=>{
      builders
       .addCase(signup.pending,(state)=>{
        state.loading = true;
      })
      .addCase(signup.fulfilled,(state,action)=>{
        state.loading = false;
      })
      .addCase(signup.rejected, (state,action)=>{
        state.loading = false;
        state.error = action.payload?.message || action.payload
      })
      .addCase(login.pending,(state)=>{
        state.loading = true;
      })
      .addCase(login.fulfilled,(state,action)=>{
        state.loading = false;
        state.user = action.payload.data;
        state.isLoggedIn = true;
      })
      .addCase(login.rejected, (state,action)=>{
        state.loading = false;
        state.error = action.payload?.message || action.payload
      })
      .addCase(getMe.pending,(state)=>{
        state.loading = true;
      })
      .addCase(getMe.fulfilled,(state,action)=>{
        state.loading = false;
        state.user = action.payload.data;
        state.isLoggedIn = true;
      })
      .addCase(getMe.rejected,(state)=>{
        state.loading = false;
        state.user = null;
        state.isLoggedIn = false;
      })
  }
})

export default authSlice.reducer;
export const {resetAuth} = authSlice.actions
