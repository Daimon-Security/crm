import React, { useEffect, useState } from 'react';
import { Field, Formik, FormikProps, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Col, Row, Button } from 'react-bootstrap';
import { CreditCreateDto } from '../../entities/dto/credit-create-dto';
import { useAppDispatch, useAppSelector } from '../../redux/hooks/hooks';
import { RootState } from '../../redux/store/store';
import CustomErrorMessage from '../custom-error/error-message';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { setCreditSelected, setPaymentsDetailCreateDto } from '../../redux/slices/credit-slice';
import DatePicker from 'react-datepicker';
import { es } from 'date-fns/locale';
import AutocompleteSelect from '../common/autocomplete-select';
import '../styles.css';
import { PaymentsPreviousModal } from '../credit/payments-previous-modal';
import { PaymentDetail } from '../../entities/payment-detail';
import { addDays, addMonths, format } from 'date-fns';
import { PaymentDetailCreateDto, StatusPayment } from '../../entities/dto/payment-detail-create-dto';
import { setClientSelected } from '../../redux/slices/client-slice';
import { MdAddCircleOutline } from 'react-icons/md';
import useNumberFormatter from '../../redux/hooks/useNumberFormatter';

interface CreditFormProps {
    initialValuesForm: any,
    submit: () => void,
    creditSelected: any,
    paymentFrequencies: [],
    isLoading: boolean
}

