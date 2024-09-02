import { Col, Row } from "react-bootstrap"
import { useNavigate, useParams } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../redux/hooks/hooks";
import { add, getById, update } from "../../redux/slices/category-slice";
import { CategoryForm } from "./category-form";
import { CategoryCreateDto } from "../../entities/dto/category-create-dto";
import { RootState } from "../../redux/store/store";
import { useEffect, useState } from "react";
import Loading from "../common/loading";

export const CategoryEdit = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const { isLoading, isError, categorySelected } = useAppSelector((state: RootState) => state.categories);
    const category: any = { ...categorySelected };
    const [categoryLoaded, setCategoryLoaded] = useState(false);

    const submit = async (values: any) => {
        category.name = values.name;
        await dispatch(update(category.id, category));
        if (!isLoading && !isError) navigate('/categories');
    }

    async function getCategory() {
        if (id) {
            await dispatch(getById(id));
            setCategoryLoaded(true);
        }
    }

    useEffect(() => {
        getCategory();
    }, [id])

    if (!categoryLoaded) {
        return <Loading/> // Puedes mostrar un indicador de carga
    }

    return (
        <Row className='justify-content-center p-3'>
            <Col sm={4} className="bg-body-tertiary shadow p-3 mb-2 bg-white rounded">
                <Row className="justify-content-center border-bottom border-bottom-1 pb-2">
                    <Col lg="4">
                        <h3 className='text-center'>Modificación Categoría</h3>
                    </Col>
                </Row>

                <CategoryForm initialValuesForm={category} submit={submit} isLoading={isLoading}></CategoryForm>
            </Col>

        </Row>
    )
};
export default CategoryEdit;