import { Col, Row, Table } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/hooks";
import { closeCash, deleteTransaction, getTransactionsById, lastCash, setTransactionSelected } from "../../redux/slices/cash-slice";
import TableResponsive from "../common/table-responsive";
import { RootState } from "../../redux/store/store";
import { TransactionCashDto, TransactionType } from '../../entities/dto/transaction-cash-dto';
import { useEffect, useState } from "react";
import { Tbody, Td, Tr } from "react-super-responsive-table";
import useNumberFormatter from "../../redux/hooks/useNumberFormatter";
import TransactionsListCash from "./transactions-list-cash";
import ModalCustomMessage from "../custom-message/modal-custom-message";
import Loading from "../common/loading";
import { getDateString } from "../function-common/get-date-string";
import { MdAddCircleOutline, MdDelete } from "react-icons/md";
import RevenuesExpensesModal from "./revenues-expenses-modal";
import CustomMessage from "../common/custom-message/custom-message";

export const CashTransactions = () => {
    const dispatch = useAppDispatch();
    const formatNumber = useNumberFormatter();
    const { isLoading } = useAppSelector((state: RootState) => state.loading);
    const { transactions, cash, totalCash, isLoading: isLoadingCash, transactionSelected } = useAppSelector((state: RootState) => state.cash);
    const [showMessage, setShowMessage] = useState<boolean>(false);
    const [showNewRevenueExpense, setShowNewRevenueExpense] = useState<boolean>(false);
    const [showCustomMessage, setShowCustomMessage] = useState(false);
    const typeOperation: any = {
        revenue: 1,
        expense: 2
    };
    const [type, setType] = useState(typeOperation.revenue);
    console.log("totalCash: ", totalCash);
    const columns = [
        {
            label: 'Fecha',
            field: 'date'
        },
        {
            label: 'Nombre',
            field: 'user'
        },
        {
            label: 'Tipo',
            field: 'type'
        },
        {
            label: 'Concepto',
            field: 'concept'
        },
        {
            label: 'Moneda',
            field: 'currencyType'
        },
        {
            label: 'Importe',
            field: 'amount'
        },
        {
            label: 'Acción',
            field: 'action'
        }
    ];

    const rows = transactions.map((transaction: TransactionCashDto) => ({
        date: transaction.date,
        user: transaction.user,
        type: transaction.type,
        concept: transaction.concept,
        currencyType: transaction.currencyType.toUpperCase(),
        amount: formatNumber(transaction.amount),
        action: (
            <button className="btn btn-danger btn-sm me-1 mb-1"
                onClick={() => handleOpenCustomMessageModal(transaction)}
                title="Eliminar"
            ><MdDelete /></button>
        )
    }));


    const handleOpenCustomMessageModal = (transaction: TransactionCashDto) => {
        dispatch(setTransactionSelected(transaction));
        setShowCustomMessage(true);
    };

    const handleCloseCustomMessageModal = () => {
        setShowCustomMessage(false);
    };

    const remove = async () => {
        if (transactionSelected && cash) {
            await dispatch(deleteTransaction(transactionSelected.id, transactionSelected.type, cash?.id));
            handleCloseCustomMessageModal();
        }

    };


    async function getTransactions() {
        if (cash) {
            await dispatch(getTransactionsById(cash?.id));
        }
    }

    function close() {
        if (cash) dispatch(closeCash(cash?.id));
        setShowMessage(false);
    }

    function openNewRevenueExpense(type: number) {
        setShowNewRevenueExpense(true);
        setType(type);
    }

    function getTitle() {
        return (cash) ? `${getDateString(new Date(cash?.openingDate))}` : ('');
    }

    useEffect(() => {
        getTransactions();
    }, []);

    if (isLoading) {
        return <Loading /> // Puedes mostrar un indicador de carga
    }


    return (
        <Row className='justify-content-center p-3'>
            <Row className="bg-body-tertiary shadow pt-3 bg-white rounded col-11">
                <Row className="justify-content-center border-bottom border-bottom-1 py-2">
                    <Col lg="12">
                        <h3 className="text-center">CAJA</h3>
                    </Col>
                    <Col lg="12">
                        <h3 className="text-center">{getTitle()}</h3>
                    </Col>
                </Row>
                <div className="pt-3">

                    <Table className="table table-bordered table-striped">
                        <Tbody>
                            <Tr>
                                <Td></Td>
                                <Td className="col-2"><span className="d-flex justify-content-center fw-bold">Pesos</span></Td>
                                <Td className="col-2"><span className="d-flex justify-content-center fw-bold">Dolares</span></Td>
                            </Tr>
                            <Tr>
                                <Td className="fw-bold"><span className="d-table-mobile">Saldo inicial</span><span className="d-lg-none">SI</span></Td>
                                <Td className="bg-success text-white col-2"><span className="d-flex justify-content-end fw-bold">{formatNumber(totalCash.openingBalancePesos)}</span></Td>
                                <Td className="bg-success text-white col-2"><span className="d-flex justify-content-end fw-bold">{formatNumber(totalCash.openingBalanceDollar)}</span></Td>

                            </Tr>
                            <Tr>
                                <Td className="fw-bold"><div className="row pe-3">
                                    <span className="d-table-mobile col-lg-6">Total Ingresos</span><span className="d-lg-none">Ingresos</span>
                                    <button className="btn btn-primary btn-sm col-lg-3 col-12 ms-2" onClick={() => openNewRevenueExpense(typeOperation.revenue)}>Nuevo <MdAddCircleOutline /></button>
                                </div>
                                </Td>
                                <Td className="bg-success text-white col-2"><span className="d-flex justify-content-end fw-bold">{formatNumber(totalCash.totalIncomesPesos)}</span></Td>
                                <Td className="bg-success text-white col-2"><span className="d-flex justify-content-end fw-bold">{formatNumber(totalCash.totalIncomesDollar)}</span></Td>

                            </Tr>
                            <Tr>
                                <Td className="fw-bold"><div className="row pe-3">
                                    <span className="d-table-mobile col-lg-6">Total Egresos</span><span className="d-lg-none">Egresos</span>
                                    <button className="btn btn-primary btn-sm col-lg-3 col-12 ms-2" onClick={() => openNewRevenueExpense(typeOperation.expense)}>Nuevo <MdAddCircleOutline /></button>
                                </div>
                                </Td>
                                <Td className="bg-success text-white col-2"><span className="d-flex justify-content-end fw-bold">{formatNumber(totalCash.totalOutflowPesos)}</span></Td>
                                <Td className="bg-success text-white col-2"><span className="d-flex justify-content-end fw-bold">{formatNumber(totalCash.totalOutflowDollar)}</span></Td>
                            </Tr>
                            <Tr>
                                <Td className="fw-bold"><span className="d-table-mobile">Saldo Final </span><span className="d-lg-none">SF</span>
                                </Td>
                                <Td className="bg-success text-white col-2"><span className="d-flex justify-content-end fw-bold">{formatNumber(totalCash.closingBalancePesos)}</span></Td>
                                <Td className="bg-success text-white col-2"><span className="d-flex justify-content-end fw-bold">{formatNumber(totalCash.closingBalanceDollar)}</span></Td>

                            </Tr>
                        </Tbody>
                    </Table>
                    {isLoadingCash ?
                        <Loading /> :
                        <TransactionsListCash columns={columns} rows={rows} remove={remove} />

                    }
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
                    <div className="d-flex justify-content-center py-3">
                        <div className="col-lg-4 col-12">
                            <button className="text-center btn btn-success col-12" onClick={() => { setShowMessage(true) }}>Cerrar Caja</button>
                        </div>
                    </div>
                    <ModalCustomMessage title={'Gestión de Caja'} message={'¿Confirmas el cierre de la caja?'} show={showMessage} onClose={close} />
                    <RevenuesExpensesModal type={type} show={showNewRevenueExpense} close={() => { setShowNewRevenueExpense(false) }} />
                </div>
            </Row>
        </Row>
    )
};
export default CashTransactions;