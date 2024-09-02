import { MdAttachMoney } from 'react-icons/md';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import { useAppSelector } from '../../redux/hooks/hooks';
import { RootState } from '../../redux/store/store';
import { useLocation, useParams } from 'react-router-dom';
import { string } from 'yup';

interface TableResponsiveProps {
    columns: any[],
    rows: any[],
}
export default function TableResponsive({ columns, rows }: TableResponsiveProps) {
    const { users, userRole } = useAppSelector((state: RootState) => state.users);
    const location = useLocation();
    const { type } = useParams();
    //console.log("usando tabla: ", location.pathname)

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
                    {columns.map((column: any, index) => (

                        (userRole == 'debt-collector' && column.label == 'Cobrador') ? ('') :
                            <Th key={index} className={`${column.label == 'Acción' ? 'col-2' : ''}`}>{column.label}</Th>


                    ))}
                </Tr>
            </Thead>
            <Tbody>
                {rows.length == 0 ?
                    <Tr>
                        <Td>No hay registros.</Td>
                    </Tr> : (

                        rows.map((row: any, index) => (
                            <Tr key={index}>
                                {Object.keys(row).map((key) => (
                                    (userRole == 'debt-collector' && key == 'debtCollector') ? ('') :
                                        <Td key={key}>{capitalize(row[key])}</Td>
                                ))}
                            </Tr>
                        ))
                    )
                }
            </Tbody>
        </Table>
    );
}