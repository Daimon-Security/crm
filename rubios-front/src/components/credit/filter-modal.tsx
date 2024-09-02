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

interface FilterModalProps {
  type: string,
  labelSelect: string;
  paymentFrequencies?: any;
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
  setStartDate: (date: Date) => void;
  setEndDate: (date: Date) => void;
  statusCredit: string;
  statusPayment: string;
  typeCurrency: string;
  user: string;
  paymentFrequency: string;
  setStatusCredit: (status: string) => void;
  setStatusPayment: (statusPayment: string) => void;
  setUser: (user: string) => void;
  setTypeCurrency: (currency: string) => void;
  setPaymentFrequency: (frequency: string) => void;

}

const FilterModal = ({ show, onClose, onApplyFilter, offApplyFilter, users, paymentFrequencies, apply, statusCredits, setStartDate, setEndDate,
  startDate, endDate, statusCredit, paymentFrequency, typeCurrency, user, setStatusCredit, setStatusPayment, setTypeCurrency, setUser,
  setPaymentFrequency }: FilterModalProps) => {
  const location = useLocation();
  const { userRole } = useAppSelector((state: RootState) => state.users);
  // console.log("apply: ", apply);
  // console.log("user: ", user);
  // console.log("typeCurrency: ", typeCurrency);


  const handleApplyFilter = () => {
    console.log("user: ", user);
    onApplyFilter();
    onClose();
  };



  return (
    <Modal size='lg' show={show} onHide={onClose} onShow={() => {
      if (!apply) {
        setStatusCredit('1');
        setTypeCurrency('all');
        setUser('all');
        setPaymentFrequency('all');
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
        {
          userRole == "admin" ?
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
            </div> : ('')
        }
        <div className="mb-3">
          <label htmlFor="debtCollector" className="form-label">Periodo de pago</label>
          <select
            id="paymentFrequency"
            className="form-select"
            value={paymentFrequency}
            onChange={(e) => {
              setPaymentFrequency(e.target.value);
            }}
          >
            <option key='all' value='all'>Todos</option>
            {paymentFrequencies.map((frecuency: any) => (
              <option value={frecuency.value} key={frecuency.id}>{frecuency.value}</option>
            ))}
          </select>
        </div>
        {location.pathname != '/sale-credits' ?
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
          </div> : ('')
        }

        <div className='col-12 row'>
          <div className="mb-3 col-6">
            <label htmlFor="startDate" className="form-label me-2">Fecha de inicio:</label>
            <DatePicker
              id="startDate"
              locale={es}
              dateFormat="dd/MM/yyyy"
              className="form-control"
              selected={startDate}
              onChange={(date) => { if (date) setStartDate(date) }}
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
              onChange={(date) => { if (date) setEndDate(date) }}
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