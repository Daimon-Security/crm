import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/hooks";
import { RootState } from "../../redux/store/store";
import CommonList from "../common/list";
import { deleteClient, getByClientName, getClient, getClients, getPaymentBhavior, getSearchClients, getTransactionsClient, setClientSelected, setLoading } from "../../redux/slices/client-slice";
import { Client, ClientType } from "../../entities/client";
import { ButtonsActions } from "../common/buttons-actions";
import { Link, useParams } from "react-router-dom";
import { MdAddCircleOutline, MdArticle, MdFilterAlt, MdSearch } from "react-icons/md";
import CustomMessage from "../common/custom-message/custom-message";
import TableResponsive from "../common/table-responsive";
import { SearchByName } from "../common/search-by-name";
import Loading from "../common/loading";
import TransactionsList from "../common/transactions-list";
import PersonalCreditDetail from "../personal-credit/personal-credit-detail";
import { getById as getCreditById } from "../../redux/slices/credit-slice";
import { getById as getSaleCreditById } from "../../redux/slices/sale-credit-slice";
import { format } from "date-fns";
import useNumberFormatter from "../../redux/hooks/useNumberFormatter";
import SaleCreditDetail from "../sale-credit/sale-credit-detail";
import TransactionsPaymentBhaviorReport from "./transactions-payment-bhavior-report";
import { MessageSystemCash } from "../common/message-system-cash";

