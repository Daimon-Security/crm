import { createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../../entities/product';
import ApiRubios from '../../api/api';
import { ProductCreateDto } from "../../entities/dto/product-create-dto";
import { ProductListDto } from '../../entities/dto/product-list';
import { stat } from 'fs';
import { ProductUpdateDto } from '../../entities/dto/product-update-dto';
import { Inventory } from '../../entities/inventory';
import { InventoryCreateDto } from '../../entities/dto/inventory-create-dto';

interface InitialState {
    products: ProductListDto[],
    productSelected: ProductListDto | null,
    isLoading: boolean,
    isError: boolean,
    message: string | null,
    inventories: Inventory[];
    stock: number;
}
const initialState: InitialState = {
    products: [],
    productSelected: null,
    isLoading: false,
    isError: false,
    message: null,
    inventories: [],
    stock: 0
};

export const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        setIsLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setIsError: (state, action: PayloadAction<any>) => {
            state.isError = action.payload.isError;
            state.message = action.payload.message;
        },
        setProducts: (state, action: PayloadAction<ProductListDto[]>) => {
            state.products = action.payload;
        },
        setProductSelected: (state, action: PayloadAction<ProductListDto | null>) => {
            state.productSelected = action.payload;
            console.log("producto guardado: ", state.productSelected);
            state.stock = (action.payload) ? action.payload?.stock : 0;
            console.log(" state.stock: ", state.stock);
        },
        remove: (state, action: PayloadAction<string>) => {
            state.products = state.products.filter((product) => product.id !== action.payload)
        },
        setInventories: (state, action: PayloadAction<Inventory[]>) => {
            state.inventories = action.payload;
        },
        updateStock: (state, action: PayloadAction<number>) => {
            state.stock = state.stock - action.payload
        }
    }
});

export const add = (product: ProductCreateDto) => {
    return async (disptach: Dispatch) => {
        disptach(setIsLoading(true))
        try {
            const { data } = await ApiRubios.post('product', product);
            disptach(setIsLoading(false))
            if (!data.success) {
                disptach(setIsError({ isError: true, message: data.message }))
            }

        } catch (err) {
            disptach(setIsError({ isError: true, message: "Error al agregar producto." }))
        }
    }
};

export const getAll = () => {
    return async (dispatch: Dispatch) => {
        try {
            const { data } = await ApiRubios.get('product');
            if (data) dispatch(setProducts(data));
        } catch (err) { console.log("error al obtener todos los productos: ", err) }
    }
};

export const getByProductName = (product: number) => {
    return async (dispatch: Dispatch) => {
        try {
            const { data } = await ApiRubios.get(`product/product-name?product=${product}`);
            if (data) dispatch(setProducts(data));
        } catch (err) { console.log("error al obtener productos por nombre: ", err) }
    }
};

export const getByCategory = (id: number) => {
    return async (dispatch: Dispatch) => {
        try {
            const { data } = await ApiRubios.get(`category/${id}/products`);
            if (data) dispatch(setProducts(data));
        } catch (err) { console.log("error al filtrar por categoría: ", err) }
    }
};

export const getById = (id: string) => {
    return async (dispatch: Dispatch) => {
        try {
            console.log("id slice: ", id);
            const { data } = await ApiRubios.get(`product/${id}`);
            console.log("data product1: ", data);
            if (data) dispatch(setProductSelected(data));
        } catch (err) { console.log("error al obtener producto por id: ", err) }
    }
};

export const update = (id: string, product: ProductUpdateDto) => {
    return async (dispatch: Dispatch) => {
        dispatch(setIsLoading(true));
        try {
            const { data } = await ApiRubios.put(`product/${id}`, product);
            if (data.success) {
                dispatch(setProductSelected(null))
            }
        } catch (err) {
            console.log("error al modificar el producto: ", err);
            dispatch(setIsError({ isError: true, message: 'No se pudo modificar el producto.' }))
        } finally {
            dispatch(setIsLoading(false));
        }
    }
};

export const deleteProduct = (id: string) => {
    return async (dispatch: Dispatch) => {
        dispatch(setIsLoading(true));
        try {
            const { data } = await ApiRubios.delete(`product/${id}`);
            if (data.success) {
                dispatch(setIsLoading(false));
                dispatch(remove(id))
            }
        } catch (err) {
            console.log("Error al eliminar el producto: ", err);
            dispatch(setIsLoading(false));
        }
    }
};

export const getInventories = (id: string) => {
    return async (dispatch: Dispatch) => {
        dispatch(setIsLoading(true));
        try {
            const { data } = await ApiRubios.get(`product/${id}/inventory`);
            if (data) dispatch(setInventories(data));
        } catch (err) {
            console.log("error al obtener el detalle de inventarios: ", err)
        } finally {
            dispatch(setIsLoading(false));
        }
    }
};

export const addInventory = (id: string, inventory: InventoryCreateDto) => {
    return async (dispatch: Dispatch) => {
        dispatch(setIsLoading(true));
        try {
            console.log("nuevo inventario: ", inventory);
            const { data } = await ApiRubios.post(`product/${id}/inventory`, inventory);
            console.log("data: ", data);
        } catch (err) {
            console.log("error al agregar inventario: ", err)
        } finally {
            dispatch(setIsLoading(false));
        }
    }
};

export const getInventoryByDate = (id: string, start: Date, end: Date) => {
    return async (dispatch: Dispatch) => {
        try {
            // console.log("start: ", start);
            // console.log("end: ", end);
            const { data } = await ApiRubios.get(`product/${id}/inventory-by-date?start=${start}&end=${end}`);
            console.log("data: ", data);
            if (data) dispatch(setInventories(data));
        } catch (err) { console.log("error al obtener inventario filtrado por fechas: ", err) }
    }
};

export const modifyStock = (stock: number, id: string) => {
    return async (dispatch: Dispatch) => {
        dispatch(setIsLoading(true));
        try {
            const { data } = await ApiRubios.put(`product/${id}/update-stock?stock=${stock}`);
            if (data.success) {
                dispatch(getById(id) as any);
                dispatch(getInventories(id) as any);
            }
        } catch (err) {
            console.log("error la modificar stock: ", err)
        } finally {
            dispatch(setIsLoading(false));
        }
    }
}

export const { setIsLoading, setIsError, setProducts, setProductSelected, remove, setInventories, updateStock } = productSlice.actions;
export default productSlice.reducer;