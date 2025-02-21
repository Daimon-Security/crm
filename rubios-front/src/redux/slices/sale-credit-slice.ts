import { Dispatch, PayloadAction, createSlice } from "@reduxjs/toolkit";
import { SaleCreditListDto } from "../../entities/dto/sale-credit-list-dto";
import ApiRubios from "../../api/api";
import { CreditListDto } from "../../entities/dto/credit-list-dto";
import { CreditHistory } from "../../entities/dto/credit-history-dto";
import { PaymentDetail } from "../../entities/payment-detail";
import { CollectionDto } from "../../entities/dto/collection-dto";
import { DateQueryDto } from "../../entities/dto/date-query-dto";
import { getDayString } from "../../components/function-common/get-day-string";
import { getDateString } from "../../components/function-common/get-date-string";
import { PaymentDetailCreateDto } from "../../entities/dto/payment-detail-create-dto";
import { startLoading, stopLoading } from "./loading-slice";
import { boolean } from "yup";
import { CreditTransactionDto } from "../../entities/dto/credit-transactions-dto";
import { getCollectionsAndCommissionsDetail } from "./report-slice";
import { DetailCollectionDto } from "../../entities/dto/collections-detail-dto";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface SaleCreditsStateInitial {
  credits: CreditListDto[],
  creditSelected: any | null,
  paymentsDetail: PaymentDetail[],
  isLoading: boolean,
  // message: string | null,
  // isError: boolean,
  collections: CollectionDto[],
  selectedCollection: CollectionDto | DetailCollectionDto | null,
  dateQuery: DateQueryDto | null,
  paymentFrequencies: any[],
  creditsHistory: CreditHistory[],
  paymentsDetailCreateDto: PaymentDetailCreateDto[],
  type: string,
  didPayments: boolean,
  filterClientName: boolean,
  clientId: number | null,
  selectedCreditHistoryId: string | null,
  transactions: CreditTransactionDto[]

};

const initialState: SaleCreditsStateInitial = {
  credits: [],
  creditSelected: null,
  paymentsDetail: [],
  isLoading: false,
  // message: null,
  // isError: false,
  collections: [],
  selectedCollection: null,
  dateQuery: null,
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
  creditsHistory: [],
  paymentsDetailCreateDto: [],
  type: '2',
  didPayments: false,
  filterClientName: false,
  clientId: null,
  selectedCreditHistoryId: null,
  transactions: []
};

export const saleCreditsSlice = createSlice({
  name: 'credits',
  initialState,
  reducers: {
    setCreditSelected: (state, action: PayloadAction<CreditListDto | null>) => {
      state.creditSelected = action.payload;
      //console.log("credito guardado: ", state.creditSelected);
    },
    //   setCreditUpdate: (state, action: PayloadAction<any>) => {
    //     const updatedCredit = action.payload;
    //     state.credits = state.credits.map((credit) =>
    //       credit.id === updatedCredit.id ? { ...updatedCredit } : credit
    //     );
    //     //state.creditSelected = null;
    //   },
    setCredits: (state, action: PayloadAction<CreditListDto[]>) => {
      state.credits = action.payload;
    },
    setPaymentsDetail: (state, action: PayloadAction<PaymentDetail[]>) => {
      state.paymentsDetail = action.payload;
    },
    //   remove: (state, action: PayloadAction<number>) => {
    //     state.credits = state.credits.filter((credit) => credit.id !== action.payload);
    //   },
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setCollections: (state, action: PayloadAction<CollectionDto[]>) => {
      state.collections = action.payload;
    },
    setSelectedCollection: (state, action: PayloadAction<CollectionDto | DetailCollectionDto>) => {
      state.selectedCollection = action.payload;
    },
    setDateQuery: (state, action: PayloadAction<DateQueryDto>) => {
      state.dateQuery = action.payload;

    },
    setUpdateCollections: (state, action: PayloadAction<CollectionDto>) => {
      const collectionUpdate = action.payload;
      state.collections = state.collections.map((collection) => {
        return (collection.id == action.payload.id) ? { ...collectionUpdate } : collection;
      })
    },
    setCreditsHistory: (state, action: PayloadAction<CreditHistory[]>) => {
      state.creditsHistory = action.payload;
    },
    setPaymentsDetailCreateDto: (state, action: PayloadAction<PaymentDetailCreateDto[]>) => {
      state.paymentsDetailCreateDto = action.payload;
    },
    setDidPayments: (state, action: PayloadAction<boolean>) => {
      state.didPayments = action.payload;
    },
    setFilterClientName: (state, action: PayloadAction<boolean>) => {
      state.filterClientName = action.payload;
    },
    setClientId: (state, action: PayloadAction<number>) => {
      state.clientId = action.payload;
    },
    setCreditHistorySelected: (state, action: PayloadAction<any | null>) => {
      state.selectedCreditHistoryId = action.payload;
      //console.log("credito guardado: ", state.creditSelected);
    },
    setTransactions: (state, action: PayloadAction<CreditTransactionDto[]>) => {
      state.transactions = action.payload
    },
    setPaymentDate: (state, action: PayloadAction<{ id: number, dueDate: Date }>) => {
      state.collections = state.collections.map(payment => {
        if (payment.id === action.payload.id) {
          return {
            ...payment,
            paymentDueDate: format(action.payload.dueDate, 'dd-MM-yyyy', { locale: es })
          };
        }
        return payment;
      });
    }
  },
});

