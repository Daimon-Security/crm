import { Col, Row } from "react-bootstrap";
import TableResponsive from "./table-responsive";
import { MdArrowBack } from "react-icons/md";

interface TransactionsListProps {
    columns: any,
    rows: any,
}
export const TransactionsList = ({ columns, rows }: TransactionsListProps) => {
    return (
        <>
            <TableResponsive columns={columns} rows={rows} />
        </>
    )
};
export default TransactionsList;