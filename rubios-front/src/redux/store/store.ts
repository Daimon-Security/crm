import { configureStore } from '@reduxjs/toolkit'
import  creditsReducer  from '../slices/credit-slice'
import clientsReducer from '../slices/client-slice'
import usersReducer from '../slices/user-slice'
import authReducer from '../slices/auth-slice'
import categoriesReducer from '../slices/category-slice'
import productsReducer from '../slices/product-slice'
import reportsReducer from '../slices/report-slice'
import salesReducer from "../slices/sale-slice"
import saleCreditsReducer from "../slices/sale-credit-slice"
import loadingReducer from "../slices/loading-slice"
import cashReducer from "../slices/cash-slice"
export const store = configureStore({
  reducer: {
    credits: creditsReducer,
    clients: clientsReducer,
    users: usersReducer,
    auth: authReducer,
    categories: categoriesReducer,
    products: productsReducer,
    reports: reportsReducer,
    sales: salesReducer,
    saleCredits: saleCreditsReducer,
    loading: loadingReducer,
    cash: cashReducer
  },
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch