import { Col, Row } from "react-bootstrap";
import { MdArrowBack } from "react-icons/md";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/hooks";
import { RootState } from "../../redux/store/store";
import { useEffect, useState } from "react";
import Loading from "../common/loading";
import { getByCreditsHistory, getById, getPaymentsDetail, getTransactionsByCreditId, savePaymentSurcharge, setCreditHistorySelected, setCreditSelected, setIsLoading, setPaymentsDetail } from "../../redux/slices/credit-slice";
import { DetailCreditCommon } from "../common/detail-credit-common";
import { statusCreditOptions } from "../constants/status-credit";
import useNumberFormatter from "../../redux/hooks/useNumberFormatter";
import PersonalCreditPaymentsDetail from "./personal-credit-payment-detail";
import TransactionsList from "../common/transactions-list";
import TabsCredit from "../credit/tabs-credit";
import TableResponsive from "../common/table-responsive";
import { useLocation } from "react-router-dom";
import PaymentsDetail from "../credit/payments-detail";
import PaymentBhaviorReport from "../client/payment-bhavior-report";
import { getPaymentBhavior } from "../../redux/slices/client-slice";


interface PersonalCreditDetailProps {
    setShowDetail: (show: boolean) => void;
    hide: boolean;
    activeTab: string
}
export const PersonalCreditDetail = ({ setShowDetail, hide, activeTab }: PersonalCreditDetailProps) => {
    const dispatch = useAppDispatch();
    const location = useLocation();
    const route = location.pathname;
    const formatNumber = useNumberFormatter();
    const { paymentBhavior } = useAppSelector((state: RootState) => state.clients);
    const { creditSelected, creditsHistory, transactions, paymentsDetail, isLoading } = useAppSelector((state: RootState) => state.credits);
    const id = creditSelected?.id;
    const [detailLoaded, setDetailLoaded] = useState<boolean>(false);
    const [showModalPaymentDetal, setShowModalPaymentDetal] = useState<boolean>(false);
    const [active, setActive] = useState<string>(activeTab);
    const [dueDate, setDueDate] = useState<Date | null>(null);

    const rows = creditsHistory.map((credit, index) => ({
        id: index + 1,
        date: credit.date,
        status: credit.status,
        firstPayment: credit.firstPayment,
        payDay: credit.payDay,
        principal: formatNumber(credit.principal),
        interest: formatNumber(credit.interest),
        balance: formatNumber(credit.balance),
        action: (
            <>
                {
                    route == '/personal-credit-list' || route == '/sale-credits' || route == '/users'?
                        <button className="btn btn-success me-1 mb-1" onClick={() => handleModalPayment(credit)} >Detalle</button>
                        : (<>-</>)
                }
            </>)
    }));

    const data = {
        columns: [
            {
                label: '#',
                field: 'id',
                sort: 'asc',
                width: 100
            },

            {
                label: 'Fecha',
                field: 'date',
                sort: 'asc',
                width: 250
            },
            {
                label: 'Estado',
                field: 'status',
                sort: 'asc',
                width: 200
            },
            {
                label: 'Vto 1º Pago',
                field: 'firstPayment',
                sort: 'asc',
                width: 250
            },
            {
                label: 'Día de pago',
                field: 'payDay',
                sort: 'asc',
                width: 200
            },
            {
                label: 'Capital',
                field: 'principal',
                sort: 'asc',
                width: 200
            },
            {
                label: 'Interés',
                field: 'interest',
                sort: 'asc',
                width: 200
            },
            {
                label: 'Saldo',
                field: 'balance',
                sort: 'asc',
                width: 200
            },
            {
                label: 'Acciones',
                field: 'action',
                sort: 'asc',
                width: 200
            },
        ],
        rows: rows
    };

    function handleModalPayment(credit: any) {
        setShowModalPaymentDetal(true);
        dispatch(setCreditHistorySelected(credit.id));
    }



    function getStatus(status: string) {
        return "- " + statusCreditOptions.find(x => x.value == status)?.name
    }

    async function getDetail() {
        if (id) {
            await dispatch(getById(id));
            await dispatch(getByCreditsHistory(id));
            dispatch(getPaymentBhavior(creditSelected.clientId, 1, creditSelected.id));
            setDetailLoaded(true);
        }
    }

    const transactionColumns = [
        {
            label: 'Fecha',
            field: 'date',
        },
        {
            label: 'Concepto',
            field: 'concept',
        },
        {
            label: 'Importe',
            field: 'amount',
        }
    ];

    const toLocalDateTime = (date: string): string => {
        const dateHourParts = date.split(" "); // Dividir la cadena en fecha y hora
        const dateParts = dateHourParts[0].split("-"); // Dividir la fecha en día, mes y año
        const hourParts = dateHourParts[1].split(":")

        const fecha = new Date(
            parseInt(dateParts[2]),  // Año
            parseInt(dateParts[1]) - 1,  // Mes (restamos 1 porque los meses en JavaScript van de 0 a 11)
            parseInt(dateParts[0]),  // Día
            parseInt(hourParts[0]),    // Hora
            parseInt(hourParts[1]),    // Minuto
            parseInt(hourParts[2])     // Segundo
        );

        const utcTimestamp = fecha;
        //console.log("utcTimestamp: ", utcTimestamp);
        const localTimezoneOffset = new Date().getTimezoneOffset();
        const localTimestamp = new Date(utcTimestamp.getTime() - (localTimezoneOffset * 60000));
        const localTimeString = localTimestamp.toLocaleString();
        return localTimeString;
    }

    const transactionRows = transactions.map((transaction: any) => ({
        date: toLocalDateTime(transaction.date),
        concept: transaction.concept,
        amount: formatNumber(transaction.amount)
    }))

    function savePayment(payment: number, paymentDueDate: Date) {
        if (creditSelected) dispatch(savePaymentSurcharge(creditSelected.creditHistoryId, payment, paymentDueDate, creditSelected.id));
    }

    const getDate = (date: string): Date => {
        const dateHourParts = date.split("T"); // Dividir la cadena en fecha y hora
        const dateParts = dateHourParts[0].split("-"); // Dividir la fecha en día, mes y año
        const hourParts = dateHourParts[1].split(":")

        const fecha = new Date(
            parseInt(dateParts[0]),  // Año
            parseInt(dateParts[1]) - 1,  // Mes (restamos 1 porque los meses en JavaScript van de 0 a 11)
            parseInt(dateParts[2]),  // Día
            parseInt(hourParts[0]),    // Hora
            parseInt(hourParts[1]),    // Minuto
            parseInt(hourParts[2])     // Segundo
        );
        return fecha;
    }

    useEffect(() => {
        if (paymentsDetail.length > 0) {
            const date = getDate(paymentsDetail[paymentsDetail.length - 1].paymentDueDate);
            setDueDate(new Date(date));
        }
    }, [paymentsDetail])


    useEffect(() => {
        getDetail();
        setActive(activeTab);
    }, [id])

    if (!detailLoaded && hide) {
        return <Loading /> // Puedes mostrar un indicador de carga
    }
    return (
        <>
            {creditSelected ?
                <div className={`${hide ? 'd-block' : 'd-none'}`}>
                    <Row className="border-top border-bottom p-2 mb-4 align-items-center d-flex justify-content-start">
                        {route == '/personal-credit-list' || route == '/sale-credits'  || route == '/users'?
                            <Col lg={1} xs={2}>
                                <button className="bg-transparent border-0" onClick={() => {
                                    setShowDetail(false);
                                    setDetailLoaded(false);
                                    dispatch(setCreditSelected(null));
                                }
                                }>
                                    <MdArrowBack size={30} color="grey" />
                                </button>
                            </Col> : ('')
                        }
                        <Col lg={11} xs={10}>
                            <h3>Detalle del Crédito de {creditSelected?.client} {(creditSelected) ? getStatus(creditSelected?.status) : ''}</h3>
                        </Col>
                    </Row>
                    <DetailCreditCommon data={data} creditSelected={creditSelected} activeTab={active} setActive={(active: string) => {
                        console.log("active: ", active);
                        setActive(active);
                    }}
                        savePayment={savePayment} isLoading={isLoading} dueDate={dueDate} />
                    <PersonalCreditPaymentsDetail show={showModalPaymentDetal} onClose={() => setShowModalPaymentDetal(false)} />

                    {active == 'history' ?
                        <TableResponsive columns={data.columns} rows={data.rows} /> : ('')
                    }
                    {active == 'transactions' ?
                        <>
                            <div className=''>
                                <TransactionsList columns={transactionColumns} rows={transactionRows} />
                            </div>
                        </>
                        : ('')
                    }
                    {active == 'paymentBhavior' ?
                        <>
                            <div className=''>
                                <PaymentBhaviorReport rows={paymentBhavior} />
                            </div>
                        </>
                        : ('')
                    }
                </div> : ('')
            }
        </>

    )
};
export default PersonalCreditDetail;