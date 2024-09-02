import { useAppDispatch, useAppSelector } from "../../redux/hooks/hooks";
import { RootState } from "../../redux/store/store";
import DatatablePage from "../table";
import { useEffect, useState } from "react";
import { Button, Col, Row } from 'react-bootstrap';
import { ButtonsActions } from "../common/buttons-actions";
import { MdFilterAlt, MdSearch, MdAddCircleOutline, MdEdit, MdDelete, MdArticle } from 'react-icons/md';
import { getAll, setCreditSelected } from '../../redux/slices/credit-slice';
import { getAll as getUsers } from '../../redux/slices/user-slice';
import FilterModal from "../credit/filter-modal";
import { CreditListDto } from '../../entities/dto/credit-list-dto';
import CustomMessage from "../common/custom-message/custom-message";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { statusCreditOptions } from "../constants/status-credit";
import Loading from "../common/loading";
import TableResponsive from "../common/table-responsive";
import { SearchByName } from "../common/search-by-name";
import { getSearchClients } from "../../redux/slices/client-slice";
import { useDateFilter } from "../../redux/hooks/useDateFilter";
import { subMonths } from 'date-fns';
import useNumberFormatter from "../../redux/hooks/useNumberFormatter";

interface CreditListProps {
    credits: any,
    title: string;
    btnAdd: string;
    btnAddRoute: string;
    remove: () => void;
    apply: boolean;
    paymentFrequencies: any,
    statusCredits: any;
    setApply: (apply: boolean) => void;
    type: string;
    getSearchCredits: (status: string | null, user: string | null, typeCurrency: string | null, paymentFrequency: string | null, startDate: Date | null, endDate: Date | null) => void;
    getCredits: () => void;
    getByClientName: (client: number) => void;
    setShowDetail: (show: boolean) => void;
    selectCredit: (credit: CreditListDto) => void;
    hide: boolean;

}

