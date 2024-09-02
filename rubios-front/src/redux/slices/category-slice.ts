import { PayloadAction, createSlice, Dispatch } from "@reduxjs/toolkit";
import { Category } from '../../entities/category';
import ApiRubios from "../../api/api";
import { CategoryCreateDto } from "../../entities/dto/category-create-dto";

interface InitialState {
    categories: Category[],
    categorySelected: Category | null,
    isLoading: boolean,
    isError: boolean,
    message: string | null
}

const initialState: InitialState = {
    categories: [],
    categorySelected: null,
    isLoading: false,
    isError: false,
    message: null
}

export const categorySlice = createSlice({
    name: 'category',
    initialState,
    reducers: {
        setCategories: (state, action: PayloadAction<Category[]>) => {
            state.categories = action.payload;
        },
        setCategorySelected: (state, action: PayloadAction<Category>) => {
            state.categorySelected = action.payload;
        },
        remove: (state, action: PayloadAction<number>) => {
            state.categories = state.categories.filter(category => category.id != action.payload);
        },
        setIsLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setIsError: (state, action: PayloadAction<any>) => {
            state.isError = action.payload.isError;
            state.message = action.payload.message;

        }
    }
});

export const getAll = () => {
    return async (dispatch: Dispatch) => {
        try {
            const { data } = await ApiRubios.get('category');
            if (data) dispatch(setCategories(data));
        } catch (err) { console.log("error al obtener las categorías: ", err) }
    }
};

export const getByCategoryByName = (name: any) => {
    return async (dispatch: Dispatch) => {
        try {
            const { data } = await ApiRubios.get('category/by-name?name=' + name);
            if (data) dispatch(setCategories(data));

        } catch (err) { console.log("error al filtrar categorías por nombre: ", err) }
    }
};

export const deleteCategory = (id: number) => {
    return async (dispatch: Dispatch) => {
        try {
            const { data } = await ApiRubios.delete(`category/${id}`);
            if (data.success) dispatch(remove(id));
        } catch (err) { console.log("error la eliminar el registro: ", err) }

    }
};

export const add = (category: CategoryCreateDto) => {
    return async (dispatch: Dispatch) => {
        dispatch(setIsLoading(true));
        try {
            const { data } = await ApiRubios.post('category', category);
        } catch (err) {
            console.log("error al agregar categoría: ", err);
            dispatch(setIsError({ isError: true, message: 'No se pudo agregar la categoría' }));
        } finally {
            dispatch(setIsLoading(false));
        }
    }
};

export const update = (id: number, category: Category) => {
    return async (dispatch: Dispatch) => {
        dispatch(setIsLoading(true));
        try {
            const { data } = await ApiRubios.put(`category/${id}`, category);
        } catch (err) {
            dispatch(setIsError({ isError: true, message: 'No se pudo modificar el registro.' }));
        } finally {
            dispatch(setIsLoading(false));
        }
    }
};

export const getById = (id: string) => {
    return async (dispatch: Dispatch) => {
        try {
            const { data } = await ApiRubios.get(`category/${id}`);
            if (data) dispatch(setCategorySelected(data))
        } catch (err) { console.log("error al obtener el registro: ", err) }
    }
};



export const { setCategories, setCategorySelected, remove, setIsError, setIsLoading } = categorySlice.actions;
export default categorySlice.reducer;