import { Col, Nav, NavItem, NavLink, Row } from "react-bootstrap";
import { MdArrowBack } from "react-icons/md";
import TableResponsive from "../common/table-responsive";
import { useState, useEffect } from 'react';
import { useAppSelector } from "../../redux/hooks/hooks";
import { RootState } from '../../redux/store/store';
import TransactionsList from "../common/transactions-list";
import PaymentBhaviorReport from "./payment-bhavior-report";

interface TransactionsListProps {
    rowsTransactions: any,
    columnsTransactions: any,
    rowsPaymentBhavior: any,
    goBack: () => void;
    active: string,
    setActive: (active: string) => void;
}
export const TransactionsPaymentBhaviorReport = ({ columnsTransactions, rowsTransactions, goBack, active, setActive, rowsPaymentBhavior }: TransactionsListProps) => {
    const { clientSelected } = useAppSelector((state: RootState) => state.clients);
    const [activeTab, setActiveTab] = useState(active);
    const toggleTab = (tab: any) => {
        if (activeTab !== tab) {
            setActiveTab(tab);
            setActive(tab);
        }
    };

    useEffect(() => {
        setActiveTab(active)
    }, [active])


    return (
        <>
            <Row className="border-top border-bottom p-2 mb-4 align-items-center d-flex justify-content-start">
                <Col lg={1} xs={2}>
                    <button className="bg-transparent border-0" onClick={() => {
                        goBack()
                    }
                    }>
                        <MdArrowBack size={30} color="grey" />
                    </button>
                </Col>
                <Col lg={11} xs={10}>
                    <h3>{`${clientSelected?.lastName + " " + clientSelected?.name}`}</h3>
                </Col>
            </Row>

            <div className="mb-2">
                <Nav className="row d-flex px-1">
                    <NavItem className={`col-6 justify-content-center align-items-center border border-1 ${activeTab === 'transactions' ? 'active bg-secondary' : 'bg-transapent'}`}>
                        <NavLink
                            onClick={() => toggleTab('transactions')}
                        >
                            <h5 className={`${activeTab === 'transactions' ? 'text-white' : 'text-dark'}`}>Transacciones</h5>

                        </NavLink>
                    </NavItem>
                    <NavItem className={`col-6 justify-content-center align-items-center border border-1 ${activeTab === 'paymentBhavior' ? 'active bg-secondary' : 'bg-transapent'}`}>
                        <NavLink
                            onClick={() => toggleTab('paymentBhavior')}
                        >
                            <h5 className={`d-none d-lg-block ${activeTab === 'paymentBhavior' ? 'text-white' : 'text-dark'}`}>Comportamiento de pago</h5>
                            <h5 className={`d-lg-none ${activeTab === 'paymentBhavior' ? 'text-white' : 'text-dark'}`}>Comportam.</h5>

                        </NavLink>
                    </NavItem>
                </Nav>
            </div>
            {
                active == 'transactions' ?
                    <TransactionsList rows={rowsTransactions} columns={columnsTransactions} /> :

                    <PaymentBhaviorReport rows={rowsPaymentBhavior} />
            }
        </>
    )
};
export default TransactionsPaymentBhaviorReport;