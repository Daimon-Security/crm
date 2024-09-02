import { Link, useLocation, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/hooks";
import { useEffect, useState } from "react";
import { RootState } from "../../redux/store/store";
import { getcollectionsAccountedHistory } from "../../redux/slices/report-slice";
import CollectionsDetailList from "./collections-detail-list";
import Loading from "../common/loading";
import { Col, Row } from "react-bootstrap";
import { MdArrowBack } from "react-icons/md";
import useNumberFormatter from "../../redux/hooks/useNumberFormatter";

interface DetailPaymentCommission {
    totalAccountabilityPeso: number,
    totalAccountabilityDollar: number
}

export const CollectionsAccountedHistory = () => {
    const dispatch = useAppDispatch();
    const { id, previous, type } = useParams();
    const location = useLocation();
    const route = location.pathname;
    const formatNumber = useNumberFormatter();
    const { reportCollectionsCommissionsDetails, start, end, isLoading } = useAppSelector((state: RootState) => state.reports);
    const [detailCollectionsAccountabilityTotal, setDetail] = useState<DetailPaymentCommission>({
        totalAccountabilityPeso: 0,
        totalAccountabilityDollar: 0
    });
    const columnsTotal = [
        {
            label: 'Rendido',
            field: 'totalAccountability',
            sort: 'asc',
            //width: 250
        },

    ];
    const rowsTotalPesos = [{
        totalAccountability: formatNumber(detailCollectionsAccountabilityTotal.totalAccountabilityPeso),
    }
    ];
    const rowsTotalDollar = [{
        totalAccountability: formatNumber(detailCollectionsAccountabilityTotal.totalAccountabilityDollar),
    }
    ];
    function getTotal() {
        let detailTotal: DetailPaymentCommission = {
            totalAccountabilityPeso: 0,
            totalAccountabilityDollar: 0
        }
        reportCollectionsCommissionsDetails?.detailsReport.forEach((detail: any) => {
            if (detail.typeCurrency == 'dolar') detailTotal.totalAccountabilityDollar = detailTotal.totalAccountabilityDollar + parseFloat(detail.payment);
            if (detail.typeCurrency == 'peso') detailTotal.totalAccountabilityPeso = detailTotal.totalAccountabilityPeso + parseFloat(detail.payment);
        });
        setDetail(detailTotal);
    }

    function getTitle() {
        return (type == '1') ? `Rendiciones Créditos Personales` :
            `Rendiciones de Créditos por Ventas`
    }

    async function getDetail() {
        if (id) {
            let startDate: string | null = start;
            let endDate: string | null = end;
            if (route == `/collections-accounted/${type}/${id}/history`) {
                startDate = null;
                endDate = null;
            }
            if (type) await dispatch(getcollectionsAccountedHistory(id, startDate, endDate, type));
        }
    }

    function goBack() {
        console.log("previous: ", previous);
        if (previous != 'commissions') {
            return `/charges-collections/${type}`
        } else {
            return `/commissions/${type}`
        }
    }

    useEffect(() => {
        getTotal();
    }, [reportCollectionsCommissionsDetails])

    useEffect(() => {
        getDetail()
    }, [id])

    if (isLoading) {
        return <Loading /> // Puedes mostrar un indicador de carga
    }

    return (
        <div className="px-2">
            <Row className="border-top border-bottom p-2 mb-4 align-items-center d-flex justify-content-beetwen">
                <h4>{getTitle()}</h4>
            </Row>
            <Row className="border-top border-bottom p-2 mb-4 align-items-center d-flex justify-content-beetwen">
                <Col lg={1} xs={2}>
                    <Link className="bg-transparent border-0" to={goBack()}>
                        <MdArrowBack size={30} color="grey" />
                    </Link>
                </Col>
                <Col lg={11} xs={9} className="d-flex justify-content-center text-center row">
                    <Col lg={12} xs={12}>
                        <h3>{`Historial de ${reportCollectionsCommissionsDetails?.debtCollectorName}`}</h3>
                    </Col>
                    <Col lg={12} xs={12} className='row d-flex justify-content-center'>
                        {route !== `/collections-accounted/${type}/${id}/history` ? <h3 className='d-none d-lg-block col-6'>{start}- {end}</h3> : ('')}
                    </Col>
                    {route !== `/collections-accounted/${type}/${id}/history` ?
                        < Col xs={12} className="d-lg-none row d-flex">
                            <h3>{start} </h3>
                            <h3>{end} </h3>
                        </Col> : ('')
                    }


                </Col>
            </Row >
            {
                reportCollectionsCommissionsDetails?.detailsReport ?
                    <CollectionsDetailList
                        collections={reportCollectionsCommissionsDetails?.detailsReport}
                        columnsTotal={columnsTotal}
                        rowsTotalPesos={rowsTotalPesos}
                        rowsTotalDollar={rowsTotalDollar}
                        title={getTitle()}
                        start={start}
                        end={end}

                    /> : ('')
            }
        </div>
    )
};

export default CollectionsAccountedHistory;