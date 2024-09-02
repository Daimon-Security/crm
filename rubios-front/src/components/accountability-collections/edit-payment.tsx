import { useState } from "react";

interface EditPaymentModalProps {
    show: boolean,
    close: () => void,
    actualPayment: number,
    update: (payment: number) => void,
    isLoading: boolean
}

export const EditPaymentModal = ({ show, close, actualPayment, update, isLoading }: EditPaymentModalProps) => {
    const [inputPayment, setInputPayment] = useState<number>(actualPayment);
    console.log("actualPayment: ", actualPayment)
    return (
        <div className='modal' style={{ display: show ? 'block' : 'none' }} id="staticBackdrop" aria-labelledby="exampleModalLabel" data-bs-keyboard="false" data-bs-backdrop="static" aria-hidden="true">
            <div className="modal-dialog  modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">Modificación del pago</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={close}></button>
                    </div>
                    <div className="modal-body d-flex justify-content-center">
                        {isLoading ?
                            <div className="spinner-border text-primary mt-2" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div> :
                            <div className="row d-flex align-items-center">
                                <h6 className="col-3">Pago: </h6>
                                <div className="col-9">
                                    <input
                                        className="form-control "
                                        type="number"
                                        value={inputPayment}
                                        onChange={(e: any) => {
                                            if (e.target.value >= 0) {
                                                setInputPayment(parseFloat(e.target.value));
                                            } else {
                                                setInputPayment(0);
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        }

                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary col-4" onClick={close} data-bs-dismiss="modal">{'Cancelar'}</button>
                        <button type="button" className='btn btn-success col-4' onClick={() => { update(inputPayment) }}>Modificar</button>
                    </div>
                </div>
            </div>
        </div>
    )
}