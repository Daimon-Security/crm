import { es } from "date-fns/locale";
import { useState } from "react";
import { Col, Row } from "react-bootstrap"
import DatePicker from 'react-datepicker';
import { MdRefresh } from "react-icons/md";

interface FilterDayProps {
    onApplyFilter: (date: Date) => void;
    offApplyFilter: () => void;

}
export const FilterDay = ({ onApplyFilter, offApplyFilter }: FilterDayProps) => {
    const dateCurrent = new Date();
    const [dateFilter, setDateFilter] = useState<Date>(dateCurrent);

    const handleApplyFilter = () => {
        onApplyFilter(dateFilter);
    };

    function handleOffApplyFilter() {
        setDateFilter(dateCurrent);
        offApplyFilter();
    }

    return (
        <Row className='mb-4 px-3 d-flex justify-content-center'>
            <Col lg={4} xs={12} className='mt-3 d-flex row'>
                <label htmlFor="startDate" className="form-label col-lg-5 col-6 align-items-center">Seleccionar fecha:</label>
                <div className='col-6 col-lg-7'>
                    <DatePicker
                        id="startDate"
                        locale={es}
                        dateFormat="dd/MM/yyyy"
                        className="form-control"
                        selected={dateFilter}
                        onChange={(date) => { if (date) setDateFilter(date) }}
                        selectsStart
                        startDate={dateFilter}
                        placeholderText="Selecciona una fecha" />
                </div>

            </Col>
            <Col lg={3} xs={12} className='mt-3 d-flex row justify-content-center'>
                <button className='btn btn-primary col-lg-7 col-5 me-4' onClick={handleApplyFilter}>
                    Filtrar
                </button>
                <button className='btn btn-outline-danger ms-3 text-center col-lg-2 col-2' onClick={handleOffApplyFilter}>
                    <MdRefresh size={20} />
                </button>
            </Col>

        </Row>
    )
};

export default FilterDay;