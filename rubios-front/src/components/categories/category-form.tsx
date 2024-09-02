import { Field, Form, Formik } from "formik";
import { Button, Col, Row } from "react-bootstrap";
import CustomErrorMessage from "../custom-error/error-message";
import { Link } from "react-router-dom";
import * as Yup from 'yup';
import { useAppDispatch } from "../../redux/hooks/hooks";
import { add } from "../../redux/slices/category-slice";

export const CategoryForm = ({ initialValuesForm, submit, isLoading }: any) => {
    const dispatch = useAppDispatch();

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('*Campo obligatorio.'),
    })

    return (
        <Formik
            initialValues={initialValuesForm}
            validationSchema={validationSchema}
            onSubmit={(values, actions) => {
                submit(values);
            }}
        >
            {({ handleSubmit,
                values,
                isSubmitting }) => (
                <Form onSubmit={handleSubmit} className='pt-2'>
                    <Row>
                        <Col className='my-2'>
                            <div className="form-group">
                                <label htmlFor="name" className='mb-2'>Nombre</label>
                                <Field className="form-control" name="name" id="name" type="text" />
                                <CustomErrorMessage name="name" />
                            </div>
                        </Col>
                    </Row>
                    <Row className='pt-2 justify-content-center'>
                        <Col lg="4" className='justify-content-center py-1'>
                            <Link to="/categories">
                                <Button
                                    className="btn btn-md btn-secondary col-12"
                                    type="submit"
                                    disabled={isSubmitting}
                                >
                                    Volver
                                </Button>
                            </Link>
                        </Col>
                        <Col lg="4" className='justify-content-center py-1'>
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
                </Form>
            )}
        </Formik>
    )
}