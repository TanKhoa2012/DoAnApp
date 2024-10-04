import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk } from "./store";
import { IMeState, IProfile } from "@/types";
import { UserApi } from "../apis/UserApi";

const initialState: IMeState = {
    error: null,
    profile: undefined,
};


const me = createSlice({
    name: 'me',
    initialState,
    reducers: {
        getProfileBegin(state: IMeState) {
            state.error = null;
        },
        getProfileSuccess(state: IMeState, action: PayloadAction<IProfile>) {
            state.profile = action.payload;
        },
        getProfileFailure(state:IMeState, action:PayloadAction<string>){
            state.error = action.payload;
            state.profile = undefined;
        },
        setError(state: IMeState, { payload }: PayloadAction<string>) {
            state.error = payload;
        },
        clearError(state: IMeState) {
            state.error = null;
        },
    },
});

export const {getProfileBegin,getProfileSuccess,getProfileFailure,setError,clearError } = me.actions
export const meReducer = me.reducer;

const getProfile = ():AppThunk =>{
    return async (dispatch)=>{
        try {
            dispatch(getProfileBegin());
            const data = await UserApi.getUserByToken();
            dispatch(getProfileSuccess(data.data.result))
        } catch (error) {
            console.log(error)
        }
    }
}

export const meActions = {
  getProfile
};
