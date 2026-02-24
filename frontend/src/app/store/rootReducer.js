import { combineReducers } from "@reduxjs/toolkit";
import authSlice from "../../rtk/auth/authSlice";
import socketSlice from "../../rtk/socket/socketSlice";

const rootReducer = combineReducers({
  auth:authSlice,
  socket:socketSlice
})

export {rootReducer};