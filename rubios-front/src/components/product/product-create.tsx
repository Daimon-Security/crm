import { Col, Row } from "react-bootstrap";
import { ProductForm } from "./product-form";
import { ProductCreateDto } from "../../entities/dto/product-create-dto";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/hooks";
import { add } from "../../redux/slices/product-slice";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../redux/store/store";

export const ProductCreate = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { isLoading, isError, message } = useAppSelector((state: RootState) => state.products);
    const initialValuesForm:any = {
        code: '',
        name: '',
        categoryId: '',
        description: '',
        stock: '',
        costPesos: '',
        costDollar: '',
        pricePesos: '',
        priceDollar: ''
    }
  
    const submit = async (values: any) => {
        var product: ProductCreateDto = {
            code: values.code,
            name: values.name,
            categoryId: parseInt(values.categoryId),
            description: values.description,
            stock: values.stock,
            costPesos: values.costPesos,
            costDollar: values.costDollar,
            pricePesos: values.pricePesos,
            priceDollar: values.priceDollar
        };
        await dispatch(add(product));
        if (!isLoading && !isError && !message) navigate('/products')
    }
    return (
        <Row className='justify-content-center p-3'>
            <Col sm={8} className="bg-body-tertiary shadow p-3 mb-2 bg-white rounded">
                <Row className="justify-content-center border-bottom border-bottom-1 pb-2">
                    <Col lg="4">
                        <h3 className='text-center'>Nuevo Producto</h3>
                    </Col>
                </Row>

                <ProductForm initialValuesForm={initialValuesForm} submit={submit} isLoading={isLoading}></ProductForm>
            </Col>
        </Row>
    )
};
export default ProductCreate;