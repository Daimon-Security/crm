import { Field, Form, Formik } from "formik";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/hooks";
import { RootState } from "../../redux/store/store";
import * as Yup from 'yup';
import { Button, Col, Row } from "react-bootstrap";
import CustomErrorMessage from "../custom-error/error-message";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { getAll } from "../../redux/slices/category-slice";
import { setProductSelected } from "../../redux/slices/product-slice";

export const ProductForm = ({ initialValuesForm, submit, isLoading }: any) => {
    const dispatch = useAppDispatch();
    const { categories } = useAppSelector((state: RootState) => state.categories);
    const { productSelected } = useAppSelector((state: RootState) => state.products);
    console.log("valores recibidos: ", initialValuesForm);


    const commonValidationSchema = Yup.object().shape({
        code: Yup.string().required('*Campo obligatorio.'),
        name: Yup.string().required('*Campo obligatorio.'),
        categoryId: Yup.string().required('*Campo obligatorio.'),
        description: Yup.string().required('*Campo obligatorio.'),
        pricePesos: Yup.number().min(1, '*Ingrese un importe mayor a 0.').required('*Campo obligatorio.'),
        priceDollar: Yup.number().min(1, '*Ingrese un importe mayor a 0.').required('*Campo obligatorio.'),
    });

    const createValidationSchema = Yup.object().shape({
        ...commonValidationSchema.fields,
        stock: Yup.number().min(1, '*El stock debe ser mayor a 0.').required('*Campo obligatorio.'),
        costPesos: Yup.number().min(1, '*Ingrese un importe mayor a 0.').required('*Campo obligatorio.'),
        costDollar: Yup.number().min(1, '*Ingrese un importe mayor a 0.').required('*Campo obligatorio.'),
    });

    const getValidation = () => {
        return (productSelected) ? commonValidationSchema : createValidationSchema;
    }


    const goBack = () => {
        dispatch(setProductSelected(null))
    };

    useEffect(() => {
        dispatch(getAll());
    }, [])


    return (
        <Formik
            initialValues={initialValuesForm}
            validationSchema={getValidation}
            validateOnBlur={false}
            validateOnChange={false}
            onSubmit={(values, actions) => {
                submit(values, actions);
            }}
        >
            {({ handleSubmit,
                values,
                resetForm,
                isSubmitting }) => (
                <Form onSubmit={handleSubmit} className='pt-2'>
                    <Row>
                        <Col lg="2" className='my-2'>
                            <div className="form-group">
                                <label htmlFor="code" className='mb-2'>Código</label>
                                <Field className="form-control" name="code" id="code" type="text"
                                >
                                </Field>
                                <CustomErrorMessage name="code" />
                            </div>
                        </Col>
                        <Col lg="7" xs="12" className='my-2'>
                            <div className="form-group">
                                <label htmlFor="name" className='mb-2'>Nombre</label>
                                <Field className="form-control" name="name" id="name" type="text"
                                >
                                </Field>
                                <CustomErrorMessage name="name" />
                            </div>
                        </Col>
                        <Col lg='3' xs='12' className='my-2'>
                            <div className="form-group">
                                <label htmlFor="category" className='mb-2'>Categoría</label>
                                <Field className="form-control" as="select" name="categoryId" id="category" placeholder="Seleccionar">
                                    <option value={0} hidden>Seleccionar</option>
                                    {categories.map(category => (
                                        <option value={category.id} key={category.id}>{category.name}</option>
                                    ))}

                                </Field>
                                <CustomErrorMessage name="categoryId" />
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col className='my-2'>
                            <div className="form-group">
                                <label htmlFor="description" className='mb-2'>Descripción</label>
                                <Field className="form-control" name="description" id="description" type="text"
                                >
                                </Field>
                                <CustomErrorMessage name="description" />
                            </div>
                        </Col>
                        {!productSelected ? (
                            <Col lg="3" xs="12" className='my-2'>
                                <div className="form-group">
                                    <label htmlFor="stock" className='mb-2'>Stock</label>
                                    <Field className="form-control" name="stock" id="stock" type="number" />
                                    <CustomErrorMessage name="stock" />
                                </div>
                            </Col>
                        ) : ('')
                        }
                    </Row>
                    <Row>
                        {!productSelected ? (
                            <>
                                <Col lg="3" xs="12" className='my-2'>
                                    <div className="form-group">
                                        <label htmlFor="costPesos" className='mb-2'>Costo $</label>
                                        <Field className="form-control" name="costPesos" id="costPesos" type="number" />
                                        <CustomErrorMessage name="costPesos" />
                                    </div>
                                </Col>
                                <Col lg="3" xs="12" className='my-2'>
                                    <div className="form-group">
                                        <label htmlFor="costDollar" className='mb-2'>Costo $USD</label>
                                        <Field className="form-control" name="costDollar" id="costDollar" type="number" />
                                        <CustomErrorMessage name="costDollar" />
                                    </div>
                                </Col>
                            </>
                        ) : ('')}
                        <Col lg={(productSelected) ? 6 : 3} xs="12" className='my-2'>
                            <div className="form-group">
                                <label htmlFor="pricePesos" className='mb-2'>Precio $</label>
                                <Field className="form-control" name="pricePesos" id="pricePesos" type="number" />
                                <CustomErrorMessage name="pricePesos" />
                            </div>
                        </Col>
                        <Col lg={(productSelected) ? 6 : 3} xs="12" className='my-2'>
                            <div className="form-group">
                                <label htmlFor="priceDollar" className='mb-2'>Precio $USD</label>
                                <Field className="form-control" name="priceDollar" id="priceDollar" type="number" />
                                <CustomErrorMessage name="priceDollar" />
                            </div>
                        </Col>
                    </Row>
                    <Row className='pt-2 justify-content-center'>
                        <Col lg="3" className='justify-content-center py-1'>
                            <Link to="/products">
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
                </Form>
            )}
        </Formik>
    )
};