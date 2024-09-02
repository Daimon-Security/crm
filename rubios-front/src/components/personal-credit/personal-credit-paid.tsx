import { CollectionDto } from "../../entities/dto/collection-dto";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/hooks";
import { cancelRegisteredPayment, cancelRegisteredPaymentInterest, getById, getCollections, getCollectionsByClientName, getCollectionsPaid, getSearchCollections, registerCancellationInterestPrincipal, registerPayment, reschedulePayment, setClientId, setCreditSelected, setSelectedCollection } from "../../redux/slices/credit-slice";
import { RootState } from "../../redux/store/store";
import MyCollections from "../my-collections/my-collections"
import { StatusPayment } from '../../entities/dto/payment-detail-create-dto';
import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import PersonalCreditDetail from "./personal-credit-detail";
import MyPaid from "../my-collections/my-paid";

export const PersonalCreditPaid = () => {
    const dispatch = useAppDispatch();
    const { collectionsPaid, dateQuery, selectedCollection, type, paymentFrequencies, filterClientName, clientId } = useAppSelector((state: RootState) => state.credits);
    const [apply, setApply] = useState<boolean>(false);    
    const [showCreditDetail, setShowCreditDetail] = useState<boolean>(false);
    const statusCredits: any = [
        { value: 1, label: 'Activo' },
        { value: 2, label: 'Cancelado' },
        { value: 3, label: 'Moroso' },
        { value: 4, label: 'Incobrable' }
    ]

    function getCredit(id: number) {
        setShowCreditDetail(true);
        dispatch(getById(id.toString()))
    }


    return (
        <>
            <MyPaid
                collections={collectionsPaid}
                dateQuery={dateQuery}
                selectedCollection={selectedCollection}
                type={type}
                paymentFrequencies={paymentFrequencies}
                statusCredits={statusCredits}
                setSelectedCollection={(collection: CollectionDto) => { dispatch(setSelectedCollection(collection)) }}
                getCollections={(date: any) => { dispatch(getCollectionsPaid(date)) }}
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
                getDetailCredit={(id: number)=>getCredit(id)}
            />
            <Modal size='xl' show={showCreditDetail} onHide={() => {
                setShowCreditDetail(false);
                dispatch(setCreditSelected(null)) }}>
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body>
                    <PersonalCreditDetail setShowDetail={() => { }} hide={true} activeTab="history" />
                </Modal.Body>
            </Modal >
        </>

    )
};

export default PersonalCreditPaid;