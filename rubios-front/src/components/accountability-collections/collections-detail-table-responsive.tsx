import { MdAttachMoney } from 'react-icons/md';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import { useAppSelector } from '../../redux/hooks/hooks';
import { RootState } from '../../redux/store/store';
import { useLocation, useParams } from 'react-router-dom';
import { string } from 'yup';

interface CollectionsDetailTableResponsiveProps {
    columns: any[],
    rows: any[],
}
export default function CollectionsDetailTableResponsive({ columns, rows }: CollectionsDetailTableResponsiveProps) {
    const { users, userRole } = useAppSelector((state: RootState) => state.users);
    const location = useLocation();
    const {id, type } = useParams();
    console.log("usando tabla: ", location.pathname);
    console.log("usando id: ", id);
    console.log("usando type: ", type);
   
    console.log(`${location.pathname === `/collections-accounted/${type}/${id}/history`}`);

    const capitalize = (inputString: string): string => {
        if (!inputString || typeof (inputString) != "string") return inputString
        // Split the input string into words
        const words = inputString?.split(' ');

        // Capitalize the first letter of each word and convert the rest to lowercase
        const capitalizedWords = words.map((word) => {
            if (word.length === 0) {
                return ''; // Handle empty words gracefully
            }
            const firstLetter = word[0].toUpperCase();
            const restOfWord = word.slice(1).toLowerCase();
            return firstLetter + restOfWord;
        });

        // Join the capitalized words back together
        const resultString = capitalizedWords.join(' ');

        return resultString;
    }

    return (
        <Table className="table table-bordered table-striped">
            <Thead className="table-light sticky-top custom-table-header border-on-scroll">
                <Tr >
                <Th>#</Th>
                <Th>Cliente</Th>
                <Th>Vto pago</Th>
                <Th>Concepto</Th>
                <Th>Importe</Th>
                <Th>Pago</Th>
                <Th>Estado Cuota</Th>
                <Th>Fecha de rendición</Th>
                <Th className={`${location.pathname === `/collections-accounted/${type}/${id}/history`? 'd-none' : 'd-flex'}`}>Acción</Th>
                </Tr>
            </Thead>
            <Tbody>
                {rows.length == 0 ?
                    <Tr>
                        <Td>No hay registros.</Td>
                    </Tr> : (

                        rows.map((row: any, index) => (
                            <Tr key={index}>
                                <Td>{row.id}</Td>
                                <Td>{capitalize(row.client)}</Td>
                                <Td>{row.paymentDueDate}</Td>
                                <Td>{capitalize(row.concept)}</Td>
                                <Td>{row.payment}</Td>
                                <Td>{row.actualPayment}</Td>
                                <Td>{row.status}</Td>
                                <Td>{row.accountabilityDate}</Td>
                                <Td  className={`${location.pathname === `/collections-accounted/${type}/${id}/history`? 'd-none' : 'd-flex'}`}>{row.action}</Td>
                            </Tr>
                        ))
                    )
                }
            </Tbody>
        </Table>
    );
}