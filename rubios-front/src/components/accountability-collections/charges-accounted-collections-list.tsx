import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/hooks";
import { RootState } from "../../redux/store/store";
import FilterDate from "../common/fllter-date";
import { Link, useParams } from "react-router-dom";
import { TotalChargeAccountedAndCollectedDto } from "../../entities/dto/charge-accounted-collection-dto";
import { getChargesAccountedAndCollected, setChargesAccountedAndCollected, setRangeDate } from "../../redux/slices/report-slice";
import ButtonsFilter from "../common/buttons-filter-date";
import { useDateFilter } from "../../redux/hooks/useDateFilter";
import { Col, Row } from "react-bootstrap";
import { getDateString } from "../function-common/get-date-string";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Loading from "../common/loading";
import TableResponsive from "../common/table-responsive";
import useNumberFormatter from "../../redux/hooks/useNumberFormatter";
import DatePicker from 'react-datepicker';

export const DetailsChargesAndAccountedCollectionsTotal = () => {
    const dispatch = useAppDispatch();
    const { type } = useParams();
    const formatNumber = useNumberFormatter();
    const { isLoading } = useAppSelector((state: RootState) => state.loading);
    const { totalChargesAccountedAndCollected } = useAppSelector((state: RootState) => state.reports);
    const dateCurrent = new Date();
    // const { dateFilter, setStartDate, setEndDate } = useDateFilter({ initialStartDate: dateCurrent, initialEndDate: dateCurrent })
    const [startDateFilter, setStartDate] = useState<Date | null>(null);
    const [endDateFilter, setEndDate] = useState<Date>(dateCurrent);
    const [chargesCollectionsLoaded, setchargesCollectionsLoaded] = useState(false);
    const previous = 'accounted';
    const rows = totalChargesAccountedAndCollected.map((detail: TotalChargeAccountedAndCollectedDto, index: number) => ({
        id: index + 1,
        debtCollector: detail.debtCollectorName,
        totalPaymentsCollectedPesos: formatNumber(detail.totalPaymentsCollectedPesos),
        totalPaymentsCollectedDollar: formatNumber(detail.totalPaymentsCollectedDollar),
        totalPaymentsReceivablesPesos: formatNumber(detail.totalPaymentsReceivablesPesos),
        totalPaymentsReceivablesDollar: formatNumber(detail.totalPaymentsReceivablesDollar),
        action: (
            <>
                <Link to={`/collections/${type}/${detail.debtCollectorId}/detail/${previous}`}>
                    <button className="btn btn-success me-2 mb-1 col-lg-5 col-9">Detalle</button>
                </Link>
                <Link to={`/collections-accounted/${type}/${detail.debtCollectorId}/history`}>
                    <button className="btn btn-primary me-1 mb-1 col-lg-5 col-9">Historial</button>
                </Link>
            </>

        ),
    }));

    const columns = [
        {
            label: '#',
            field: 'id',
            sort: 'asc',
            //width: 100
        },
        {
            label: 'Cobrador/a',
            field: 'debtCollector',
            sort: 'asc',
            //width: 250
        },
        {
            label: 'A rendir $',
            field: 'totalPaymentsCollectedPesos',
            sort: 'asc',
            //width: 250
        },
        {
            label: 'A rendir $USD',
            field: 'totalPaymentsCollectedDollar',
            sort: 'asc',
            //width: 250
        },
        {
            label: 'Pendiente $',
            field: 'totalPaymentsReceivablesPesos',
            sort: 'asc',
            //width: 250
        },
        {
            label: 'Pendiente $USD',
            field: 'totalPaymentsReceivablesDollar',
            sort: 'asc',
        },
        {
            label: 'Action',
            field: 'action',
            sort: 'asc',
        }
    ];


    function onApplyFilter() {
        dispatch(setRangeDate({ start: (startDateFilter) ? format(startDateFilter, 'dd-MM-yyyy', { locale: es }) : null, end: format(endDateFilter, 'dd-MM-yyyy', { locale: es }) }));
        if (type) dispatch(getChargesAccountedAndCollected(startDateFilter, endDateFilter, type));
    }

    function offApplyFilter() {
        setStartDate(null);
        setEndDate(dateCurrent);
        dispatch(setRangeDate({ start: null, end: format(dateCurrent, 'dd-MM-yyyy', { locale: es }) }));
        if (type) dispatch(getChargesAccountedAndCollected(null, dateCurrent, type));
    }

    async function getChargesCollections() {
        dispatch(setRangeDate({ start: (startDateFilter)?getDateString(startDateFilter): null, end: getDateString(endDateFilter) }))
        if (type) await dispatch(getChargesAccountedAndCollected(startDateFilter, endDateFilter, type));
    }

    function getTitle() {
        return (type == '1') ? 'Rendiciones Créditos Personales' : 'Rendiciones Créditos por Ventas';
    }

    useEffect(() => {
        getChargesCollections();
    }, [])

    if (isLoading) {
        return <Loading /> // Puedes mostrar un indicador de carga
    }


    return (
        <div className="px-2">
            <Row className="border-top border-bottom p-2 mb-4 align-items-center d-flex justify-content-beetwen">
                <Col lg={12} xs={12} className="d-flex justify-content-center text-center row">
                    <Col lg={12} xs={12}>
                        <h3>{getTitle()}</h3>
                    </Col>
                    {
                        startDateFilter ?
                        <Col lg={12} xs={12} className='row d-flex justify-content-center'>
                        <h3 className='d-none d-lg-block col-6'>{getDateString(startDateFilter)} - {getDateString(endDateFilter)}</h3>
                    </Col>:
                      <Col lg={12} xs={12} className='row d-flex justify-content-center'>
                      <h3 className='d-none d-lg-block col-6'>al {getDateString(endDateFilter)}</h3>
                  </Col>
                    }
                    <Col xs={12} className="d-lg-none row d-flex">
                        {
                            startDateFilter?
                            <h3>{getDateString(startDateFilter)} </h3>:
                            <h3>al</h3>
                        }
                        
                        <h3>{getDateString(endDateFilter)} </h3>
                    </Col>
                </Col>
            </Row>
            <Row className="d-flex justify-content-center">
                <Col lg={6} className="d-flex justify-content-center">
                    <Row className='mb-2 px-3 col-12'>
                        <Col lg={6} className='d-flex row mb-2'>
                            <label htmlFor="startDate" className="form-label col-6 d-flex align-items-center">Fecha de inicio:</label>
                            <div className='col-6'>
                                <DatePicker
                                    id="startDate"
                                    locale={es}
                                    dateFormat="dd/MM/yyyy"
                                    className="form-control"
                                    selected={startDateFilter}
                                    onChange={(e: any) => {
                                        setStartDate(new Date(e))
                                    }}
                                    selectsStart
                                    placeholderText="Seleccionar"
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
                                    selected={endDateFilter}
                                    onChange={(e: any) => setEndDate(new Date(e))}
                                    placeholderText="Selecciona una fecha"
                                />
                            </div>
                        </Col>
                    </Row>
                </Col>
                <Col lg={12} className="d-flex justify-content-center">
                    <div className="col-lg-6 col-12 d-flex justify-content-center">
                        <ButtonsFilter
                            handleApplyFilter={onApplyFilter}
                            handleOffApplyFilter={offApplyFilter}
                        />
                    </div>
                </Col>
            </Row>


            <TableResponsive columns={columns} rows={rows} />
        </div>
    )
};
export default DetailsChargesAndAccountedCollectionsTotal;