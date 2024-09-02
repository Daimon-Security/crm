import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/hooks";
import { RootState } from "../../redux/store/store";
import TableResponsive from "../common/table-responsive";
import Loading from "../common/loading";
import PersonalCreditDetail from "../personal-credit/personal-credit-detail";
import { getUnpaidClients } from "../../redux/slices/report-slice";
import { Modal, Nav, NavItem, NavLink } from "react-bootstrap";
import { setCreditSelected as selectedPersonalCredit, getById as getByIdPersonalCredit } from "../../redux/slices/credit-slice";
import { setCreditSelected as selectedSaleCredit, getById as getByIdSaleCredit } from "../../redux/slices/sale-credit-slice";
import SaleCreditDetail from "../sale-credit/sale-credit-detail";

export const UnpaidClients = () => {
    const dispatch = useAppDispatch();
    const { isLoading } = useAppSelector((state: RootState) => state.loading);
    const [showCreditDetail, setShowCreditDetail] = useState(false);
    const { unpaidClientsPersonal, unpaidClientsSale } = useAppSelector((state: RootState) => state.reports);
    const [activeTab, setActiveTab] = useState('personal-credit');
    const unpaidClients = (activeTab == 'personal-credit' ? [...unpaidClientsPersonal] : [...unpaidClientsSale])
    const toggleTab = (tab: any) => {
        if (activeTab !== tab) {
            setActiveTab(tab);
        }
    };

    function getUnpaid() {
        const clientType = (activeTab == 'personal-credit') ? 1 : 2;
        if (unpaidClientsPersonal.length == 0 || unpaidClientsSale.length == 0) dispatch(getUnpaidClients(clientType));
    }
    function handleOpenDetailCredit(creditId: number) {
        setShowCreditDetail(true);
        (activeTab == 'personal-credit') ?
            dispatch(getByIdPersonalCredit(creditId.toString())) :
            dispatch(getByIdSaleCredit(creditId.toString()));
    };

    useEffect(() => {
        getUnpaid()
    }, [activeTab])


    const getItems = (items: any) => {
        return items?.length > 0 ? items.map((client: any) => ({
            client: client.lastName + " " + client.name,
            delay: client.delay,
            actions: (
                <button className="btn btn-success btn-sm col-12" onClick={() => handleOpenDetailCredit(client.id)}>crédito</button>
            ),
        })) : [];

    }

    const delay = unpaidClients.filter(x => x.delay <= 15);
    const delay15 = unpaidClients.filter(x => x.delay > 15 && x.delay < 30);
    const delay30 = unpaidClients.filter(x => x.delay > 30 && x.delay < 90)
    const delay90 = unpaidClients.filter(x => x.delay > 90);

    const data = {
        columns: [
            {
                label: 'Apellido y Nombre',
                field: 'client',
            },
            {
                label: 'días de atraso',
                field: 'delay',
            },
            {
                label: 'Acciones',
                field: 'actions',
            }
        ],
        rows: getItems(delay),
        delay30: getItems(delay30),
        delay15: getItems(delay15),
        delay90: getItems(delay90)

    };

    if (isLoading) {
        return <Loading />
    }

    return (
        <>
            <div className="px-3">
                <Nav className="row d-flex">
                    <NavItem className={`col-6 justify-content-center align-items-center d-flex border border-1 cursor-hand ${activeTab === 'personal-credit' ? 'active bg-secondary' : 'bg-transapent'}`}
                        onClick={() => toggleTab('personal-credit')}
                    >
                        <NavLink
                        >
                            <h5 className={`${activeTab === 'personal-credit' ? 'text-white' : 'text-dark'}`}>Personales</h5>
                        </NavLink>
                    </NavItem>
                    <NavItem className={`col-6 justify-content-center align-items-center d-flex border border-1 cursor-hand ${activeTab === 'sale-credit' ? 'active bg-secondary' : 'bg-transapent'}`}
                        onClick={() => toggleTab('sale-credit')}
                    >
                        <NavLink
                        >
                            <h5 className={`${activeTab === 'sale-credit' ? 'text-white' : 'text-dark'}`}>Por ventas</h5>
                        </NavLink>
                    </NavItem>
                </Nav>
            </div>
            {
                data.delay90?.length == 0 && data.delay30?.length == 0 && data.delay15?.length == 0 && data.rows?.length == 0 ?
                    <div className="card mt-4">
                        <div className="card-body text-center">
                            <h5>No hay clientes morosos.</h5>
                        </div>
                    </div>
                    :
                    <div className='d-block'>
                        <div className='p-3 d-block'>
                            {data.delay90?.length > 0 ?
                                <div>
                                    <div className="alert alert-danger border-top border-bottom py-2 mb-4 d-flex align-items-center justify-content-between">
                                        <h5>Clientes con más de 90 días de mora</h5>
                                    </div>
                                    <TableResponsive columns={data.columns} rows={data.delay90} />
                                </div>
                                : ''
                            }
                            {data.delay30?.length > 0 ?
                                <div>
                                    <div className="alert alert-warning border-top  mt-5 border-bottom py-2 mb-4 d-flex align-items-center justify-content-between">
                                        <h5>Clientes con más de 30 días de mora</h5>
                                    </div>
                                    <TableResponsive columns={data.columns} rows={data.delay30} />
                                </div>
                                : ''
                            }
                            {data.delay15?.length > 0 ?
                                <div>
                                    <div className="alert alert-secondary border-top mt-5 border-bottom py-2 mb-4 d-flex align-items-center justify-content-between">
                                        <h5>Clientes con más de 15 días de mora</h5>
                                    </div>
                                    <TableResponsive columns={data.columns} rows={data.delay15} />
                                </div>
                                : ''
                            }
                            {data.rows?.length > 0 ?
                                <div>
                                    <div className="alert alert-info border-top mt-5 border-bottom py-2 mb-4 d-flex align-items-center justify-content-between">
                                        <h5>Clientes con mora</h5>
                                    </div>

                                    <TableResponsive columns={data.columns} rows={data.rows} />
                                </div>
                                : ''
                            }
                        </div>
                    </div>
            }

            <Modal size='xl' show={showCreditDetail} onHide={() => {
                setShowCreditDetail(false);
                (activeTab == 'personal-credit') ? dispatch(selectedPersonalCredit(null)) : dispatch(selectedSaleCredit(null))
            }}>
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body>
                    {
                        activeTab == 'personal-credit' ?
                            <PersonalCreditDetail setShowDetail={() => { }} hide={true} activeTab="history" /> :
                            <SaleCreditDetail setShowDetail={() => { }} hide={true} activeTab="history" />
                    }
                </Modal.Body>
            </Modal >
        </>

    )
};
export default UnpaidClients;