import { useEffect, useState } from "react";
import { Col, Row, Table } from "react-bootstrap";
import { Tbody, Td, Th, Thead, Tr } from "react-super-responsive-table";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/hooks";
import { getProducts } from "../../redux/slices/report-slice";
import { RootState } from "../../redux/store/store";
import Loading from "../common/loading";
import { getAll as getCategories, setCategorySelected } from "../../redux/slices/category-slice";
import { Category } from "../../entities/category";
import { es } from "date-fns/locale";
import DatePicker from 'react-datepicker';
import FilterDate from "../common/fllter-date";
import { subMonths } from "date-fns";

export const ProductsReport = () => {
    const dispatch = useAppDispatch();
    const { products, isLoading } = useAppSelector((state: RootState) => state.reports);
    const { categories } = useAppSelector((state: RootState) => state.categories);
    const currentDate = new Date();
    const [startDate, setStartDate] = useState(subMonths(currentDate, 1));
    const [endDate, setEndDate] = useState(currentDate);
    const [category, setCategory] = useState('all');
    const [apply, setApply] = useState(false);

    function applyfilter() {
        setApply(true);
        dispatch(getProducts(category, startDate, endDate));
    }

    function offApplyfilter() {
        setCategory('all');
        setStartDate(subMonths(currentDate, 1));
        setEndDate(currentDate);
        setApply(false);
        dispatch(getProducts('all', subMonths(currentDate, 1), currentDate));
    }

    useEffect(() => {
        dispatch(getCategories());
        dispatch(getProducts(category, startDate, endDate));
    }, [])

    if (isLoading) {
        return <Loading />
    }


    return (
        <div className="card m-3">
            <div className="card-header">
                <h3 className="align-items-center d-flex justify-content-evenly p-1 mt-2">
                    Productos más vendidos
                </h3>
            </div>
            <div className="card-header">
                <div className=" b-2 border bg-white p-3 m-2 ">
                    <Row className="d-flex justify-content-between">
                        <Col lg={3} xs={12} className=''>
                            <label htmlFor="status" className="form-label">Categoría:</label>
                            <select
                                id="type"
                                className="form-control"
                                value={category}
                                onChange={(e) => {
                                    setCategory(e.target.value);
                                    setApply(false);
                                }}
                            >
                                <option key='all' value='all'>Todas</option>
                                {
                                    categories.map((x: Category, index: any) => (
                                        <option key={x.id} value={x.id}>{x.name}</option>
                                    ))
                                }
                            </select>
                        </Col>
                        <Col lg={3} xs={12} className='mb-2'>
                            <div className='d-flex row px-3'>
                                <label htmlFor="startDate" className="form-label ps-0">Fecha de inicio:</label>
                                <DatePicker
                                    id="startDate"
                                    locale={es}
                                    dateFormat="dd/MM/yyyy"
                                    className="form-control"
                                    selected={startDate}
                                    onChange={(e: any) => {
                                        setStartDate(new Date(e));
                                        setApply(false);
                                    }}
                                    selectsStart
                                    placeholderText="Selecciona una fecha"
                                />
                            </div>
                        </Col>
                        <Col lg={3} xs={12} className='mb-2'>
                            <div className='d-flex row px-3'>
                                <label htmlFor="endDate" className="form-label ps-0">Fecha de fin:</label>
                                <DatePicker
                                    id="endDate"
                                    locale={es}
                                    dateFormat="dd/MM/yyyy"
                                    className="form-control"
                                    selected={endDate}
                                    onChange={(e: any) => {
                                        setEndDate(new Date(e));
                                        setApply(false);
                                    }
                                    }
                                    placeholderText="Selecciona una fecha"
                                />
                            </div>
                        </Col>
                    </Row>
                    <Row className="d-flex justify-content-center mt-3 px-3">
                        {
                            apply ?
                                <button className="btn btn-danger col-lg-2 col-12" onClick={offApplyfilter}>Quitar</button> :
                                <button className="btn btn-primary col-lg-2 col-12" onClick={applyfilter}>Filtrar</button>

                        }
                    </Row>
                </div>
            </div>
            <div className="card-body">
                <Table className="table table-bordered table-striped px-4">
                    <Thead className="table-light">
                        <Tr>
                            <Th>Nombre</Th>
                            <Th>Cantidad</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {products.length == 0 ?
                            <Tr>
                                <td>No hay registros.</td>
                            </Tr> : (
                                products.map((product: any, index: any) => (
                                    <Tr key={index}>
                                        <td>{product.name}</td>
                                        <td>{product.quantity}</td>
                                    </Tr>
                                ))
                            )
                        }
                    </Tbody>
                </Table>
            </div>
        </div>
    )
};

export default ProductsReport;