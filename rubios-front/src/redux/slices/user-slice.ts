import { createSlice, Dispatch, PayloadAction } from "@reduxjs/toolkit";
import { ApiRubios } from "../../api/api";
import { User } from "../../entities/user";
import { UserDto } from '../../entities/dto/user-dto';
import { UserCreateDto } from "../../entities/dto/user-create-dto";
import { stat } from "fs";
import { startLoading, stopLoading } from "./loading-slice";
import { setSaleSelected } from "./sale-slice";

interface UsersStateInitial {
    debtCollectors: User[],
    userRole: string | null,
    users: UserDto[],
    isLoading: boolean,
    message: string,
    isError: boolean,
    userSelected: UserDto | null,
    userName: string | null,
    credits: any
};

const initialState: UsersStateInitial = {
    debtCollectors: [],
    userRole: null,
    //userRole: 'debt-collector',
    users: [],
    isLoading: false,
    message: '',
    isError: false,
    userSelected: null,
    userName: null,
    credits: []

};

export const userSlice = createSlice({
    initialState,
    name: 'users',
    reducers: {
        setDebtCollectors: (state, action: PayloadAction<[]>) => {
            state.debtCollectors = action.payload;
        },
        setUsers: (state, action: PayloadAction<UserDto[]>) => {
            state.users = action.payload;
        },
        setIsLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setIsError: (state, action: PayloadAction<any>) => {
            state.isError = action.payload.isError;
            state.message = action.payload.message;
        },
        setUserSelected: (state, action: PayloadAction<UserDto | null>) => {
            state.userSelected = action.payload;
        },
        remove: (state, action: PayloadAction<number>) => {
            state.users = state.users.filter((user: UserDto) => user.id !== action.payload);
        },
        setLoggedUser: (state, action: PayloadAction<any>) => {
            state.userName = action.payload.userName;
            state.userRole = action.payload.role;
        },
        setError: (state, action: PayloadAction<any>) => {
            state.isError = action.payload.isError;
            state.message = action.payload.message;
        },
        setCredits: (state, action: PayloadAction<any>) => {
            state.credits = action.payload;
        }

    }
});

export const getDebtCollectors = () => {
    return async (dispatch: Dispatch) => {
        try {
            const { data } = await ApiRubios.get('user/debt-collectors');
            if (data) {
                dispatch(setDebtCollectors(data));
            }

        } catch (err) { console.log("error: ", err) };
    }
};

export const getAll = () => {
    return async (dispatch: Dispatch) => {
        dispatch(startLoading());
        try {
            const { data } = await ApiRubios.get('user');
            if (data) dispatch(setUsers(data));
            dispatch(stopLoading());
        } catch (err) {
            console.log("error al obtener los usuarios: ", err);
            dispatch(stopLoading());
        }
    }
};

export const getByUserName = (name: any) => {
    return async (dispatch: Dispatch) => {
        //dispatch(startLoading());
        try {
            const { data } = await ApiRubios.get(`user/by-name?name=${name}`);
            if (data) dispatch(setUsers(data));
            // dispatch(stopLoading());
        } catch (err) {
            console.log("error al obtener usuarios por nombre: ", err);
            // dispatch(stopLoading());
        }

    }
};

export const add = (user: UserCreateDto, setShowModalCustomMessage: (show: boolean) => void, goTo: () => void) => {
    return async (dispatch: Dispatch) => {
        dispatch(setIsLoading(true));
        try {
            const { data } = await ApiRubios.post('auth/registration', user);
            if (data.success) {
                goTo();
            } else {
                dispatch(setIsLoading(false));
                dispatch(setError({ isError: true, message: data.error }));
                setShowModalCustomMessage(true);
            };
        } catch (err) {
            console.log("error al agregar usuario: ", err)
            dispatch(setIsLoading(false));
            dispatch(setError({ isError: true, message: 'no se registró el nuevo usuario' }));
            setShowModalCustomMessage(true);
        }
    }
};

export const update = (id: number, user: UserDto, setShowModalCustomMessage: (show: boolean) => void, goTo: () => void) => {
    return async (dispatch: Dispatch) => {
        dispatch(setIsLoading(true));
        try {
            const { data } = await ApiRubios.put(`user/${id}`, user);
            if (data.success) {
                goTo();
            } else {
                dispatch(setIsLoading(false));
                dispatch(setError({ isError: true, message: data.error }));
                setShowModalCustomMessage(true);
            };
        } catch (err) {
            console.log("error al modificar el usuario: ", err);
            dispatch(setIsLoading(false));
            dispatch(setError({ isError: true, message: 'no se puedo modificar el usuario' }));
            setShowModalCustomMessage(true);
        }
    }
};

export const deleteUser = (id: number) => {
    return async (dispatch: Dispatch) => {
        dispatch(startLoading());
        try {
            const { data } = await ApiRubios.delete(`user/${id}`);
            if (data.success) {
                dispatch(remove(id))
            };
            dispatch(setUserSelected(null));
            dispatch(stopLoading());

        } catch (err) {
            console.log("error al eliminar el registro: ", err);
            dispatch(stopLoading());
        }
    }
};

export const getById = (id: string) => {
    return async (dispatch: Dispatch) => {
        dispatch(startLoading());
        try {
            const { data } = await ApiRubios.get(`user/${id}`);
            if (data) dispatch(setUserSelected(data));
            dispatch(setIsLoading(false));
            dispatch(stopLoading());
        } catch (err) {
            console.log("error al obtener el registro: ", err);
            dispatch(stopLoading());
        }
    }
};

export const getCreditsByUser = (id: number) => {
    return async (dispatch: Dispatch) => {
        dispatch(startLoading());
        try {
            const { data } = await ApiRubios.get(`user/${id}/credits`);
            dispatch(setCredits(data));
        } catch (err) {
            console.log("error la obtener los créditos por usuario: ", err);
        }finally{
            dispatch(stopLoading());
        }
    }
};

export const getCreditsDebtCollectorByClientName = (id: number, clientId: number | null) => {
    return async (dispatch: Dispatch) => {
      try {
  
        const { data } = await ApiRubios.get(`user/${id}/credits-by-client?client=${clientId}`);
        dispatch(setCredits(data));
  
      } catch (err) { console.log("error al obtener por nombre: ", err) }
    }
  };


export const { setDebtCollectors, setUsers, setIsLoading, setIsError, setUserSelected,
    remove, setLoggedUser, setError, setCredits } = userSlice.actions;
export default userSlice.reducer;