import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "./rootReducer";
import {persistReducer} from 'redux-persist'
import persistStore from "redux-persist/es/persistStore";
import storage from "redux-persist/lib/storage";
import { setStore } from "./storeRef";

const persistConfig = {
  key:'root',
  storage,
}

const persistedReducer = persistReducer(persistConfig,rootReducer)

const store = configureStore({
  reducer:persistedReducer,
  middleware:(getDefaultMiddleware)=>{
    return getDefaultMiddleware({serializableCheck:false})
  }
})

setStore(store);

const persistor = persistStore(store);
export {persistor,store};