import { Col, Row } from "react-bootstrap";
import CreditForm from "./personal-credit-form"
import { useAppDispatch, useAppSelector } from "../../redux/hooks/hooks";
import { RootState } from "../../redux/store/store";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { getClients, getSearchClients } from "../../redux/slices/client-slice";
import { getDebtCollectors } from "../../redux/slices/user-slice";
import { getById, setCreditSelected, update } from "../../redux/slices/credit-slice";
import { statusCreditOptions } from "../constants/status-credit";
import Loading from "../common/loading";
import { CreditEdit } from "../credit/credit-edit";
import { StatusPayment } from "../../entities/dto/payment-detail-create-dto";


export const PersonalCreditEdit = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const { creditSelected, isLoading, isError, type, paymentFrequencies, paymentsDetailCreateDto, didPayments } = useAppSelector((state: RootState) => state.credits);
    console.log("Credito a amodificar: ", creditSelected);
    const date = (creditSelected) ? getDate(creditSelected.date) : new Date();
    const firstPayment = (creditSelected) ? getDate(creditSelected.firstPayment) : new Date();
    const credit: any = { ...creditSelected, date, firstPayment };
    const statusCredits = statusCreditOptions;
    const [selectedStatusCredit, setStatusCredit] = useState<string>((creditSelected) ? creditSelected.status : '');
    const [creditLoaded, setCreditLoaded] = useState(false);
    function getDate(date: string) {
        console.log("date: ", date);
        const year = parseInt(date.substring(6));
        const month = getMonth(date.substring(3, 5));
        const day = parseInt(date.substring(0, 2));
        return new Date(year, month, day);
    }

    function getMonth(month: string) {
        if (month.substring(0, 1) == "0") {
            return parseInt(month.substring(1)) - 1;
        } else {
            return parseInt(month) - 1;
        }
    }

    function getBalance(payment: number, numberPayment: number) {
        let balance = payment * numberPayment;
        if (paymentsDetailCreateDto.length > 0) {
            balance = paymentsDetailCreateDto.reduce((amount: number, payment: any) => {
                return (payment.status == StatusPayment.active) ? amount + parseFloat(payment.payment) : amount;
            }, 0)
        }
        console.log("balance calculado: ", balance);
        return balance;
    }

    const submit = async (values: any, date: any, firstPayment: any) => {
        if (creditSelected && credit && credit.id) {
            credit.clientId = parseInt(values.clientId);
            credit.debtCollectorId = parseInt(values.debtCollectorId);
            credit.firstPayment = firstPayment;
            credit.principal = parseInt(values.principal);
            credit.numberPayment = parseInt(values.numberPayment);
            credit.payment = values.payment;
            credit.interestRate = values.interestRate;
            credit.paymentFrequency = values.paymentFrequency;
            credit.information = values.information;
            credit.typeCurrency = values.typeCurrency;
            credit.status = selectedStatusCredit;
            credit.date = date;
            credit.commission = values.commission;
            credit.paymentsDetail = (didPayments)?null:paymentsDetailCreateDto;
            credit.balance = (didPayments)?null:getBalance(values.payment, parseInt(values.numberPayment))
            // Despacha la acción con el objeto credit modificado
            await dispatch(update(credit.id, credit, navigate));
               //navigate('/personal-credit-list')
        }
    }

    async function getCredit() {
        if (id) {
            console.log("id: ", id);
            await dispatch(getById(id));
            setCreditLoaded(true);
        }
    }

    useEffect(() => {
        if (creditSelected) setStatusCredit(creditSelected?.status)
    }, [creditSelected])


    useEffect(() => {
        getCredit();
        dispatch(getSearchClients(type));
        dispatch(getDebtCollectors());
    }, [id]);

    if (!creditLoaded) {
        return <Loading /> // Puedes mostrar un indicador de carga
    }


    return (
        <CreditEdit
            title={'Modificación del crédito'}
            selectedStatusCredit={selectedStatusCredit}
            setStatusCredit={setStatusCredit}
            statusCredits={statusCredits}
            credit={credit}
            submit={submit}
            creditSelected={creditSelected}
            paymentFrequencies={paymentFrequencies}
            isLoading={isLoading}
        />
      

    )
}