export const CreditForm = ({ initialValuesForm, submit, creditSelected, paymentFrequencies, isLoading }: any) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const location = useLocation();
    const route = location.pathname;
    const formatNumber = useNumberFormatter();
    const { didPayments, paymentsDetailCreateDto } = useAppSelector((state: RootState) => state.credits);
    const { clients } = useAppSelector((state: RootState) => state.clients);
    const { debtCollectors } = useAppSelector((state: RootState) => state.users);
    const [firstPayment, setFirstPayment] = useState<Date>(initialValuesForm.firstPayment);
    const [date, setDate] = useState<Date>(initialValuesForm.date);
    const [show, setShow] = useState<boolean>(false);
    const [changed, setChanged] = useState<boolean>(true);
    
    console.log("valores a amodificar: ", initialValuesForm);
    const validationSchemaCreditCreate = Yup.object().shape({
        clientId: Yup.string().required('*Campo obligatorio.'),
        debtCollectorId: Yup.string().required('*Campo obligatorio.'),
        principal: Yup.number().min(1, '*El valor debe ser mayor o igual a 1').required('*Campo obligatorio.'),
        numberPayment: Yup.string().required('*Campo obligatorio.'),
        paymentFrequency: Yup.string().required('*Campo obligatorio.'),
        typeCurrency: Yup.string().required('*Campo obligatorio.'),
        commission: Yup.number().min(0, '*El valor debe ser mayor o igual a 1').required('*Campo obligatorio.'),
    });

    const validationSchemaCreditEdit = Yup.object().shape({
        debtCollectorId: Yup.string().required('*Campo obligatorio.'),
        typeCurrency: Yup.string().required('*Campo obligatorio.'),
    });

    const getValidation = () => {
        return (creditSelected) ? validationSchemaCreditEdit : validationSchemaCreditCreate;
    }

    const [payment, setPayment] = useState<number>(0);


    const goBack = () => {
        dispatch(setCreditSelected(null))
        dispatch(setClientSelected(null));
    };


    const calculatePayments = (values: any) => {
        setChanged(true)
        const pay = parseFloat((values.principal * (1 + (values.interestRate / 100)) / values.numberPayment).toFixed(2));
        console.log("setting changed")
       
        setPayment(pay);
        return pay;
    };

    function getOptionsClients() {
        return clients.map((option: any) => {
            return { id: option.id, label: option.lastName + " " + option.name }
        })
    }

    function getOptionsDebtCollectors() {
        return debtCollectors.map((option: any) => {
            return { id: option.id, label: option.lastName + " " + option.name }
        })
    }


    function getStatusBtnPayment(values: any) {
        return ((!values.paymentFrequency || values.paymentFrequency == "") || (!values.payment || values.payment == "") || (creditSelected && didPayments)) ? true : false;
    }

    function handleOpenPaymentsModal() {
        setShow(true);
        console.log("didPayment: ", didPayments);
        console.log("route: ", route);
        //if(!didPayments && (route == `/personal-credit/${creditSelected.id}/edit` || `/sale-credit/${creditSelected.id}/edit`)) setChanged(true);
    }

    function handleClosePaymentsModal() {
        setShow(false);
    }

    function updateChanged() {
        setChanged(false);
    }

    return (
        <>
            <Formik
                initialValues={initialValuesForm}
                validationSchema={getValidation}
                onSubmit={(values, actions) => {
                    submit(values, date, firstPayment);
                }}
            >
                {({ handleSubmit,
                    setFieldValue,
                    handleBlur,
                    values,
                    resetForm,
                    isSubmitting }) => (
                    <Form onSubmit={handleSubmit} className='pt-2'>
                        <Row>
                            {clients ?
                                <>
                                    <Col lg='4' xs='12' className='my-2'>
                                        <div className="form-group">
                                            <label htmlFor="clientId" className='mb-2'>Cliente</label>
                                            <Field name="clientId" id="clientId" component={AutocompleteSelect} placeholder={'escribe un nombre...'} options={getOptionsClients()}
                                                disabled={creditSelected && didPayments}
                                                onSelect={() => { }}
                                            />
                                            <div className='col-12 d-lg-none'>
                                                <CustomErrorMessage name="clientId" />
                                            </div>
                                        </div>
                                    </Col>
                                </>
                                : ('')
                            }
                            <Col lg="2" xs="12" className='my-2 d-flex align-items-end'>
                                <div className='col-12'>
                                    <button className="btn btn-primary col-12" type='button' disabled={(creditSelected && didPayments) ? true : false} onClick={() => navigate('/client-create/1')}>Nuevo cliente <MdAddCircleOutline /></button>
                                </div>
                            </Col>
                            {debtCollectors ?
                                <Col lg='4' xs='12' className='my-2'>
                                    <div className="form-group">
                                        <label htmlFor="debtCollectorId" className='mb-2'>Cobrador</label>
                                        <Field name="debtCollectorId" id="debtCollectorId" component={AutocompleteSelect} placeholder={'escribe un nombre...'} options={getOptionsDebtCollectors()}
                                            onSelect={() => { }} />
                                        <div className='col-12 d-lg-none'>
                                            <CustomErrorMessage name="debtCollectorId" />
                                        </div>
                                    </div>
                                </Col> : ('')
                            }
                            <Col lg="2" xs='12' className='my-2 form-group input-date'>
                                <label htmlFor="date" className='mb-2'>Fecha</label>
                                <DatePicker
                                    disabled={(creditSelected && didPayments) || route == `/sale-credit/${id}/edit`}
                                    id="startDate"
                                    locale={es}
                                    dateFormat="dd/MM/yyyy"
                                    className="form-control"
                                    selected={date}
                                    onChange={(date) => { if (date) setDate(date) }}
                                    selectsStart
                                    startDate={date}
                                    placeholderText="Selecciona una fecha"
                                />
                            </Col>
                            <div className='col-6 d-none d-lg-block'>
                                <CustomErrorMessage name="clientId" />
                            </div>
                            <div className='col-6 d-none d-lg-block'>
                                <CustomErrorMessage name="debtCollectorId" />
                            </div>
                        </Row>
                        <Row>
                            <Col lg="3" className='my-2 form-group input-date'>
                                <label htmlFor="firstPayment" className='mb-2'>Fecha de 1º pago</label>
                                <DatePicker
                                    disabled={creditSelected && didPayments}
                                    id="startDate"
                                    locale={es}
                                    dateFormat="dd/MM/yyyy"
                                    className="form-control"
                                    selected={firstPayment}
                                    onChange={(date) => {
                                        if (date) setFirstPayment(date);
                                        dispatch(setPaymentsDetailCreateDto([]));
                                    }}
                                    selectsStart
                                    startDate={firstPayment}
                                    placeholderText="Selecciona una fecha"
                                />
                            </Col>
                            <Col lg="3" xs="12" className='my-2'>
                                <div className="form-group">
                                    <label htmlFor="paymentFrequency" className='mb-2'>Frecuencia</label>
                                    <Field className="form-control" as="select" name="paymentFrequency" id="paymentFrequency" disabled={creditSelected && didPayments}
                                        onChange={(e: any) => {
                                            //console.log("frecuencia seleccionada: ", e);
                                            dispatch(setPaymentsDetailCreateDto([]));
                                            setFieldValue('paymentFrequency', e.target.value);
                                        }}
                                    >
                                        <option value="" disabled hidden>Seleccionar</option>
                                        {paymentFrequencies.map((frecuency: any) => (
                                            <option value={frecuency.value} key={frecuency.id}>{frecuency.value}</option>
                                        ))}

                                    </Field>
                                    <CustomErrorMessage name="paymentFrequency" />
                                </div>
                            </Col>
                            <Col lg="3" xs="12" className='my-2'>
                                <div className="form-group">
                                    <label htmlFor="numberPayment" className='mb-2'>Nº de Pagos</label>
                                    <Field className="form-control" name="numberPayment" id="numberPayment" type="number" disabled={((creditSelected && didPayments) || values.paymentFrequency == 'Un pago')}
                                        onBlur={(e: any) => {
                                            dispatch(setPaymentsDetailCreateDto([]));
                                            if (values.principal != null) {
                                                const result = calculatePayments(values);
                                                setFieldValue('payment', result);
                                            }
                                        }

                                        } />
                                    <CustomErrorMessage name="numberPayment" />
                                </div>
                            </Col>
                            <Col lg="3" xs="12" className='my-2'>
                                <div className="form-group">
                                    <label htmlFor="typeCurrency" className='mb-2'>Moneda</label>
                                    <Field className="form-control" as="select" name="typeCurrency" id="typeCurrency" disabled={creditSelected && didPayments}>
                                        <option value="" disabled hidden>Seleccionar</option>
                                        <option value={'peso'} key={'peso'}>Peso</option>
                                        <option value={'dolar'} key={'dolar'}>Dolar</option>
                                    </Field>
                                    <CustomErrorMessage name="typeCurrency" />
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col lg="3" xs="12" className='my-2'>
                                <div className="form-group">
                                    <label htmlFor="interestRate" className='mb-2'>Tasa %</label>
                                    <Field className="form-control" name="interestRate" id="interestRate" type="number" disabled={creditSelected && didPayments}
                                        onBlur={(e: any) => {
                                            dispatch(setPaymentsDetailCreateDto([]));
                                            const result = calculatePayments(values);
                                            setFieldValue('payment', result);
                                        }

                                        } />
                                </div>
                            </Col>
                            <Col lg="3" xs="12" className='my-2'>
                                <div className="form-group">
                                    <label htmlFor="principal" className='mb-2'>Capital $</label>
                                    <Field className="form-control" name="principal" id="principal" type="number" disabled={(creditSelected && didPayments) || route == `/sale-credit/${id}/edit`}
                                        onBlur={(e: any) => {
                                            dispatch(setPaymentsDetailCreateDto([]));
                                            const result = calculatePayments(values);
                                            setFieldValue('payment', result);
                                        }

                                        } />
                                    <CustomErrorMessage name="principal" />
                                </div>
                            </Col>
                            <Col lg="3" xs="12" className='my-2'>
                                <div className="form-group">
                                    <label htmlFor="payment" className='mb-2'>Pago $</label>
                                    <Field className="form-control" name="payment" id="payment" type="number" disabled onChange={() => {
                                        dispatch(setPaymentsDetailCreateDto([]));
                                    }} />
                                </div>
                            </Col>
                            <Col lg="3" xs="12" className='my-2 d-flex align-items-end'>
                                <button className="btn btn-success col-12" type='button' disabled={getStatusBtnPayment(values)} onClick={handleOpenPaymentsModal}>Pagos a generar</button>
                            </Col>
                        </Row>
                        <Row>
                            <Col lg="3" xs="12" className='my-2'>
                                <div className="form-group">
                                    <label htmlFor="commission" className='mb-2'>Comisión %</label>
                                    <Field className="form-control" name="commission" id="commission" type="number" />
                                    <CustomErrorMessage name="commission" />
                                </div>
                            </Col>

                            {
                                route == `/personal-credit/${id}/edit` || route == '/personal-credit-create' ?
                                    <Col className='my-2 col-lg-9 col-12'>
                                        <div className="form-group">
                                            <label htmlFor="information" className='mb-2'>Información adicional para el cobro</label>
                                            <Field className="form-control" name="information" id="information" type="text" />
                                        </div>
                                    </Col>
                                    : ('')
                            }
                        </Row>
                        {
                            (creditSelected && didPayments) ?
                                <div>
                                    <h6 className='text-danger'>***Algunos campos no pueden modificarse debido a que el cliente ya efectuó pagos.</h6>
                                </div> : ('')
                        }

                        <Row className='pt-2 justify-content-center'>
                            <Col lg="3" className='justify-content-center py-1'>
                                <Link to={(route == `/personal-credit/${id}/edit` || route == '/personal-credit-create') ? "/personal-credit-list" : "/sale-credits"}>
                                    <Button
                                        className="btn btn-md btn-secondary col-12"
                                        type="submit"
                                        disabled={isSubmitting}
                                        onClick={goBack}
                                    >
                                        Volver
                                    </Button>
                                </Link>
                            </Col>
                            <Col lg="3" className='justify-content-center py-1'>
                                <Button
                                    className="btn btn-md col-12"
                                    type="submit"
                                    disabled={isSubmitting}
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

                    </Form>

                )}
            </Formik >



        </>
    )
};

export default CreditForm;