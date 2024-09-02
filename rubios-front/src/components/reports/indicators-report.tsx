import { Col, Row } from "react-bootstrap";
import useNumberFormatter from "../../redux/hooks/useNumberFormatter";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/hooks";
import { RootState } from "../../redux/store/store";
import '../styles.css';
import { useEffect } from "react";
import { getTotalIndicators } from "../../redux/slices/report-slice";
import Loading from "../common/loading";

interface IndicatorReportProps {
    currency: string
}

export const IndicatorsReport = ({currency}: IndicatorReportProps) => {
    const formatNumber = useNumberFormatter();
    const { totalIndicators, isLoading } = useAppSelector((state: RootState) => state.reports);

    const levelColors: any = {
        level1: '#f0f0f0',
        level2: '#30d847',
        level3: 'yellow',
        level4: '#ff8d05',
        level5: '#ff0000',
    };

    if (isLoading) {
        return <Loading /> // Puedes mostrar un indicador de carga
    }
    return (
        <div>
            <div className="py-2 bg-secondary text-white fw-bold px-2 my-1">
                Marcadores
            </div>
            <div className="px-2">
                <Row className="d-flex bg-light fw-bolder">
                    <Col lg={3} xs={2} className="d-flex align-items-center p-2 justify-content-center">
                        Nivel
                    </Col>
                    <Col lg={2} xs={4} className="text-center d-flex align-items-center justify-content-end">
                        Monto
                    </Col>
                    <Col lg={2} xs={2} className="text-center d-flex align-items-center justify-content-end">
                        %
                    </Col>
                    <Col lg={2} xs={2} className="text-center d-flex align-items-center justify-content-end">
                        Regs
                    </Col>
                    <Col lg={2} xs={2} className="text-center d-flex align-items-center justify-content-end">
                        %
                    </Col>
                </Row>
                {
                    totalIndicators.map((indicator: any, index: number) => (
                        <Row className="d-flex ps-2" key={index}>
                            <Col lg={3} xs={2} className="text-mobile d-flex align-items-center fw-bold p-1" style={{ 
                                backgroundColor: levelColors[`level${index + 1}`], 
                                fontSize: 10
                                }}>
                                {indicator.level}
                            </Col>
                            <Col lg={2} xs={4} className="d-flex text-center align-items-center justify-content-end">
                                {formatNumber(indicator?.total)}
                            </Col>
                            <Col lg={2} xs={2} className="d-flex text-center align-items-center justify-content-end">
                                {indicator?.percentageTotal}
                            </Col>
                            <Col lg={2} xs={2} className="d-flex text-center align-items-center justify-content-end">
                                {indicator?.records}
                            </Col>
                            <Col lg={2} xs={2} className="d-flex text-center align-items-center justify-content-end">
                                {indicator?.percentageRecords}
                            </Col>
                        </Row>
                    ))
                }

            </div>
        </div>
    )
};
export default IndicatorsReport;