import { MdArrowBack, MdCheck, MdClose } from 'react-icons/md';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import TableResponsive from '../common/table-responsive';
import { useAppDispatch, useAppSelector } from '../../redux/hooks/hooks';
import { RootState } from '../../redux/store/store';
import { useLocation, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import '../styles.css';
import { Button, Col, Row } from 'react-bootstrap';
import { getCollectionsAndCommissionsDetail, registerSurrenderPayments, setRangeDate } from '../../redux/slices/report-slice';
import { Link } from 'react-router-dom';
import Loading from '../common/loading';
import TotalTableResponsive from './total-table-responsive-collections';
import CustomMessage from '../common/custom-message/custom-message';
import { CustomMessageProps } from '../../entities/custom-message';
import { DetailCollectionDto } from '../../entities/dto/collections-detail-dto';
import DetailTable from './detail-table';
import { PaymentDetail } from '../../entities/payment-detail';
import CollectionsDetailList from './collections-detail-list';
import useNumberFormatter from '../../redux/hooks/useNumberFormatter';
import { ReportCollectionsCommissionsDto } from '../../entities/dto/report-collections-commissions-dto';
import { EditPaymentModal } from './edit-payment';

interface DetailPaymentCommission {
    totalReceivablePesos: number;
    totalReceivableDollar: number;
    totalCollectedPesos: number
    totalCollectedDollar: number
}


export const CollectionsAccountDetail = () => {
    const dispatch = useAppDispatch();
    const { id, previous, type } = useParams();
    const location = useLocation();
    const route = location.pathname;
    const formatNumber = useNumberFormatter();
    const { reportCollectionsCommissionsDetails, start, end, isLoading } = useAppSelector((state: RootState) => state.reports);
    const [detailPaymentcommission, setDetail] = useState<DetailPaymentCommission>({
        totalReceivablePesos: 0,
        totalReceivableDollar: 0,
        totalCollectedPesos: 0,
        totalCollectedDollar: 0
    });
    const [customMessage, setCustomMessage] = useState<CustomMessageProps | null>(null)
    const [showModal, setShowModal] = useState(false);
    const [statusPayments, setStatusPayments] = useState('all');
    const [detailCollections, setDetailCollections] = useState<any | null>(null);


    async function registerSurrender(id: string) {
        console.log("id riendiendo: ", id);
        if (type) await dispatch(registerSurrenderPayments(id, start, end, type));
        handleCloseCustomMessageModal()
        //getDetail();
    }

    const columnsTotal = [
        {
            label: 'No Cobrado',
            field: 'totalReceivable',
            sort: 'asc',
            //width: 250
        },
        {
            label: 'Cobrado',
            field: 'totalCollected',
            sort: 'asc',
            //width: 250
        },

    ];

    const rowsTotalPesos = [{
        totalReceivable: formatNumber(detailPaymentcommission.totalReceivablePesos),
        totalCollected: formatNumber(detailPaymentcommission.totalCollectedPesos),
    }
    ];

    const rowsTotalDollar = [{
        totalReceivable: formatNumber(detailPaymentcommission.totalReceivableDollar),
        totalCollected: formatNumber(detailPaymentcommission.totalCollectedDollar),
    }
    ];

    function getTotal(collections: any) {
        console.log("collections: ", collections);
        let detailTotal: DetailPaymentCommission = {
            totalReceivablePesos: 0,
            totalReceivableDollar: 0,
            totalCollectedPesos: 0,
            totalCollectedDollar: 0
        }


        collections?.forEach((detail: any) => {
            console.log("detail payment: ", detail);
            if (detail.typeCurrency == 'dolar' && detail.paymentDate != null) detailTotal.totalCollectedDollar = detailTotal.totalCollectedDollar + parseFloat(detail.actualPayment);
            if (detail.typeCurrency == 'peso' && detail.paymentDate != null) detailTotal.totalCollectedPesos = detailTotal.totalCollectedPesos + parseFloat(detail.actualPayment);
            if (detail.typeCurrency == 'dolar' && detail.paymentDate == null) detailTotal.totalReceivableDollar = detailTotal.totalReceivableDollar + parseFloat(detail.payment);
            if (detail.typeCurrency == 'peso' && detail.paymentDate == null) detailTotal.totalReceivablePesos = detailTotal.totalReceivablePesos + parseFloat(detail.payment);
        });
        setDetail(detailTotal);
    }

    function getTitle() {
        return (type == '1') ? 'Rendiciones Créditos Personales' : 'Rendiciones Créditos por Ventas';
    }

    async function getDetail() {
        if (id) {
            let startDate: string | null = start;
            let endDate: string | null = end;
            // if (previous == 'commissions') {
            //     startDate = null;
            //     endDate = new Date().toString();
            // }
            if (type) await dispatch(getCollectionsAndCommissionsDetail(id, startDate, endDate, type));
        }
    }

    function handleCloseCustomMessageModal() {
        setShowModal(false);
    }

    function getMessageModal(operation: string) {
        if (rowsTotalPesos[0].totalCollected == '0.00' && rowsTotalDollar[0].totalCollected == '0.00') {
            return `no tiene cobros pendientes de rendición.`
        } else {
            return `Cobros:  
                $ ${rowsTotalPesos[0].totalCollected} - $USD ${rowsTotalDollar[0].totalCollected} 
                ¿confirmas el registro de la rendición de cobros?`
        }
    }

    function getInfoBtnAcceptsModal(operation: string) {
        console.log("rowsTotalPesos[0].totalCollected:  ", rowsTotalPesos[0].totalCollected);
        console.log("rowsTotalDollar[0].totalCollected:  ", rowsTotalDollar[0].totalCollected)
        if (rowsTotalPesos[0].totalCollected == '0.00' && rowsTotalDollar[0].totalCollected == '0.00') {
            return {
                btn: 'Aceptar',
                operation: () => handleCloseCustomMessageModal()
            }
        } else {
            return {
                btn: 'Confirmar',
                operation: () => { if (id) registerSurrender(id) },
            }
        }
    }


    function handleOpenCustomMessageModal(operation: string) {
        var detailCustomMessage: CustomMessageProps;
        setShowModal(true)
        const btnAcceptOperation = getInfoBtnAcceptsModal(operation);
        detailCustomMessage = {
            title: `Rendición de cobros de ${reportCollectionsCommissionsDetails?.debtCollectorName}`,
            message: getMessageModal(operation),
            acceptBtnName: btnAcceptOperation.btn,
            cancelBtnName: 'Cancelar',
            onCloseModal: () => handleCloseCustomMessageModal(),
            operation: btnAcceptOperation.operation,
            typeOperation: 'add',
        };
        setCustomMessage(detailCustomMessage);
    }

    function goBack() {
        console.log("previous: ", previous);
        if (previous != 'commissions') {
            return `/charges-collections/${type}`
        } else {
            return `/commissions/${type}`
        }
    }

    function filterByStatusPaymentsCollections(status: string) {
        var collectionsPayments: any = [];
        switch (status) {
            case 'all':
                collectionsPayments = reportCollectionsCommissionsDetails?.detailsReport;
                break;
            case 'pending':
                collectionsPayments = reportCollectionsCommissionsDetails?.detailsReport.filter(x => x.paymentDate == null);
                break;
            case 'not-pending':
                collectionsPayments = reportCollectionsCommissionsDetails?.detailsReport.filter(x => x.paymentDate != null);
                break;
            default:
        }
        setDetailCollections(collectionsPayments);

    }


    useEffect(() => {
        const newPaymentsCollections = reportCollectionsCommissionsDetails?.detailsReport;
        setDetailCollections(newPaymentsCollections);
        getTotal(newPaymentsCollections);
    }, [reportCollectionsCommissionsDetails])

    // useEffect(() => {
    //     getTotal();
    // }, [detailCollections])

    useEffect(() => {
        console.log("useEffect")
        getDetail();
    }, [id]);

    if (isLoading) {
        return <Loading /> // Puedes mostrar un indicador de carga
    }

    return (
        <div className='px-2'>
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
                        <h3>{`${reportCollectionsCommissionsDetails?.debtCollectorName}`}</h3>
                    </Col>
                    <Col lg={12} xs={12} className='row d-flex justify-content-center'>
                        {route !== `/collections-accounted/${type}/${id}/history` && previous != 'commissions' ? <h3 className='d-none d-lg-block col-6'>
                            {start ?
                                <span> {start}- {end}</span> :
                                <span> al {end}</span>
                            }

                        </h3> : ('')}
                    </Col>
                    {route !== `/collections-accounted/${type}/${id}/history` && previous != 'commissions' ?
                        < Col xs={12} className="d-lg-none row d-flex">
                            <h3>{start} </h3>
                            <h3>{end} </h3>
                        </Col> : ('')
                    }


                </Col>
            </Row >

            <Row className='d-flex justify-content-center my-2 align-items-center px-3'>
                <Col lg={3} className='d-flex justify-content-start mb-3'>
                    <label htmlFor="status" className="form-label fs-5 fw-bold me-2">Cuotas:</label>
                    <select
                        id="type"
                        className="form-control"
                        value={statusPayments}
                        onChange={(e) => {
                            setStatusPayments(e.target.value);
                            filterByStatusPaymentsCollections(e.target.value)
                        }}
                    >
                        <option key='all' value='all'>Todas</option>
                        <option key='pending' value='pending'>Pendientes</option>
                        <option key='mot-pending' value='not-pending'>Cobradas</option>
                    </select>
                </Col>
            </Row>
            {
                detailCollections ?
                    <CollectionsDetailList
                        collections={detailCollections}
                        columnsTotal={columnsTotal}
                        rowsTotalPesos={rowsTotalPesos}
                        rowsTotalDollar={rowsTotalDollar}
                        title={getTitle()}
                        start={start}
                        end={end}
                    /> : ('')
            }
            {
                detailCollections && detailCollections.length > 0 &&  reportCollectionsCommissionsDetails?.userRole == 'debt-collector'?
                    <Row className="border-top border-bottom p-2 mb-4 align-items-center d-flex justify-content-evenly">

                        <Col lg={4} xs={12} className="d-flex justify-content-center text-center row py-2">
                            {
                                (detailCollections.filter((x: any) => x.accountabilityDate != '').length == 0) ?
                                    <button className="btn btn-success me-1" disabled>Pagos rendidos</button> :
                                    <button className="btn btn-danger me-1" onClick={() => handleOpenCustomMessageModal('recordAccounted')}>Rendir pagos</button>
                            }
                        </Col>

                    </Row> : ('')
            }

            {customMessage ?
                <CustomMessage
                    title={customMessage?.title}
                    message={customMessage?.message}
                    acceptBtnName={customMessage?.acceptBtnName}
                    cancelBtnName={customMessage?.cancelBtnName}
                    onCloseModal={customMessage?.onCloseModal}
                    operation={customMessage?.operation}
                    showModal={showModal}
                    typeOperation={customMessage?.typeOperation}
                /> : ('')
            }
        </div>
    );
};
export default CollectionsAccountDetail;