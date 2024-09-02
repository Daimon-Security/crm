import { Field, Form, Formik } from "formik";
import { Button, Col, Row } from "react-bootstrap";
import CustomErrorMessage from "../custom-error/error-message";
import DatePicker from 'react-datepicker';
import { Link } from "react-router-dom";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/hooks";
import { RootState } from "../../redux/store/store";
import * as Yup from 'yup';
import { es } from "date-fns/locale";
import AutocompleteSelect from '../common/autocomplete-select';
import { PaymentsPreviousModal } from "../credit/payments-previous-modal";
import { setPaymentsDetailCreateDto } from "../../redux/slices/sale-credit-slice";
import useNumberFormatter from "../../redux/hooks/useNumberFormatter";

interface SalePaymentProps {
    initialValues: any,
    dateSale: any,
    submit: (values: any, saleTotal: any, payment: any, firstPayment: Date, isSubmitting: boolean) => void
    totalSale: string;
    handleHideSalePayment: () => void,
    isLoading: boolean
}

export const SaleFormPayment = ({ initialValues, dateSale, submit, totalSale, handleHideSalePayment, isLoading }: SalePaymentProps) => {
    // console.log("initial date: ", date);
    const dispatch = useAppDispatch();
    const formatNumber = useNumberFormatter();
    const { debtCollectors } = useAppSelector((state: RootState) => state.users);
    const { saleSelected } = useAppSelector((state: RootState) => state.sales);
    const { paymentFrequencies, creditSelected, paymentsDetailCreateDto } = useAppSelector((state: RootState) => state.saleCredits);
    const [saleCreditTotal, setSaleCreditTotal] = useState<string>((initialValues.numberPayment * initialValues.payment).toFixed(2));
    const [downPayment, setDownPayment] = useState<string>(initialValues.downPayment);
    const [pendingTotal, setPendingTotal] = useState<number>(parseFloat(totalSale)-initialValues.downPayment);
    const [firstPayment, setFirstPayment] = useState<Date>(dateSale);
    const [payment, setPayment] = useState<string>(initialValues.payment);
    const [paymentType, setPaymentType] = useState<string>(initialValues.paymentType)
    const [errorDownPayment, setErrorDownPayment] = useState<boolean>();
    const [changed, setChanged] = useState<boolean>(false);

    const paymentsTypes = [
        { id: 1, value: 'Contado' },
        { id: 2, value: 'Crédito' }
    ]
    const [show, setShow] = useState<boolean>(false);
    //console.log("valores iniciales form payment: ", initialValues);

    function getOptionsDebtCollectors() {
        return debtCollectors.map((option: any) => {
            return { id: option.id, label: option.lastName + " " + option.name }
        })
    }

    function resetForm(setFieldValue: any) {
        setFieldValue('debtCollectorId', null);
        setFieldValue('commission', '');
        setFieldValue('paymentFrequency', 'Un pago');
        setFieldValue('numberPayment', 1);
        setFieldValue('interestRate', '5');
        setFieldValue('payment', '0,00');
        //setFirstPayment(dateSale);
    }

    const validationSchema = Yup.object().shape({
        paymentType: Yup.string().required('*Método de pago es requerido'),
        numberPayment: Yup.number().required('*Campo es requerido'),
        paymentFrequency: Yup.string().required('*Campo es requerido'),
        interestRate: Yup.string().required('*Campo es requerido'),
        debtCollectorId: Yup.string().required('*Campo es requerido'),
        commission: Yup.string().required('*Campo es requerido'),
        downPayment: Yup.number().required('*Campo es requerido'),
    });

    const notValidation = Yup.object().shape({
    });

    function getSchemaValidation() {
        return (paymentType == 'Contado') ? notValidation : validationSchema;
    }


    const calculatePayments = (values: any, total: string, setFieldValue: any, rate: number, numberPayment: number) => {
        setChanged(true)
        const pay = parseFloat((parseFloat(total) * (1 + (rate / 100)) / numberPayment).toFixed(2));
        setPayment(pay.toFixed(2));
        setFieldValue('payment', pay.toFixed(2));
        const totalCredit = pay * numberPayment;
        setSaleCreditTotal(totalCredit.toFixed(2));
    };

    function returnFormSale() {
        handleHideSalePayment()
    }

    function getStatusBtnPayment(values: any) {
        return (values.paymentType == 'Contado' || saleSelected) ? true : false;
    }

    function handleOpenPaymentsModal() {
        setShow(true);
    }

    function handleClosePaymentsModal() {
        setShow(false);
    }

    function onSubmit(values: any, isSubmitting: boolean) {
        submit(values, totalSale, payment, firstPayment, isSubmitting)
    }

    function updateChanged() {
        setChanged(false);
    }

    return (
        <>
            <Row className="border-bottom border-bottom-1">
                <Col lg="4">
                    <h5 className=''>Información del pago</h5>
                </Col>
            </Row>
            <Formik
                initialValues={initialValues}
                validationSchema={getSchemaValidation}
                onSubmit={(values: any) => {
                    onSubmit(values, true)
                }}
            >
                {({ handleSubmit,
                    values,
                    setFieldValue,
                    isSubmitting }) => (
                    <Form onSubmit={handleSubmit} className='pt-2'>
                        <Row>
                            <Col lg="4" xs="12" className='my-2'>
                                <div className="form-group">
                                    <label htmlFor="paymentType" className='mb-2'>Forma de pago</label>
                                    <Field className="form-control" as="select" name="paymentType" id="paymentType"
                                        disabled={(saleSelected)}
                                        onChange={(e: any) => {
                                            const option = e.target.value;
                                            //console.log("payment type: ", option)
                                            setPaymentType(option);
                                            if (option == 'Crédito') {
                                                setFieldValue('paymentType', option);
                                                if (totalSale != null) {
                                                    setSaleCreditTotal(totalSale);
                                                    calculatePayments(values, totalSale, setFieldValue, values.interestRate, values.numberPayment);
                                                }
                                            } else {
                                                resetForm(setFieldValue);
                                                setSaleCreditTotal('0,00');
                                                setPayment('0,00');
                                                setFieldValue('paymentType', option);
                                            }
                                        }}
                                    >
                                        <option value="" disabled hidden>Seleccionar</option>
                                        {paymentsTypes.map(type => (
                                            <option value={type.value} key={type.id}>{type.value}</option>
                                        ))}

                                    </Field>
                                    <CustomErrorMessage name="paymentType" />
                                </div>
                            </Col>
                            <Col lg="4" xs="12" className='my-2'>
                                <div className="form-group">
                                    <label htmlFor="total" className='mb-2'>Total Contado $</label>
                                    <input className="form-control" value={formatNumber(totalSale)}
                                        disabled
                                    />
                                </div>
                            </Col>
                            <Col lg="4" xs="12" className='my-2'>
                                <div className="form-group">
                                    <label htmlFor="total" className='mb-2'>Anticipo</label>
                                    {/* <input className="form-control"
                                        type="number"
                                        value={formatNumber(downPayment)}
                                        disabled={(paymentType == 'Contado' || saleSelected)}
                                        onChange={(e: any) => {
                                             //setDownPayment(e.target.value)
                                             const newTotalPending = parseFloat(totalSale) - e.target.value;
                                             setPendingTotal(newTotalPending);
                                             calculatePayments(values, newTotalPending.toFixed(2), setFieldValue, values.interestRate, values.numberPayment)
                                            
                                            if (e.target.value <= parseFloat(totalSale)) {
                                                console.log("anticipo: ", e.target.value);
                                                setErrorDownPayment(false);
                                            }else{
                                                setErrorDownPayment(true);
                                            }
                                        }}
                                    /> */}
                                    <Field className="form-control" name="downPayment" id="downPayment"
                                        type="number"
                                        disabled={(paymentType == 'Contado' || saleSelected)}
                                        onChange={(e: any) => {
                                            dispatch(setPaymentsDetailCreateDto([]));
                                            //setDownPayment(e.target.value)
                                            setFieldValue('downPayment', e.target.value);
                                            const newTotalPending = parseFloat(totalSale) - e.target.value;
                                            setPendingTotal(newTotalPending);
                                            calculatePayments(values, newTotalPending.toFixed(2), setFieldValue, values.interestRate, values.numberPayment)

                                            if (e.target.value <= parseFloat(totalSale)) {
                                                console.log("anticipo: ", e.target.value);
                                                setErrorDownPayment(false);
                                            } else {
                                                setErrorDownPayment(true);
                                            }
                                        }}
                                    ></Field>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col lg="4" xs="12" className='my-2'>
                                <div className="form-group">
                                    <label htmlFor="total" className='mb-2'>Total pendiente $</label>
                                    <input className="form-control" value={formatNumber(pendingTotal)}
                                        disabled
                                    />
                                </div>
                            </Col>
                            <Col lg="4" xs="12" className='my-2'>
                                <div className="form-group">
                                    <label htmlFor="interestRate" className='mb-2'>Tasa %</label>
                                    <Field className="form-control" name="interestRate" id="interestRate" type="number"
                                        disabled={(paymentType == 'Contado' || saleSelected)}
                                        onChange={(e: any) => {
                                            dispatch(setPaymentsDetailCreateDto([]));
                                            console.log("e.target.value: ", e.target.value)
                                            setFieldValue('interestRate', e.target.value);
                                            calculatePayments(values, pendingTotal.toFixed(2), setFieldValue, e.target.value, values.numberPayment);
                                        }

                                        } />
                                    <CustomErrorMessage name="interestRate" />
                                </div>
                            </Col>
                            <Col lg="4" xs="12" className='my-2'>
                                <div className="form-group">
                                    <label htmlFor="total" className='mb-2'>Total Crédito$</label>
                                    <input className="form-control" value={formatNumber(saleCreditTotal)}
                                        disabled
                                    />
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col lg="3" xs="12" className='my-2'>
                                <div className="form-group">
                                    <label htmlFor="paymentFrequency" className='mb-2'>Frecuencia</label>
                                    <Field className="form-control" as="select" name="paymentFrequency" id="paymentFrequency"
                                        disabled={(paymentType == 'Contado' || saleSelected)}
                                        onChange={(e: any) => {
                                            //console.log("frecuencia seleccionada: ", e);
                                            dispatch(setPaymentsDetailCreateDto([]));
                                            setFieldValue('paymentFrequency', e.target.value);
                                        }}
                                    >
                                        <option value="" disabled hidden>Seleccionar</option>
                                        {paymentFrequencies.map(frecuency => (
                                            <option value={frecuency.value} key={frecuency.id}>{frecuency.value}</option>
                                        ))}

                                    </Field>
                                    <CustomErrorMessage name="paymentFrequency" />
                                </div>
                            </Col>
                            <Col lg="3" xs="12" className='my-2'>
                                <div className="form-group">
                                    <label htmlFor="numberPayment" className='mb-2'>Nº de Cuotas</label>
                                    <Field className="form-control" name="numberPayment" id="numberPayment" type="number"
                                        disabled={(paymentType == 'Contado' || saleSelected || values.paymentFrequency == 'Un pago')}
                                        onChange={(e: any) => {
                                            if (totalSale != null) {
                                                dispatch(setPaymentsDetailCreateDto([]));
                                                setFieldValue('numberPayment', e.target.value);
                                                calculatePayments(values, pendingTotal.toFixed(2), setFieldValue, values.interestRate, e.target.value);
                                            }
                                        }

                                        } />
                                    <CustomErrorMessage name="numberPayment" />
                                </div>
                            </Col>
                            <Col lg="3" xs="12" className='my-2'>
                                <div className="form-group">
                                    <label htmlFor="payment" className='mb-2'>Cuota $</label>
                                    <input className="form-control" value={formatNumber(payment)}
                                        disabled
                                    />
                                </div>
                            </Col>
                            <Col lg="3" xs="12" className='my-2 d-flex align-items-end'>
                                <button className="btn btn-success col-12" type='button' disabled={getStatusBtnPayment(values)} onClick={handleOpenPaymentsModal}>Pagos a generar</button>
                            </Col>
                        </Row>
                        <Row>
                            {debtCollectors ?
                                <Col lg='7' xs='12' className='my-2'>
                                    <div className="form-group">
                                        <label htmlFor="debtCollectorId" className='mb-2'>Cobrador</label>
                                        <Field name="debtCollectorId" id="debtCollectorId" component={AutocompleteSelect} placeholder={'escribir un nombre...'} options={getOptionsDebtCollectors()}
                                            disabled={(paymentType == 'Contado' || saleSelected)}
                                            onSelect={() => { }}
                                        />
                                        <CustomErrorMessage name="debtCollectorId" />
                                    </div>
                                </Col> : ('')
                            }

                            <Col lg="2" xs="12" className='my-2'>
                                <div className="form-group">
                                    <label htmlFor="commission" className='mb-2'>Comisión %</label>
                                    <Field className="form-control" name="commission" id="commission" type="number"
                                        disabled={(paymentType == 'Contado' || saleSelected)}
                                    />
                                    <CustomErrorMessage name="commission" />
                                </div>
                            </Col>

                            <Col lg="3" className='my-2 form-group input-date'>
                                <label htmlFor="firstPayment" className='mb-2'>Fecha de 1º pago</label>
                                <DatePicker
                                    disabled={(paymentType == 'Contado' || saleSelected)}
                                    id="startDate"
                                    locale={es}
                                    dateFormat="dd/MM/yyyy"
                                    className="form-control"
                                    selected={(paymentType == 'Contado') ? new Date() : firstPayment}
                                    onChange={(date) => {
                                        if (date)
                                            setFirstPayment(date)
                                    }
                                    }
                                    selectsStart
                                    startDate={firstPayment}
                                    placeholderText="Selecciona una fecha"
                                />
                            </Col>
                        </Row>
                        {
                            saleSelected ?
                                <Row className='pt-2 justify-content-center'>
                                    <Col lg="3" className='justify-content-center py-1'>
                                        <Button
                                            className="btn btn-md btn-secondary col-12"
                                            type="button"
                                            disabled={isSubmitting}
                                            onClick={() => handleHideSalePayment()}
                                        >
                                            Volver
                                        </Button>
                                    </Col>
                                    <Col lg="3" className='justify-content-center py-1'>
                                        <Button
                                            className="btn btn-md col-12 btn-danger"
                                            type="submit"
                                            disabled={isSubmitting}
                                        // onClick={cancelSubmit}
                                        >
                                            Anular
                                        </Button>
                                    </Col>
                                    {isLoading ?
                                        <div className="spinner-border text-primary mt-2" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div> : ('')
                                    }
                                </Row> :
                                <Row className='pt-2 justify-content-center'>
                                    <Col lg="3" className='justify-content-center py-1'>
                                        <Button
                                            className="btn btn-md btn-secondary col-12"
                                            type="button"
                                            disabled={isSubmitting}
                                            onClick={() => {
                                                onSubmit(values, isSubmitting);
                                                handleHideSalePayment()
                                            }
                                            }
                                        >
                                            Volver
                                        </Button>
                                    </Col>
                                    <Col lg="3" className='justify-content-center py-1'>
                                        <Button
                                            className="btn btn-md col-12"
                                            type="submit"
                                            disabled={isSubmitting || errorDownPayment}
                                        >
                                            Guardar
                                        </Button>
                                    </Col>
                                    {isLoading ?
                                        <div className="spinner-border text-primary mt-2" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div> : ('')
                                    }
                                </Row>
                        }

                        {
                            show ?
                                <PaymentsPreviousModal
                                    valuesForm={values}
                                    firstPayment={firstPayment}
                                    show={show}
                                    onClose={handleClosePaymentsModal}
                                    paymentsDetailCreateDto={paymentsDetailCreateDto}
                                    creditSelected={creditSelected}
                                    changed={changed}
                                    updateChanged={updateChanged}

                                /> : ('')
                        }
                    </Form >

                )}
            </Formik >
        </>
    )
};

export default SaleFormPayment;