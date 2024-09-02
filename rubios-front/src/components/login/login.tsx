import { Field, Formik, FormikProps } from "formik";
import { Alert, Button, Col, Form, Row } from "react-bootstrap";
import CustomErrorMessage from "../custom-error/error-message";
import { useEffect, useState } from "react";
import { MdVpnKey, MdVpnKeyOff } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from 'yup';
import { useAppDispatch, useAppSelector } from "../../redux/hooks/hooks";
import { UserLogin } from "../../entities/dto/user-login";
import { logIn } from "../../redux/slices/auth-slice";
import { RootState } from "../../redux/store/store";

export const Login = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { isLoading, isError, message, token, isAuthenticate } = useAppSelector((state: RootState) => state.auth);
    const [showPassword, setShowPassword] = useState(false);
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const validationSchema = Yup.object().shape({
        email: Yup.string().required('*Campo obligatorio.'),
        password: Yup.string().required('*Campo obligatorio.'),
    })

    const login = async (values: any) => {
        const userLogin: UserLogin = {
            email: values.email,
            password: values.password
        };
        await dispatch(logIn(userLogin));
       

    };

    useEffect(() => {
        if (isAuthenticate && token) {
            navigate('/home');
        }
    }, [isAuthenticate, token, navigate]);

    return (
        <Row className='justify-content-center'>
            <Col sm={4} xs='10' className="bg-body-tertiary shadow pt-3 mb-2 bg-white rounded">
                <Row className="justify-content-center border-bottom border-bottom-1 pb-2">
                    <Col lg="6" xs='4'>
                        <h3>Iniciar Sesión</h3>
                    </Col>
                </Row>
                <Row className="justify-content-center mt-3">
                    <Col lg="8">
                        <Formik
                            initialValues={{ email: '', password: '' }}
                            validationSchema={validationSchema}
                            onSubmit={(values, actions) => {
                                login(values);
                            }}
                        >
                            {({ handleSubmit,
                                isSubmitting }) => (
                                <Form onSubmit={handleSubmit}>
                                    <div className="form-group mb-3">
                                        <label htmlFor="useremailName" className='mb-2'>Email</label>
                                        <Field className="form-control" name="email" id="email" type="text" />
                                        <CustomErrorMessage name="email" />
                                        <p className={`text-danger fs-6 ${isError && message.email ? 'd-block' : 'd-none'}`}>*{message.email}</p>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="password" className='mb-2'>Contraseña</label>
                                        <div className='form-control'>
                                            <Field
                                                type={showPassword ? 'text' : 'password'}
                                                className="col-10 notBorder"
                                                id="password"
                                                name="password"
                                            />
                                            <button type="button" className="notBorder bg-transparent col-2" onClick={togglePasswordVisibility}>
                                                {showPassword ? (<MdVpnKey />) : (<MdVpnKeyOff />)}
                                            </button>
                                        </div>
                                        <CustomErrorMessage name="password" />
                                        <p className={`text-danger fs-6 ${isError && message.password ? 'd-block' : 'd-none'}`}>*{message.password}</p>

                                    </div>
                                    {/* <Link to="/about" className="fs-8">recuperar contraseña</Link> */}
                                    <Button
                                        className="btn btn-md col-12 my-4 pt-1"
                                        type="submit"
                                    >
                                        Ingresar
                                    </Button>
                                </Form>
                            )}
                        </Formik>
                    </Col>
                </Row>

            </Col>
        </Row>
    )
};
export default Login;