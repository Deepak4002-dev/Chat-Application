import {createSlice} from "@reduxjs/toolkit"
const initialState = {
  user:null,
  loading:false,
  isLoggedIn:false,
  error:null
}

export const authSlice = createSlice({
  name:"auth",
  initialState,
  extraReducers:(builders)=>{
      builders
      .addCase()
  }
})

export default authSlice.reducer;