export const CreditList = ({ credits, title, btnAdd, btnAddRoute, remove, apply, paymentFrequencies, statusCredits,
    setApply, type, getSearchCredits, getCredits, getByClientName, setShowDetail, selectCredit, hide }: CreditListProps) => {
    const dispatch = useAppDispatch();
    const location = useLocation();
    const route = location.pathname;
    const navigate = useNavigate();
    const formatNumber = useNumberFormatter();
    const { clients } = useAppSelector((state: RootState) => state.clients);
    const { userRole, users } = useAppSelector((state: RootState) => state.users);
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [showCustomMessage, setShowCustomMessage] = useState(false);
    const optionsFilter: any = statusCreditOptions;
    const { isLoading } = useAppSelector((state: RootState) => state.loading);
    const dateCurrent = new Date();
    const { dateFilter, setStartDate, setEndDate } = useDateFilter({ initialStartDate: subMonths(dateCurrent, 1), initialEndDate: dateCurrent });
    const [statusCredit, setStatusCredit] = useState<string>('all');
    const [statusPayment, setStatusPayment] = useState<string>('all');
    const [user, setUser] = useState<string>('all');
    const [typeCurrency, setTypeCurrency] = useState<string>('all');
    const [paymentFrequency, setPaymentFrequency] = useState<string>('all');
    //console.log("user credit: ", user);



    const handleOpenCustomMessageModal = (credit: CreditListDto) => {
        dispatch(setCreditSelected(credit));
        setShowCustomMessage(true);
    };

    function goToDetail(credit: CreditListDto) {
        selectCredit(credit);
        setShowDetail(true);
    }

    function goToEdit(credit: CreditListDto) {
        selectCredit(credit);
        if (route == '/personal-credit-list') {
            navigate(`/personal-credit/${credit.id}/edit`)
        } else {
            navigate(`/sale-credit/${credit.id}/edit`)
        }
    }


    const rows = credits.map((credit: any, index: any) => ({
        clientNumber: credit.clientNumber,
        client: credit.client,
        debtCollector: credit.debtCollector,
        date: credit.date,
        typeCurrency: credit.typeCurrency.toUpperCase(),
        principal: formatNumber(credit.principal),
        interest: formatNumber(credit.interest),
        balance: formatNumber(credit.balance),
        paymentFrequency: credit.paymentFrequency,
        numberPayment: credit.numberPayment,
        payment: formatNumber(credit.payment),
        actions: (
            <>
                {userRole == 'admin' ? (
                    <>
                        <button className="btn btn-primary me-1 mb-1" onClick={() => { goToEdit(credit) }}  title="Modificar"><MdEdit /></button>
                        {route == '/personal-credit-list' ?
                            <button className="btn btn-danger me-1 mb-1" onClick={() => handleOpenCustomMessageModal(credit)} title="Eliminar"><MdDelete /></button> : ('')
                        }
                    </>) : ('')
                }
                <button className="btn btn-success me-1 mb-1" onClick={() => { goToDetail(credit) }} title="Detalle"><MdArticle /></button>
             
            </>
        ),
    }));

    const data = {
        columns: [
            {
                label: 'Ficha',
                field: 'clientNumber',
                sort: 'asc',
                ////width: 50
            },
            {
                label: 'Cliente',
                field: 'client',
                sort: 'asc',
                ////width: 80
            },
            {
                label: 'Cobrador',
                field: 'debtCollector',
                sort: 'asc',
                //width: 100
            },
            {
                label: 'Fecha',
                field: 'date',
                sort: 'asc',
                //width: 50
            },
            {
                label: 'Moneda',
                field: 'typeCurrency',
                sort: 'asc',
                //width: 50
            },
            {
                label: 'Capital',
                field: 'principal',
                sort: 'asc',
                //width: 50
            },
            {
                label: 'Interés',
                field: 'interest',
                sort: 'asc',
                //width: 50
            },
            {
                label: 'Saldo',
                field: 'balance',
                sort: 'asc',
            },
            {
                label: 'Frecuencia',
                field: 'paymentFrequency',
                sort: 'asc',
                //width: 50
            },
            {
                label: 'Nº de pagos',
                field: 'numberPayment',
                sort: 'asc',
                //width: 50
            },
            {
                label: 'Pago',
                field: 'payment',
                sort: 'asc',
                //width: 50
            },
            {
                label: 'Acciones',
                field: 'actions',
                sort: 'asc',
                //width: 100
            }
        ],
        // rows: [...credits],
        rows: rows
    };


    const handleCloseCustomMessageModal = () => {
        setShowCustomMessage(false);
    };

    const offApplyFilter = () => {
        setApply(false);
        dispatch(getAll());
    }


    function handleApplyFilterCredit() {
        setApply(true);
        getSearchCredits(statusCredit, user, typeCurrency, paymentFrequency, dateFilter.startDate, dateFilter.endDate)
    }

    const handleShowFilterModal = () => {
        setShowFilterModal(true);
    };

    const handleCloseFilterModal = () => {
        setShowFilterModal(false);
    };

    const removeCredit = () => {
        remove();
        handleCloseCustomMessageModal();

    };

    function getOptionsClients() {
        return clients.map((option: any) => {
            return { id: option.id, label: option.lastName + " " + option.name }
        })
    }


    const searchByClient = (client: number) => {
        //console.log("searchByName")
        getByClientName(client);
    };

    useEffect(() => {
        getCredits();
        dispatch(getSearchClients(type));
        dispatch(getUsers());
    }, [])

    if (isLoading) {
        return <Loading /> // Puedes mostrar un indicador de carga
    }



    return (
        <>

            <div className={`p-3 ${hide ? 'd-none' : 'd-block'}`}>
                <div className="border-top border-bottom py-2 mb-4 d-flex align-items-center justify-content-between">
                    <h3>{title}</h3>
                    {(userRole == 'admin' && location.pathname != '/sale-credits') ?
                        <Link to={`${btnAddRoute}`}>
                            <button className="btn btn-primary col-12">{btnAdd} <MdAddCircleOutline /></button>
                        </Link> : ('')
                    }
                </div>
                <div className="d-flex align-items-center mb-3 row">
                    <SearchByName options={getOptionsClients()} placeholder='escribe el nombre de un cliente...' getByOption={searchByClient} />
                </div>
                <div>
                    <button className="btn btn-primary mb-3" onClick={handleShowFilterModal}><MdFilterAlt /></button>
                    {apply ?
                        <button className="mb-3 ms-2 btn btn-outline-danger" onClick={() => {
                            offApplyFilter()
                        }}>
                            Quitar filtros
                        </button> : ('')
                    }
                </div>
                <CustomMessage
                    title={'Eliminar registro'}
                    message={'¿Seguro que quiere eliminar el registro?'}
                    acceptBtnName={'Eliminar'}
                    cancelBtnName={'Cancelar'}
                    onCloseModal={handleCloseCustomMessageModal}
                    operation={removeCredit}
                    showModal={showCustomMessage}
                    typeOperation="remove"
                />

                <TableResponsive columns={data.columns} rows={data.rows} />

            </div>

            <FilterModal
                show={showFilterModal}
                onClose={handleCloseFilterModal}
                onApplyFilter={handleApplyFilterCredit}
                offApplyFilter={offApplyFilter}
                options={optionsFilter}
                type="credits"
                labelSelect={'Estado'}
                users={users}
                apply={apply}
                paymentFrequencies={paymentFrequencies}
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
                paymentFrequency={paymentFrequency}
                setPaymentFrequency={setPaymentFrequency}
            />


        </>
    )
}

export default CreditList;