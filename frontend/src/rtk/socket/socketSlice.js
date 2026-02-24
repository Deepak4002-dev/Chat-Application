import { createSlice } from "@reduxjs/toolkit"
const initialState = {
  isConnected:false,
  onlineUsers: [],
  friendRequests:[],
  notificationCount:0
}

export const socketSlice = createSlice({
  name:"socket",
  initialState,
  reducers:{
      setConnected: (state,action)=>{
        state.isConnected = action.payload
      },
      setOnlineUsers:(state,action)=>{
        state.onlineUsers = action.payload;
      },
      addFriendRequest: (state,action)=>{
        const exists = state.friendRequests.find((request)=> request.requestId===action.payload.requestId)
        if(!exists)
        {
          state.friendRequests.unshift(action.payload);
          state.notificationCount+=1;
        }
      },

    }
  });

export default socketSlice.reducer;
export const {setConnected,setOnlineUsers, addFriendRequest} = socketSlice.actions;
