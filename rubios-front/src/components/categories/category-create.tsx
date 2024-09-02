import { Col, Row } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../redux/hooks/hooks";
import { add } from "../../redux/slices/category-slice";
import { CategoryForm } from "./category-form";
import { CategoryCreateDto } from "../../entities/dto/category-create-dto";
import { RootState } from "../../redux/store/store";

export const CategoryCreate = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { isLoading, isError } = useAppSelector((state: RootState) => state.categories);
    const initialValuesForm = {
        name: ''
    }

    const submit = async (values: any) => {
        var category: CategoryCreateDto = { name: values.name };
 
        await dispatch(add(category));
        if (!isLoading && !isError) navigate('/categories');
    }

    return (
        <Row className='justify-content-center p-3'>
            <Col sm={4} className="bg-body-tertiary shadow p-3 mb-2 bg-white rounded">
                <Row className="justify-content-center border-bottom border-bottom-1 pb-2">
                    <Col lg="4">
                        <h3 className='text-center'>Nueva Categoría</h3>
                    </Col>
                </Row>

                <CategoryForm initialValuesForm={initialValuesForm} submit={submit} isLoading={isLoading}></CategoryForm>
            </Col>

        </Row>
    )
}