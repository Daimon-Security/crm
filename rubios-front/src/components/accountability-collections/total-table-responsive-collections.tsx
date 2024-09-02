import { useLocation, useParams } from "react-router-dom";
import { Table, Tbody, Td, Tr } from "react-super-responsive-table";

interface TotalTableProps {
    rows: any[]
}

export const TotalTableResponsiveCollections = ({ rows }: TotalTableProps) => {
    const location = useLocation();
    const route = location.pathname;
    const { id, previous, type } = useParams();

    return (
        <Table className="table table-bordered table-striped d-table-mobile">
            <Tbody>
                {
                    rows.length > 0 ? (
                        <>
                            <Tr>
                                {route == `/collections/${type}/${id}/detail/${previous}` ?
                                    <>
                                        <Td>No cobrado: <span className='fw-bold'>{rows[0].totalReceivable}</span></Td>
                                        <Td className="bg-success  text-white">Cobrado: <span className='fw-bold'>{rows[0].totalCollected}</span></Td>
                                    </> : (
                                        <>
                                            <Td className="bg-success  text-white">Rendido: <span className='fw-bold'>{rows[0].totalAccountability}</span></Td>
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
export default TotalTableResponsiveCollections;