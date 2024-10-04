import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppThunk } from './store';

interface IConfigState {
    isShowLoading: boolean;
}

const initialState: IConfigState = {
    isShowLoading: false,
}

const config = createSlice({
    name: 'config',
    initialState,
    reducers: {
        setIsLoading(state: IConfigState, action: PayloadAction<boolean>) {
            state.isShowLoading = action.payload;
        },
    },
});

export const { setIsLoading} = config.actions;

export const configReducer = config.reducer;

const showLoad = (): AppThunk => {
    return async (dispatch) => {
        dispatch(setIsLoading(true));
    };
};

const hideLoad = (): AppThunk => {
    return async (dispatch) => {
        dispatch(setIsLoading(false));
    };
};

export const configActions = {
    showLoad,
    hideLoad,
};
