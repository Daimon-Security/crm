import { Col, Row } from "react-bootstrap";
import { ProductForm } from "./product-form";
import { ProductCreateDto } from "../../entities/dto/product-create-dto";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/hooks";
import { add, getById, update } from "../../redux/slices/product-slice";
import { useNavigate, useParams } from "react-router-dom";
import { RootState } from "../../redux/store/store";
import { useEffect, useState } from "react";
import { ProductUpdateDto } from "../../entities/dto/product-update-dto";
import Loading from "../common/loading";

export const ProductEdit = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const { isLoading, isError, message, productSelected } = useAppSelector((state: RootState) => state.products);
    const [productLoaded, setProductLoaded] = useState(false);

    const submit = async (values: any) => {
        var product: ProductUpdateDto = {
            code: values.code,
            name: values.name,
            categoryId: parseInt(values.categoryId),
            description: values.description,
            pricePesos: parseFloat(values.pricePesos),
            priceDollar: parseFloat(values.priceDollar)
        };
        if (id) await dispatch(update(id, product));
        if (!isLoading && !isError && !message) navigate('/products')
    }

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
        return <Loading/> // Puedes mostrar un indicador de carga
    }

    return (
        <>
            <Row className='justify-content-center p-3'>
                <Col sm={8} className="bg-body-tertiary shadow p-3 mb-2 bg-white rounded">
                    <Row className="justify-content-center border-bottom border-bottom-1 pb-2">
                        <Col lg="4">
                            <h3 className='text-center'>Modificar Producto</h3>
                        </Col>
                    </Row>
                    <ProductForm initialValuesForm={productSelected} submit={submit} isLoading={isLoading}></ProductForm>
                </Col>
            </Row>
        </>
    )
};
export default ProductEdit;