export const getAll = () => {
  return async (dispatch: Dispatch) => {
    try {
      const { data } = await ApiRubios.get('sale-credit');
      if (data) dispatch(setCredits(data));
    } catch (err) {
      console.log("error al pedir créditos por venta: ", err)
    }

  }
};


export const getByClientName = (client: number) => {
  return async (dispatch: Dispatch) => {
    try {
      const { data } = await ApiRubios.get(`sale-credit/by-client?client=${client}`);
      dispatch(setCredits(data));

    } catch (err) { console.log("error al obtener por nombre: ", err) }
  }
};

export const getById = (id: string) => {
  return async (dispatch: Dispatch) => {
    dispatch(setDidPayments(false))
    try {
      const { data } = await ApiRubios.get(`sale-credit/${id}`);
      if (data) dispatch(setCreditSelected(data));
      dispatch(getTransactionsByCreditId(id) as any);
      const didPayments = data.paymentsDetail.find((x: any) => x.paymentDate != null);
      console.log("data: ", data);
      if (didPayments) dispatch(setDidPayments(true))
    } catch (err) { console.log("error al obtener crédito por id: ", err) }
  }
};

export const getByCreditsHistory = (id: string) => {
  return async (dispatch: Dispatch) => {
    dispatch(setIsLoading(true));
    try {
      const { data } = await ApiRubios.get(`sale-credit/${id}/credits-history`);
      console.log("data credits history: ", data);
      if (data) {
        dispatch(setCreditsHistory(data));
        dispatch(setPaymentsDetail([]));
        const id = data.find((x: any) => x.status == 'Actual').id;
        dispatch(getPaymentsDetail(id) as any)
        dispatch(setCreditHistorySelected(data[0].id))
      }
    } catch (err) {
      console.log("error al obtener el historial del crédito: ", err)
    } finally {
      dispatch(setIsLoading(false));
    }
  }
};

export const getPaymentsDetail = (id: string) => {
  return async (dispatch: Dispatch) => {
    try {

      console.log("id: ", id);
      const { data } = await ApiRubios.get(`sale-credit/${id}/payments-detail`);
      dispatch(setPaymentsDetail(data));
      dispatch(setIsLoading(false));

    } catch (err) {
      console.log("error al obtener los detalles de pagos: ", err);
      dispatch(setIsLoading(false));
    }
  }
};

export const update = (id: number, credit: any, navigate: (route: string) => void) => {
  return async (dispatch: Dispatch) => {
    dispatch(setIsLoading(true))
    try {
      const { data } = await ApiRubios.put(`sale-credit/${id}`, credit);
      console.log("data: ", data);
      if (data.success) {
        dispatch(setCreditSelected(null));
        dispatch(setIsLoading(false))
        navigate('/sale-credits')
      }

    } catch (err) { console.log("error: ", err) }
  }
};

export const getSearchCredits = (status: string, user: string | null, typeCurrency: string | null, paymentFrequency: string | null,
  startDate: Date | null, endDate: Date | null) => {
  return async (dispatch: Dispatch) => {
    try {
      console.log("status: ", status);
      console.log("user: ", user);
      console.log("typeCurrency: ", typeCurrency);
      console.log("paymentFrequency: ", paymentFrequency);
      console.log("startDate: ", startDate);
      console.log("endDate: ", endDate);
      const { data } = await ApiRubios.get(`sale-credit/search?status=${status}&user=${user}&currency=${typeCurrency}&frequency=${paymentFrequency}&startDate=${startDate}&endDate=${endDate}`)
      dispatch(setCredits(data));
    } catch (err) { console.log("error al filtrar los créditos: ", err) }
  }
};

