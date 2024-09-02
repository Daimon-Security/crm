import { Dispatch, PayloadAction, createSlice } from "@reduxjs/toolkit";
import ApiRubios from "../../api/api";
import { TotalChargeAccountedAndCollectedDto } from "../../entities/dto/charge-accounted-collection-dto";
import { ReportCollectionsCommissionsDto } from "../../entities/dto/report-collections-commissions-dto";
import { format } from "date-fns";
import { CommissionTotal } from '../../entities/dto/commission-total';
import { CommissionListDebtCollector } from "../../entities/dto/commission-list-debt-collector";
import { startLoading, stopLoading } from "./loading-slice";
import { ReportTotalBalanceDto } from "../../entities/dto/report-total-balance-dto";
import { TotalIndicatorsReport } from "../../entities/dto/total-indicators-report";
import { covertStringToDate } from "../../components/function-common/get-date-";

interface InitialState {
    totalChargesAccountedAndCollected: TotalChargeAccountedAndCollectedDto[];
    reportCollectionsCommissionsDetails: ReportCollectionsCommissionsDto | null;
    start: string;
    end: string;
    commissions: CommissionTotal[];
    commissionsCredits: CommissionListDebtCollector | null;
    loanPrincipalList: [],
    totalBalance: ReportTotalBalanceDto | null,
    totalBadCredits: ReportTotalBalanceDto | null,
    totalIndicators: TotalIndicatorsReport[],
    isLoading: boolean,
    monthlyCredits: any,
    monthlyCreditAmounts: any,
    creditsByDebtCollector: any,
    products: any,
    unpaidClientsPersonal: Array<any>,
    unpaidClientsSale: Array<any>,
    expiredCreditCountPersonalCredit: { expired: number, "al corriente": number },
    expiredCreditCountSaleCredit: { expired: number, "al corriente": number },
    unpaidCurrentWeek: any,
    unpaidCurrentMonth: any,
    totalExpiredPending: any,
    unpaidCurrentWeekSale: any,
    unpaidCurrentMonthSale: any,
    totalExpiredPendingSale: any,
    totalBalances: any
};

const initialState: InitialState = {
    totalChargesAccountedAndCollected: [],
    reportCollectionsCommissionsDetails: null,
    start: format(new Date(), "dd-MM-yyyy"),
    end: format(new Date(), "dd-MM-yyyy"),
    commissions: [],
    commissionsCredits: null,
    loanPrincipalList: [],
    totalBalance: null,
    totalBadCredits: null,
    totalIndicators: [],
    isLoading: false,
    monthlyCredits: null,
    monthlyCreditAmounts: null,
    creditsByDebtCollector: null,
    products: [],
    unpaidClientsPersonal: [],
    unpaidClientsSale: [],
    expiredCreditCountPersonalCredit: { expired: 0, "al corriente": 0 },
    expiredCreditCountSaleCredit: { expired: 0, "al corriente": 0 },
    unpaidCurrentWeek: { current: 0, previous: 0 },
    unpaidCurrentMonth: { current: 0, previous: 0 },
    totalExpiredPending: {},
    unpaidCurrentWeekSale: { current: 0, previous: 0 },
    unpaidCurrentMonthSale: { current: 0, previous: 0 },
    totalExpiredPendingSale: {},
    totalBalances:{}
};

