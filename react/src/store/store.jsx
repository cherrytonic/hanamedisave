import { configureStore } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import { PERSIST, REGISTER, persistReducer } from 'redux-persist';
import userSlice from './userSlice'; 

const reducers = combineReducers({
    user: userSlice.reducer
  });
  const persistConfig = {
    key: 'root',
    storage,
    whitelist: [],
  };
  const persistedReducer = persistReducer(persistConfig, reducers);
  const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [REGISTER, PERSIST],
        },
      }),
  });
  
  export default store;