export const getDay = () => {
  return async (dispatch: Dispatch) => {
    try {
      const currentDate = new Date();
      dispatch(setDateQuery({
        day: getDayString(currentDate),
        date: currentDate.toString(),
        dateShort: getDateString(currentDate)
      }));

    } catch (err) { console.log("err al obtener el día: ", err) }
  }
};

export const getCollections = (date: string) => {
  return async (dispatch: Dispatch) => {
    try {
      const dateQuery = (date) ? new Date(date).toUTCString() : new Date().toUTCString();
      const { data } = await ApiRubios.get(`sale-credit/collections-by-date?date=${dateQuery}`);
      if (data) {
        dispatch(setCollections(data));
      }
      dispatch(stopLoading());
    } catch (err) {
      console.log("error al pedir las cobranzas del día: ", err);
      dispatch(stopLoading());
    }
  }

};

export const getSearchCollections = (statusCredit: string, user: string | null, typeCurrency: string | null, startDate: Date | null, endDate: Date | null, statusPayment: string | null) => {
  return async (dispatch: Dispatch) => {
    dispatch(startLoading());
    try {
      const { data } = await ApiRubios.get(`sale-credit/search-collections?status=${statusCredit}&user=${user}&currency=${typeCurrency}&startDate=${startDate}&endDate=${endDate}&statusPayment=${statusPayment}`);
      dispatch(setCollections(data));
      dispatch(stopLoading());
    } catch (err) {
      console.log("error al filtrar por estado y por cobrador: ", err);
      dispatch(stopLoading());
    }
  }
};

export const getCollectionsByClientName = (client: number | null, date: string) => {
  return async (dispatch: Dispatch) => {
    //dispatch(startLoading());
    try {
      if (client) {
        dispatch(setFilterClientName(true))
      } else {
        dispatch(setFilterClientName(false))
      }
      const { data } = await ApiRubios.get(`sale-credit/collections-by-client?client=${client}&date=${new Date(date).toUTCString()}`);
      dispatch(setCollections(data) as any);
      //dispatch(stopLoading());
    } catch (err) {
      console.log("error al obtener por nombre: ", err);
      //dispatch(stopLoading());
    }
  }
};

export const registerPayment = (id: number, payment: number, date: string, filterClientName: boolean, client: number | null) => {
  return async (dispatch: Dispatch) => {
    dispatch(startLoading());
    try {
      const { data } = await ApiRubios.put(`sale-credit/${id}/register-payment`, { payment: payment });
      if (filterClientName) {
        //console.log("mostrando las cobranza por cliente")
        dispatch(getCollectionsByClientName(client, date) as any);
      } else {
        dispatch(getCollections(new Date().toString()) as any)
      };
      dispatch(stopLoading());
    } catch (err) {
      console.log("error al registrar el pago: ", err);
      dispatch(stopLoading());
    }
  }
};

export const registerCancellationInterestPrincipal = (id: number, payment: number, firstPayment: any, date: string, filterClientName: boolean, client: number | null) => {
  return async (dispatch: Dispatch) => {
    dispatch(startLoading());
    try {
      const body = { payment: payment, firstPayment: firstPayment }
      const { data } = await ApiRubios.put(`sale-credit/${id}/register-cancellation-interest-principal`, body)
      //console.log("data: ", data);     
      if (filterClientName) {
        //console.log("mostrando las cobranza por cliente: ", client, date);
        dispatch(getCollectionsByClientName(client, date) as any);
      } else {
        dispatch(getCollections(new Date().toString()) as any)
      };
      dispatch(stopLoading());
    } catch (err) {
      console.log("error al cancelar intereses: ", err);
      dispatch(stopLoading());
    }
  }

};

export const cancelRegisteredPayment = (id: number, date?: string, filterClientName?: boolean, client?: number | null) => {
  return async (dispatch: Dispatch) => {
    dispatch(startLoading());
    try {
      const { data } = await ApiRubios.put(`sale-credit/${id}/cancel-registered-payment`);
      if (filterClientName) {
        if (client && date) dispatch(getCollectionsByClientName(client, date) as any);
      } else {
        dispatch(getCollections(new Date().toString()) as any)
      };
      dispatch(stopLoading());
    } catch (err) {
      console.log("error al registrar el pago: ", err);
      dispatch(stopLoading());
    }
  }
};