export const reportSlice = createSlice({
    name: 'reports',
    initialState,
    reducers: {
        setChargesAccountedAndCollected: (state, action: PayloadAction<TotalChargeAccountedAndCollectedDto[]>) => {
            state.totalChargesAccountedAndCollected = action.payload;
        },
        setCollectionsAndCommissionsDetail: (state, action: PayloadAction<ReportCollectionsCommissionsDto>) => {
            state.reportCollectionsCommissionsDetails = action.payload;
            //console.log("collectionsCommissions: ", state.reportCollectionsCommissionsDetails);
        },
        setRangeDate: (state, action: PayloadAction<any>) => {
            state.start = action.payload.start;
            state.end = action.payload.end
        },
        setCommissionsTotal: (state, action: PayloadAction<CommissionTotal[]>) => {
            state.commissions = action.payload;
        },
        setCommissionCreditDto: (state, action: PayloadAction<CommissionListDebtCollector>) => {
            state.commissionsCredits = action.payload;
        },
        setLoanPrincipalList: (state, action: PayloadAction<any>) => {
            state.loanPrincipalList = action.payload;
        },
        setTotalBalance: (state, action: PayloadAction<ReportTotalBalanceDto>) => {
            state.totalBalance = action.payload;
        },
        setTotalBalanceBad: (state, action: PayloadAction<ReportTotalBalanceDto>) => {
            state.totalBadCredits = action.payload;
        },
        setTotalIndicators: (state, action: PayloadAction<TotalIndicatorsReport[]>) => {
            state.totalIndicators = action.payload;
        },
        setIsLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setMonthlyCredits: (state, action: PayloadAction<any>) => {
            state.monthlyCredits = action.payload;
        },
        setMonthlyCreditAmounts: (state, action: PayloadAction<any>) => {
            state.monthlyCreditAmounts = action.payload;
        },
        setCreditsByDebtCollector: (state, action: PayloadAction<any>) => {
            state.creditsByDebtCollector = action.payload;
        },
        setProducts: (state, action: PayloadAction<any>) => {
            state.products = action.payload;
        },
        setUnpaidClientsPersonal: (state, action: PayloadAction<any>) => {
            state.unpaidClientsPersonal = action.payload;
        },
        setUnpaidClientsSale: (state, action: PayloadAction<any>) => {
            state.unpaidClientsSale = action.payload;
        },
        setExpiredCreditCountPersonalCredit: (state, action: PayloadAction<any>) => {
            state.expiredCreditCountPersonalCredit = action.payload;
        },
        setExpiredCreditCountSaleCredit: (state, action: PayloadAction<any>) => {
            state.expiredCreditCountSaleCredit = action.payload;
        },
        setUnpaidCurrentWeekTotals: (state, action: PayloadAction<any>) => {
            state.unpaidCurrentWeek = action.payload;
        },
        setUnpaidCurrentMonthTotals: (state, action: PayloadAction<any>) => {
            state.unpaidCurrentMonth = action.payload;
        },
        setTotalExpiredPending: (state, action: PayloadAction<any>) => {
            state.totalExpiredPending = action.payload;
        },


        setUnpaidCurrentWeekTotalsSale: (state, action: PayloadAction<any>) => {
            state.unpaidCurrentWeekSale = action.payload;
        },
        setUnpaidCurrentMonthTotalsSale: (state, action: PayloadAction<any>) => {
            state.unpaidCurrentMonthSale = action.payload;
        },
        setTotalExpiredPendingSale: (state, action: PayloadAction<any>) => {
            state.totalExpiredPendingSale = action.payload;
        },
        setTotalBalances: (state, action: PayloadAction<any>) => {
            console.log("here action", action.payload)
            state.totalBalances = action.payload
        }
    }
});

export const getChargesAccountedAndCollected = (start: Date | null, end: Date | null, type: string) => {
    return async (dispatch: Dispatch) => {
        dispatch(startLoading());
        try {
            const { data } = await ApiRubios.get('report/charges-accounted-collected?start=' + start + "&end=" + end + "&type=" + type);
            console.log("recibiendo cobros: ", data);
            if (data) dispatch(setChargesAccountedAndCollected(data));
            dispatch(stopLoading());
        } catch (err) {
            console.log("error al obtener las comisiones: ", err);
            dispatch(stopLoading());
        }

    }
};

export const getCollectionsAndCommissionsDetail = (id: string, start: string | null, end: string | null, type: string) => {
    return async (dispatch: Dispatch) => {
        dispatch(setIsLoading(true));
        try {
            const { data } = await ApiRubios.get('report/payments-collected-pending?id=' + id + '&start=' + start + '&end=' + covertStringToDate(end) + "&type=" + type);
            //console.log("data getCollectionsAndCommissionsDetail: ", data);
            if (data) dispatch(setCollectionsAndCommissionsDetail(data));
        } catch (err) {
            console.log("error al obtener detalle de comisiones: ", err);
        } finally {
            dispatch(setIsLoading(false));
        }
    }
};

