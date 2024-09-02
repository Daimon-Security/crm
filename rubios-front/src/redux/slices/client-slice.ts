import { createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit';
import { ApiRubios } from '../../api/api';
import { Client } from '../../entities/client';
import { ClientCreateDto } from '../../entities/dto/ClientCreateDto';
import { stat } from 'fs';
import { startLoading, stopLoading } from './loading-slice';
import finalPropsSelectorFactory from 'react-redux/es/connect/selectorFactory';


interface ClientsStateInitial {
    clients: Client[],
    isLoading: boolean,
    clientSelected: Client | null,
    isError: boolean,
    message: string | null;
    transactions: any;
    paymentBhavior: any

};

const initialState: ClientsStateInitial = {
    clients: [],
    isLoading: false,
    clientSelected: null,
    isError: false,
    message: null,
    transactions: [],
    paymentBhavior: []
};


export const clientsSlice = createSlice({
    name: 'clients',
    initialState,
    reducers: {
        setClients: (state, action: PayloadAction<[]>) => {
            state.clients = action.payload
            state.isLoading = false;
        },
        createClient: (state, action: PayloadAction<boolean>) => { },
        setLoading: (state, action) => {
            state.isLoading = action.payload
        },
        setClientSelected: (state, action: PayloadAction<Client | null>) => {
            state.clientSelected = action.payload;
        },
        remove: (state, action: PayloadAction<number>) => {
            state.clients = state.clients.filter((client) => client.id !== action.payload);
        },
        setError: (state, action: PayloadAction<any>) => {
            state.isError = action.payload.isError;
            state.message = action.payload.message;
        },
        setTransactions: (state, action: PayloadAction<any>) => {
            state.transactions = action.payload;
        },
        setPaymentBhavior: (state, action: PayloadAction<any>) => {
            state.paymentBhavior = action.payload;
        }
    },
})


export const getClients = () => {
    return async (dispatch: Dispatch) => {
        try {
            dispatch(setLoading(true));
            const { data } = await ApiRubios.get('client');
            if (data) {
                dispatch(setClients(data));
            }

        } catch (err) { console.log("error: ", err) };
    }
}

export const getByClientName = (name: string) => {
    return async (dispatch: Dispatch) => {
        try {
            const { data } = await ApiRubios.get(`client/by-name?name=${name}`);
            if (data) dispatch(setClients(data));
        } catch (err) { console.log("error al filtrar los clientes por nombre: ", err) }
    }
};

export const getClient = (id: number, type: string) => {
    return async (dispatch: Dispatch) => {
        try {
            const { data } = await ApiRubios.get(`client/client?client=${id}&type=${type}`);
            if (data) dispatch(setClients(data));
        } catch (err) { console.log("error al filtrar los clientes por id: ", err) }
    }
};

export const deleteClient = (id: number) => {
    return async (dispatch: Dispatch) => {
        dispatch(startLoading());
        try {
            const { data } = await ApiRubios.delete(`client/${id}`);
            if (data.success) dispatch(remove(id));
            dispatch(stopLoading());
        } catch (err) {
            console.log("error al eliminar el registro: ", err);
            dispatch(stopLoading());
        }
    }
};

export const add = (client: ClientCreateDto, setShowModalCustomMessage: (show: boolean) => void, goTo: () => void) => {
    return async (dispatch: Dispatch) => {
        dispatch(startLoading());
        try {
            console.log("client nuevo: ", client);
            const { data } = await ApiRubios.post('client', client);
            console.log("data add: ", data);
            if (data.success) {
                goTo();
            } else {
                dispatch(setError({ isError: true, message: data.error }));
                setShowModalCustomMessage(true);
            };
        } catch (err) {
            dispatch(setError({ isError: true, message: 'no se pudo crear nuevo cliente' }));
            setShowModalCustomMessage(true);
        } finally {
            dispatch(stopLoading());
        }
    }
};

export const update = (id: number, client: Client, setShowModalCustomMessage: (show: boolean) => void, goTo: (type: string) => void, type: string) => {
    return async (dispatch: Dispatch) => {
        dispatch(startLoading());
        try {
            const { data } = await ApiRubios.put(`client/${id}`, client);
            if (data.success) {
                goTo(type);
            } else {
                dispatch(setError({ isError: true, message: data.error }));
                setShowModalCustomMessage(true);
            };
        } catch (err) {
            dispatch(setError({ isError: true, message: 'no se puedo modificar el cliente' }));
            setShowModalCustomMessage(true);
        } finally {
            dispatch(stopLoading());
        }
    }
};

export const getSearchClients = (type: string) => {
    return async (dispatch: Dispatch) => {
        dispatch(startLoading());
        try {
            const { data } = await ApiRubios.get(`client/search?type=${type}`);
            if (data) dispatch(setClients(data));
            dispatch(stopLoading());
        } catch (err) {
            console.log("error al filtrar los clientes por tipo: ", err);
            dispatch(stopLoading());
        }
    };
}

export const getById = (id: string) => {
    return async (dispatch: Dispatch) => {
        dispatch(startLoading());
        try {
            const { data } = await ApiRubios.get(`client/${id}`);
            if (data) dispatch(setClientSelected(data))
            dispatch(stopLoading());
        } catch (err) {
            console.log("error al obtener el registro: ", err);
            dispatch(stopLoading());
        }
    }
};

export const getTransactionsClient = (id: number, type: number) => {
    return async (dispatch: Dispatch) => {
        try {
            const { data } = await ApiRubios.get(`client/${id}/transactions?type=${type}`);
            if (data) {
                dispatch(setTransactions(data));
            }
        } catch (err) { console.log("error al obtener las transacciones por cliente: ", err) }
    }
}

export const getPaymentBhavior = (id: number, type: number, creditId: number | null) => {
    return async (dispatch: Dispatch) => {
        try {
            const { data } = await ApiRubios.get(`report/${id}/payment-bhavior?type=${type}&creditId=${creditId}`);
            if (data) {
                dispatch(setPaymentBhavior(data));
            }
        } catch (err) { console.log("error al obtener el comportamiento de pago: ", err) }
    }
}

// Extract the action creators object and the reducer
export const { createClient, setClients, setLoading, setClientSelected, remove, setError, setTransactions, setPaymentBhavior } = clientsSlice.actions;

export default clientsSlice.reducer;