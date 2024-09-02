import { Field, Formik, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Col, Row, Button } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../../redux/hooks/hooks';
import CustomErrorMessage from '../custom-error/error-message';
import { Link } from 'react-router-dom';
import { MdVpnKey, MdVpnKeyOff } from 'react-icons/md';
import { useState } from 'react';
import './styles.css';
import { setUserSelected } from '../../redux/slices/user-slice';
import { RootState } from '../../redux/store/store';

export const UserForm = ({ initialValuesForm, submit, isLoading, submitting }: any) => {
    const dispatch = useAppDispatch();
    const { userSelected } = useAppSelector((state: RootState) => state.users);
    const [showPassword, setShowPassword] = useState(false);
    const [showRepeatPassword, setShowRepeatPassword] = useState(false);
    const [isChecked, setIsChecked] = useState<boolean>(false);
    console.log("initila values: ", initialValuesForm);

    const validationSchemaUserCreate = Yup.object().shape({
        lastName: Yup.string().required('*Campo obligatorio.'),
        name: Yup.string().required('*Campo obligatorio.'),
        roleName: Yup.string().required('*Campo obligatorio.'),
        phoneNumber: Yup.string().required('*Campo obligatorio.'),
        address: Yup.string().required('*Campo obligatorio.'),
        email: Yup.string().required('*Campo obligatorio.'),
        userName: Yup.string().required('*Campo obligatorio.'),
        password: Yup.string()
            .min(8, '*La contraseña debe tener al menos 8 caracteres').required('*Campo obligatorio.'),
        repeatPassword: Yup.string()
            .oneOf([Yup.ref('password')], '*Las contraseñas deben coincidir')
            .required('*Debes confirmar tu contraseña'),
    });

    const validationSchemaUserEdit = Yup.object().shape({
        lastName: Yup.string().required('*Campo obligatorio.'),
        name: Yup.string().required('*Campo obligatorio.'),
        roleName: Yup.string().required('*Campo obligatorio.'),
        phoneNumber: Yup.string().required('*Campo obligatorio.'),
        address: Yup.string().required('*Campo obligatorio.'),
        email: Yup.string().required('*Campo obligatorio.'),
        userName: Yup.string().required('*Campo obligatorio.'),
    });

    const getValidation = () => {
        return (userSelected && !isChecked) ? validationSchemaUserEdit : validationSchemaUserCreate;
    }

    const goBack = () => {
        dispatch(setUserSelected(null))
    };

    const togglePasswordVisibility = (input: string) => {
        if (input == 'password') {
            setShowPassword(!showPassword);
        } else {
            setShowRepeatPassword(!showRepeatPassword);
        }
    };

    return (
        <>
            {/* <Row >
                <Col> */}
            <Formik
                initialValues={initialValuesForm}
                validationSchema={getValidation}
                onSubmit={(values, actions) => {
                    submit(values, actions);
                }}
            >
                {({ handleSubmit,
                    setFieldValue,
                    values,
                    isSubmitting }) => (
                    <Form onSubmit={handleSubmit} className='pt-2'>
                        <Row>
                            <Col lg="4" className='py-2'>
                                <div className="form-group">
                                    <label htmlFor="lastName" className='mb-2'>Apellido</label>
                                    <Field className="form-control" name="lastName" id="lastName" type="text">
                                    </Field>
                                    <CustomErrorMessage name="lastName" />
                                </div>
                            </Col>
                            <Col lg="4" className='py-2'>
                                <div className="form-group">
                                    <label htmlFor="name" className='mb-2'>Nombre</label>
                                    <Field className="form-control" name="name" id="address" type="text">
                                    </Field>
                                    <CustomErrorMessage name="name" />
                                </div>
                            </Col>
                            <Col lg="4" xs="12" className='py-2'>
                                <div className="form-group">
                                    <label htmlFor="roleName" className='mb-2'>Tipo</label>
                                    <Field className="form-control" as="select" name="roleName" id="roleName">
                                        <option value="" disabled>Seleccionar</option>
                                        <option value="admin">Administrador/a</option>
                                        <option value="debt-collector">Cobrador/a</option>
                                    </Field>
                                    <CustomErrorMessage name="roleName" />
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col lg="4" className='py-2'>
                                <div className="form-group">
                                    <label htmlFor="address" className='mb-2'>Dirección</label>
                                    <Field className="form-control" name="address" id="address" type="text">
                                    </Field>
                                    <CustomErrorMessage name="address" />
                                </div>
                            </Col>
                            <Col lg="4" className='py-2'>
                                <div className="form-group">
                                    <label htmlFor="phoneNumber" className='mb-2'>Teléfono</label>
                                    <Field className="form-control" name="phoneNumber" id="phoneNumber" type="text">
                                    </Field>
                                    <CustomErrorMessage name="phoneNumber" />
                                </div>
                            </Col>
                            <Col lg="4" xs="12" className='py-2'>
                                <div className="form-group">
                                    <label htmlFor="email" className='mb-2'>Email</label>
                                    <Field className="form-control" name="email" id="email" type="text" />
                                    <CustomErrorMessage name="email" />
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col lg="4" xs="12" className='py-2'>
                                <div className="form-group">
                                    <label htmlFor="userName" className='mb-2'>Usuario</label>
                                    <Field className="form-control" name="userName" id="userName" type="text" />
                                    <CustomErrorMessage name="userName" />
                                </div>
                            </Col>
                            <Col lg="4" xs="12" className='py-2'>
                                <div className="form-group">
                                    <label htmlFor="password" className='mb-2 me-2'>Nueva Contraseña</label>
                                    {
                                        userSelected ?
                                            <input
                                                type="checkbox"
                                                checked={isChecked ? true : false}
                                                onChange={(e: any) => {
                                                    setIsChecked(!isChecked);
                                                }}
                                            /> : ('')
                                    }
                                    <div className={`form-control ${!isChecked && userSelected ? 'input-password-disabled' : ''}`}>
                                        <Field
                                            disabled={!isChecked && userSelected}
                                            type={showPassword ? 'text' : 'password'}
                                            className={`col-10 notBorder ${!isChecked && userSelected ? 'input-password-disabled' : ''}`}
                                            id="password"
                                            name="password"
                                        />
                                        <button type="button" className="notBorder bg-transparent col-2" onClick={() => togglePasswordVisibility('password')}>
                                            {showPassword ? (<MdVpnKey />) : (<MdVpnKeyOff />)}
                                        </button>
                                    </div>
                                    <CustomErrorMessage name="password" />
                                </div>
                            </Col>
                            <Col lg="4" xs="12" className='py-2'>
                                <div className="form-group">
                                    <label htmlFor="repeatPassword" className='mb-2'>Repetir Contraseña</label>
                                    <div className={`form-control ${!isChecked && userSelected ? 'input-password-disabled' : ''}`}>
                                        <Field
                                            disabled={!isChecked && userSelected}
                                            type={showRepeatPassword ? 'text' : 'password'}
                                            className={`col-10 notBorder ${!isChecked && userSelected ? 'input-password-disabled' : ''}`}
                                            id="repeatPassword"
                                            name="repeatPassword"

                                        />
                                        <button type="button" className="notBorder bg-transparent col-2" onClick={() => togglePasswordVisibility('repeatPassword')}>
                                            {showRepeatPassword ? (<MdVpnKey />) : (<MdVpnKeyOff />)}
                                        </button>
                                    </div>
                                    <CustomErrorMessage name="repeatPassword" />
                                </div>
                            </Col>
                        </Row>
                        <Row className='pt-2 justify-content-center'>
                            <Col lg="3" className='justify-content-center py-1'>
                                <Link to="/users">
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
                            <Col lg="3" className='justify-content-center py-1'>
                                <Button
                                    className="btn btn-md col-12"
                                    type="submit"
                                    disabled={submitting}
                                    onClick={() => console.log("values formulario: ", values)}
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

export default UserForm;