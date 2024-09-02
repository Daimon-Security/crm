import { Link, useParams } from "react-router-dom";
import { CommissionTotal } from "../../entities/dto/commission-total";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/hooks";
import { RootState } from "../../redux/store/store";
import { MdArticle } from "react-icons/md";
import { useEffect, useState } from "react";
import { getCommissionsTotal, setRangeDate } from "../../redux/slices/report-slice";
import { Col, Row } from "react-bootstrap";
import TableResponsive from "../common/table-responsive";
import Loading from "../common/loading";
import useNumberFormatter from "../../redux/hooks/useNumberFormatter";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export const CommissionsTotalDebtCollector = () => {
    const dispatch = useAppDispatch();
    const { type } = useParams();
    const formatNumber = useNumberFormatter();
    const { isLoading } = useAppSelector((state: RootState)=> state.loading);
    const { commissions } = useAppSelector((state: RootState) => state.reports);
    const previous = 'commissions'

    const rows = commissions.map((detail: CommissionTotal, index: number) => ({
        id: index + 1,
        debtCollector: detail.debtCollectorName,
        totalCommissionRecoveryPesos: formatNumber(detail.commissionsRecoveryPesos),
        totalCommissionRecoveryDollar: formatNumber(detail.commissionsRecoveryDollar),
        action: (
            <>
                <Link to={`/commissions/${type}/${detail.debtCollectorId}/detail`}>
                    <button className="btn btn-success me-2 mb-1 col-lg-3 col-9" onClick={() => {
                        dispatch(setRangeDate({ start: null, end: null }))
                    }}>Ir a pagar</button>
                </Link>
                <Link to={`/collections/${type}/${detail.debtCollectorId}/detail/${previous}`}>
                    <button className="btn btn-primary me-2 mb-1 col-lg-3 col-9"  onClick={() => {
                        dispatch(setRangeDate({ start: null, end: format(new Date(), 'dd-MM-yyyy', { locale: es }) }))
                    }}>Rendiciones</button>
                </Link>
                <Link to={`/commissions/${type}/${detail.debtCollectorId}/history`}>
                    <button className="btn btn-success me-1 mb-1 col-lg-3 col-9">Historial</button>
                </Link>
            </>
        ),
    }));

    const columns = [
        {
            label: '#',
            field: 'id',
            sort: 'asc',
            //width: 100
        },
        {
            label: 'Cobrador/a',
            field: 'debtCollector',
            sort: 'asc',
            //width: 250
        },
        {
            label: 'A cobrar $',
            field: 'totalCommissionRecoveryPesos',
            sort: 'asc',
            //width: 250
        },
        {
            label: 'A cobrar en $USD',
            field: 'totalCommissionRecoveryDollar',
            sort: 'asc',
        },
        {
            label: 'Action',
            field: 'action',
            sort: 'asc',
        }
    ];

    function getTitle(){
        return (type == '1') ? `Pago de comisiones por Créditos Personales`: 'Pago de comisiones por Créditos por Ventas';
    }

    async function getCommissions() {
        if(type)await dispatch(getCommissionsTotal(type));
    }

    useEffect(() => {
        getCommissions();
    }, [])

    if (isLoading) {
        return <Loading /> // Puedes mostrar un indicador de carga
    }

    return (
        <div className="px-2">
            <Row className="border-top border-bottom p-2 mb-4 align-items-center d-flex justify-content-beetwen">
                <Col lg={12} xs={12} className="d-flex justify-content-center text-center row">
                    <Col lg={12} xs={12}>
                        <h3>{getTitle()}</h3>
                    </Col>
                </Col>
            </Row>

            <TableResponsive columns={columns} rows={rows} />
        </div>
    )
};

export default CommissionsTotalDebtCollector