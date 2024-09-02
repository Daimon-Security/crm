import { useEffect, useState } from "react";

import { useAppDispatch, useAppSelector } from "../../redux/hooks/hooks";
import { RootState } from "../../redux/store/store";
import DatatablePage from "../table";
import { getById, getPaymentsDetail } from "../../redux/slices/credit-slice";
import { Col, Row } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { MdArrowBack } from "react-icons/md";
import Loading from "../common/loading";
import TableResponsive from "../common/table-responsive";

export const PaymentsDetail = () => {
    const dispatch = useAppDispatch();
    const { id, creditId } = useParams();
    const { paymentsDetail, creditSelected } = useAppSelector((state: RootState) => state.credits);
    const [detailLoaded, setDetailLoaded] = useState<boolean>(false);


    const rows = paymentsDetail.map((payment, index) => ({
        id: index + 1,
        paymentDueDate: payment.paymentDueDate.split('T')[0],
        paymentDate: (payment.paymentDate) ? payment.paymentDate.split('T')[0] : '-',
        concep: payment.paymentType,
        payment: getSymbolTypeCurrency()+ " "+payment.payment,
        actualPayment: getSymbolTypeCurrency()+" "+((payment.actualPayment) ? payment.actualPayment : '0.00'),
        balance: getSymbolTypeCurrency()+payment.balance
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
            {
                label: 'Saldo',
                field: 'balance',
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

    async function getDetail() {
        if (id && creditId) {
            await dispatch(getById(creditId));
            await dispatch(getPaymentsDetail(id));
            setDetailLoaded(true);
        }
    }

    useEffect(() => {
        getDetail()
    }, [id])

    if (!detailLoaded) {
        return <Loading /> // Puedes mostrar un indicador de carga
    }

    return (
        
        <div className="p-2">
            <Row className="border-top border-bottom p-2 mb-4 align-items-center d-flex justify-content-start">
                <Col xs={1}>
                    <Link to={`/credit/${creditSelected?.id}/detail`}>
                        <MdArrowBack size={30} color="grey" />
                    </Link>
                </Col>
                <Col xs={11}>
                    <h3>Detalle de los Pagos</h3>
                </Col>
            </Row>

            <TableResponsive columns={data.columns} rows={data.rows} />
        </div>
    )
};

export default PaymentsDetail;