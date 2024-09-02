import { Col, Row } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/hooks";
import { RootState } from "../../redux/store/store";
import { memo, useEffect, useMemo } from "react";
import { getByClientName, getCollections, getCollectionsByClientName, getDay, getSearchCollections, setClientId, setDateQuery, setFilterClientName, setSelectedCollection } from "../../redux/slices/credit-slice";
import { getAll as getUsers } from '../../redux/slices/user-slice';
import { MdAttachMoney, MdDateRange, MdDone, MdFilterAlt, MdInfoOutline } from "react-icons/md";
import { useState } from 'react';
import InformationModal from "../information-modal/information-modal";
import { CollectionDto } from '../../entities/dto/collection-dto';
import { HeaderListDate } from "../header-list-date/header-list-date";
import TableResponsive from "../common/table-responsive";
import { useDateFilter } from "../../redux/hooks/useDateFilter";
import { getDateString } from "../function-common/get-date-string";
import { RegisterPayment } from "./register-payment";
import { SearchByName } from "../common/search-by-name";
import { getSearchClients } from "../../redux/slices/client-slice";
import useNumberFormatter from "../../redux/hooks/useNumberFormatter";
import Loading from "../common/loading";
import { startLoading } from "../../redux/slices/loading-slice";
import { getDayString } from "../function-common/get-day-string";
import { date } from 'yup';
import FilterModal from "./filter-modal";
import { ReschedulePayment } from "./reschedule-payment";
import { covertStringToDate } from "../function-common/get-date-";
import TableMyCollections from "./table-my-collections";



interface MyCollectionsProps {
    collections: any,
    dateQuery: any,
    selectedCollection: any,
    type: any,
    paymentFrequencies: any,
    statusCredits: any;
    setSelectedCollection: (collection: CollectionDto) => void;
    getCollections: (date: any) => void;
    getSearchCollections: (status: string | null, user: string | null, typeCurrency: string | null, startDate: Date | null, endDate: Date | null, statusPayment: string | null) => void;
    getCollectionsByClientName: (client: number, date: any) => void;
    registerCancellationInterestPrincipal: (collectionId: number, inputPayment: number, date: any, firstPayment: any) => void;
    registerPayment: (collectionId: number, inputPayment: number) => void;
    cancelRegisteredPayment: (collectionId: number) => void;
    cancelRegisteredPaymentInterest: (collectionId: number) => void;
    setClientId: (client: number) => void;
    apply: boolean;
    setApply: (apply: boolean) => void;
    reschedulePayment: (id: number, dueDate: Date) => void;
    getDetailCredit: (id: number) => void;

}