export const registerSurrenderPayments = (id: string, start: string | null, end: string | null, type: string) => {
    return async (dispatch: Dispatch) => {
        dispatch(setIsLoading(true));
        console.log("end: ", end);
        try {
            console.log("riendiendo");
            const { data } = await ApiRubios.patch(`report/register-accounted-payments?id=${id}&start=${start}&end=${covertStringToDate(end)}&type=${type}`);
            console.log("data: ", data);
            //if(data.success) dispatch(setRegisterSurrenderPayment(id));
            dispatch(getCollectionsAndCommissionsDetail(id, start, end, type) as any);
        } catch (err) {
            console.log("error al registrar la rendición de los pagos cobrados: ", err);
        } finally {
            dispatch(setIsLoading(false));
        }
    }
};

export const registerCommissionsPayments = (id: string, type: string) => {
    return async (dispatch: Dispatch) => {
        dispatch(startLoading());
        try {
            const { data } = await ApiRubios.patch(`report/register-commissions-payments?id=${id}&type=${type}`);
            console.log("data: ", data);
            //if(data.success) dispatch(setRegisterSurrenderPayment(id));
            dispatch(stopLoading());
        } catch (err) {
            console.log("error al registrar la rendición de los pagos cobrados: ", err);
            dispatch(stopLoading());
        }
    }
};

export const getCommissionsTotal = (type: string) => {
    return async (dispatch: Dispatch) => {
        dispatch(startLoading());
        try {
            const { data } = await ApiRubios.get(`report/commissions-total?type=${type}`);
            console.log("data commissions: ", data);
            if (data) dispatch(setCommissionsTotal(data));
            dispatch(stopLoading());
        } catch (err) {
            console.log("error al obtener las comisiones totales: ", err);
            dispatch(stopLoading());
        }
    }
};

export const getCommissionCreditDetail = (id: string, type: string) => {
    return async (dispatch: Dispatch) => {
        dispatch(startLoading());
        try {
            const { data } = await ApiRubios.get(`report/${id}/commissions-credit-by-deb-collector?type=${type}`);
            if (data) dispatch(setCommissionCreditDto(data));
            dispatch(stopLoading());
        } catch (err) { console.log('error al obtener el detalle de créditos para le pago de comisiones: ', err) }
    }
};

export const getcollectionsAccountedHistory = (id: string, start: string | null, end: string | null, type: string) => {
    return async (dispatch: Dispatch) => {
        dispatch(setIsLoading(true));
        try {
            const { data } = await ApiRubios.get(`report/${id}/collections-accounted-history?start=${start}&end=${end}&type=${type}`);
            //console.log("recibiendo cobros: ", data);
            if (data) dispatch(setCollectionsAndCommissionsDetail(data));
        } catch (err) {
            console.log("error al obtener las comisiones: ", err);
        } finally {
            dispatch(setIsLoading(false));
        }

    }
};

export const getCommissionCreditDetailHistory = (id: string, type: string) => {
    return async (dispatch: Dispatch) => {
        dispatch(startLoading());
        try {
            const { data } = await ApiRubios.get(`report/${id}/commissions-credits-history?type=${type}`);
            if (data) dispatch(setCommissionCreditDto(data));
            console.log("historial de comisiones: ", data);
            dispatch(stopLoading());

        } catch (err) {
            console.log('error al obtener el detalle de créditos para le pago de comisiones: ', err);
            dispatch(stopLoading());
        }
    }
};

export const getLoanPrincipal = () => {
    return async (dispatch: Dispatch) => {
        try {
            const { data } = await ApiRubios.get('report/loan-principal');
            if (data) dispatch(setLoanPrincipalList(data));
        } catch (err) { console.log("error al obtener los registros del informe de capital prestado: ", err) }
    }
};

export const getTotalBalance = (year: string, currencyType: string) => {
    return async (dispatch: Dispatch) => {
        dispatch(startLoading());
        dispatch(setIsLoading(true));
        try {
            const { data } = await ApiRubios.get('report/total-balance?year=' + year + '&currencyType=' + currencyType);
            if (data) dispatch(setTotalBalance(data));
            console.log("report data: ", data);
            dispatch(stopLoading());

        } catch (err) {
            console.log("error al obtener el balance total: ", err);
            dispatch(stopLoading());
        }
    }
}

