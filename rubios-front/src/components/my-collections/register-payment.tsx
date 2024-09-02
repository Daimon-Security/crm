import { useEffect, useState } from "react";
import CustomMessage from "../common/custom-message/custom-message";
import { CollectionDto } from "../../entities/dto/collection-dto";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/hooks";
import { BodyMessageRegisterPayment } from "./body-message-register-payment";

export interface RegisterPaymentProps {
    show: boolean;
    typeOperation: string;
    closeModal: () => void;
    selectedCollection: CollectionDto,
    dateQuery: any,
    registerCancellationInterestPrincipal: (collectionId: number, inputPayment: number, date: any, firstPayment: any) => void;
    registerPayment: (collectionId: number, inputPayment: number) => void;
    cancelRegisteredPayment: (collectionId: number) => void;
    cancelRegisteredPaymentInterest: (collectionId: number) => void;

}

interface DetailCustomMessageModal {
    title: string;
    message: any;
    operation: () => void;
};

interface CurrentPaymentProps {
    currencyType: any
    interest: number;
    principal: number;
    payment: number;

}

export const RegisterPayment = ({ show, typeOperation, closeModal, selectedCollection, dateQuery, registerCancellationInterestPrincipal,
    registerPayment, cancelRegisteredPayment, cancelRegisteredPaymentInterest }: RegisterPaymentProps) => {
    const dispatch = useAppDispatch();
    const currentPaymentInitial: CurrentPaymentProps = {
        currencyType: '',
        interest: 0,
        principal: 0,
        payment: 0
    };
    const detailModalInitial: DetailCustomMessageModal = {
        title: '',
        message: '',
        operation: () => { }
    };
    const [detailCustomMessageModal, setDetailCustomMessageModal] = useState<DetailCustomMessageModal>(detailModalInitial);
    const [currentPayment, setCurrentPayment] = useState<CurrentPaymentProps>(currentPaymentInitial);
    const [showCustomMessage, setShowCustomMessage] = useState<boolean>(show);
    const [inputPayment, setInputPayment] = useState<number>(0);
    const [register, setRegister] = useState<boolean>(false);
    const [firstPayment, setFirstPayment] = useState<Date | null>(null);
    const [validationDate, setValidationDate] = useState<boolean>(false);
    const [validationPayment, setValidationPayment] = useState<boolean>(false);

    function handleOpenCustomMessageModal() {
        const currentePaymentValues = (selectedCollection) ? getCurrentPaymentValues(selectedCollection) : currentPaymentInitial;
        getDetailCustomMessageModalPayment(typeOperation, currentePaymentValues);
    };

    function handleCloseCustomMessageModal() {
        setRegister(false);
        setShowCustomMessage(false);
        setCurrentPayment(currentPaymentInitial);
        closeModal();
    };

    function getTypeCurrency(type: string) {
        return (type == 'peso') ? '$' : '$USD'
    };

    function getCurrentPaymentValues(collection: CollectionDto) {
        const currentPaymentValues: CurrentPaymentProps = {
            currencyType: getTypeCurrency(collection.typeCurrency),
            interest: collection.interest,
            principal: collection.principal,
            payment: collection.payment
        };
        setCurrentPayment(currentPaymentValues);
        return currentPaymentValues;
    };

    function getInputPayment(payment: number, firstPayment?: any) {
        setInputPayment(payment);
        //console.log("recibiendo fecha: ", firstPayment);
        if (firstPayment) setFirstPayment(firstPayment)

    };

    function getDetailCustomMessageModalPayment(typeOperation: string, currentPaymentValues: CurrentPaymentProps) {
        console.log("currentPaymentValues: ", currentPaymentValues);
        var detailModal = { ...detailModalInitial };
        if (typeOperation == 'cancellationInterest') {
            detailModal.title = 'Pago de intereses';
            detailModal.message = <BodyMessageRegisterPayment
                interest={currentPaymentValues.interest}
                principal={currentPaymentValues.principal}
                currencytype={currentPaymentValues.currencyType}
                getInputPayment={getInputPayment}
                payment={currentPaymentValues.interest}
                operationType={typeOperation}
                balance={selectedCollection.balance}
                setValidationDate={setValidationDate}
                setValidationPayment={setValidationPayment}
                setRegister={setRegister} />;
            detailModal.operation = registerOperation;
        } else if (typeOperation == 'payment') {
            detailModal.title = `Registrar pago de cuota`;
            detailModal.message = <BodyMessageRegisterPayment
                interest={currentPaymentValues.interest}
                principal={currentPaymentValues.principal}
                currencytype={currentPaymentValues.currencyType}
                getInputPayment={getInputPayment}
                payment={currentPaymentValues.payment}
                operationType={typeOperation}
                balance={selectedCollection.balance}
                setValidationDate={setValidationDate}
                setValidationPayment={setValidationPayment}
                setRegister={setRegister} />;
            detailModal.operation = registerOperation;
        }
        else if (typeOperation == 'cancelRegisteredPayment') {
            detailModal.title = 'Cancelar pago registrado';
            detailModal.message = <div>Confirmas la cancelación del pago de la cuota?</div>;
            detailModal.operation = registerOperation;

        } else {
            detailModal.title = 'Cancelar pago registrado';
            detailModal.message = <div>Confirmas la cancelación del pago de interés?</div>;
            detailModal.operation = registerOperation;
        }
        setDetailCustomMessageModal(detailModal);
    };

    function registerOperation() {
        setRegister(true);
    };

    useEffect(() => {
        if (show) handleOpenCustomMessageModal();
    }, [show])

    useEffect(() => {
        console.log("registrando pagos: ", register);
        if (register) {
            const total = parseFloat(currentPayment.principal.toString()) + parseFloat(currentPayment.interest.toString());
            console.log("total: ", total);
            if (!firstPayment) setValidationDate(true);
            if (typeOperation == 'cancellationInterest') {
                console.log("input payment: ", inputPayment);
                if (inputPayment >= total) setValidationPayment(true);
                if (inputPayment > 0 && inputPayment != null && inputPayment < total && firstPayment != null) {

                    if (selectedCollection && dateQuery) {
                        console.log("firstPayment: ", firstPayment);
                        registerCancellationInterestPrincipal(selectedCollection?.id, inputPayment, dateQuery.date, firstPayment);
                        handleCloseCustomMessageModal();
                    }
                }
            } else if (typeOperation == 'payment') {
                if (inputPayment > 0 && inputPayment != null) {
                    if (selectedCollection && dateQuery) {
                        registerPayment(selectedCollection?.id, inputPayment);
                        handleCloseCustomMessageModal();
                    }
                }
            } else if (typeOperation == 'cancelRegisteredPayment') {
                if (selectedCollection && dateQuery) {
                    cancelRegisteredPayment(selectedCollection?.id);
                    handleCloseCustomMessageModal();
                }
            } else {
                if (selectedCollection && dateQuery) {
                    cancelRegisteredPaymentInterest(selectedCollection?.id);
                    handleCloseCustomMessageModal();
                }
            }
        }
    }, [register])

    return (

        <div className='modal' style={{ display: showCustomMessage ? 'block' : 'none' }} id="staticBackdrop" aria-labelledby="exampleModalLabel" data-bs-keyboard="false" data-bs-backdrop="static" aria-hidden="true">
            <div className="modal-dialog  modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">{detailCustomMessageModal.title}</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleCloseCustomMessageModal}></button>
                    </div>
                    <div className="modal-body">
                        {detailCustomMessageModal.message}
                    </div>
                    <div className="px-3">
                        {
                            validationDate ?
                                <h6 className="col-12 text-danger mt-2">*Seleccione la fecha del próximo pago.</h6> : ('')
                        }
                        {
                            validationPayment ?
                                <h6 className="col-12 text-danger mt-2">*El importe deber ser menor a la deuda total.</h6> : ('')
                        }
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary col-4" onClick={handleCloseCustomMessageModal} data-bs-dismiss="modal">{'Cancelar'}</button>
                        <button type="button" className='btn btn-success col-4' onClick={detailCustomMessageModal.operation}>{(typeOperation == 'cancelRegisteredPayment' || typeOperation == 'cancelRegisteredPaymentInterest') ? 'Confirmar' : 'Registrar'}</button>
                    </div>
                </div>
            </div>
        </div>
    );
}