import { MdAddCircleOutline, MdArticle, MdDelete, MdFilterAlt, MdSearch } from "react-icons/md";
import { Link } from "react-router-dom";
import CustomMessage from "../common/custom-message/custom-message";
import TableResponsive from "../common/table-responsive";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/hooks";
import { SaleDto, SaleStatus } from '../../entities/dto/sale-dto';
import { RootState } from "../../redux/store/store";
import { useEffect, useState } from 'react';
import { getBySaleByClient, getSales, getSearchSales, saleDelete, setSaleSelected } from "../../redux/slices/sale-slice";
import { Col, Modal, Row } from "react-bootstrap";
import { getSearchClients } from "../../redux/slices/client-slice";
import { SearchByName } from "../common/search-by-name";
import FilterModal from "../credit/filter-modal";
import FilterSaleModal from "./filter-sales-modal";
import Loading from "../common/loading";
import useNumberFormatter from "../../redux/hooks/useNumberFormatter";
import { number } from "yup";
import SaleCreditDetail from "../sale-credit/sale-credit-detail";
import { getById, setCreditSelected } from "../../redux/slices/sale-credit-slice";

export const SaleList = () => {
    const dispatch = useAppDispatch();
    const formatNumber = useNumberFormatter();
    const { sales, type, saleSelected } = useAppSelector((state: RootState) => state.sales);
    const { clients } = useAppSelector((state: RootState) => state.clients);
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [apply, setApply] = useState<boolean>(false);
    const [salesLoaded, setSalesLoaded] = useState(false);
    const [showCustomMessage, setShowCustomMessage] = useState(false);
    const [showCreditDetail, setShowCreditDetail] = useState<boolean>(false);
    const rows = sales.map((sale: SaleDto, index: any) => ({
        id: index + 1,
        date: toLocalDateTime(sale.date),
        client: sale.clientName,
        paymentType: (<>
            {
                sale.paymentType == 'Crédito' ?
                    <Row className="d-flex justify-content-between">
                        <Col lg={3}>{sale.paymentType}</Col>
                        <Col lg={7}>
                            <button className="btn btn-outline-success btn-sm col-12" onClick={() => handleOpenDetailCredit(sale)}>ver</button>
                        </Col>
                    </Row> : sale.paymentType
            }</>

        ),
        currencyType: sale.currencyType?.toUpperCase(),
        total: formatNumber(sale.total),
        //payment: formatNumber(sale.payment),
        actions: (
            <Row className="mx-2">
                {sale.status == SaleStatus.valid ?
                    <Link to={`/sale/${sale.id}/cancel`} className="col-lg-5 col-11 btn btn-danger me-2 my-1">
                        Anular
                    </Link> :
                    <button className="btn btn-primary col-lg-5 col-11 my-1 me-2" disabled>Anulada</button>
                }
                <Link to={`/sale/${sale.id}/detail`} className="col-lg-3 col-5 btn btn-success me-2 my-1" title="Detalle">
                    <MdArticle />
                </Link>
                <button className="btn btn-danger col-lg-3 col-5 my-1" onClick={() => handleOpenCustomMessageModal(sale)} title="Eliminar"><MdDelete /></button>
            </Row>
        ),
    }));

    function toLocalDateTime(date: string): string {
        const dateHourParts = date.split(" "); // Dividir la cadena en fecha y hora
        const dateParts = dateHourParts[0].split("-"); // Dividir la fecha en día, mes y año
        const hourParts = dateHourParts[1].split(":")

        const fecha = new Date(
            parseInt(dateParts[2]),  // Año
            parseInt(dateParts[1]) - 1,  // Mes (restamos 1 porque los meses en JavaScript van de 0 a 11)
            parseInt(dateParts[0]),  // Día
            parseInt(hourParts[0]),    // Hora
            parseInt(hourParts[1]),    // Minuto
            parseInt(hourParts[2])     // Segundo
        );

        const utcTimestamp = fecha;
        // console.log("utcTimestamp: ", utcTimestamp);
        const localTimezoneOffset = new Date().getTimezoneOffset();
        const localTimestamp = new Date(utcTimestamp.getTime() - (localTimezoneOffset * 60000));
        const localTimeString = localTimestamp.toLocaleString();
        return localTimeString;
    }

    async function deleteSale() {
        if (saleSelected) {
            await dispatch(saleDelete(saleSelected.id));
            handleCloseCustomMessageModal();
        }
    }

    const data = {
        columns: [
            {
                label: '#',
                field: 'id',
                sort: 'asc',
                ////width: 50
            },
            {
                label: 'Fecha',
                field: 'date',
                sort: 'asc',
                //width: 50
            },
            {
                label: 'Cliente',
                field: 'client',
                sort: 'asc',
                ////width: 80
            },
            {
                label: 'Forma de Pago',
                field: 'paymentType',
                sort: 'asc',
                //width: 50
            },
            {
                label: 'Moneda',
                field: 'currencyType',
                sort: 'asc',
                //width: 50
            },
            {
                label: 'Total',
                field: 'total',
                sort: 'asc',
                //width: 100
            },
            // {
            //     label: 'Pago',
            //     field: 'payment',
            //     sort: 'asc',
            //     //width: 50
            // },
            {
                label: 'Acciones',
                field: 'actions',
                sort: 'asc',
                //width: 100
            }
        ],

        rows: rows
    };

    function handleOpenDetailCredit(sale: SaleDto) {
        setShowCreditDetail(true);
        getCredit(sale.creditId)
    }

    function getCredit(id: number) {
        setShowCreditDetail(true);
        dispatch(getById(id?.toString()))
    }

    function getOptionsClients() {
        return clients.map((option: any) => {
            return { id: option.id, label: option.lastName + " " + option.name }
        })
    }

    const searchByClient = (id: number) => {
        //console.log("name recibido: ", name);
        dispatch(getBySaleByClient(id));
    };


    const handleShowFilterModal = () => {
        setShowFilterModal(true);
    };

    const handleCloseFilterModal = () => {
        setShowFilterModal(false);
    };

    const handleApplyFilter = (startDate: Date, endDate: Date, paymentType: string, statusSale: string) => {
        setApply(true);;
        dispatch(getSearchSales(startDate, endDate, statusSale, paymentType))
    };

    const offApplyFilter = () => {
        dispatch(getSales())
    }

    const handleOpenCustomMessageModal = (sale: SaleDto) => {
        dispatch(setSaleSelected(sale));
        setShowCustomMessage(true);
    };

    const handleCloseCustomMessageModal = () => {
        setShowCustomMessage(false);
    };

    async function getAllSales() {
        await dispatch(setSaleSelected(null));
        await dispatch(getSales())
        setSalesLoaded(true);
    }

    useEffect(() => {
        //console.log("ejecutando use efect");
        getAllSales();
        dispatch(getSearchClients(type));
    }, [])

    if (!salesLoaded) {
        return <Loading /> // Puedes mostrar un indicador de carga
    }

    return (
        <div className="p-3">
            <div className="border-top border-bottom py-2 mb-4 d-flex align-items-center justify-content-between">
                <h3>Ventas</h3>
                <Link to="/sale-create">
                    <button className="btn btn-primary">Nueva <MdAddCircleOutline /></button>
                </Link>
            </div>
            <div className="d-flex align-items-center mb-3 row">
                <SearchByName options={getOptionsClients()} placeholder='escribe el nombre de un cliente...' getByOption={searchByClient} />
            </div>
            <div>
                <button className="btn btn-primary mb-3" onClick={handleShowFilterModal}><MdFilterAlt /></button>
                {apply ?
                    <button className="mb-3 ms-2 btn btn-outline-danger" onClick={() => {
                        setApply(false);
                        dispatch(getSales())
                    }}>
                        Quitar filtros
                    </button> : ('')
                }
            </div>
            <FilterSaleModal
                show={showFilterModal}
                onClose={handleCloseFilterModal}
                onApplyFilter={handleApplyFilter}
                offApplyFilter={offApplyFilter}
                apply={apply}
            />

            <TableResponsive columns={data.columns} rows={data.rows} />

            <CustomMessage
                title={'Eliminar registro'}
                message={'¿Seguro que quiere eliminar el registro?'}
                acceptBtnName={'Eliminar'}
                cancelBtnName={'Cancelar'}
                onCloseModal={handleCloseCustomMessageModal}
                operation={deleteSale}
                showModal={showCustomMessage}
                typeOperation="remove"
            />

            <Modal size='xl' show={showCreditDetail} onHide={() => {
                setShowCreditDetail(false);
                dispatch(setCreditSelected(null))
            }}>
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body>
                    <SaleCreditDetail setShowDetail={() => { }} hide={true} activeTab="history" />
                </Modal.Body>
            </Modal >

        </div>

    )
};

export default SaleList;