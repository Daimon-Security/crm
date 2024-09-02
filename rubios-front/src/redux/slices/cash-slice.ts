import { Dispatch, PayloadAction, createSlice } from "@reduxjs/toolkit";
import { CashDto } from '../../entities/dto/cash-dto';
import ApiRubios from "../../api/api";
import { startLoading, stopLoading } from "./loading-slice";
import { TransactionCashDto } from '../../entities/dto/transaction-cash-dto';
import { TotalCashDto } from "../../entities/dto/total-cash-dto";
import { boolean } from 'yup';

interface InitialState {
    cash: CashDto | null;
    transactions: TransactionCashDto[];
    totalCash: TotalCashDto;
    opening: boolean;
    isLoading: boolean;
    transactionSelected: TransactionCashDto | null;
    isError: boolean;
    message: string;
}

const initialState: InitialState = {
    cash: null,
    transactions: [],
    totalCash: {
        openingBalancePesos: 0,
        openingBalanceDollar: 0,
        totalIncomesPesos: 0,
        totalIncomesDollar: 0,
        totalOutflowPesos: 0,
        totalOutflowDollar: 0,
        closingBalancePesos: 0,
        closingBalanceDollar: 0,
    },
    opening: false,
    isLoading: false,
    transactionSelected: null,
    isError: false,
    message: ''
};

export const cashSlice = createSlice({
    name: 'cash',
    initialState,
    reducers: {
        setCash: (state, action: PayloadAction<CashDto>) => {
            state.cash = action.payload;
            state.totalCash.openingBalancePesos = parseFloat(action.payload.openingBalancePeso.toString());
            state.totalCash.openingBalanceDollar = parseFloat(action.payload.openingBalanceDollar.toString());
        },
        setTransactions: (state, action: PayloadAction<TransactionCashDto[]>) => {
            state.transactions = [...action.payload];
        },
        setTotalCash: (state, action: PayloadAction<TransactionCashDto[]>) => {
            const transactions = action.payload;
            var totalIncomesPesos = 0;
            var totalIncomesDollar = 0;
            var totalOutflowPesos = 0;
            var totalOutflowDollar = 0;
            transactions.forEach(x => {
                if ((x.type == 1 || x.type == 2 || x.type == 3 || x.type == 5 || x.type == 6) && x.currencyType == 'peso') totalIncomesPesos = totalIncomesPesos + parseFloat(x.amount.toString());
                if ((x.type == 1 || x.type == 2 || x.type == 3 || x.type == 5 || x.type == 6) && x.currencyType == 'dolar') totalIncomesDollar = totalIncomesDollar + parseFloat(x.amount.toString());
                if ((x.type == 4 || x.type == 7 || x.type == 8 || x.type == 9 || x.type == 10) && x.currencyType == 'peso') totalOutflowPesos = totalOutflowPesos + parseFloat(x.amount.toString());
                if ((x.type == 4 || x.type == 7 || x.type == 8 || x.type == 9 || x.type == 10) && x.currencyType == 'dolar') totalOutflowDollar = totalOutflowDollar + parseFloat(x.amount.toString());
            });
            state.totalCash.totalIncomesPesos = totalIncomesPesos;
            state.totalCash.totalIncomesDollar = totalIncomesDollar;
            state.totalCash.totalOutflowPesos = totalOutflowPesos;
            state.totalCash.totalOutflowDollar = totalOutflowDollar;
            state.totalCash.closingBalancePesos = state.totalCash.openingBalancePesos + (totalIncomesPesos - totalOutflowPesos);
            state.totalCash.closingBalanceDollar = state.totalCash.openingBalanceDollar + totalIncomesDollar - totalOutflowDollar;
        },
        setOpening: (state, action: PayloadAction<boolean>) => {
            state.opening = action.payload;
        },
        setIsLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setTransactionSelected: (state, action: PayloadAction<TransactionCashDto>) => {
            state.transactionSelected = action.payload;
        },
        setError: (state, action: PayloadAction<{ isError: boolean, message: string }>) => {
            state.isError = action.payload.isError;
            state.message = action.payload.message;
        }
    }
});

export const lastCash = () => {
    return async (dispatch: Dispatch) => {
        dispatch(startLoading());
        dispatch(setIsLoading(true));
        try {
            const { data } = await ApiRubios.get('cash/last');
            if (data) {
                dispatch(setCash(data));
                if (data.closingDate) {
                    dispatch(setOpening(false));
                } else {
                    dispatch(setOpening(true));
                }
            }
        } catch (err) {
            dispatch(setError({ isError: true, message: 'Problemas con la conexión a internet. Recargar el sitio.' }))
        }
        finally {

            dispatch(stopLoading());
            dispatch(setIsLoading(false));
        }
    }
};

export const openCash = () => {
    return async (dispatch: Dispatch) => {
        dispatch(startLoading());
        try {
            const { data } = await ApiRubios.post('cash/open');
            if (data.success) {
                dispatch(setOpening(true));
                dispatch(lastCash() as any);
            }
        } catch (err) {
            console.log("error al abrir la caja: ", err)
        } finally {
            dispatch(stopLoading());
        }
    }
}

export const closeCash = (id: number) => {
    return async (dispatch: Dispatch) => {
        dispatch(startLoading());
        try {
            const { data } = await ApiRubios.put(`cash/${id}/close`);
            if (data.success) {
                console.log("data.success: ", data.success);
                dispatch(setOpening(false));
            }
        } catch (err) {
            console.log("error al cerrar la caja: ", err)
        } finally {
            dispatch(stopLoading());
        }
    }
};

export const getTransactionsById = (id: number) => {
    return async (dispatch: Dispatch) => {
        dispatch(setIsLoading(true));
        try {
            const { data } = await ApiRubios.get(`cash/transactions?id=${id}`);
            console.log("transacciones: ", data);
            dispatch(setTransactions(data));
            dispatch(setTotalCash(data));

        } catch (err) {
            console.log("error al obtener las transacciones: ", err)
        } finally {
            dispatch(setIsLoading(false));
        }
    }
};

export const addRevenue = (record: any, cashId: number, close: () => void) => {
    return async (dispatch: Dispatch) => {
        dispatch(setIsLoading(true));
        try {
            const { data } = await ApiRubios.post('cash/add-revenue', record);
            if (data.success) dispatch(getTransactionsById(cashId) as any)
        } catch (err) {
            console.log("error al agregar ingreso: ", err)
        } finally {
            dispatch(setIsLoading(false));
            close();
        }
    }
};

export const addExpense = (record: any, cashId: number, close: () => void) => {
    return async (dispatch: Dispatch) => {
        dispatch(setIsLoading(true));
        try {
            const { data } = await ApiRubios.post('cash/add-expense', record);
            if (data.success) dispatch(getTransactionsById(cashId) as any)
        } catch (err) {
            console.log("error al agregar egreso: ", err)
        } finally {
            dispatch(setIsLoading(false));
            close();
        }
    }
};

export const deleteTransaction = (id: number, type: number, cashiId: number) => {
    return async (dispatch: Dispatch) => {
        dispatch(setIsLoading(true));
        try {
            const { data } = await ApiRubios.delete(`cash/${id}/?type=${type}`);
            if (data.success) dispatch(getTransactionsById(cashiId) as any);
        } catch (err) {
            console.log("error al eliminar la trasacción: ", err)
        } finally {
            dispatch(setIsLoading(false));
        }
    }
}

export const { setCash, setTransactions, setTotalCash, setOpening, setIsLoading, setTransactionSelected, setError } = cashSlice.actions;
export default cashSlice.reducer;