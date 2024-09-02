import React, { useEffect, useState } from 'react';
import { Field, Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Col, Row, Button } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../../redux/hooks/hooks';
import { RootState } from '../../redux/store/store';
import CustomErrorMessage from '../custom-error/error-message';
import { Link, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import { es } from 'date-fns/locale';
import AutocompleteSelect from '../common/autocomplete-select';
import '../styles.css';
import { SaleDetailCreateDto } from '../../entities/dto/sale-detail-create-dto';
import { getAll, getByCategory, setProductSelected, setProducts, updateStock } from '../../redux/slices/product-slice';
import SaleDetailTable from './sale-detail-table';
import { ProductListDto } from '../../entities/dto/product-list';
import { MdAddCircleOutline } from 'react-icons/md';
import useNumberFormatter from '../../redux/hooks/useNumberFormatter';
import { setClientSelected } from '../../redux/slices/client-slice';
import AutocompleteProduct from './autocomplete-product';

export const SaleForm = ({ initialValues, saleDetailsInitial, submit, handleHideSalePayment }: any) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const formatNumber = useNumberFormatter();
    const { saleSelected } = useAppSelector((state: RootState) => state.sales);
    const { clients } = useAppSelector((state: RootState) => state.clients);
    const { products, stock, productSelected } = useAppSelector((state: RootState) => state.products);
    const { categories } = useAppSelector((state: RootState) => state.categories);
    const [saleDetails, setSaleDetails] = useState<SaleDetailCreateDto[]>(saleDetailsInitial)
    const [date, setDate] = useState<Date>(initialValues.date);
    const [saleTotal, setSaletotal] = useState<string>(initialValues.total);
    const [showValidationSaleDetail, setShowValidation] = useState<boolean>(false);


    const validationSchemaSaleCash = Yup.object().shape({
        clientId: Yup.string().required('Nombre del cliente es requerido'),
        categoryId: Yup.string(),
        code: Yup.string(),
        date: Yup.string(),
        productId: Yup.string(),
        paymentType: Yup.string(),
        typeCurrency: Yup.string().required('Campo requerido.'),
    });



    const notValidation = Yup.object().shape({
    });

    function getSchemaValidationSale() {
        return (saleSelected) ? notValidation : validationSchemaSaleCash;
    }

    function getOptionsClients() {
        return clients.map((option: any) => {
            return { id: option.id, label: option.lastName + " " + option.name }
        })
    }

    function getOptionsProducts() {
        return products.map((option: any) => {
            return { id: option.id, label: option.name }
        })
    }

    function getOptionsCode() {
        return products.map((option: any) => {
            return { id: option.code, label: option.code };
        });
    }

    function getOptionsCategories() {
        return categories.map((option: any) => {
            return { id: option.id, label: option.name }
        })
    }

    function getProduct(propertyName: string, value: any) {
        console.log("buscando en products: ", products);
        return products.find((x: ProductListDto) => x[propertyName] == value);
    }

    function updateProduct(index: any, values: any, setFieldValue: any) {
        const updatedSaleDetails = [...saleDetails];
        const existingProduct = updatedSaleDetails[index];
        existingProduct.quantity += parseInt(values.quantity);
        existingProduct.total += values.quantity * values.price;
        setSaleDetails(updatedSaleDetails);
        const newTotal = (parseFloat(saleTotal) + (values.quantity * values.price)).toFixed(2);
        setSaletotal(newTotal);
    }


    function addNewProduct(values: any, setFieldValue: any) {
        const existingIndex = saleDetails.findIndex(x => x.productId == values.productId);
        dispatch(updateStock(parseInt(values.quantity)))
        if (existingIndex != (-1)) {
            updateProduct(existingIndex, values, setFieldValue);
        } else {
            const newSaleDetail: SaleDetailCreateDto = {
                code: values.code,
                productId: values.productId,
                productName: (values.productId) ? products.find(x => x.id == values.productId)?.name : '',
                quantity: parseInt(values.quantity),
                price: values.price,
                total: values.quantity * values.price
            };
            setSaleDetails([...saleDetails, newSaleDetail]);
            const newTotal = (parseFloat(saleTotal) + newSaleDetail.total).toFixed(2);
            setSaletotal(newTotal);
        }
        dispatch(setProductSelected(null));
    }

    function resetValuesProduct(values: any, setFieldValue: any) {
        setFieldValue('categoryId', '');
        setFieldValue('code', '');
        setFieldValue('productId', '')
        setFieldValue('quantity', 1);
        setFieldValue('price', 0);
        dispatch(getAll());
        dispatch(setProductSelected(null));
    }

    function removeProduct(index: any) {
        const detail = saleDetails[index];
        const updatedSaleDetails = [...saleDetails];
        updatedSaleDetails.splice(index, 1);
        setSaleDetails(updatedSaleDetails);
        const newTotal = (parseFloat(saleTotal) - detail.total).toFixed(2);
        setSaletotal(newTotal);
    }

    function handleCategoryChange(event: any) {
        dispatch(getByCategory(event));
    }


    function setValueCode(product: any, setFieldValue: any, values: any) {
        if (product.stock > 0) {
            setFieldValue('quantity', 1)
            setFieldValue('code', product?.code || '');
            const price = (values.typeCurrency == 'peso') ? product?.pricePesos : product?.priceDollar;
            setFieldValue('price', price);
        } else {
            setFieldValue('price', 0);
            setFieldValue('quantity', 0)
        }
    }

    function setProduct(selectedOption: any, setFieldValue: any, values: any) {
        console.log("product: ", getProduct('code', selectedOption));
        const product = getProduct('code', selectedOption);
        setFieldValue('productId', product?.id || '');
        const price = (values.typeCurrency == 'peso') ? product?.pricePesos : product?.priceDollar;
        setFieldValue('price', price);
    }

    function checkStock(quantity: any, product: ProductListDto) {
        return (product && quantity <= product?.stock)
    }

    function setQuantity(quantity: any, productId: any, setFieldValue: any) {
        const product = getProduct('id', productId);
        if (quantity >= 0 && product) {
            checkStock(quantity, product) ? setFieldValue('quantity', quantity) : setFieldValue('quantity', product?.stock);
        } else {
            setFieldValue('quantity', 0);
        }
    }

    function getStock(id: number) {
        const productStock = saleDetails.find(x => x.productId == id);
        var newStock = stock;
        if (productStock) {
            newStock = newStock - productStock.quantity;
        }
        return newStock;
    }

    function unSelectProduct(setFieldValue: any) {
        setFieldValue('productId', null);
        setFieldValue('code', null);
        setFieldValue('quantity', 1);
        setFieldValue('price', 0);
        dispatch(setProductSelected(null))
    }

    // useEffect(() => {
    // }, [stock])

    return (

        <>
            <Row className="border-bottom border-bottom-1">
                <Col lg="4">
                    <h5 className=''>Información de la venta</h5>
                </Col>
            </Row>
            <Formik
                initialValues={initialValues}
                validationSchema={getSchemaValidationSale}
                onSubmit={(values: any, { setSubmitting }) => {
                    console.log("values: ", values);
                    if (saleDetails.length > 0 && values.clientId != null) {
                        handleHideSalePayment();              
                        dispatch(setProductSelected(null));          
                        submit(values, saleTotal, saleDetails, date)
                    }
                }}
            >
                {({ handleSubmit,
                    values,
                    setFieldValue,
                    isSubmitting }) => (
                    <Form onSubmit={handleSubmit} className='pt-2'>
                        <Row>
                            {clients ?
                                <Col lg='6' xs='12' className='my-2'>
                                    <div className="form-group">
                                        <label htmlFor="clientId" className='mb-2'>Cliente</label>
                                        <Field name="clientId" id="clientId" component={AutocompleteSelect} placeholder={'escribir un nombre...'} options={getOptionsClients()}
                                            disabled={saleSelected}
                                            onSelect={(e: any) => {
                                                console.log("client: ", e)
                                                const client = clients.find(x => x.id == e);
                                                if(client)dispatch(setClientSelected(client));
                                            }}
                                        />
                                        <div className='col-12 d-lg-none'>
                                            <CustomErrorMessage name="clientId" />
                                        </div>
                                    </div>
                                </Col> : ('')
                            }
                            <Col lg="2" xs="12" className='my-2 d-flex align-items-end'>
                                <div className='col-12'>
                                    <button className="btn btn-primary col-12" type='button' disabled={(saleSelected) ? true : false} onClick={() => navigate('/client-create/2')}>Nuevo cliente <MdAddCircleOutline /></button>
                                </div>
                            </Col>
                            <Col lg="2" xs='12' className='my-2 form-group input-date'>
                                <label htmlFor="date" className='mb-2'>Fecha</label>
                                <DatePicker
                                    disabled={saleSelected}
                                    id="startDate"
                                    locale={es}
                                    dateFormat="dd/MM/yyyy"
                                    className="form-control"
                                    selected={date}
                                    onChange={(date) => {
                                        if (date) setDate(date)
                                    }}
                                    selectsStart
                                    startDate={date}
                                    placeholderText="Selecciona una fecha"
                                />
                            </Col>
                            <Col lg="2" xs="12" className='my-2'>
                                <div className="form-group">
                                    <label htmlFor="typeCurrency" className='mb-2'>Moneda</label>
                                    <Field className="form-control" as="select" name="typeCurrency" id="typeCurrency"
                                        disabled={saleDetails.length > 0}
                                    >
                                        <option value="" disabled hidden>Seleccionar</option>
                                        <option value={'peso'} key={'peso'}>Peso</option>
                                        <option value={'dolar'} key={'dolar'}>Dolar</option>
                                    </Field>
                                </div>
                            </Col>
                            <div className='col-12 d-none d-lg-block'>
                                <CustomErrorMessage name="clientId" />
                            </div>
                        </Row>
                        <Row>
                            {products ?
                                <Col lg='2' xs='12' className='my-2'>
                                    <div className="form-group">
                                        <label htmlFor="categoryId" className='mb-2'>Categoría</label>
                                        <Field name="categoryId" id="categoryId" component={AutocompleteSelect} placeholder={'escribir...'} options={getOptionsCategories()}
                                            disabled={saleSelected}
                                            onSelect={handleCategoryChange}
                                        />
                                        <CustomErrorMessage name="categoryId" />
                                    </div>
                                </Col> : ('')
                            }
                            {products ?
                                <Col lg='2' xs='12' className='my-2'>
                                    <div className="form-group">
                                        <label htmlFor="code" className='mb-2'>Cód.</label>
                                        <Field name="code" id="code" component={AutocompleteSelect} options={getOptionsCode()}
                                            disabled={saleSelected}
                                            onSelect={(selectedOption: any) => {
                                                if (selectedOption) {
                                                    setProduct(selectedOption, setFieldValue, values);
                                                }
                                            }}
                                        />
                                        <CustomErrorMessage name="code" />
                                    </div>
                                </Col> : ('')
                            }
                            {products ?
                                <Col lg='5' xs='12' className='my-2'>
                                    <div className="form-group">
                                        <label htmlFor="productId" className='mb-2'>Producto</label>
                                        <Field name="productId" id="productId" component={AutocompleteProduct} placeholder={'escribir un nombre...'} options={getOptionsProducts()}
                                            disabled={saleSelected}
                                            onSelect={(selectedOption: any) => {
                                                console.log("products: ", products);
                                                if (selectedOption) {
                                                    const product = getProduct('id', selectedOption);
                                                    if (product) dispatch(setProductSelected(product));
                                                    setValueCode(product, setFieldValue, values);

                                                }
                                            }}
                                            unSelect={() => unSelectProduct(setFieldValue)}
                                        />
                                    </div>
                                    {
                                        productSelected ?
                                            <p className={`${productSelected.stock > 0? 'text-primary':'text-danger'} px-1 mt-1`}>*stock: {getStock(values.productId)}</p> : ('')
                                    }
                                </Col> : ('')
                            }
                            <Col lg="1" xs="12" className='my-2'>
                                <div className="form-group">
                                    <label htmlFor="quantity" className='mb-2'>Cantidad</label>
                                    <Field className="form-control" name="quantity" id="quantity" type="number"
                                        disabled={saleSelected}
                                        onBlur={(e: any) => {
                                            console.log("cantidad: ", e.target.value);
                                            const value = e.target.value;
                                            setQuantity(value, values.productId, setFieldValue)
                                        }}
                                    />
                                </div>
                            </Col>
                            <Col lg="2" xs="12" className='my-2'>
                                <div className="form-group">
                                    <label htmlFor="price" className='mb-2'>Precio</label>
                                    <Field className="form-control" name="price" id="price" type="number"
                                        disabled={saleSelected}
                                    />
                                </div>
                            </Col>
                        </Row>
                        <Row className='d-flex justify-content-center'>
                            <Col lg="3" className='justify-content-center py-1'>
                                <Button
                                    className="btn btn-md col-12 bg-success"
                                    disabled={(saleSelected != null || getStock(values.productId) == 0)}
                                    type="button" onClick={() => {
                                        if (values.productId != null && values.productId != '') {
                                            addNewProduct(values, setFieldValue);
                                            resetValuesProduct(values, setFieldValue);
                                        }
                                    }}
                                >
                                    Agregar
                                </Button>
                            </Col>
                        </Row>
                        <Row>
                            <SaleDetailTable saleDetails={saleDetails} onRemoveProduct={removeProduct} disabled={saleSelected} />
                            {
                                saleDetails.length == 0 && showValidationSaleDetail ?
                                    <p style={{ color: 'red' }}>*Deber cargar al menos un producto.</p> : ('')
                            }
                        </Row>
                        <Row className='d-flex justify-content-end'>
                            <Col lg="3" xs="12" className='my-2'>
                                <div className="form-group">
                                    <label htmlFor="total" className='mb-2'>Total Contado $</label>
                                    <input className="form-control" value={formatNumber(saleTotal)}
                                        disabled
                                    />
                                    <CustomErrorMessage name="total" />
                                </div>
                            </Col>
                        </Row>


                        <Row className='pt-2 justify-content-center'>
                            <Col lg="3" className='justify-content-center py-1'>
                                <Link to="/sales">
                                    <Button
                                        className="btn btn-md btn-secondary col-12"
                                        type="button"
                                    >
                                        Volver
                                    </Button>
                                </Link>
                            </Col>
                            <Col lg="3" className='justify-content-center py-1'>
                                <Button
                                    className="btn btn-md col-12"
                                    type="submit"
                                    onClick={() => setShowValidation(true)}
                                >
                                    Forma de pago
                                </Button>
                            </Col>
                        </Row>
                    </Form >
                )}
            </Formik >
        </>
    )
};

export default SaleForm;