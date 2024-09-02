import { useEffect, useState } from "react";

import { useAppDispatch, useAppSelector } from "../../redux/hooks/hooks";
import { RootState } from "../../redux/store/store";
import DatatablePage from "../table";
import { getPaymentsDetail } from "../../redux/slices/credit-slice";
import { Col, Row } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { MdArrowBack } from "react-icons/md";
import { getById, getInventories, getInventoryByDate, modifyStock } from "../../redux/slices/product-slice";
import Loading from "../common/loading";
import FilterDate from "../common/fllter-date";
import { OperationStock } from "../../entities/inventory";
import useNumberFormatter from "../../redux/hooks/useNumberFormatter";
import TableResponsive from "../common/table-responsive";
import CustomMessage from "../common/custom-message/custom-message";

export const ProductDetail = () => {
    const dispatch = useAppDispatch();
    const { id } = useParams();
    const formatNumber = useNumberFormatter();
    const { productSelected, inventories, isLoading } = useAppSelector((state: RootState) => state.products);
    const [productLoaded, setProductLoaded] = useState(false);
    const [showEditStock, setShowEditStock] = useState<boolean>(false);
    const stock = (productSelected) ? productSelected?.stock : 0;
    const [newStock, setNewStock] = useState<number>(stock);


    const rows = inventories.map((inventory, index) => ({
        id: index + 1,
        date: inventory.date.split('T')[0],
        concept: (`${OperationStock[inventory.concept]}`).toString(),
        amount: (`${OperationStock[inventory.concept]}` == 'venta') ? (-1) * inventory.amount : inventory.amount,
        costPesos: formatNumber(inventory.costPesos),
        costDollar: formatNumber(inventory.costDollar)
    }));

    const data = {
        columns: [
            {
                label: '#',
                field: 'id',
                sort: 'asc',
                width: 100
            },
            {
                label: 'Fecha',
                field: 'date',
                sort: 'asc',
                width: 250
            },
            {
                label: 'Concepto',
                field: 'concept',
                sort: 'asc',
                width: 250
            },
            {
                label: 'Cantidad',
                field: 'amount',
                sort: 'asc',
                width: 250
            },
            {
                label: 'Costo $',
                field: 'costPesos',
                sort: 'asc',
                width: 200
            },
            {
                label: 'Costo $USD',
                field: 'costDollar',
                sort: 'asc',
                width: 200
            },
        ],
        // rows: [...credits],
        rows: rows
    };

    function saveStock() {
        if (productSelected && newStock) dispatch(modifyStock(newStock, productSelected.id));
        setShowEditStock(false);
    }

    async function getDetail() {
        if (id) {
            console.log("id: ", id);
            await dispatch(getById(id));
            await dispatch(getInventories(id));
            setProductLoaded(true);
        }
    }

    useEffect(() => {
        getDetail()
    }, [id])

    if (!productLoaded) {
        return <Loading /> // Puedes mostrar un indicador de carga
    }


    return (
        <div className="p-2">
            <Row className="border-top border-bottom p-2 mb-4 align-items-center d-flex">
                <Col xs={1}>
                    <Link to="/products">
                        <MdArrowBack size={30} color="grey" />
                    </Link>
                </Col>
                <Col lg={10} xs={11} className="d-flex justify-content-center text-center row">
                    <Col lg={10} xs={12}>
                        <h3>Detalle de inventario<span className="d-none d-lg-block"> {productSelected?.name}</span> </h3>
                    </Col>
                    <Col lg={3} xs={12} className="d-lg-none">
                        <h3>{productSelected?.name}</h3>
                    </Col>
                </Col>
            </Row>
            <Row className="me-1 ms-1 border-top">
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
            <Row className="me-1 ms-1 border-top border-bottom mb-2">
                <div className="ps-2 d-flex align-items-center col-lg-9">
                    <Col className="d-flex align-items-center">
                        <h6 className="pe-1">Descripción: </h6><p className="pt-2">{productSelected?.description}</p>
                    </Col>
                </div>
                <div className="ps-2 d-flex align-items-center col-lg-3">
                    <Col className="d-flex align-items-center">
                        <h6 className="pe-1">Stock: </h6>{
                            isLoading ? <Loading /> :
                                <p className="pt-2">{productSelected?.stock}</p>
                        }
                        <button className="btn btn-primary col-4 btn-sm mx-3 mb-1"
                            onClick={() => {
                                if (productSelected) setNewStock(productSelected?.stock)
                                setShowEditStock(true);
                            }}>Ajustar</button>
                    </Col>
                </div>
            </Row>
            {
                isLoading ? <Loading /> :
                    <TableResponsive columns={data.columns} rows={data.rows} />
            }


            <CustomMessage
                title="Ajustar Stock"
                message={<div className="text-center">Stock: <input className="rounded text-end col-3" value={isNaN(newStock) ? 0 : newStock}
                    onChange={(e: any) => {
                        setNewStock(parseInt(e.target.value));
                    }
                    }
                />
                </div>}
                acceptBtnName="Guardar"
                cancelBtnName="Cancelar"
                operation={saveStock}
                showModal={showEditStock}
                onCloseModal={() => { setShowEditStock(false) }}
                typeOperation="add"
            />
        </div>
    )
};

export default ProductDetail;