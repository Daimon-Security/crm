import { differenceInDays } from "date-fns";
import { Table, Tbody, Td, Th, Thead, Tr } from "react-super-responsive-table";
import { getDateString } from "../function-common/get-date-string";
import useNumberFormatter from "../../redux/hooks/useNumberFormatter";

export const PaymentBhaviorReport = ({ rows }: any) => {
    const formatNumber = useNumberFormatter();

    const getDate = (date: string): Date => {
        const dateHourParts = date.split("T"); // Dividir la cadena en fecha y hora
        const dateParts = dateHourParts[0].split("-"); // Dividir la fecha en día, mes y año
        const hourParts = dateHourParts[1].split(":")

        const fecha = new Date(
            parseInt(dateParts[0]),  // Año
            parseInt(dateParts[1]) - 1,  // Mes (restamos 1 porque los meses en JavaScript van de 0 a 11)
            parseInt(dateParts[2]),  // Día
            parseInt(hourParts[0]),    // Hora
            parseInt(hourParts[1]),    // Minuto
            parseInt(hourParts[2])     // Segundo
        );
        return fecha;
    }

    const toLocalDateTime = (date: string): string => {
        const dateHourParts = date.split("T"); // Dividir la cadena en fecha y hora
        const dateParts = dateHourParts[0].split("-"); // Dividir la fecha en día, mes y año
        const hourParts = dateHourParts[1].split(":")

        const fecha = new Date(
            parseInt(dateParts[0]),  // Año
            parseInt(dateParts[1]) - 1,  // Mes (restamos 1 porque los meses en JavaScript van de 0 a 11)
            parseInt(dateParts[2]),  // Día
            parseInt(hourParts[0] + 3),    // Hora
            parseInt(hourParts[1]),    // Minuto
            parseInt(hourParts[2])     // Segundo
        );

        const utcTimestamp = fecha;

        const localTimezoneOffset = new Date().getTimezoneOffset();
        const localTimestamp = new Date(utcTimestamp.getTime() - (localTimezoneOffset * 60000));
        const localTimeString = localTimestamp.toLocaleString();
        console.log("localTimeString: ", localTimeString);
        const dateString = localTimeString.split(",")[0];
        const partsDateString = dateString.split("/");
        if (partsDateString[0].length == 1) partsDateString[0] = '0' + partsDateString[0];
        return partsDateString[0] + "-" + partsDateString[1] + "-" + partsDateString[2];
    }


    function getDiffDate(date1: string, date2: string) {
        if (date2) {
            const paymentDueDate = getDate(date1);
            const paymentDate = getDate(date2);
            const diferenciaEnDias = differenceInDays(paymentDate, paymentDueDate);

            if (diferenciaEnDias >= 0) {
                return diferenciaEnDias;
            } else {
                return 0
            }
        } else {
            const paymentDueDate = getDate(date1);
            if (paymentDueDate < new Date()) {
                return differenceInDays(new Date(), paymentDueDate);
            } else {
                return '-'
            }
        }


    }

    function getColorForDiffDate(paymentDueDate: string, paymentDate: string) {
        const diferenciaEnDias = differenceInDays((paymentDate) ? new Date(paymentDate) : new Date(), new Date(paymentDueDate));
        console.log("diferenciaEnDias color: ", diferenciaEnDias)
        if (diferenciaEnDias > 10) {
            return 'red'; // Color rojo si la diferencia es mayor que 10 días
        } else if (diferenciaEnDias > 3 && diferenciaEnDias <= 10) {
            return '#ff601d'; // Color amarillo si la diferencia es mayor que 3 días
        } else if (diferenciaEnDias <= 3) {
            return 'blue'; // Color azul si la diferencia es de 0 a 2 días
        }
        return ''; // Puedes establecer un color predeterminado o dejarlo vacío si lo deseas
    }

    return (
        <Table className="table table-bordered table-striped">
            <Thead className="table-light">
                <Tr>
                    <Th>Concepto</Th>
                    <Th>Fecha de Vencimiento</Th>
                    <Th>Fecha de pago</Th>
                    <Th>Días de atraso</Th>
                </Tr>
            </Thead>
            <Tbody>
                {rows.length == 0 ?
                    <Tr>
                        <Td>No hay registros.</Td>
                    </Tr> : (
                        rows.map((row: any, index: any) => (
                            <>
                                <Tr key={index}>
                                    <Td>Crédito de:
                                        <span className="fw-bold">{(row.credit.typeCurrency == 'peso') ? ' $' : ' USD'}</span>
                                        <span className="fw-bold">{formatNumber(row.principal)}</span> Fecha: <span className="fw-bold">{toLocalDateTime(row.date)}</span> Estado:  <span className="fw-bold">{(row.status == 1) ? 'Actual' : 'Renovado'}</span>
                                    </Td>
                                </Tr>
                                {row.paymentsDetail.map((paymentDetail: any, paymentIndex: number) => (
                                    <Tr key={paymentIndex}>
                                        <Td>{(paymentDetail.paymentType == 1) ? 'Cuota' : 'Interés'}</Td>
                                        <Td>{toLocalDateTime(paymentDetail.paymentDueDate)}</Td>
                                        <Td>{paymentDetail.paymentDate ? toLocalDateTime(paymentDetail.paymentDate) : '-'}</Td>

                                        <Td style={{ color: getColorForDiffDate(paymentDetail.paymentDueDate, paymentDetail.paymentDate) }}>
                                            <span className="fw-bold">{getDiffDate(paymentDetail.paymentDueDate, paymentDetail.paymentDate)}</span>
                                        </Td>
                                    </Tr >
                                ))}
                            </>


                        ))
                    )
                }
            </Tbody>
        </Table >
    )
};

export default PaymentBhaviorReport;