export const getTotalBalanceBadCredits = (year: string, currencyType: string) => {
    return async (dispatch: Dispatch) => {
        // dispatch(startLoading());
        try {
            const { data } = await ApiRubios.get('report/total-balance-bad?year=' + year + '&currencyType=' + currencyType);
            if (data) dispatch(setTotalBalanceBad(data));
            console.log("report data: ", data);
            //dispatch(stopLoading());

        } catch (err) {
            console.log("error al obtener el balance total: ", err);
            // dispatch(stopLoading());
        }
    }
}

export const getTotalIndicators = (currencyType: string) => {
    return async (dispatch: Dispatch) => {
        try {
            const { data } = await ApiRubios.get('report/total-indicators?currencyType=' + currencyType);
            if (data) dispatch(setTotalIndicators(data));
            console.log("report data: ", data);
            dispatch(setIsLoading(false));

        } catch (err) {
            console.log("error al obtener el balance total: ", err);
            dispatch(setIsLoading(false));
        }
    }
};

export const getMonthlyCredits = () => {
    return async (dispatch: Dispatch) => {
        try {
            const { data } = await ApiRubios.get('report/monthly-credits');
            if (data) dispatch(setMonthlyCredits(data));
        } catch (err) { console.log("error al obtener el reporte:", err) }
    }
};

export const getMonthlyCreditAmounts = () => {
    return async (dispatch: Dispatch) => {
        try {
            const { data } = await ApiRubios.get('report/monthly-credit-amounts');
            if (data) dispatch(setMonthlyCreditAmounts(data));
        } catch (err) { console.log("error al obtener el reporte:", err) }
    }
};

export const getCreditsByDebtCollector = () => {
    return async (dispatch: Dispatch) => {
        try {
            const { data } = await ApiRubios.get('report/credits-by-debtcollector');
            if (data) dispatch(setCreditsByDebtCollector(data));
        } catch (err) { console.log("error al obtener el reporte:", err) }
    }
};

export const getProducts = (category: string, startDate: Date, endDate: Date) => {
    return async (dispatch: Dispatch) => {
        dispatch(setIsLoading(true));
        try {
            console.log("category: ", category);
            console.log("startDate: ", startDate);
            console.log("endDate: ", endDate);
            const { data } = await ApiRubios.get(`report/products?category=${category}&startDate=${startDate.toUTCString()}&endDate=${endDate.toUTCString()}`);
            if (data) dispatch(setProducts(data));
        } catch (err) {
            console.log("error al obtener el reporte de productos más vendidos: ", err)
        } finally {
            dispatch(setIsLoading(false));
        }
    }
        ;
}

export const getUnpaidClients = (clientType: number) => {
    return async (dispatch: Dispatch) => {
        dispatch(setIsLoading(true));
        try {
            const { data } = await ApiRubios.get(`report/expired-credits?type=${clientType}`);
            if (data) {
                (clientType == 1) ? dispatch(setUnpaidClientsPersonal(data)) : dispatch(setUnpaidClientsSale(data));
            }
        } catch (err) {
            console.log("error al obtener el reporte de productos más vendidos: ", err)
        } finally {
            dispatch(setIsLoading(false));
        }
    };
}

export const getUnpaidCurrentWeek = (clientType: number) => {
    return async (dispatch: Dispatch) => {
        dispatch(setIsLoading(true));
        try {
            const { data } = await ApiRubios.get(`report/pending-current-week`);
            if (data) {
                dispatch(setUnpaidCurrentWeekTotals(data));
            }
        } catch (err) {
            console.log("error al obtener el reporte de productos más vendidos: ", err)
        } finally {
            dispatch(setIsLoading(false));
        }
    };
}

