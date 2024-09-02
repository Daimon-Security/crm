import { useEffect, useState } from "react";
import { Button, Col, Modal, Row } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/hooks";
import { RootState } from "../../redux/store/store";
import { closeCash, lastCash, openCash } from "../../redux/slices/cash-slice";
import useNumberFormatter from "../../redux/hooks/useNumberFormatter";
import { getDateString } from "../function-common/get-date-string";
import Loading from "../common/loading";
import CashTransactions from "./cash-transactions";
import ModalCustomMessage from "../custom-message/modal-custom-message";

export const Cash = () => {
    const dispatch = useAppDispatch();
    const formatNumber = useNumberFormatter();
    const { isLoading } = useAppSelector((state: RootState) => state.loading);
    const { cash, opening, isError, message, isLoading: isLoadingCash } = useAppSelector((state: RootState) => state.cash);
    const [showMessage, setShowMessage] = useState<boolean>(false);
    console.log("cash: ", cash);

    function getTitle() {
        if (cash) {
            return <div className="row d-flex"><span className="col-12">Fecha de Cierre </span><span className="col-12">{getDateString(new Date(cash?.closingDate))}</span></div>;
        } else {
            return 'Primera apertura de caja';
        }
    }

    function closeMessage() {
        setShowMessage(false);
    }


    async function getCash() {
        await dispatch(lastCash());
        if (!cash) setShowMessage(true);
    }


    useEffect(() => {
        getCash();
    }, [opening])

    if (isLoading) {
        return <Loading /> // Puedes mostrar un indicador de carga
    }

    return (
        <>
            {
                cash && !isError ?
                    <div>
                        {
                            !opening ?

                                <Row className='justify-content-center p-3'>
                                    <Row className="bg-body-tertiary shadow pt-3 bg-white rounded col-11">
                                        <Row className="justify-content-center border-bottom border-bottom-1 py-2">
                                            <Col lg="12">
                                                <h3 className="text-center">CAJA</h3>
                                            </Col>
                                            <Col lg="12">
                                                <h3 className="text-center">{getTitle()}</h3>
                                            </Col>
                                        </Row>
                                        <div className="d-table-mobile">
                                            <Row className="justify-content-center pt-2">
                                                <Col lg="6">
                                                    <h3 className="text-center">Saldo Inicial</h3>
                                                </Col>
                                                <Col lg="6">
                                                    <h3 className="text-center">Saldo Final</h3>
                                                </Col>
                                            </Row>
                                            <Row className="justify-content-center">
                                                <Col lg="6">
                                                    <h4 className="text-center">$ARG: {formatNumber(cash?.openingBalancePeso)}</h4>
                                                </Col>
                                                <Col lg="6">
                                                    <h4 className="text-center">$ARG: {formatNumber(cash?.closingBalancePeso)}</h4>
                                                </Col>
                                            </Row>
                                            <Row className="justify-content-center border-bottom border-bottom-1">
                                                <Col lg="6">
                                                    <h4 className="text-center">USD: {formatNumber(cash?.openingBalanceDollar)}</h4>
                                                </Col>
                                                <Col lg="6">
                                                    <h4 className="text-center">USD: {formatNumber(cash?.closingBalanceDollar)}</h4>
                                                </Col>
                                            </Row>
                                            <Row className="d-flex justify-content-center align-items-center">
                                                <Col lg={4} className="py-3 d-flex justify-content-center align-items-center">

                                                    <Col lg="6">
                                                        <button className="text-center btn btn-primary col-12" onClick={() => dispatch(openCash())}>Abrir Caja</button>
                                                    </Col>
                                                </Col>

                                            </Row>
                                        </div>
                                        <div className="d-lg-none d-md-none">
                                            <Row className="pt-2 border-bottom border-bottom-1">
                                                <Col lg="6" xs="12">
                                                    <h3 className="text-center">Saldo Inicial</h3>
                                                </Col>
                                                <Col lg="6">
                                                    <h4 className="text-center">$ARG: {formatNumber(cash?.openingBalancePeso)}</h4>
                                                </Col>
                                                <Col lg="6">
                                                    <h4 className="text-center">USD: {formatNumber(cash?.openingBalanceDollar)}</h4>
                                                </Col>
                                            </Row>
                                            <Row className="border-bottom border-bottom-1">
                                                <Col lg="6">
                                                    <h3 className="text-center">Saldo Final</h3>
                                                </Col>
                                                <Col lg="6">
                                                    <h4 className="text-center">$ARG: {formatNumber(cash?.closingBalancePeso)}</h4>
                                                </Col>
                                                <Col lg="6">
                                                    <h4 className="text-center">USD: {formatNumber(cash?.closingBalanceDollar)}</h4>
                                                </Col>
                                            </Row>
                                            <Row className="d-flex justify-content-center align-items-center">
                                                <Col lg={4} className="py-3 d-flex justify-content-center align-items-center">

                                                    <Col lg="6" xs="12">
                                                        <button className="text-center btn btn-primary col-12" onClick={() => dispatch(openCash())}>Abrir Caja</button>
                                                    </Col>
                                                </Col>

                                            </Row>
                                        </div>
                                    </Row>
                                </Row> :
                                <CashTransactions />
                        }
                    </div> :
                    <div>
                        <ModalCustomMessage title={'Mensaje del Sistema'} message={message} show={showMessage} onClose={closeMessage} />
                    </div>
            }

        </>


    )
};
export default Cash;