export const MyCollections = ({ collections, dateQuery, selectedCollection, type, statusCredits,
    setSelectedCollection, getCollections, getSearchCollections, getCollectionsByClientName, registerCancellationInterestPrincipal,
    registerPayment, cancelRegisteredPayment, cancelRegisteredPaymentInterest, setClientId, apply, setApply, reschedulePayment,
    getDetailCredit }: MyCollectionsProps) => {
    const dispatch = useAppDispatch();
    const formatNumber = useNumberFormatter();
    const { isLoading } = useAppSelector((state: RootState) => state.loading);
    const { clients } = useAppSelector((state: RootState) => state.clients);
    const { users } = useAppSelector((state: RootState) => state.users);
    const [collectionsData, setCollectionsData] = useState<CollectionDto[]>([]);
    const [showCustomMessage, setShowCustomMessage] = useState<boolean>(false);
    const [showReschedulePayment, setShowReschedulePayment] = useState<boolean>(false);
    const [showFilterModal, setShowFilterModal] = useState<boolean>(false);
    const dateCurrent = new Date();
    const { dateFilter, setStartDate, setEndDate } = useDateFilter({ initialStartDate: dateCurrent, initialEndDate: dateCurrent });
    const [statusCredit, setStatusCredit] = useState<string>('all');
    const [statusPayment, setStatusPayment] = useState<string>('all');
    const [user, setUser] = useState<string>('all');
    const [paymentId, setPaymentId] = useState<number>();
    const [typeCurrency, setTypeCurrency] = useState<string>('all');
    const [reschedulePaymentData, setReschedulePaymentData] = useState<{ id: number, dueDate: Date }>();
    const optionsFilter: any = [
        { value: 'all', name: 'Todos' },
        { value: 'active', name: 'Activo' },
        { value: 'canceled', name: 'Cancelado' }
    ];
    const [operationType, setOperationType] = useState<string>('');
    const rows = collectionsData.map((collection: CollectionDto, index: number) => ({
        creditId: collection.creditId,
        clientNumber:
            (
                <Row className="d-flex row mx-2 align-items-center">
                    <Col lg={3}>
                        {collection.clientNumber ?
                            <span className="col-12 fw-bold text-client-collections">{collection.clientNumber}</span> : ('')
                        }
                    </Col>
                    <Col lg={8}>
                        <button className="btn btn-outline-success btn-sm row d-flex" onClick={() => handleOpenDetailCredit(collection)}>
                            <span className="col-12 fw-bold text-date-collections">{collection.date.split('T')[0]}</span>
                            <span className="col-12 fw-bold">{getSymbolTypeCurrency(collection)}{formatNumber(collection.principal)}</span>
                        </button>
                    </Col>
                </Row>
            ),
        client: collection.client,
        debtCollector: collection.debtCollector,
        detail: collection.detail,
        concept: collection.number ? collection.number.toLowerCase() : collection.paymentType.toLowerCase(),
        paymentDueDate: collection.paymentDueDate.split('T')[0],
        paymentDate: (collection.paymentDate) ? collection.paymentDate.split('T')[0] : '-',
        payment: getSymbolTypeCurrency(collection) + formatNumber(collection.payment),
        actualPayment: (collection.actualPayment) ? getSymbolTypeCurrency(collection) + formatNumber(collection.actualPayment) : getSymbolTypeCurrency(collection) + '0,00',
        action: (
            <>
                {isLoading && collection.id == paymentId ?
                    <div className=" ml-2 d-flex justify-content-center">
                        <div className="capa-semi-transparente"></div>

                        <div className="spinner-border text-primary mt-2" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div> : <div className="col-12">
                        {collection.statusCreditHistory == '1' ?
                            <div className="d-flex col-12">
                                {collection.paymentDate ?
                                    <button className="btn btn-danger me-1 btn-sm col-lg-4 col-5 payment-button" onClick={() => handleOpenCustomMessageModal(collection, 'cancelRegisteredPayment')}>Cancelar pago</button> :
                                    <>
                                        <button className="btn btn-success btn-sm col-lg-4 col-5 payment-button" onClick={() => handleOpenCustomMessageModal(collection, 'payment')}>Pagar cuota</button>
                                        <button className="btn btn-primary btn-sm mx-1 col-2" onClick={() => handleOpenReschedulePaymentModal(collection.id, collection.paymentDueDate)} title="Reagendar"><MdDateRange /></button>
                                    </>
                                }
                                {
                                    collection.numberPayment == 1 && !collection.number?.includes('Recargo') ?
                                        <button className="btn btn-primary btn-sm col-lg-4 col-5 payment-button" disabled={collection.paymentDate != null} onClick={() => handleOpenCustomMessageModal(collection, 'cancellationInterest')}>Pagar intereses</button>
                                        : ('')

                                }

                            </div> :
                            <>
                                {
                                    collection.paymentDate && collection.paymentType == 'interés' && collection.numberPayment == 1 ?
                                        <>
                                            <button className="btn btn-danger me-1 btn-sm col-lg-4 col-5 payment-button" onClick={() => handleOpenCustomMessageModal(collection, 'cancelRegisteredPaymentInterest')}>Cancelar pago</button>
                                        </> : ('')
                                }
                            </>
                        }
                    </div>
                }

            </>
        )
    }));

    const columns = [
        {
            label: 'Ficha',
            field: 'clientNumber',
            sort: 'asc',
            //width: 100
        },
        {
            label: 'Cliente',
            field: 'client',
            sort: 'asc',
            //width: 250
        },
        {
            label: 'Cobrador',
            field: 'debtCollector',
            sort: 'asc',
            //width: 250
        },
        {
            label: 'Detalle',
            field: 'detail',
            sort: 'asc',
            //width: 250
        },
        {
            label: 'Cuota',
            field: 'concept',
            sort: 'asc',
            //width: 250
        },
        {
            label: 'Vto del Pago',
            field: 'paymentDueDate',
            sort: 'asc',
            //width: 250
        },
        {
            label: 'Fecha de pago',
            field: 'paymentDate',
            sort: 'asc',
            //width: 250
        },
        {
            label: 'Pago',
            field: 'payment',
            sort: 'asc',
            //width: 200
        },
        {
            label: 'Pagado',
            field: 'actualPayment',
            sort: 'asc',
            //width: 200
        },
        {
            label: 'Acción',
            field: 'action',
            sort: 'asc',
            //width: 200
        },
    ];

    const data = {
        columns: columns,
        // rows: [...credits],
        rows: rows
    };

    function getSymbolTypeCurrency(collection: CollectionDto) {
        return (collection?.typeCurrency == 'peso') ? '$' : '$USD';
    }

    function handleOpenCustomMessageModal(collection: CollectionDto, typeOperation: string) {
        setPaymentId(collection.id);
        console.log("tipo de operación: ", typeOperation);
        setSelectedCollection(collection);
        setOperationType(typeOperation);
        setShowCustomMessage(true);
    }

    function handleOpenReschedulePaymentModal(id: number, dueDate: string) {
        setReschedulePaymentData({ id, dueDate: covertStringToDate(dueDate) });
        setShowReschedulePayment(true);
    }

    function handleCloseReschedulePaymentModal() {
        setShowReschedulePayment(false);
    }

    function handleCloseCustomMessageModal() {
        setShowCustomMessage(false);

    };

    async function handleReschedulePayment(id: number, dueDate: Date) {
        setPaymentId(id);
        await reschedulePayment(id, dueDate);
        setShowReschedulePayment(false);

    }

    function handleOpenDetailCredit(collection: CollectionDto) {
        setSelectedCollection(collection);
        getDetailCredit(collection.creditId);
    };

    // function handleCloseDetailCredit() {
    //     setShowCreditDetail(false);
    // };

    function handleOpenFilterModal() {
        setShowFilterModal(true);
    }

    function handleCloseFilterModal() {
        setShowFilterModal(false);
    }

    function handleApplyFilter() {
        setApply(true);
        console.log("dateFilter: ", dateFilter);
        if (statusCredit) getSearchCollections(statusCredit, user, typeCurrency, dateFilter.startDate, dateFilter.endDate, statusPayment);
    };

    function offApplyFilter() {
        if (dateQuery) getCollections(dateQuery.date);
    }


    function removeFilters() {
        dispatch(startLoading());
        if (dateQuery) setStartDate(new Date(dateQuery.date));
        if (dateQuery) setEndDate(new Date(dateQuery.date));
        setApply(false);
        if (dateQuery) getCollections(dateQuery.date);
    }

    const searchByClient = (client: number) => {
        //console.log("searchByName")
        if (dateQuery) getCollectionsByClientName(client, dateQuery.date);
        setClientId(client);
    };

    function getOptionsClients() {
        return clients.map((option: any) => {
            return { id: option.id, label: option.lastName + " " + option.name }
        })
    }

    async function getAllCollections(date: any) {
        console.log("date: ", date);
        dispatch(startLoading());
        getCollections(date);
    }

    async function handleDate(date: any) {
        const newDate = new Date(date);
        console.log("nueva fecha handle: ", newDate);
        const newDateQuery = {
            day: getDayString(newDate),
            date: newDate.toString(),
            dateShort: getDateString(newDate)
        };
        dispatch(setDateQuery(newDateQuery));
        getAllCollections(newDateQuery.date);
    }



    useEffect(() => {
        dispatch(getDay());
        dispatch(getSearchClients(type));
        dispatch(getUsers());
    }, [])

    useEffect(() => {
        //console.log('dateQuery: ', dateQuery?.date);
        getAllCollections(dateQuery?.date);
        // dispatch(getSearchClients(type));
        // dispatch(getUsers());
    }, [])

    useEffect(() => {
        setCollectionsData(collections);
    }, [collections])



    return (
        <>
            {dateQuery ?
                <div className="p-3">
                    <HeaderListDate
                        title={'Cobranzas día'}
                        startDate={getDateString(dateFilter.startDate)}
                        endDate={getDateString(dateFilter.endDate)}
                        applyFilter={apply}
                        onDateChange={handleDate}
                    />
                    <div className="d-flex align-items-center mb-3 row">
                        <SearchByName options={getOptionsClients()} placeholder='escribe el nombre de un cliente...' getByOption={searchByClient} />
                    </div>
                    <div>
                        <button className="btn btn-primary mb-3" onClick={handleOpenFilterModal}><MdFilterAlt /></button>
                        {apply ?
                            <button className="mb-3 ms-2 btn btn-outline-danger" onClick={removeFilters}>
                                Quitar filtros
                            </button> : ('')
                        }
                    </div>
                    <TableMyCollections columns={data.columns} rows={data.rows} />
                    {
                        showCustomMessage ? <RegisterPayment
                            show={showCustomMessage}
                            typeOperation={operationType}
                            closeModal={handleCloseCustomMessageModal}
                            selectedCollection={selectedCollection}
                            dateQuery={dateQuery}
                            registerCancellationInterestPrincipal={(collectionId: number, inputPayment: number, date: any, firstPayment: any) => registerCancellationInterestPrincipal(collectionId, inputPayment, date, firstPayment)}
                            registerPayment={(collectionId: number, inputPayment: number) => registerPayment(collectionId, inputPayment)}
                            cancelRegisteredPayment={(collectionId: number) => cancelRegisteredPayment(collectionId)}
                            cancelRegisteredPaymentInterest={(collectionId: number) => cancelRegisteredPaymentInterest(collectionId)}
                        /> : ('')
                    }

                    {
                        showReschedulePayment ? <ReschedulePayment
                            id={reschedulePaymentData ? reschedulePaymentData.id : 0}
                            dueDate={reschedulePaymentData ? reschedulePaymentData.dueDate : new Date()}
                            closeModal={handleCloseReschedulePaymentModal}
                            reschedulePayment={handleReschedulePayment}
                        /> : ('')
                    }

                    <FilterModal
                        show={showFilterModal}
                        onClose={handleCloseFilterModal}
                        onApplyFilter={handleApplyFilter}
                        offApplyFilter={offApplyFilter}
                        options={optionsFilter}
                        users={users}
                        apply={apply}
                        statusCredits={statusCredits}
                        startDate={dateFilter.startDate}
                        endDate={dateFilter.endDate}
                        setStartDate={setStartDate}
                        setEndDate={setEndDate}
                        statusCredit={statusCredit}
                        statusPayment={statusPayment}
                        typeCurrency={typeCurrency}
                        user={user}
                        setStatusCredit={setStatusCredit}
                        setStatusPayment={setStatusPayment}
                        setUser={setUser}
                        setTypeCurrency={setTypeCurrency}
                    />
                </div>
                : ('')
            }
        </>
    )
};

export default MyCollections;