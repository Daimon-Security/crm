import { PayloadAction, createSlice, Dispatch } from "@reduxjs/toolkit";
import { UserLogin } from "../../entities/dto/user-login";
import { ApiRubios } from "../../api/api";
import { setLoggedUser } from "./user-slice";

interface MessageError {
    email: string | null,
    password: string | null
}

interface Tokens {
    accessToken: string,
    refreshToken: string,
}

interface InitialState {
    isAuthenticate: boolean,
    token: string | null,
    refreshToken: string | null,
    isLoading: boolean,
    isError: boolean,
    message: MessageError
};

const initialState: InitialState = {
    isAuthenticate: false,
    token: null,
    refreshToken: null,
    isLoading: false,
    isError: false,
    message: { email: null, password: null }
};


export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action: PayloadAction<Tokens>) => {
            state.isAuthenticate = true;
            state.token = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
        },
        logout: (state, action: PayloadAction) => {
            state.isAuthenticate = false;
            state.token = null;
            state.refreshToken = null;
            window.localStorage.removeItem('loggedUser');
        },
        setIsLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setIsError: (state, action: PayloadAction<any>) => {
            state.isError = action.payload.isError;

            if (action.payload.message == 'Contraseña incorrecta') {
                state.message.password = action.payload.message;
            } else {
                state.message.email = action.payload.message;
            }
        }
    }
});


export const logIn = (userLogin: UserLogin) => {
    return async (dispatch: Dispatch) => {
        try {
            dispatch(setIsLoading(true));
            const { data } = await ApiRubios.post('auth/login', userLogin);
            dispatch(login(data));
            const loggedUser = {
                token: data.accessToken,
                refreshToken: data.refreshToken,
                isAuthenticate: true,
                userName: data.userName,
                role: data.role
            };

            window.localStorage.setItem('loggedUser', JSON.stringify(loggedUser));
            dispatch(setLoggedUser({ userName: loggedUser.userName, role: loggedUser.role } as any))
            dispatch(setIsLoading(false));
        } catch (err: any) {
            dispatch(setIsLoading(false));
            dispatch(setIsError({ isError: true, message: err.response.data.message }))

        }
    }
}

export const { login, logout, setIsLoading, setIsError } = authSlice.actions;
export default authSlice.reducer;