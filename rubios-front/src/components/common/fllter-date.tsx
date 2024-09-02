import React, { useEffect, useState } from 'react';
import { Button, Col, Modal, Row } from 'react-bootstrap';
import { es } from 'date-fns/locale';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { MdRefresh } from 'react-icons/md';


interface DateFilter {
  startDate: Date;
  endDate: Date;
}

interface DateFilterProps {
  dateFilter: DateFilter;
  setStartDate: (date: Date) => void;
  setEndDate: (date: Date) => void;
}

export const FilterDate = ({ dateFilter, setStartDate, setEndDate }: DateFilterProps) => {


  return (
    <Row className='mb-2 px-3 col-12'>
      <Col lg={6} className='d-flex row mb-2'>
        <label htmlFor="startDate" className="form-label col-6 d-flex align-items-center">Fecha de inicio:</label>
        <div className='col-6'>
          <DatePicker
            id="startDate"
            locale={es}
            dateFormat="dd/MM/yyyy"
            className="form-control"
            selected={dateFilter.startDate}
            onChange={(e: any) =>{
               setStartDate(new Date(e))
            }}
            selectsStart
            placeholderText="Selecciona una fecha"
          />
        </div>

      </Col>
      <Col lg={6} className='d-flex row mb-2'>
        <label htmlFor="startDate" className="form-label col-6 d-flex align-items-center">Fecha de fin:</label>
        <div className='col-6'>
          <DatePicker
            id="endDate"
            locale={es}
            dateFormat="dd/MM/yyyy"
            className="form-control"
            selected={dateFilter.endDate}
            onChange={(e: any) => setEndDate(new Date(e))}
            placeholderText="Selecciona una fecha"
          />
        </div>
      </Col>
    </Row>
  );
};

export default FilterDate;