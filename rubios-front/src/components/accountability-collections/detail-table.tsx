import { Col, Row, Table } from "react-bootstrap";
import TableResponsive from "../common/table-responsive";
import TotalTableResponsive from "./total-table-responsive-collections";
import { useLocation, useParams } from "react-router-dom";
import { Tbody, Td, Tr } from "react-super-responsive-table";
import CollectionsDetailTableResponsive from "./collections-detail-table-responsive";

interface DetailTableProps {
    title: string,
    columnsDetail: any,
    columnsTotal: any,
    rowsDetail: any,
    rowsTotal: any,
    commissions: boolean
}

export const DetailTable = ({ title, columnsDetail, columnsTotal, rowsDetail, rowsTotal, commissions }: DetailTableProps) => {
    const location = useLocation();
    const route = location.pathname;
    const { id } = useParams();
    return (
        <>
            <Row className="border-top border-bottom p-2 mb-4 align-items-center d-flex justify-content-evenly ps-4">
                <h5>{title}</h5>
            </Row>
            {commissions ?
                <TableResponsive columns={columnsDetail} rows={rowsDetail}/> :
                <CollectionsDetailTableResponsive columns={columnsDetail} rows={rowsDetail} />

            }
        </>
    )
};
export default DetailTable;