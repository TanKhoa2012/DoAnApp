import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from './store';
import { getProfileFailure, meActions } from './meSlice';
import {  setDataSecure, setStorageItem } from '../libs/storage';
import { decodeToken } from '../libs/utils';
import { UserApi } from '../apis/UserApi';
import { configActions } from './configSlice';
import { ROLES, TRole } from '../type';



// export interface IRegisterInfo {
//     email: string;
//     phone: string;
//     referrer: string;
// }
interface IRegister {
    username: string;
    name: string;
    password: string;
    email: string;
}

interface IAuthData {
    accessToken: string;
    refreshToken?: string;
}

interface IAuthState {
    error: string | null;
    role: TRole | null;
    authStatus: 'init' | 'done' | 'failed'
}

const initialState: IAuthState = {
    role: ROLES.USER,
    error: null,
    authStatus: 'init'
};

const auth = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        authInit: (state: IAuthState) => {
            state.authStatus = 'init';
            state.error = null;
            state.role = ROLES.USER;
            setDataSecure('token', '');

        },
        authSuccess: (state: IAuthState, action: PayloadAction<{ role: TRole }>) => {
            const { role } = action.payload;
            state.role = role;
            state.authStatus = 'done';
            state.error = null;
        },
        authFailure: (state: IAuthState, action: PayloadAction<string>) => {
            state.authStatus = 'failed';
            state.role = null;
            state.error = action.payload;
        },
    },
});

export const { authSuccess, authFailure, authInit } = auth.actions;
export const authReducer = auth.reducer;

const loginSuccess = (data: IAuthData): AppThunk => {
    return async (dispatch) => {
        try {
            const { accessToken } = data;

            dispatch(authSuccess({ role: decodeToken(accessToken).role }));
            dispatch(meActions.getProfile());

            console.log('Get profile thanh cong')
        } catch (err) {
            dispatch(authFailure('error'));
        }
        finally {
            dispatch(configActions.hideLoad());
        }
    };
};

const login = (username: string, password: string): AppThunk => {
    return async (dispatch) => {
        try {

            dispatch(configActions.showLoad());

            const data = await UserApi.getToken({username, password})
            setDataSecure('token', data.data.result.token)
            dispatch(loginSuccess({ accessToken: data.data.result.token }))

        } catch (err) {
            dispatch(authFailure('error'));
        }
        finally {
            dispatch(configActions.hideLoad())
        }
    };
};

// const loginWithGG = (): AppThunk => {
//     return async (dispatch) => {
//         try {
//             dispatch(configActions.showLoad());
//             const data = await AuthAPI.loginWithGG()

//             setDataSecure('token', data.accessToken)

//             dispatch(loginSuccess({ accessToken: data.accessToken }))
//         } catch (err) {
//             dispatch(authFailure('error'));
//         }
//         finally {
//             dispatch(configActions.hideLoad())
//         }
//     };
// };

const register = (data: any): AppThunk => {
    return async (dispatch) => {
        try {
            dispatch(configActions.showLoad());
            const res = await UserApi.createUser(data);

            console.log(res.data.result);

            setStorageItem('id', res.data.result);
            setStorageItem('email', res.data.result)

            return res
        } catch (error) {
            console.log('register error', error)
            throw error
        } finally {
            dispatch(configActions.hideLoad())
        }
    }
}

// const checkCode = (code: string): AppThunk => {
//     return async (dispatch) => {
//         try {
//             dispatch(configActions.showLoad());

//             const id = await getStorageItem('_id')
//             const res = await AuthAPI.checkCode({ _id: id, code: code });

//             return res
//         } catch (error) {
//             console.log('checked failed', error)
//             throw error
//         } finally {
//             dispatch(configActions.hideLoad())
//         }
//     }
// }

// const reSendCode = (): AppThunk => {
//     return async (dispatch) => {
//         try {
//             dispatch(configActions.showLoad());

//             const email = await getStorageItem('email')
//             const res = await AuthAPI.reSendCode(email);

//             return res
//         } catch (error) {
//             console.log('resend failed', error)
//             throw error
//         } finally {
//             dispatch(configActions.hideLoad())
//         }
//     }
// }


const logout = (callback?: VoidFunction): AppThunk => {
    return async (dispatch) => {
        try {
          await UserApi.logout();
        } catch (error) { }

        dispatch(getProfileFailure(''));
        dispatch(authInit());
        callback?.();
    };
};

export const authActions = {
    login,
    // loginWithGG,
    logout,
    loginSuccess,
    register,
    // checkCode,
    // reSendCode,
};
