import { MdArrowBack, MdCheck, MdClose } from 'react-icons/md';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import TableResponsive from '../common/table-responsive';
import { useAppDispatch, useAppSelector } from '../../redux/hooks/hooks';
import { RootState } from '../../redux/store/store';
import { useLocation, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import '../styles.css';
import { Button, Col, Row } from 'react-bootstrap';
import { getCollectionsAndCommissionsDetail, getCommissionCreditDetail, registerCommissionsPayments, registerSurrenderPayments, setRangeDate } from '../../redux/slices/report-slice';
import { Link } from 'react-router-dom';
import Loading from '../common/loading';
import TotalTableResponsive from '../accountability-collections/total-table-responsive-collections';
import CustomMessage from '../common/custom-message/custom-message';
import { CustomMessageProps } from '../../entities/custom-message';
import { DetailCollectionDto } from '../../entities/dto/collections-detail-dto';
import DetailTable from '../accountability-collections/detail-table';
import { PaymentDetail } from '../../entities/payment-detail';
import { CommissionCreditDto } from '../../entities/dto/commission-credit-dto';
import CommissionsDetailList from './commissions-detail-list';
import useNumberFormatter from '../../redux/hooks/useNumberFormatter';
import { startLoading } from '../../redux/slices/loading-slice';

interface DetailPaymentCommission {
    totalCommissionPeso: number;
    totalCommissionDollar: number
}

export const CommissionsCreditsDetail = () => {
    const dispatch = useAppDispatch();
    const { id, type } = useParams();
    const formatNumber = useNumberFormatter();
    const { isLoading } = useAppSelector((state: RootState) => state.loading);
    const { commissionsCredits, start, end } = useAppSelector((state: RootState) => state.reports);
    const [customMessage, setCustomMessage] = useState<CustomMessageProps | null>(null)
    const [showModal, setShowModal] = useState(false);
    const [detailPaymentcommission, setDetail] = useState<DetailPaymentCommission>({
        totalCommissionPeso: 0,
        totalCommissionDollar: 0
    });
    const columnsTotal = [{
        label: 'Comisión a cobrar',
        field: 'commission',
        sort: 'asc',
        //width: 200
    }];
    const rowsTotalPesos = [{
        commission: formatNumber(detailPaymentcommission?.totalCommissionPeso),
    }
    ];

    const rowsTotalDollar = [{
        commission: formatNumber(detailPaymentcommission?.totalCommissionDollar),
    }
    ];

    function getTotal() {
        let detailTotal: DetailPaymentCommission = {
            totalCommissionPeso: 0,
            totalCommissionDollar: 0
        }
        commissionsCredits?.creditsDetailCommission.forEach((detail: any) => {
            if (detail.typeCurrency == 'peso') detailTotal.totalCommissionPeso = detailTotal.totalCommissionPeso + parseFloat(detail.commission);
            if (detail.typeCurrency == 'dolar') detailTotal.totalCommissionDollar = detailTotal.totalCommissionDollar + parseFloat(detail.commission);
        });
        setDetail(detailTotal);
    }



    async function getDetail() {
        if (id && type) {
            await dispatch(getCommissionCreditDetail(id, type));;
            //setDetailLoaded(true);
        }
    }

    function handleCloseCustomMessageModal() {
        setShowModal(false);
    }

    function getMessageModal(operation: string) {
        return `Comisión a cobrar:  
                $ ${rowsTotalPesos[0].commission} - $USD ${rowsTotalDollar[0].commission} 
                ¿confirmas el registro del pago de la comisión?`
    }

    async function registerPaymentsCommissions(id: string) {
        if (type) await dispatch(registerCommissionsPayments(id, type));
        handleCloseCustomMessageModal()
        getDetail();
    }

    function getInfoBtnAcceptsModal(operation: string) {
        return {
            btn: 'Confirmar',
            operation: () => { if (id) registerPaymentsCommissions(id) }
        }
    }


    function handleOpenCustomMessageModal(operation: string) {
        var detailCustomMessage: CustomMessageProps;
        setShowModal(true)
        const btnAcceptOperation = getInfoBtnAcceptsModal(operation);
        console.log("estoy aqui");
        detailCustomMessage = {
            title: `Pago de comisiones a ${commissionsCredits?.debtCollectorName}`,
            message: getMessageModal(operation),
            acceptBtnName: btnAcceptOperation.btn,
            cancelBtnName: 'Cancelar',
            onCloseModal: () => handleCloseCustomMessageModal(),
            operation: btnAcceptOperation.operation,
            typeOperation: 'add',
        };
        setCustomMessage(detailCustomMessage);
    }

    useEffect(() => {
        getTotal();
    }, [commissionsCredits])

    useEffect(() => {
        getDetail();
    }, [id]);

    if (isLoading) {
        return <Loading /> // Puedes mostrar un indicador de carga
    }

    return (
        <>
            {commissionsCredits ?
                <CommissionsDetailList
                    creditsDetailCommission={commissionsCredits?.creditsDetailCommission}
                    columnsTotal={columnsTotal}
                    rowsTotalPesos={rowsTotalPesos}
                    rowsTotalDollar={rowsTotalDollar}
                    title={`${commissionsCredits?.debtCollectorName}`}
                />
                : ('')
            }

            {
                commissionsCredits && commissionsCredits?.creditsDetailCommission.length > 0 ?
                    <Row className="border-top border-bottom p-2 mb-4 align-items-center d-flex justify-content-evenly">
                        {

                            <Col lg={4} xs={12} className="d-flex justify-content-center text-center row py-2">
                                {(commissionsCredits?.creditsDetailCommission.length == 0) ?
                                    <button className="btn btn-success me-1" disabled>Comisión pagada</button> :
                                    <button className="btn btn-danger me-1" onClick={() => handleOpenCustomMessageModal('PaymentCommission')}>Pagar comisión</button>
                                }
                            </Col>
                        }

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
        </>
    );
};
export default CommissionsCreditsDetail;