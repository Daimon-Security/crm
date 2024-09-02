import { Field, Formik, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Col, Row, Button } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../../redux/hooks/hooks';
import CustomErrorMessage from '../custom-error/error-message';
import { Link, useLocation, useParams } from 'react-router-dom';
import { RootState } from '../../redux/store/store';
import { setClientSelected } from '../../redux/slices/client-slice';
import { useState } from 'react';

export const ClientForm = ({ initialValuesForm, submit, submitting, isLoading }: any) => {
    const dispatch = useAppDispatch();
    const { type } = useParams();
    const location = useLocation();
    const route = location.pathname;
    const [clientType, setClientType] = useState(type);
    initialValuesForm.clientNumber = (initialValuesForm.clientNumber) ? initialValuesForm.clientNumber : '';

    const clientTypes = [
        {value:1, label:'Crédito'},
        {value:2, label:'Venta'},
        // {value:3, label:'Crédito-Venta'},

    ]

    const validationSchemaForm = Yup.object().shape({
        lastName: Yup.string().required('*Campo obligatorio.'),
        name: Yup.string().required('*Campo obligatorio.'),
        type: Yup.string().required('*Campo obligatorio.'),
    });

    const goBack = () => {
        console.log('client Type: ', clientType);
        dispatch(setClientSelected(null))
    };

    return (
        <>
            {/* <Row >
                <Col> */}
            <Formik
                initialValues={initialValuesForm}
                validationSchema={validationSchemaForm}
                onSubmit={(values, actions) => {
                    setClientType(values.type);
                    submit(values, actions);
                }}
            >
                {({ handleSubmit,
                    setFieldValue,
                    values }) => (
                    <Form onSubmit={handleSubmit} className='pt-2'>
                        <Row>
                            <Col lg="5" className='my-2'>
                                <div className="form-group">
                                    <label htmlFor="lastName" className='mb-2'>Apellido</label>
                                    <Field className="form-control" name="lastName" id="lastName" type="text">
                                    </Field>
                                    <CustomErrorMessage name="lastName" />
                                </div>
                            </Col>
                            <Col lg="5" className='my-2'>
                                <div className="form-group">
                                    <label htmlFor="name" className='mb-2'>Nombre</label>
                                    <Field className="form-control" name="name" id="address" type="text">
                                    </Field>
                                    <CustomErrorMessage name="name" />
                                </div>
                            </Col>
                            <Col lg="2" className='my-2'>
                                <div className="form-group">
                                    <label htmlFor="clientNumber" className='mb-2'>Nº Ficha</label>
                                    <Field className="form-control" name="clientNumber" id="clientNumber" type="number">
                                    </Field>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col lg="4" className='my-2'>
                                <div className="form-group">
                                    <label htmlFor="type" className='mb-2'>Tipo</label>
                                    <Field className="form-control" as="select" name="type" id="type" disabled={route == `/client-create/${type}` && clientType} 
                                    onChange={(e: any)=> {
                                        console.log('typo select: ', e.target.value);
                                        setFieldValue('type', e.target.value); 
                                    }}>
                                        {clientTypes.map(type => (
                                            <option value={type.value} selected={(route == `/client-create/${type}` && clientType && type.value == parseInt(clientType))?true: false} key={type.value}>{type.label}</option>
                                        ))}
                                    </Field>
                                    <CustomErrorMessage name="paymentFrequency" />
                                </div>
                            </Col>
                            <Col lg="4" className='my-2'>
                                <div className="form-group">
                                    <label htmlFor="address" className='mb-2'>Dirección</label>
                                    <Field className="form-control" name="address" id="address" type="text">
                                    </Field>
                                </div>
                            </Col>
                            <Col lg="4" className='my-2'>
                                <div className="form-group">
                                    <label htmlFor="phoneNumber" className='mb-2'>Teléfono</label>
                                    <Field className="form-control" name="phoneNumber" id="phoneNumber" type="text">
                                    </Field>
                                </div>
                            </Col>
                        </Row>
                        <Row className='pt-2 justify-content-center'>
                            <Col lg="4" className='justify-content-center py-1'>
                                <Link to={`/clients/${type}`}>
                                    <Button
                                        className="btn btn-md btn-secondary col-12"
                                        type="submit"
                                        disabled={submitting}
                                        onClick={goBack}
                                    >
                                        Volver
                                    </Button>
                                </Link>
                            </Col>
                            <Col lg="4" className='justify-content-center py-1'>
                                <Button
                                    className="btn btn-md col-12"
                                    type="submit"
                                    disabled={submitting}
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
                    </Form>
                )}
            </Formik>
        </>
    )
};

export default ClientForm;