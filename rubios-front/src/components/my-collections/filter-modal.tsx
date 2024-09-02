import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { es } from 'date-fns/locale';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { UserDto } from '../../entities/dto/user-dto';
import { useAppSelector } from '../../redux/hooks/hooks';
import { RootState } from '../../redux/store/store';
import { subMonths } from 'date-fns';
import { useLocation } from 'react-router-dom';
import { useDateFilter } from '../../redux/hooks/useDateFilter';

interface FilterModalProps {
    show: boolean;
    onClose: () => void;
    onApplyFilter: () => void;
    offApplyFilter: () => void;
    options: any;
    users: UserDto[];
    apply: boolean;
    statusCredits?: any;
    startDate: Date;
    endDate: Date;
    setStartDate: (date:Date)=> void;
    setEndDate: (date: Date) => void;
    statusCredit: string;
    statusPayment: string;
    typeCurrency: string;
    user: string;
    setStatusCredit: (status: string)=> void;
    setStatusPayment: (statusPayment: string) => void;
    setUser: (user: string) => void;
    setTypeCurrency: (currency: string) => void;

}

const FilterModal = ({ show, onClose, onApplyFilter, offApplyFilter, users, apply, statusCredits, setStartDate, setEndDate,
     startDate, endDate, statusCredit, statusPayment, typeCurrency, user, setStatusCredit, setStatusPayment, setTypeCurrency, setUser }: FilterModalProps) => {
    const { userRole } = useAppSelector((state: RootState) => state.users);
    console.log("apply: ", apply);

    const handleApplyFilter = () => {
        onApplyFilter();
        onClose();
    };



    return (
        <Modal size='lg' show={show} onHide={onClose} onShow={() => {
            if (!apply) {
                setStatusCredit('1');
                setTypeCurrency('all');
                setUser('all');
                setStatusPayment('all');
            }
        }}>
            <Modal.Header closeButton>
                <Modal.Title>Aplicar filtros</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="mb-3">
                    <label htmlFor="status" className="form-label">Estado del Crédito</label>
                    <select
                        id="status"
                        className="form-select"
                        value={statusCredit}
                        onChange={(e) => {
                            setStatusCredit(e.target.value);
                        }}
                    >
                        <option key='all' value='all'>Todos</option>
                        {

                            statusCredits.map((option: any) => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))
                        }
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="status" className="form-label">Estado del pago</label>
                    <select
                        id="statusPayment"
                        className="form-select"
                        value={statusPayment}
                        onChange={(e) => {
                            setStatusPayment(e.target.value);
                        }}
                    >
                        <option key='all' value='all'>Todos</option>
                        <option key='active' value={'active'}>Activo</option>
                        <option key='canceled' value={'canceled'}>Cancelado</option>
                    </select>
                </div>

                {
                    userRole == "admin" ?
                        <>
                            <div className="mb-3">
                                <label htmlFor="debtCollector" className="form-label">Cobrador</label>
                                <select
                                    id="debtCollector"
                                    className="form-select"
                                    value={user}
                                    onChange={(e) => {
                                        setUser(e.target.value);
                                    }}
                                >
                                    <option key='all' value='all'>Todos</option>
                                    {

                                        users.map((user: any) => (
                                            <option key={user.id} value={user.id}>{user.lastName} {user.name}</option>
                                        ))
                                    }
                                </select>
                            </div>
                        </> : ('')
                }
                <div className="mb-3">
                    <label htmlFor="typeCurrency" className="form-label">Moneda</label>
                    <select
                        id="typeCurrency"
                        className="form-select"
                        value={typeCurrency}
                        onChange={(e) => {
                            setTypeCurrency(e.target.value);
                        }}
                    >
                        <option key='all' value='all'>Todos</option>
                        <option key={'peso'} value={'peso'}>Peso</option>
                        <option key={'dolar'} value={'dolar'}>Dolar</option>
                    </select>
                </div>

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
                            onChange={(date) => {if(date)setEndDate(date)}}
                            selectsEnd
                            startDate={startDate}
                            endDate={endDate}
                            minDate={startDate}
                            placeholderText="Selecciona una fecha"
                        />
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

export default FilterModal;