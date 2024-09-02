import { Table, Tbody, Td, Th, Thead, Tr } from "react-super-responsive-table"
import '../styles.css';
import { Col } from "react-bootstrap";

interface TransactionsListCashProps {
    columns: any[],
    rows: any[],
    remove: () => void;
}

export const TransactionsListCash = ({ columns, rows }: TransactionsListCashProps) => {

    const toLocalDateTime = (date: string): string => {
        const dateHourParts = date.split(" "); // Dividir la cadena en fecha y hora
        const dateParts = dateHourParts[0].split("-"); // Dividir la fecha en día, mes y año
        const hourParts = dateHourParts[1].split(":")

        const fecha = new Date(
            parseInt(dateParts[2]),  // Año
            parseInt(dateParts[1]) - 1,  // Mes (restamos 1 porque los meses en JavaScript van de 0 a 11)
            parseInt(dateParts[0]),  // Día
            parseInt(hourParts[0]),    // Hora
            parseInt(hourParts[1]),    // Minuto
            parseInt(hourParts[2])     // Segundo
        );

        const utcTimestamp = fecha;
        //console.log("utcTimestamp: ", utcTimestamp);
        const localTimezoneOffset = new Date().getTimezoneOffset();
        const localTimestamp = new Date(utcTimestamp.getTime() - (localTimezoneOffset * 60000));
        const localTimeString = localTimestamp.toLocaleString();
        return localTimeString;
    }

    const capitalize = (inputString: string): string => {
        if (!inputString || typeof (inputString) != "string") return inputString
        const words = inputString?.split(' ');
        const capitalizedWords = words.map((word) => {
            if (word.length === 0) {
                return '';
            }
            const firstLetter = word[0].toUpperCase();
            const restOfWord = word.slice(1).toLowerCase();
            return firstLetter + restOfWord;
        });
        const resultString = capitalizedWords.join(' ');
        return resultString;
    }

    const dolarTransactions = rows.filter(x => x.currencyType == 'DOLAR');
    const pesoTransactions = rows.filter(x => x.currencyType == 'PESO');

    return (
        <>
            <Col ><h3 className="mt-5 mb-3 font-weight-bold">Transacciones en pesos</h3></Col>
            <Table className="table table-bordered table-striped">
                <Thead className="table-light">
                    <Tr>
                        {/* {columns.map((column: any, index) => (
                            (column.label != 'Tipo') ?
                                <Th key={index}>{column.label}</Th> : ('')
                        ))} */}
                        <Th>Fecha</Th>
                        <Th>Nombre</Th>
                        <Th>Concepto</Th>
                        <Th>Moneda</Th>
                        <Th>Importe</Th>
                        <Th>Acción</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {pesoTransactions.length == 0 ?
                        <Tr>
                            <Td>No hay registros.</Td>
                        </Tr> : (

                            pesoTransactions.map((row: any, index) => (
                                <Tr key={index} className={`${row.type == 4 || row.type == 7 || row.type == 8 || row.type == 9 || row.type == 10 ? 'text-red' : ''}`}>
                                    <Td>{toLocalDateTime(row.date)}</Td>
                                    <Td>{capitalize(row.user)}</Td>
                                    <Td>{capitalize(row.concept)}</Td>
                                    <Td>{row.currencyType}</Td>
                                    <Td className="d-flex justify-content-end">
                                        <span className={`${row.type == 4 || row.type == 7 || row.type == 8 || row.type == 9 || row.type == 10 ? 'd-block' : 'd-none'}`}>-</span>{row.amount}
                                    </Td>
                                    <Td>{row.type == 4 || row.type == 3 ?
                                        <span>{row.action}</span> : <span className="d-lg-none">-</span>
                                    }
                                    </Td>
                                </Tr>
                            ))
                        )
                    }
                </Tbody>
            </Table>
            <Col ><h3 className="mt-5 mb-3 font-weight-bold">Transacciones en dólares</h3></Col>
            <Table className="table table-bordered table-striped">
                <Thead className="table-light">
                    <Tr>
                        {columns.map((column: any, index) => (
                            (column.label != 'Tipo') ?
                                <Th key={index}>{column.label}</Th> : ('')
                        ))}
                    </Tr>
                </Thead>
                <Tbody>
                    {dolarTransactions.length == 0 ?
                        <Tr>
                            <Td>No hay registros.</Td>
                        </Tr> : (
                            dolarTransactions.map((row: any, index) => (
                                <Tr key={index} className={`${row.type == 4 || row.type == 7 || row.type == 8 || row.type == 9 || row.type == 10 ? 'text-red' : ''}`}>
                                    <Td>{toLocalDateTime(row.date)}</Td>
                                    <Td>{capitalize(row.user)}</Td>
                                    <Td>{capitalize(row.concept)}</Td>
                                    <Td>{row.currencyType}</Td>
                                    <Td className="d-flex justify-content-end">
                                        <span className={`${row.type == 4 || row.type == 7 || row.type == 8 || row.type == 9 || row.type == 10 ? 'd-block' : 'd-none'}`}>-</span>
                                        {row.amount}
                                    </Td>
                                    <Td>{row.type == 4 || row.type == 3 ?
                                        <span>{row.action}</span> : <span className="d-lg-none">-</span>
                                    }
                                    </Td>
                                </Tr>
                            ))
                        )
                    }
                </Tbody>
            </Table>
        </>
    )
};
export default TransactionsListCash;