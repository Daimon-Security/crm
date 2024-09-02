import { MdArrowBack, MdCheck, MdClose, MdEdit } from "react-icons/md";
import { DetailCollectionDto } from "../../entities/dto/collections-detail-dto";
import DetailTable from "./detail-table";
import TotalTableResponsive, { TotalTableResponsiveCollections } from "./total-table-responsive-collections";
import TableResponsive from "../common/table-responsive";
import useNumberFormatter from "../../redux/hooks/useNumberFormatter";
import { useState } from "react";
import { EditPaymentModal } from "./edit-payment";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/hooks";
import { cancelPayment as cancelPaymentPersonalCredit, cancelRegisteredPayment as cancelRegisteredPaymentPersonalCredit, setSelectedCollection as setSelectCollectionPersonalCredit, updatePayment as updatePaymentPersonalCredit } from "../../redux/slices/credit-slice";
import { cancelPayment as cancelPaymentSaleCredit, cancelRegisteredPayment as cancelRegisteredPaymentSaleCredit, setSelectedCollection as setSelectCollectionSaleCredit, updatePayment as updatePaymentSalePersonalCredit } from "../../redux/slices/sale-credit-slice";
import { RootState } from "../../redux/store/store";

interface CollectionsDetailListProps {
    collections: DetailCollectionDto[],
    columnsTotal: any,
    rowsTotalPesos: any,
    rowsTotalDollar: any,
    title: string,
    start: string,
    end: string
}
export const CollectionsDetailList = ({ collections, columnsTotal, rowsTotalPesos, rowsTotalDollar, title, start, end }: CollectionsDetailListProps) => {
    const dispatch = useAppDispatch();
    const { id, type } = useParams();
    const formatNumber = useNumberFormatter();
    const [showEditPayment, setShowEditPayment] = useState(false);
    const [showCustomMessage, setShowCustomMessage] = useState<boolean>(false);
    const [paymentDetail, setPaymentDetail] = useState<DetailCollectionDto | null>(null);
    const [payment, setPayment] = useState(0);
    const { isLoading } = useAppSelector((state: RootState) => state.loading);
    const [paymentId, setPaymentId] = useState<string>();
    const [operationType, setOperationType] = useState<string>('');
    const columns = [
        {
            label: '#',
            field: 'id',
            sort: 'asc',
            //width: 100
        },
        {
            label: 'Cliente',
            field: 'client',
            sort: 'asc',
            //width: 250
        },
        {
            label: 'Vto Pago',
            field: 'paymentDueDate',
            sort: 'asc',
            //width: 250
        },
        {
            label: 'Concepto',
            field: 'paymentType',
            sort: 'asc',
            //width: 200
        },
        {
            label: 'Importe',
            field: 'payment',
            sort: 'asc',
            //width: 200
        },
        {
            label: 'Pago',
            field: 'actualPayment',
            sort: 'asc',
            //width: 200
        },
        {
            label: 'Estado Cuota',
            field: 'status',
            sort: 'asc',
            //width: 200
        },
        {
            label: 'Fecha de rendición',
            field: 'accountabilityDate',
            sort: 'asc',
            //width: 200
        },
        {
            label: 'Acción',
            field: 'action',
            sort: 'asc',
            //width: 200
        },
    ];

    const rowsPaymentPesos: any = collections.filter((x) => x.typeCurrency == 'peso').map((detail: DetailCollectionDto, index: number) => ({
        id: index + 1,
        client: detail.client,
        paymentDueDate: detail.paymentDueDate,
        concept: detail.paymentType + (detail.number ? ` - Nº ${detail.number}` : ''),
        payment: formatNumber(detail.payment),
        actualPayment: formatNumber(detail.actualPayment),
        status: (detail.paymentDate) ?
            <MdCheck size={20} color='green' /> :
            <MdClose size={20} color='red' />,
        accountabilityDate: detail.accountabilityDate,
        action: (
            <>
                {
                    detail.actualPayment != 0.00 ?
                        <>
                            <button className="btn btn-danger me-1 btn-sm col-lg-4 col-6"
                                onClick={() => handleOpenCustomMessageModal(detail, (detail.paymentType == 'cuota' ? 'cancelRegisteredPayment' : 'cancelRegisteredPaymentInterest'))}
                            >Cancelar pago</button>
                            <button className="btn btn-success btn-sm ms-1 col-lg-4 col-6" onClick={() => { openModal(detail) }}>Editar pago</button>
                        </> : ('-')
                }
            </>
        )

    }));


    const rowsPaymentDollar: any = collections.filter(x => x.typeCurrency == 'dolar').map((detail: DetailCollectionDto, index: number) => ({
        id: index + 1,
        client: detail.client,
        paymentDueDate: detail.paymentDueDate,
        concept: detail.paymentType + (detail.number ? ` - Nº ${detail.number}` : ''),
        payment: formatNumber(detail.payment),
        actualPayment: formatNumber(detail.actualPayment),
        status: (detail.paymentDate) ?
            <MdCheck size={20} color='green' /> :
            <MdClose size={20} color='red' />,
        accountabilityDate: detail.accountabilityDate,
        action: (
            <>
                {
                    detail.actualPayment != 0.00 ?
                        <>
                            <button className="btn btn-danger me-1 btn-sm col-lg-4 col-12"
                                onClick={() => handleOpenCustomMessageModal(detail, (detail.paymentType == 'cuota' ? 'cancelRegisteredPayment' : 'cancelRegisteredPaymentInterest'))}
                            >Cancelar pago</button>
                            <button className="btn btn-success btn-sm ms-1 col-lg-4 col-12" onClick={() => { openModal(detail) }}>Editar pago</button>
                        </> : ('-')
                }
            </>
        )
    }));

    function openModal(detail: DetailCollectionDto) {
        setPaymentDetail(detail);
        setPayment(detail.actualPayment);
        setShowEditPayment(true);
    }

    function closeModal() {
        setPaymentDetail(null);
        setShowEditPayment(false);
    }

    function editPayment(paymentUpdate: number) {
        if (type == '1') {
            if (paymentDetail && id) dispatch(updatePaymentPersonalCredit(paymentDetail.id, paymentUpdate, paymentDetail.paymentType, closeModal, start, end, type, id));
        } else {
            if (paymentDetail && id && type) dispatch(updatePaymentSalePersonalCredit(paymentDetail.id, paymentUpdate, paymentDetail.paymentType, closeModal, start, end, type, id));
        }
    }

    function handleOpenCustomMessageModal(detail: DetailCollectionDto, typeOperation: string) {
        setPaymentId(detail?.id);
        (type == '1') ? setSelectCollectionPersonalCredit(detail) : setSelectCollectionSaleCredit(detail);
        setOperationType(typeOperation);
        setShowCustomMessage(true);
    }

    function handleCloseCustomMessageModal() {
        setShowCustomMessage(false);

    };

    function cancelRegisterPayment() {
        if (paymentId && id && type) {
            if (type == '1') {
                dispatch(cancelPaymentPersonalCredit(parseInt(paymentId), start, end, id, type, handleCloseCustomMessageModal, operationType))
            } else {
                dispatch(cancelPaymentSaleCredit(parseInt(paymentId), start, end, id, type, handleCloseCustomMessageModal, operationType));
            }
        }
    }

    return (
        <div>
            <DetailTable
                title="Pesos"
                columnsDetail={columns}
                columnsTotal={columnsTotal}
                rowsDetail={rowsPaymentPesos}
                rowsTotal={rowsTotalPesos}
                commissions={false}
            />
            <div className='d-lg-none bg-table-total'>
                <TableResponsive columns={columnsTotal} rows={rowsTotalPesos} />
            </div>
            <div className='d-flex justify-content-end'>
                <div className='col-8'>
                    <TotalTableResponsiveCollections rows={rowsTotalPesos} />
                </div>
            </div>
            <DetailTable
                title="Dolares"
                columnsDetail={columns}
                columnsTotal={columnsTotal}
                rowsDetail={rowsPaymentDollar}
                rowsTotal={rowsTotalDollar}
                commissions={false}
            />
            <div className='d-lg-none bg-table-total'>
                <TableResponsive columns={columnsTotal} rows={rowsTotalDollar} />
            </div>
            <div className='d-flex justify-content-end'>
                <div className='col-8'>
                    <TotalTableResponsiveCollections rows={rowsTotalDollar} />
                </div>
            </div>
            {
                showEditPayment ?
                    <EditPaymentModal show={showEditPayment} close={closeModal} actualPayment={payment} update={editPayment} isLoading={isLoading} />
                    : ('')
            }
            {
                showCustomMessage ?
                    <div className='modal' style={{ display: showCustomMessage ? 'block' : 'none' }} id="staticBackdrop" aria-labelledby="exampleModalLabel" data-bs-keyboard="false" data-bs-backdrop="static" aria-hidden="true">
                        <div className="modal-dialog  modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="exampleModalLabel">{'Cancelar pago registrado'}</h5>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleCloseCustomMessageModal}></button>
                                </div>
                                <div className="modal-body d-flex justify-content-center">
                                    {isLoading ?
                                        <div className="spinner-border text-primary mt-2" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div> :
                                        <div>¿Confirmas la cancelación del pago?</div>
                                    }
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary col-4" onClick={handleCloseCustomMessageModal} data-bs-dismiss="modal">{'Cancelar'}</button>
                                    <button type="button" className='btn btn-success col-4' onClick={cancelRegisterPayment}>{'Confirmar'}</button>
                                </div>
                            </div>
                        </div>
                    </div> : ('')
            }
        </div>
    )
};

export default CollectionsDetailList;