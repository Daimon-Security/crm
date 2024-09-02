import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/hooks";
import { RootState } from "../../redux/store/store";
import { Col, Row } from "react-bootstrap";
import { getTotalBalance, getTotalBalanceBadCredits, getTotalIndicators } from "../../redux/slices/report-slice";
import useNumberFormatter from "../../redux/hooks/useNumberFormatter";
import IndicatorsReport from "./indicators-report";
import Loading from "../common/loading";

export const Reports = () => {
    const dispatch = useAppDispatch();
    const formatNumber = useNumberFormatter();
    const [currencyType, setCurrencyType] = useState('peso');
    const [year, setYear] = useState('2023')
    const { totalBalance, totalBadCredits } = useAppSelector((state: RootState) => state.reports);
    //const periods = ['2023', '2022', '2021']
    const { isLoading } = useAppSelector((state: RootState) => state.loading);



    async function getIndicators() {
        await dispatch(getTotalIndicators(currencyType));
    }

    async function getTotal() {
        await dispatch(getTotalBalance(year, currencyType));
        await dispatch(getTotalBalanceBadCredits(year, currencyType));
        getIndicators();
        
    }


    useEffect(() => {
        console.log("obteniendo datos del reporte");
        getTotal();

    }, [year, currencyType])

    if (isLoading) {
        return <Loading /> // Puedes mostrar un indicador de carga
    }

    return (
        <div className="px-2">

            <div className="bg-primary text-white fw-bold fs-5 text-center py-2">
                <label htmlFor="status" className="form-label">Moneda</label>
                <select
                    id="type"
                    className="bg-primary border-0 text-white fw-bold mx-2"
                    value={currencyType}
                    onChange={(e) => {
                        setCurrencyType(e.target.value);
                    }}
                >
                    <option key='peso' value='peso'>$ ARS</option>
                    <option key='dolar' value='dolar'>USD</option>
                </select>
                {/* -
                <select
                    id="type"
                    className="bg-primary border-0 text-white fw-bold mx-2"
                    value={year}
                    onChange={(e) => {
                        setYear(e.target.value);
                    }}
                >
                    {
                        periods.map((option: any) => (
                            <option key={option} value={option}>{option}</option>
                        ))
                    }
                </select> */}
            </div>
            <div>
                <div className="py-2 bg-secondary text-white fw-bold px-2 my-1">
                    Resumen
                </div>
                <div className="px-2">
                    <Row className="d-flex pe-2">
                        <Col lg={4} xs={4} className="d-flex justify-content-start">
                            <h6>Balance Total</h6>
                        </Col>
                        <Col lg={4} xs={4} className="d-flex justify-content-end">
                            <p>{formatNumber(totalBalance?.total)}</p>
                        </Col>
                        <Col lg={4} xs={4} className="d-flex justify-content-end">
                            <p>{totalBalance?.totalRecords}</p>
                        </Col>
                    </Row>
                    <Row className="d-flex pe-2">
                        <Col lg={4} xs={4} className="d-flex justify-content-start">
                            <h6>Lista Negra</h6>
                        </Col>
                        <Col lg={4} xs={4} className="d-flex justify-content-end">
                            <p>{formatNumber(totalBadCredits?.total)}</p>
                        </Col>
                        <Col lg={4} xs={4} className="d-flex justify-content-end">
                            <p>{totalBadCredits?.totalRecords}</p>
                        </Col>
                    </Row>
                </div>
            </div>
            <IndicatorsReport currency={currencyType}/>
        </div>

    )
};

export default Reports;