export const ClientList = () => {
    const dispatch = useAppDispatch();
    const { type } = useParams();
    const { isLoading } = useAppSelector((state: RootState) => state.loading);
    const { clients, clientSelected, transactions, paymentBhavior } = useAppSelector((state: RootState) => state.clients);
    const { userRole } = useAppSelector((state: RootState) => state.users);
    const [showCustomMessage, setShowCustomMessage] = useState(false);
    const [showTransactions, setShowTransactions] = useState(false);
    const [showCreditDetail, setShowCreditDetail] = useState(false);
    const [active, setActive] = useState<string>('transactions');
    const { opening, message, cash } = useAppSelector((state: RootState) => state.cash);
    const [showMessageSystem, setShowMessageSystem] = useState<boolean>(false);

    const formatNumber = useNumberFormatter();

    function closeMessageSystem() {
        setShowMessageSystem(false);
      }
    

    const handleOpenCustomMessageModal = (client: Client) => {
        dispatch(setClientSelected(client));
        setShowCustomMessage(true);
    };

    const handleCloseCustomMessageModal = () => {
        setShowCustomMessage(false);
    };

    const goToEdit = (client: any) => {
        dispatch(setClientSelected(client));
    };

    const remove = async () => {
        if (clientSelected) {
            await dispatch(deleteClient(clientSelected.id));

            handleCloseCustomMessageModal();
        }

    };

    const goToDetail = (client: Client) => {
        dispatch(setClientSelected(client));
        dispatch(getTransactionsClient(client.id, client.type));
        dispatch(getPaymentBhavior(client.id, client.type, null));
        setShowTransactions(true);
        setActive('transactions');
    }

    const transactionColumns = [
        {
            label: 'Fecha',
            field: 'date',
        },
        {
            label: 'Concepto',
            field: 'concept',
        },
        {
            label: 'Moneda',
            field: 'currencyType',
        },
        {
            label: 'Importe',
            field: 'amount',
        },
        {
            label: 'Crédito',
            field: 'credit',
        },
    ];

    const transactionRows = transactions.map((transaction: any) => ({
        date: transaction.date,
        concept: transaction.concept,
        currencyType: transaction.currencyType,
        amount: formatNumber(transaction.amount),
        credit: (
            <button className="btn btn-success col-12" onClick={() => {
                console.log("transaction.creditId: ", transaction.creditId);
                selectCredit(transaction.creditId);
                setShowCreditDetail(true);
            }}>ver</button>
        )
    }))

    function selectCredit(id: string) {
        console.log("entra select credit: ")
        if (clientSelected?.type == 1) {
            dispatch(getCreditById(id));
        } else if (clientSelected?.type == 2) {
            dispatch(getSaleCreditById(id));
        }
    }

    function goBack() {
        setShowTransactions(false);
    }

    const rows = clients.map((client: Client, index: number) => ({
        clientNumber: (client.clientNumber) ? client.clientNumber : '-',
        client: client.lastName + " " + client.name,
        // type: (client.type) ? `${ClientType[client.type]}` : '-',
        phoneNumber: (client.phoneNumber) ? client.phoneNumber : '-',        
        address: (client.address) ? client.address : '-',
        actions: (
            <>
                <ButtonsActions entity={client} openModal={handleOpenCustomMessageModal} goToEdit={goToEdit}
                    goToDetail={goToDetail} userRole={userRole} routeEdit={`/client-edit/${type}/${client.id}`} />
                <button className="btn btn-success mb-1" onClick={() => { goToDetail(client) }}><MdArticle /></button>
                {getButtonsByTypeClient(client.type, client)}

            </>
        ),
    }));

    const data = {
        columns: [
            {
                label: 'Nº Ficha',
                field: 'clientNumber',
                //sort: 'desc',
            },
            {
                label: 'Apellido y Nombre',
                field: 'client',
                //sort: 'asc',
                ////width: 80
            },
            {
                label: 'Teléfono',
                field: 'phoneNumber',
                //sort: 'asc',
                //width: 50
            },
            {
                label: 'Dirección',
                field: 'address',
                //sort: 'asc',
                //width: 50
            },
            {
                label: 'Acciones',
                field: 'actions',
                //sort: 'asc',
                //width: 100
            }
        ],
        rows: rows
    };

    function getButtonsByTypeClient(type: number, client: Client) {
        switch (type) {
            case 1:
                return (<Link to={`${opening?"/personal-credit-create":''}`}>
                    <button className="btn btn-success mx-1 mb-1 col-lg-4 col-11"
                     onClick={() => {if(opening) {dispatch(setClientSelected(client))} else setShowMessageSystem(true) }}
                     >Crédito</button>
                </Link>
                );
            case 2:
                return (<Link to={`${opening?"/sale-create":''}`}>
                    <button className="btn btn-success mx-1 mb-1 col-lg-4 col-11"
                     onClick={() => { if(opening) {dispatch(setClientSelected(client))} else setShowMessageSystem(true) }}
                     >Venta</button>
                </Link>
                );
        }
    }

    const searchByClient = (client: number) => {
        //console.log("searchByName")
        if (type) dispatch(getClient(client, type));
    };

    function getTitle() {
        return (type == '1') ? 'por créditos' : `por ventas`;
    }

    function getOptionsClients() {
        return clients.map((option: any) => {
            return { id: option.id, label: option.lastName + " " + option.name }
        })
    }

    async function getClientsList() {
        if (type) await dispatch(getSearchClients(type));
    }

    useEffect(() => {
        getClientsList();
    }, [])

    if (isLoading) {
        return <Loading /> // Puedes mostrar un indicador de carga
    }

    return (
        <>
            <div className={`${showCreditDetail ? 'd-none' : 'd-block'}`}>
                <div className={`p-3 ${showTransactions ? 'd-none' : 'd-block'}`}>
                    <div className="border-top border-bottom py-2 mb-4 d-flex align-items-center justify-content-between">
                        <h3>Clientes {getTitle()}</h3>
                        {(userRole != 'debt-collector') ?
                            <Link to={`/client-create/${type}`}>
                                <button className="btn btn-primary">Nuevo <MdAddCircleOutline /></button>
                            </Link> : ('')
                        }
                    </div>
                    <div className="d-flex align-items-center mb-3 row">
                        <SearchByName options={getOptionsClients()} placeholder='escribe el nombre de un cliente...' getByOption={searchByClient} />
                    </div>

                    <CustomMessage
                        title={'Eliminar registro'}
                        message={'¿Seguro que quiere eliminar el registro?'}
                        acceptBtnName={'Eliminar'}
                        cancelBtnName={'Cancelar'}
                        onCloseModal={handleCloseCustomMessageModal}
                        operation={remove}
                        showModal={showCustomMessage}
                        typeOperation="remove"
                    />

                    <TableResponsive columns={data.columns} rows={data.rows} />
                </div>
                <div className={`p-3 row ${showTransactions ? 'd-flex' : 'd-none'}`}>
                    <TransactionsPaymentBhaviorReport
                        columnsTransactions={transactionColumns}
                        rowsTransactions={transactionRows}
                        rowsPaymentBhavior={paymentBhavior}
                        active={active}
                        setActive={setActive}
                        goBack={goBack} />
                </div>
            </div>

            {clientSelected?.type == 1 ?
                <PersonalCreditDetail setShowDetail={setShowCreditDetail} hide={showCreditDetail} activeTab="history" />
                :
                <SaleCreditDetail setShowDetail={setShowCreditDetail} hide={showCreditDetail} activeTab="history" />

            }

            <MessageSystemCash showMessage={showMessageSystem} isLoading={isLoading} cash={cash} message={message} closeMessage={closeMessageSystem} />

        </>

    )
};
export default ClientList;