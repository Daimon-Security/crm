import { Col, Row } from "react-bootstrap"
import { MdArrowBack } from "react-icons/md"
import { Link, useLocation } from "react-router-dom"
import TableResponsive from "./table-responsive"
import { TabsCreditOptions } from "../credit/tabs-credit"
import useNumberFormatter from "../../redux/hooks/useNumberFormatter"
import CustomMessage from "./custom-message/custom-message"
import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import { es } from "date-fns/locale"

interface DetailCreditCommonProps {
    data: any,
    creditSelected: any,
    activeTab: string,
    setActive: (active: string) => void,
    savePayment: (payment: number, paymentDueDate: Date) => void,
    isLoading: boolean,
    dueDate: Date | null,
}

export const DetailCreditCommon = ({ data, creditSelected, activeTab, setActive, savePayment, isLoading, dueDate }: DetailCreditCommonProps) => {
    const location = useLocation();
    const route = location.pathname;
    const formatNumber = useNumberFormatter();
    const [payment, setPayment] = useState<number>(0);
    const [paymentDueDate, setPaymentDueDate] = useState<Date | null>(null);
    const [showAddPayment, setShowAddPayment] = useState<boolean>(false);
    const [isSubmitting, setSubmitting] = useState<boolean>(false);
    const [showValidateDatePayment, setShowValidationDatePayment] = useState<boolean>(false);
    console.log("creditSelected detail: ", creditSelected);
    function validateDatePayment() {
        setShowValidationDatePayment(true);
        if (paymentDueDate && payment > 0) {
            savePayment(payment, paymentDueDate);
            setShowAddPayment(false);
            setSubmitting(true);
            setPayment(0);
            setShowValidationDatePayment(false);
        }
    }


    function onclose() {
        setShowAddPayment(false);
        setPayment(0);
        if (dueDate) setPaymentDueDate(new Date(dueDate));
    }

    useEffect(() => {
        if (dueDate) setPaymentDueDate(new Date(dueDate));
    }, [dueDate, isLoading])



    return (
        <>
            <div className="p-2">
                <Row className="me-1 ms-1 border-top">
                    <div className=" ps-2 d-flex align-items-center col-lg-3">
                        <Col className="d-flex align-items-center">
                            <h6 className="pe-1">Nº Ficha: </h6><p className="pt-2">{creditSelected?.clientNumber}</p>
                        </Col>
                    </div>
                    <div className="ps-2 d-flex align-items-center col-lg-3">
                        <Col className="d-flex align-items-center">
                            <h6 className="pe-1">Cobrador: </h6><p className="pt-2">{creditSelected?.debtCollector}</p>
                        </Col>
                    </div>
                    <div className="ps-2 d-flex align-items-center col-lg-3">
                        <Col className="d-flex align-items-center">
                            <h6 className="pe-1">Cuota: </h6><p className="pt-2">{formatNumber(creditSelected?.payment)}</p>
                        </Col>
                    </div>
                    <div className="ps-2 d-flex align-items-center col-lg-3">
                        <Col className="d-flex align-items-center">
                            <h6 className="pe-1">Frecuencia de pago: </h6><p className="pt-2">{creditSelected?.paymentFrequency}</p>
                        </Col>
                    </div>
                </Row>
                <Row className="me-1 ms-1 border-top ">
                    <div className="ps-2 d-flex align-items-center col-lg-3">
                        <Col className="d-flex align-items-center">
                            <h6 className="pe-1">Nº de pagos: </h6><p className="pt-2">{creditSelected?.numberPayment}</p>
                        </Col>
                    </div>
                    <div className="ps-2 d-flex align-items-center col-lg-3">
                        <Col className="d-flex align-items-center">
                            <h6 className="pe-1">Moneda: </h6><p className="pt-2">{creditSelected?.typeCurrency.toUpperCase()}</p>
                        </Col>
                    </div>
                    <div className="ps-2 d-flex align-items-center col-lg-3">
                        <Col className="d-flex align-items-center">
                            <h6 className="pe-1">Día de pago: </h6><p className="pt-2">{creditSelected?.payDay}</p>
                        </Col>
                    </div>
                    <div className="ps-2 d-flex align-items-center col-lg-3">
                        <Col className="d-flex align-items-center">
                            <h6 className="pe-1">Interés: </h6><p className="pt-2">{creditSelected?.interestRate}%</p>
                        </Col>
                    </div>
                </Row>
                <Row className="me-1 ms-1 border-top ">
                {route == '/credits-list' || creditSelected.type == 1?
                        <>
                            <div className="ps-2 d-flex align-items-center col-lg-3">
                                <Col className="d-flex align-items-center">
                                    <h6 className="pe-1">Comisión: </h6><p className="pt-2">{creditSelected?.commission}%</p>
                                </Col>
                            </div>
                            <div className="ps-2 d-flex align-items-center col-lg-9 col-12">
                                <Col className="d-flex align-items-center">
                                    <h6 className="pe-1">Información adicional: </h6><p className="pt-2">{(creditSelected?.information) ? creditSelected?.information : '-'}</p>
                                </Col>
                            </div>
                        </> : ('')
                    }
                </Row>
                <Row className="border-bottom me-1 ms-1">
                    {route == '/sale-credits' || creditSelected.type === 2 ?
                        <>
                            <div className="ps-2 d-flex align-items-center col-lg-3">
                                <Col className="d-flex align-items-center">
                                    <h6 className="pe-1">Anticipo: </h6><p className="pt-2">{creditSelected?.downPayment}</p>
                                </Col>
                            </div>
                            <div className="ps-2 d-flex align-items-center col-lg-3">
                                <Col className="d-flex align-items-center">
                                    <h6 className="pe-1">Comisión: </h6><p className="pt-2">{creditSelected?.commission}%</p>
                                </Col>
                            </div>
                            <div className="ps-2 d-flex align-items-center col-lg-3 col-12">
                                <Col className="d-flex align-items-center">
                                    <h6 className="pe-1">Detalle venta: </h6><p className="pt-2">{creditSelected?.detail}</p>
                                </Col>
                            </div>
                        </>
                        : ('')
                    }
                </Row>
                <Row className="border-bottom mb-4 py-2 me-1 ms-1 d-flex justify-content-center">
                    <Col className="d-flex align-items-center col-4 justify-content-center">
                        <button className="btn btn-primary col-lg-4 col-12 btn-sm mx-3 mb-1"
                            onClick={() => {
                                setShowAddPayment(true);
                            }}>Recargo</button>
                        {isLoading && isSubmitting ?
                            <div className="spinner-border text-primary mb-1" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div> : ('')
                        }
                    </Col>

                </Row>
            </div>
            <div className="px-2">
                <TabsCreditOptions active={activeTab} setActive={setActive} />
            </div>
            <CustomMessage
                title="Gestión de Créditos"
                message={
                    <div className="d-flex row">
                        <div className="col-6">
                            Recargo:
                            <input className="rounded text-end col-12 px-2" value={isNaN(payment) ? 0 : payment}
                                onChange={(e: any) => {
                                    setPayment(parseInt(e.target.value));
                                }
                                }
                            />
                        </div>
                        <div className="col-6 d-flex row">
                            Fecha de pago:
                            <DatePicker
                                id="startDate"
                                locale={es}
                                dateFormat="dd/MM/yyyy"
                                className="rounded px-2 col-12"
                                selected={paymentDueDate}
                                onChange={(e: any) => {
                                    setPaymentDueDate(new Date(e));
                                }}
                                selectsStart
                                placeholderText="Selecciona una fecha"
                            />
                        </div>

                        <div className="px-3">
                            {
                                payment == 0 && showValidateDatePayment ?
                                    <h6 className="col-12 text-danger mt-2">*El importe deber ser mayor que 0.</h6> : ('')
                            }
                        </div>
                        <div className="px-3">
                            {
                                !paymentDueDate && showValidateDatePayment ?
                                    <h6 className="col-12 text-danger mt-2">*Seleccione la fecha de pago.</h6> : ('')
                            }
                        </div>
                    </div>}
                acceptBtnName="Guardar"
                cancelBtnName="Cancelar"
                operation={validateDatePayment}
                showModal={showAddPayment}
                onCloseModal={onclose}
                typeOperation="add"
            />
        </>
    )
}