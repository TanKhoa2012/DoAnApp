import { combineReducers } from '@reduxjs/toolkit';
import { authReducer } from './authSlice';
import { configReducer } from './configSlice';
import { meReducer } from './meSlice';
const rootReducer = combineReducers({
    auth: authReducer,
    config:configReducer,
    me:meReducer,
});

export type AppState = ReturnType<typeof rootReducer>;

export default rootReducer;
