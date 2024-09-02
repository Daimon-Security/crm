import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/hooks";
import DatePicker from 'react-datepicker';
import { es } from "date-fns/locale";
import { format } from "date-fns";
import { Col } from "react-bootstrap";

export interface ReschedulePaymentProps {
    id: number;
    dueDate: Date;
    closeModal: () => void;
    reschedulePayment: (id: number, dueDate: Date) => void;
}

export const ReschedulePayment = ({ id, dueDate, closeModal, reschedulePayment }: ReschedulePaymentProps) => {
    const [newDate, setNewDate] = useState<Date>(dueDate);
    const dispatch = useAppDispatch();
    const showModal = true;

    function onCloseModal() {
        closeModal();
    }

    return (
        <div className='modal' style={{ display: showModal ? 'block' : 'none' }} id="staticBackdrop" aria-labelledby="exampleModalLabel" data-bs-keyboard="false" data-bs-backdrop="static" aria-hidden="true">
            <div className="modal-dialog  modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">Reagendar pago</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={onCloseModal}></button>
                    </div>
                    <div className="modal-body row">
                        <label>Fecha actual: <span className="fw-bold">{format(dueDate, 'dd/MM/yyyy')}</span></label>
                        <Col className="mt-4">
                            <label>Nueva fecha:</label>
                        </Col>
                        <Col lg="12" className="mt-4">
                            <DatePicker
                                id="startDate"
                                locale={es}
                                dateFormat="dd/MM/yyyy"
                                className="form-control"
                                selected={newDate}
                                onChange={(date) => {
                                    if (date) { setNewDate(date) }
                                }}
                                selectsStart
                                startDate={dueDate}
                                placeholderText="Selecciona una fecha"
                            />
                        </Col>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary col-4" onClick={onCloseModal} data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" className='btn btn-success col-4' onClick={() => reschedulePayment(id, newDate)}>Aceptar</button>
                    </div>
                </div>
            </div>
        </div>
    );
}