export const cancelRegisteredPaymentInterest = (id: number, date?: string, filterClientName?: boolean, client?: number | null) => {
  return async (dispatch: Dispatch) => {
    dispatch(startLoading());
    try {
      const { data } = await ApiRubios.put(`sale-credit/${id}/cancel-registered-payment-interest`);
      if (filterClientName) {
        if(client && date)dispatch(getCollectionsByClientName(client, date) as any);
      } else {
        dispatch(getCollections(new Date().toString()) as any)
      }
      dispatch(stopLoading());
    } catch (err) {
      console.log("error al registrar el pago: ", err);
      dispatch(stopLoading());
    }
  }
};

export const cancelPayment = (id: number, startDate: string, endDate: string, debtCollectorId: string, type: string, close: ()=>void, operation:string) => {
  return async (dispatch: Dispatch) => {
    console.log("cancelando pago");
    dispatch(startLoading());
    try {
      const { data } = (operation == 'cancelRegisteredPayment') ? await ApiRubios.put(`sale-credit/${id}/cancel-registered-payment`):
      await ApiRubios.put(`sale-credit/${id}/cancel-registered-payment-interest`);;  
      dispatch(getCollectionsAndCommissionsDetail(debtCollectorId, startDate, endDate, type) as any)
      close();
    } catch (err) {
      console.log("error al registrar el pago: ", err);
    }finally{

      dispatch(stopLoading());
    }
  }
};

export const getTransactionsByCreditId = (id: string) => {
  return async (dispatch: Dispatch) => {
    try {
      const { data } = await ApiRubios.get(`sale-credit/${id}/transactions`);
      if (data) {
        dispatch(setTransactions(data));
      }
    } catch (err) { console.log("error al obtener crédito por id: ", err) }
  }
}

export const reschedulePayment = (id: number, dueDate: Date, filterClientName: boolean, client: number | null, date: string) => {
  return async (dispatch: Dispatch) => {
    console.log("reschedulePayment")
    dispatch(startLoading());
    try {
      const { data } = await ApiRubios.put(`sale-credit/reschedule-payment`, { id, dueDate });
      dispatch(setPaymentDate({ id, dueDate }));
      dispatch(stopLoading());
    } catch (err) {
      console.log("error al registrar el pago: ", err);
      dispatch(stopLoading());
    }

  };
}

export const savePaymentSurcharge = (id: number, payment: number, paymentDueDate: Date, creditId: string) => {
  return async (dispatch: Dispatch) => {
    dispatch(setIsLoading(true));
    try {
      const body = {
        payment,
        paymentDueDate
      }
      const { data } = await ApiRubios.put(`sale-credit/${id}/add-payment-surcharge`, body);
      if (data.success) {
        dispatch(getById(creditId) as any);
        dispatch(getByCreditsHistory(creditId) as any);
      }

    } catch (err) {
      console.log("error al agregar recargo: ", err)
    } finally {
      dispatch(setIsLoading(false));
    }
  }
};

export const updatePayment = (id: string, payment: number, concept: string, close: () => void, startDate: string, endDate: string, type: string, debtCollectorId: string) => {
  return async (dispatch: Dispatch) => {
    dispatch(startLoading());
    try {
      const body = {
        payment, concept
      }
      const { data } = await ApiRubios.put(`sale-credit/collection/${id}/update-payment`, body);
      if (data.success) {
        dispatch(getCollectionsAndCommissionsDetail(debtCollectorId, startDate, endDate, type) as any)
        close();
      }

    } catch (err) {
      console.log("error al modificar el pago: ", err)
    } finally {
      dispatch(stopLoading());
    }
  }
}


export const { setCredits, setCreditSelected, setCreditsHistory, setPaymentsDetail, setCollections, setSelectedCollection, setDateQuery,
  setUpdateCollections, setPaymentsDetailCreateDto, setDidPayments, setFilterClientName, setClientId, setCreditHistorySelected, setIsLoading,
  setTransactions, setPaymentDate } = saleCreditsSlice.actions;

export default saleCreditsSlice.reducer;