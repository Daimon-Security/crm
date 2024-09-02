import { useState } from "react";
import { CollectionDto } from "../../entities/dto/collection-dto";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/hooks";
import {
    cancelRegisteredPayment,
    getCollections,
    getCollectionsByClientName,
    getSearchCollections,
    registerCancellationInterestPrincipal,
    registerPayment,
    setClientId,
    setSelectedCollection,
    reschedulePayment,
    cancelRegisteredPaymentInterest,
    getById,
    setCreditSelected
} from "../../redux/slices/sale-credit-slice";
import { RootState } from "../../redux/store/store";
import MyCollections from "../my-collections/my-collections"
import { Modal } from "react-bootstrap";
import SaleCreditDetail from "./sale-credit-detail";

export const SaleCreditMyCollections = () => {
    const dispatch = useAppDispatch();
    const { collections, dateQuery, selectedCollection, type, paymentFrequencies, clientId, filterClientName } = useAppSelector((state: RootState) => state.saleCredits);
    const [apply, setApply] = useState<boolean>(false);
    const [showCreditDetail, setShowCreditDetail] = useState<boolean>(false);
    const statusCredits: any = [
        { value: 1, label: 'Activo' },
        { value: 2, label: 'Cancelado' },
        { value: 3, label: 'Moroso' },
        { value: 4, label: 'Incobrable' },
        { value: 5, label: 'Anulado' }
    ];

    function getCredit(id: number) {
        setShowCreditDetail(true);
        dispatch(getById(id.toString()))
    }


    return (
        <>
            <MyCollections
                collections={collections}
                dateQuery={dateQuery}
                selectedCollection={selectedCollection}
                type={type}
                paymentFrequencies={paymentFrequencies}
                statusCredits={statusCredits}
                setSelectedCollection={(collection: CollectionDto) => { dispatch(setSelectedCollection(collection)) }}
                getCollections={(date: any) => { dispatch(getCollections(date)) }}
                getSearchCollections={(status: any, user: any, typeCurrency: any, startDate: any, endDate: any, statusPayment: any) => { dispatch(getSearchCollections(status, user, typeCurrency, startDate, endDate, statusPayment)) }}
                getCollectionsByClientName={(client: number, date: any) => { dispatch(getCollectionsByClientName(client, date)) }}
                registerCancellationInterestPrincipal={(collectionId: number, inputPayment: number, date: any, firstPayment: any) => { if (dateQuery) dispatch(registerCancellationInterestPrincipal(collectionId, inputPayment, firstPayment, dateQuery.date, filterClientName, clientId)) }}
                registerPayment={(collectionId: number, inputPayment: number) => { if (dateQuery) dispatch(registerPayment(collectionId, inputPayment, dateQuery.date, filterClientName, clientId)) }}
                cancelRegisteredPayment={(collectionId: number) => { if (dateQuery) dispatch(cancelRegisteredPayment(collectionId, dateQuery.date, filterClientName, clientId)) }}
                cancelRegisteredPaymentInterest={(collectionId: number) => { if (dateQuery) dispatch(cancelRegisteredPaymentInterest(collectionId, dateQuery.date, filterClientName, clientId)) }}
                setClientId={(client: number) => dispatch(setClientId(client))}
                apply={apply}
                setApply={setApply}
                reschedulePayment={(id: number, dueDate: Date) => { if (dateQuery) dispatch(reschedulePayment(id, dueDate, filterClientName, clientId, dateQuery.date)) }}
                getDetailCredit={(id: number) => getCredit(id)}
            />
            <Modal size='xl' show={showCreditDetail} onHide={() => {
                setShowCreditDetail(false);
                dispatch(setCreditSelected(null))
            }}>
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body>
                    <SaleCreditDetail setShowDetail={() => { }} hide={true} activeTab="history" />
                </Modal.Body>
            </Modal >
        </>

    )
};

export default SaleCreditMyCollections;