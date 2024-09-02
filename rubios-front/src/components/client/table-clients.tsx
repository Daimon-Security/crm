import { Table, Tbody, Td, Th, Thead, Tr } from "react-super-responsive-table";

interface TableClientsProps {
    columns: any[],
    rows: any[],
}
export const TableClients = ({ columns, rows }: TableClientsProps) => {
    return (
        <Table className="table table-bordered table-striped">
            <Thead className="table-light">
                <Tr>
                    {columns.map((column: any, index) => (
                            <Th key={index}>{column.label}</Th>

                    ))}
                </Tr>
            </Thead>
            <Tbody>
                {rows.length == 0 ?
                    <Tr>
                        <Td>No hay registros.</Td>
                    </Tr> : (

                        rows.map((row: any, index) => (
                            <Tr key={index} onClick={()=>{console.log("fila: ", index)}}>
                                {Object.keys(row).map((key) => (
                                    <Td key={key}>{row[key]}</Td>
                                ))}
                            </Tr>
                        ))
                    )
                }
            </Tbody>
        </Table>
    );
}