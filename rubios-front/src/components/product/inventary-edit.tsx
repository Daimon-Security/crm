import { Field, Form, Formik } from "formik";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/hooks";
import { RootState } from "../../redux/store/store";
import * as Yup from 'yup';
import { Button, Col, Row } from "react-bootstrap";
import CustomErrorMessage from "../custom-error/error-message";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAll } from "../../redux/slices/category-slice";
import { addInventory, getById, setProductSelected } from "../../redux/slices/product-slice";
import Loading from "../common/loading";
import { InventoryCreateDto } from "../../entities/dto/inventory-create-dto";
import useNumberFormatter from "../../redux/hooks/useNumberFormatter";

export const InventoryEdit = () => {
    const dispatch = useAppDispatch();
    const { id } = useParams();
    const navigate = useNavigate();
    const formatNumber = useNumberFormatter();
    const { productSelected, isLoading } = useAppSelector((state: RootState) => state.products);
    const [productLoaded, setProductLoaded] = useState(false);
    const initialValuesForm = {
        stock: '',
        costPesos: '',
        costDollar: ''
    }

    const validationSchema = Yup.object().shape({
        stock: Yup.number().min(1, '*El stock debe ser mayor a 0.').required('*Campo obligatorio.'),
        costPesos: Yup.number().min(1, '*Ingrese un importe mayor a 0.').required('*Campo obligatorio.'),
        costDollar: Yup.number().min(1, '*Ingrese un importe mayor a 0.').required('*Campo obligatorio.'),
    });


    const goBack = () => {
        dispatch(setProductSelected(null))
    };

    async function getProduct() {
        if (id) {
            console.log("id: ", id);
            await dispatch(getById(id));
            setProductLoaded(true);
        }
    }

    useEffect(() => {
        getProduct();
    }, [id])

    if (!productLoaded) {
        return <Loading /> // Puedes mostrar un indicador de carga
    }

    const submit = async (values: any) => {
        const inventory: InventoryCreateDto = {
            amount: values.stock,
            costPesos: values.costPesos,
            costDollar: values.costDollar
        };
        if (id) await dispatch(addInventory(id, inventory));
        navigate('/products');
    }

    return (
        <Row className='justify-content-center p-3'>
            <Col sm={8} className="bg-body-tertiary shadow p-3 mb-2 bg-white rounded">
                <Row className="justify-content-center border-bottom border-bottom-1 pb-2">
                    <Col lg="12">
                        <h3 className='text-center'>Modificación de stock</h3>
                    </Col>
                    <Col lg="12">
                        <h4 className='text-center'>{productSelected?.name.toUpperCase()}</h4>
                    </Col>
                    <Col lg="12">
                        <h5 className='text-center'>stock: {productSelected?.stock}</h5>
                    </Col>
                </Row>
                <Row className="border-bottom pe-2 ps-2">
                    <div className="ps-2 d-flex align-items-center col-lg-3">
                        <Col className="d-flex align-items-center">
                            <h6 className="pe-1">Código: </h6><p className="pt-2">{productSelected?.code}</p>
                        </Col>
                    </div>
                    <div className="ps-2 d-flex align-items-center col-lg-3">
                        <Col className="d-flex align-items-center">
                            <h6 className="pe-1">Categoría: </h6><p className="pt-2">{productSelected?.category}</p>
                        </Col>
                    </div>
                    <div className="ps-2 d-flex align-items-center col-lg-3">
                        <Col className="d-flex align-items-center">
                            <h6 className="pe-1">Precio $: </h6><p className="pt-2">{formatNumber(productSelected?.pricePesos)}</p>
                        </Col>
                    </div>
                    <div className="ps-2 d-flex align-items-center col-lg-3">
                        <Col className="d-flex align-items-center">
                            <h6 className="pe-1">Precio $USD: </h6><p className="pt-2">{formatNumber(productSelected?.priceDollar)}</p>
                        </Col>
                    </div>
                </Row>

                <Formik
                    initialValues={initialValuesForm}
                    validationSchema={validationSchema}
                    validateOnBlur={false}
                    validateOnChange={false}
                    onSubmit={(values, actions) => {
                        submit(values);
                    }}
                >
                    {({ handleSubmit,
                        values,
                        resetForm,
                        isSubmitting }) => (
                        <Form onSubmit={handleSubmit} className='pt-2'>
                            <Row className="justify-content-center">
                                <Col lg="3" xs="12" className='my-2'>
                                    <div className="form-group">
                                        <label htmlFor="stock" className='mb-2'>Stock</label>
                                        <Field className="form-control" name="stock" id="stock" type="number" />
                                        <CustomErrorMessage name="stock" />
                                    </div>
                                </Col>
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


            </Col>
        </Row>
    )
};