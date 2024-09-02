import { useLocation, useParams } from "react-router-dom";
import { Table, Tbody, Td, Tr } from "react-super-responsive-table";

interface TotalTableProps {
    rows: any[]
}

export const TotalTableResponsiveCommissions = ({ rows }: TotalTableProps) => {
    const location = useLocation();
    const route = location.pathname;
    const { id, type } = useParams();

    return (
        <Table className="table table-bordered table-striped d-table-mobile">
            <Tbody>
                {
                    rows.length > 0 ? (
                        <>
                            <Tr>
                                {route == `/commissions/${type}/${id}/history` ?
                                    <>
                                        <Td className="bg-success  text-white">Cobrado: <span className='fw-bold'>{rows[0].commission}</span></Td>
                                    </> : (
                                        <>
                                            <Td className="bg-success  text-white">A cobrar: <span className='fw-bold'>{rows[0].commission}</span></Td>
                                        </>
                                    )}
                            </Tr>
                        </>
                    ) : ('')
                }
            </Tbody>
        </Table>
    )
};
export default TotalTableResponsiveCommissions;