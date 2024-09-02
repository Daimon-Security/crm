import { Dispatch, PayloadAction, createSlice } from "@reduxjs/toolkit";
import { SaleCreateDto } from "../../entities/dto/sale-create-dto";
import ApiRubios from "../../api/api";
import { Sale } from "../../entities/sale";
import { error } from "console";
import { SaleDto } from "../../entities/dto/sale-dto";
import SaleDetailTable from '../../components/sale/sale-detail-table';
import { stat } from "fs";
import { SaleCreditCreateDto } from "../../entities/dto/sale-credit-create-dto";

interface InitialState {
    sales: SaleDto[];
    saleSelected: any | null;
    type: string;
    paymentFrequencies: any,
    isLoading: boolean
}

const initialState: InitialState = {
    sales: [],
    saleSelected: null,
    type: '2-3',
    paymentFrequencies: [
        {
            id: 4,
            value: 'Un pago'
        },
        {
            id: 1,
            value: "Semanal",
        },
        {
            id: 3,
            value: "Quincenal"
        },
        {
            id: 2,
            value: "Mensual"
        },
    ],
    isLoading: false
};

export const SaleSlice = createSlice({
    name: 'sales',
    initialState,
    reducers: {
        setSales: (state, action: PayloadAction<SaleDto[]>) => {
            state.sales = action.payload;
        },
        setSaleSelected: (state, action: PayloadAction<SaleDto | null>) => {
            state.saleSelected = action.payload;
        },
        setIsLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
    }
});

export const getSales = () => {
    return async (dispatch: Dispatch) => {
        try {
            const { data } = await ApiRubios.get('sale');
            if (data) dispatch(setSales(data));
        } catch (err) { console.log("error al obtener las ventas: ", err) }
    }
}

export const addSale = (sale: SaleCreateDto, credit: SaleCreditCreateDto | null, navigate: (route: string) => void) => {
    return async (dispatch: Dispatch) => {
        dispatch(setIsLoading(true))
        try {
            const body = {
                sale: sale, credit: credit
            }
            const { data } = await ApiRubios.post('sale', body);
            dispatch(setIsLoading(false))
            navigate('/sales')
        } catch (err) {
            console.log("error al registrar la venta: ", err);
            dispatch(setIsLoading(false))
        }
    }
};

export const getSaleById = (id: string) => {
    return async (dispatch: Dispatch) => {
        try {
            const { data } = await ApiRubios.get(`sale/${id}`);
            console.log("data: ", data);
            if (data) dispatch(setSaleSelected(data));
        } catch (err) { console.log("error al obtener la venta por id: ", id) }
    }
};

export const getSaleByIdDetailAnnull = (id: string) => {
    return async (dispatch: Dispatch) => {
        try {
            console.log("pidienod venta: ", id);
            const { data } = await ApiRubios.get(`sale/${id}/detail-annull`);
            console.log("data: ", data);
            if (data) dispatch(setSaleSelected(data));
        } catch (err) { console.log("error al obtener la venta por id: ", id) }
    }
};

export const saleCancel = (id: number, navigate: (route: string) => void) => {
    return async (dispatch: Dispatch) => {
        dispatch(setIsLoading(true))
        try {
            const { data } = await ApiRubios.patch(`sale/${id}/cancel`);
            console.log("response: ", data);
            dispatch(setIsLoading(false));
            navigate('/sales');
        } catch (err) {
            console.log("error al cancelar la venta: ", err);
            dispatch(setIsLoading(false))
        }
    }
};

export const getBySaleByClientName = (name: string) => {
    return async (dispatch: Dispatch) => {
        try {
            const { data } = await ApiRubios.get(`sale/search?name=${name}`);
            console.log("ventas filtradas: ", data);
        } catch (err) { console.log("error al filtrar por nombre de cliente: ", err) }
    }
};

export const getBySaleByClient = (id: number) => {
    return async (dispatch: Dispatch) => {
        try {
            console.log("cliente a buscar: ", id);
            const { data } = await ApiRubios.get('sale/by-client-id?id=' + id);
            console.log("data: ", data);
            if (data) dispatch(setSales(data));
        } catch (err) { console.log("error al filtrar la ventas por cliente: ", err) }
    }
};
export const getSearchSales = (startDate: Date, endDate: Date, statusSale: string, paymentType: string) => {
    return async (dispatch: Dispatch) => {
        try {
            const { data } = await ApiRubios.get(`sale/search?startDate=${startDate}&endDate=${endDate}&status=${statusSale}&paymentType=${paymentType}`)
            if (data) dispatch(setSales(data));
        } catch (err) { console.log("error al filtrar las ventas: ", err) }
    }
};

export const saleDelete = (id: number) => {
    return async (dispatch: Dispatch) => {
        try {
            const { data } = await ApiRubios.delete(`sale/${id}`);
            console.log("data: ", data);
                dispatch(setSaleSelected(null));
                dispatch(getSales() as any)
        } catch (err) { console.log("error al eliminar la venta: ", err) }
    }
}

export const { setSaleSelected, setSales, setIsLoading } = SaleSlice.actions;
export default SaleSlice.reducer;