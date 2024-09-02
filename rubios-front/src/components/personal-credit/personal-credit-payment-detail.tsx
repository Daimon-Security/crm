import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/hooks";
import { RootState } from "../../redux/store/store";
import { Button, Col, Modal, Row } from "react-bootstrap";
import Loading from "../common/loading";
import TableResponsive from "../common/table-responsive";
import { getById, getPaymentsDetail, setIsLoading, setPaymentsDetail } from "../../redux/slices/credit-slice";
import useNumberFormatter from "../../redux/hooks/useNumberFormatter";
import { getDateString } from "../function-common/get-date-string";

interface PersonalCreditPaymentsDetailModalProps {
    show: boolean;
    onClose: () => void;
}

export const PersonalCreditPaymentsDetail = ({ show, onClose }: PersonalCreditPaymentsDetailModalProps) => {
    const formatNumber = useNumberFormatter();
    const { paymentsDetail, creditSelected, selectedCreditHistoryId, isLoading } = useAppSelector((state: RootState) => state.credits);
    const dispatch = useAppDispatch();

    const rows = paymentsDetail.map((payment, index) => ({
        id: payment.number,
        paymentDueDate: getDate(new Date(payment.paymentDueDate)),
        paymentDate: (payment.paymentDate) ? getDate(new Date(payment.paymentDate)) : '-',
        concep: payment.paymentType,
        payment: getSymbolTypeCurrency() + " " + formatNumber(payment.payment),
        actualPayment: getSymbolTypeCurrency() + " " + ((payment.actualPayment) ? formatNumber(payment.actualPayment) : '0,00'),
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
                label: 'Vto del Pago',
                field: 'paymentDueDate',
                sort: 'asc',
                width: 250
            },
            {
                label: 'Fecha de pago',
                field: 'paymentDate',
                sort: 'asc',
                width: 250
            },
            {
                label: 'Concepto',
                field: 'concep',
                sort: 'asc',
                width: 200
            },
            {
                label: 'Importe',
                field: 'payment',
                sort: 'asc',
                width: 200
            },
            {
                label: 'Pago',
                field: 'actualPayment',
                sort: 'asc',
                width: 200
            },
        ],
        // rows: [...credits],
        rows: rows
    };

    function getSymbolTypeCurrency() {
        return (creditSelected?.typeCurrency == 'peso') ? '$' : '$USD';
    }

    function getDate(date:Date){
        const year = date.getUTCFullYear();
        const month = (date.getUTCMonth()+1<10)?`0${date.getUTCMonth()+1}`: date.getUTCMonth()+1;
        const day = (date.getUTCDate()<10)?`0${date.getUTCDate()}`: date.getUTCDate();
        return `${day}-${month}-${year}`
         
    }

    async function getDetailPayments() {
        dispatch(setIsLoading(true))
        dispatch(setPaymentsDetail([]));
        if (creditSelected && selectedCreditHistoryId) {
            await dispatch(getById(creditSelected.id));
            await dispatch(getPaymentsDetail(selectedCreditHistoryId));
        }
    }

    useEffect(() => {
        getDetailPayments()
    }, [selectedCreditHistoryId])


    return (
        <Modal size='xl' show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title><h3>Detalle de los Pagos</h3></Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="p-2">
                    {isLoading ?
                        <Loading /> :
                        <TableResponsive columns={data.columns} rows={data.rows} />
                    }
                </div>
            </Modal.Body>
        </Modal >
    )
};

export default PersonalCreditPaymentsDetail;