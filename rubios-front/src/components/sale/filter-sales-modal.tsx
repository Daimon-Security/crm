import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { es } from 'date-fns/locale';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { subMonths } from 'date-fns';

interface FilterSaleModalProps {
    show: boolean;
    onClose: () => void;
    onApplyFilter: (startDate: Date, endDate: Date, paymentType: string, statusSale: string) => void;
    offApplyFilter: () => void;
    apply: boolean

}

const FilterSaleModal = ({ show, onClose, onApplyFilter, offApplyFilter, apply }: FilterSaleModalProps) => {
    const [paymentType, setPaymentType] = useState<string>('all');
    const [statusSaleSelected, setStatusSale] = useState<string>('all');
    const dateCurrent = new Date();
    const [startDate, setStartDate] = useState<Date>(subMonths(dateCurrent, 1));
    const [endDate, setEndDate] = useState<Date>(dateCurrent);

    const statusSale: any = [
        { value: 1, label: 'Válida' },
        { value: 2, label: 'Anulada' }
    ]

    const paymentTypeValues: any = [
        { value: 'contado', label: 'Contado' },
        { value: 'crédito', label: 'Crédito' },
    ]

    const handleApplyFilter = () => {
        onApplyFilter(startDate, endDate, paymentType, statusSaleSelected);
        onClose();
    };

    function handleOffApplyFilter() {
        setStatusSale('all');
        setPaymentType('all');
        getPeriod();
    }

    const getPeriod = () => {
        setStartDate(subMonths(dateCurrent, 1));
        setEndDate(dateCurrent);
    }



    return (
        <Modal size='lg' show={show} onHide={onClose} onShow={() => {
            if (!apply) handleOffApplyFilter()
        }}>
            <Modal.Header closeButton>
                <Modal.Title>Aplicar filtros</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                
            <div className='col-12 row'>
                    <div className="mb-3 col-6">
                        <label htmlFor="startDate" className="form-label me-2">Fecha de inicio:</label>
                        <DatePicker
                            id="startDate"
                            locale={es}
                            dateFormat="dd/MM/yyyy"
                            className="form-control"
                            selected={startDate}
                            onChange={(date) => {if(date)setStartDate(date)}}
                            selectsStart
                            startDate={startDate}
                            endDate={endDate}
                            placeholderText="Selecciona una fecha"
                        />
                    </div>
                    <div className="mb-3 col-6">
                        <label htmlFor="endDate" className="form-label me-2">Fecha de fin:</label>
                        <DatePicker
                            id="endDate"
                            locale={es}
                            dateFormat="dd/MM/yyyy"
                            className="form-control"
                            selected={endDate}
                            onChange={(date) => {if(date)setStartDate(date)}}
                            selectsEnd
                            startDate={startDate}
                            endDate={endDate}
                            minDate={startDate}
                            placeholderText="Selecciona una fecha"
                        />
                    </div>
                </div>
                <div className='row col-12'>
                    <div className="mb-3 col-lg-6 col-12">
                        <label htmlFor="status" className="form-label">Estado de la venta</label>
                        <select
                            id="status"
                            className="form-select"
                            value={statusSaleSelected}
                            multiple={false}
                            onChange={(e) => {
                                setStatusSale(e.target.value);
                            }}
                        >
                            <option key='all' value='all'>Todos</option>
                            {

                                statusSale.map((option: any) => (
                                    <option key={option.value} value={option.value}>{option.label}</option>
                                ))
                            }
                        </select>
                    </div>
                    <div className="mb-3 col-lg-6 col-12">
                        <label htmlFor="status" className="form-label">Tipo de pago</label>
                        <select
                            id="statusPayment"
                            className="form-select"
                            value={paymentType}
                            multiple={false}
                            onChange={(e) => {
                                setPaymentType(e.target.value);
                            }}
                        >  <option key='all' value='all'>Todos</option>
                            {

                                paymentTypeValues.map((option: any) => (
                                    <option key={option.value} value={option.value}>{option.label}</option>
                                ))
                            }
                        </select>
                    </div>
                </div>

            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose} className='col-3'>
                    Cerrar
                </Button>
                <Button variant="primary" onClick={handleApplyFilter} className='col-3'>
                    Aplicar
                </Button>

            </Modal.Footer>
        </Modal>
    );
};

export default FilterSaleModal;