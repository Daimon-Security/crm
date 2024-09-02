import { Col, Row } from "react-bootstrap";
import { MdArrowBack } from "react-icons/md";
import { Link, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/hooks";
import { RootState } from "../../redux/store/store";
import { useEffect, useState } from "react";
import Loading from "../common/loading";
import { getSaleById } from "../../redux/slices/sale-slice";
import TableResponsive from "../common/table-responsive";
import { SaleStatus } from "../../entities/dto/sale-dto";
import useNumberFormatter from "../../redux/hooks/useNumberFormatter";

export const SaleDetail = () => {
    const dispatch = useAppDispatch();
    const { id } = useParams();
    const formatNumber = useNumberFormatter();
    const { saleSelected} = useAppSelector((state: RootState) => state.sales);
    const sale = {...saleSelected};
    const [detailLoaded, setDetailLoaded] = useState<boolean>(false);


    const rows = (saleSelected)?saleSelected?.saleDetails.map((detail: any, index: any) => ({
        id: index + 1,
        code: detail.code,
        productName: detail.productName,
        quantity: detail.quantity,
        price:  formatNumber(detail.price),
        total:  formatNumber(detail.total)
    })):[];

    const data = {
        columns: [
            {
                label: '#',
                field: 'id',
                sort: 'asc',
                width: 100
            },
            {
                label: 'Cód.',
                field: 'code',
                sort: 'asc',
                width: 250
            },
            {
                label: 'Producto',
                field: 'productName',
                sort: 'asc',
                width: 200
            },
            {
                label: 'Cantidad',
                field: 'quantity',
                sort: 'asc',
                width: 200
            },
            {
                label: 'Precio',
                field: 'price',
                sort: 'asc',
                width: 200
            },
            {
                label: 'Total',
                field: 'total',
                sort: 'asc',
                width: 200
            },
        ],
        rows: rows
    };

    function getStatusSale(){
        if(saleSelected){
            return (SaleStatus[saleSelected.status] == 'valid')?'Válida':'Anulada'
        }
    }

    async function getDetail() {
        if (id) {
            await dispatch(getSaleById(id));
            setDetailLoaded(true);
        }
    }

    useEffect(() => {
        getDetail()
    }, [id])

    if (!detailLoaded) {
        return <Loading /> // Puedes mostrar un indicador de carga
    }
    return (
        <>
            <div className="p-2">
                <Row className="border-top border-bottom p-2 mb-4 align-items-center d-flex justify-content-start">
                    <Col xs={1}>
                        <Link to="/sales">
                            <MdArrowBack size={30} color="grey" />
                        </Link>
                    </Col>
                    <Col xs={11}>
                        <h3>Detalle de la venta</h3>
                    </Col>
                </Row>
                <Row className="me-1 ms-1 border-top">
                    <div className=" ps-2 d-flex align-items-center col-lg-3">
                        <Col className="d-flex align-items-center">
                            <h6 className="pe-1">Fecha: </h6><p className="pt-2">{saleSelected?.date}</p>
                        </Col>
                    </div>
                    <div className="ps-2 d-flex align-items-center col-lg-7">
                        <Col className="d-flex align-items-center">
                            <h6 className="pe-1">Cliente: </h6><p className="pt-2">{saleSelected?.clientName}</p>
                        </Col>
                    </div>
                    <div className="ps-2 d-flex align-items-center col-lg-2">
                        <Col className="d-flex align-items-center">
                            <h6 className="pe-1">Estado: </h6><p className="pt-2">{getStatusSale()}</p>
                        </Col>
                    </div>
                </Row>
                <Row className="me-1 ms-1 border-top border-bottom mb-2">
                    <div className="ps-2 d-flex align-items-center col-lg-4">
                        <Col className="d-flex align-items-center">
                            <h6 className="pe-1">Forma de pago: </h6><p className="pt-2">{saleSelected?.paymentType}</p>
                        </Col>
                    </div>
                    <div className="ps-2 d-flex align-items-center col-lg-4">
                        <Col className="d-flex align-items-center">
                            <h6 className="pe-1">Moneda: </h6><p className="pt-2">{saleSelected?.currencyType?.toUpperCase()}</p>
                        </Col>
                    </div>
                    <div className="ps-2 d-flex align-items-center col-lg-4">
                        <Col className="d-flex align-items-center">
                            <h6 className="pe-1">Total: </h6><p className="pt-2">{formatNumber(saleSelected?.total)}</p>
                        </Col>
                    </div>
                    {/* <div className="ps-2 d-flex align-items-center col-lg-3">
                        <Col className="d-flex align-items-center">
                            <h6 className="pe-1">Pago: </h6><p className="pt-2">{formatNumber(saleSelected?.payment)}</p>
                        </Col>
                    </div> */}
                </Row>
            </div>
            
            <TableResponsive columns={data.columns} rows={data.rows} />
        </>
    )
};
export default SaleDetail;