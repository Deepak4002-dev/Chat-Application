import { combineReducers } from "@reduxjs/toolkit";
import authSlice from "../../rtk/auth/authSlice";

const rootReducer = combineReducers({
  auth:authSlice
})

export {rootReducer};