export const getUnpaidCurrentMonth = (clientType: number) => {
    return async (dispatch: Dispatch) => {
        dispatch(setIsLoading(true));
        try {
            const { data } = await ApiRubios.get(`report/pending-current-month`);
            if (data) {
                dispatch(setUnpaidCurrentMonthTotals(data));
            }
        } catch (err) {
            console.log("error al obtener el reporte de productos más vendidos: ", err)
        } finally {
            dispatch(setIsLoading(false));
        }
    };
}

export const getTotalExpiredPending = () => {
    return async (dispatch: Dispatch) => {
        dispatch(setIsLoading(true));
        try {
            const { data } = await ApiRubios.get(`report/total-expired-pending`);
            if (data) {
                dispatch(setTotalExpiredPending(data));
            }
        } catch (err) {
            console.log("error al obtener el reporte de productos más vendidos: ", err)
        } finally {
            dispatch(setIsLoading(false));
        }
    };
}



//Sale

export const getUnpaidCurrentWeekSale = (clientType: number) => {
    return async (dispatch: Dispatch) => {
        dispatch(setIsLoading(true));
        try {
            const { data } = await ApiRubios.get(`report/sale-pending-current-week`);
            if (data) {
                dispatch(setUnpaidCurrentWeekTotalsSale(data));
            }
        } catch (err) {
            console.log("error al obtener el reporte de productos más vendidos: ", err)
        } finally {
            dispatch(setIsLoading(false));
        }
    };
}

export const getUnpaidCurrentMonthSale = (clientType: number) => {
    return async (dispatch: Dispatch) => {
        dispatch(setIsLoading(true));
        try {
            const { data } = await ApiRubios.get(`report/sale-pending-current-month`);
            if (data) {
                dispatch(setUnpaidCurrentMonthTotalsSale(data));
            }
        } catch (err) {
            console.log("error al obtener el reporte de productos más vendidos: ", err)
        } finally {
            dispatch(setIsLoading(false));
        }
    };
}

export const getTotalExpiredPendingSale = () => {
    return async (dispatch: Dispatch) => {
        dispatch(setIsLoading(true));
        try {
            const { data } = await ApiRubios.get(`report/sale-total-expired-pending`);
            if (data) {
                dispatch(setTotalExpiredPendingSale(data));
            }
        } catch (err) {
            console.log("error al obtener el reporte de productos más vendidos: ", err)
        } finally {
            dispatch(setIsLoading(false));
        }
    };
}

export const getExpiredCreditCount = () => {
    return async (dispatch: Dispatch) => {
        dispatch(setIsLoading(true));
        try {
            const { data } = await ApiRubios.get(`report/expired-credit-count`);
            console.log("data: ", data);
            if (data) {
                dispatch(setExpiredCreditCountPersonalCredit(data[0]));
                dispatch(setExpiredCreditCountSaleCredit(data[1]));
            }
        } catch (err) {
            console.log("error al obtener el reporte de productos más vendidos: ", err)
        } finally {
            dispatch(setIsLoading(false));
        }
    };
}

export const getTotalBalances = () => {
    return async (dispatch: Dispatch) => {
        dispatch(setIsLoading(true));
        try {
            const { data } = await ApiRubios.get(`report/total-balances`);
            if (data) {
                dispatch(setTotalBalances(data));
            }
        } catch (err) {
            console.log("error al obtener el reporte de deuda total: ", err)
        } finally {
            dispatch(setIsLoading(false));
        }
    };
}

export const { setChargesAccountedAndCollected, setCollectionsAndCommissionsDetail, setRangeDate,
    setCommissionsTotal, setCommissionCreditDto, setLoanPrincipalList, setTotalBalance, setTotalBalanceBad,
    setTotalIndicators, setIsLoading, setMonthlyCredits, setMonthlyCreditAmounts, setCreditsByDebtCollector,
    setProducts, setUnpaidClientsPersonal, setUnpaidClientsSale, setExpiredCreditCountPersonalCredit, setExpiredCreditCountSaleCredit,
    setUnpaidCurrentWeekTotals, setUnpaidCurrentMonthTotals, setTotalExpiredPending,
    setUnpaidCurrentWeekTotalsSale, setUnpaidCurrentMonthTotalsSale, setTotalExpiredPendingSale,
    setTotalBalances
} = reportSlice.actions;
export default reportSlice.reducer;