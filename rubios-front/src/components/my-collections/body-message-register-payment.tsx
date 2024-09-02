import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import CustomMessage from "../common/custom-message/custom-message";
import DatePicker from 'react-datepicker';
import { es } from "date-fns/locale";
import useNumberFormatter from "../../redux/hooks/useNumberFormatter";

export interface BodyMessageRegisterPaymentProps {
    interest: number;
    principal: number;
    currencytype: string;
    getInputPayment: (payment: number, firstPayment?: any) => void,
    payment: number;
    operationType: string;
    balance: number;
    setValidationDate: (value: boolean)=>void;
    setValidationPayment: (value: boolean)=>void;
    setRegister: (value: boolean)=> void;
}

export const BodyMessageRegisterPayment = ({ interest, principal, currencytype, getInputPayment, payment, operationType, balance, setValidationDate, setValidationPayment, setRegister }: BodyMessageRegisterPaymentProps) => {
    //console.log("operation type: ", operationType);
    const formatNumber = useNumberFormatter();
    const [inputPayment, setInputPayment] = useState<number>((operationType == 'cancellationInterest') ? interest : payment);
    const [principalAmountToBePaid, setPrincipalAmount] = useState<number>(0);
    const [firstPayment, setFirstPayment] = useState<Date | null>(null);


    function getPricipalToCancel() {
        setPrincipalAmount((parseFloat(inputPayment.toString()) <= interest) ? 0 : inputPayment - interest);
    }

    useEffect(() => {
    }, [principalAmountToBePaid])

    useEffect(() => {
        //console.log("operation: ", operationType);
        if (operationType == 'cancellationInterest') {
            getInputPayment(interest, firstPayment);
        } else {
            getInputPayment(payment, firstPayment);
        }
    }, [])


    return (
        <>
            {
                operationType == 'cancellationInterest' ?
                    <div>
                        <Row>
                            <h6 className="col-12">Capital: {currencytype} {formatNumber(principal)}</h6>
                            <h6 className="col-12">Intereses a pagar: {currencytype} {formatNumber(interest)}</h6>
                            <h6 className="col-12">Reducción de capital: {currencytype} {formatNumber(principalAmountToBePaid)}</h6>
                            <div className="row d-flex align-items-center">
                                <h6 className="col-6">Pago: {currencytype}</h6>
                                <div className="col-6">
                                    <input
                                        className="form-control "
                                        type="number"
                                        value={inputPayment}
                                        onBlur={(e: any) => {
                                            console.log("fecha de pago: ", firstPayment);
                                            getInputPayment(parseFloat(e.target.value), firstPayment);
                                            getPricipalToCancel();
                                        }
                                        }
                                        onChange={(e: any) => {
                                            setValidationPayment(false);
                                            setRegister(false);
                                            if (e.target.value >= 0) {
                                                setInputPayment(parseFloat(e.target.value));
                                            } else {
                                                setInputPayment(0);
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="row d-flex align-items-center">
                                <h6 className="col-6">Fecha próximo pago:</h6>
                                <div className="col-6">
                                    <Col className='my-2 form-group input-date'>
                                        <DatePicker
                                            id="startDate"
                                            locale={es}
                                            dateFormat="dd/MM/yyyy"
                                            className="form-control"
                                            selected={firstPayment}
                                            onChange={(date) => {
                                                if (date) {
                                                    //console.log("seleccionado fecha: ", date);
                                                    setFirstPayment(date);
                                                    getInputPayment(inputPayment, date);
                                                    setValidationDate(false);
                                                    setRegister(false);
                                                }
                                            }}
                                            selectsStart
                                            startDate={firstPayment}
                                            placeholderText="Selecciona una fecha"
                                        />
                                    </Col>
                                </div>
                              
                            </div>
                        </Row>

                    </div>
                    :
                    <div>
                        <Row>
                            <h6 className="col-12">Importe a pagar: {currencytype} {formatNumber(payment)}</h6>
                            <h6 className="col-6">Otro importe: {currencytype}</h6>
                            <input
                                className="ms-2 rounded col-4"
                                type="number"
                                value={inputPayment}
                                onBlur={(e: any) => {
                                    getInputPayment(parseFloat(e.target.value))
                                }}
                                onChange={(e: any) => {
                                    if (e.target.value >= 0) {
                                        console.log("payment ingresado: ", e.target.value);
                                        setInputPayment(parseFloat(e.target.value));
                                    } else {
                                        setInputPayment(0);
                                    }
                                }}
                            />
                            {
                                inputPayment <= balance ?
                                    <>{
                                        payment > inputPayment ?
                                            <h6 className="col-12 text-danger mt-2">*pago parcial de cuota, saldo pendiente: {currencytype} {formatNumber(payment - inputPayment)}</h6>
                                            : ('')

                                    }
                                        {inputPayment > payment ?
                                            <h6 className="col-12 text-danger mt-2">*pago de multiples cuotas</h6> : ('')
                                        }
                                    </> : ('')
                            }
                        </Row>

                    </div>
            }


        </>
    );
}