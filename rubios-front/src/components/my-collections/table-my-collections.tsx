import { MdAttachMoney, MdKeyboardArrowDown } from 'react-icons/md';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import { useAppSelector } from '../../redux/hooks/hooks';
import { RootState } from '../../redux/store/store';
import { useLocation, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import React from 'react';

interface TableMyCollectionsProps {
    columns: any[],
    rows: any[],
}


export default function TableMyCollections({ columns, rows }: TableMyCollectionsProps) {
    const { users, userRole } = useAppSelector((state: RootState) => state.users);
    const location = useLocation();



    const groupedData = groupByClient(rows);
    const [collapsedRows, setCollapsedRows] = useState(new Set());

    //console.log("usando tabla: ", location.pathname)

    const capitalize = (inputSTring: string): string => {
        if (!inputSTring) return ""
        // Split the input sTring into words
        const words = inputSTring.split(' ');

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
        const resultSTring = capitalizedWords.join(' ');

        return resultSTring;
    }

    function groupByClient(rows: any) {
        const groupedData = new Map();
        rows.forEach((item: any) => {
            const client = item.creditId;
            if (!groupedData.has(client)) {
                groupedData.set(client, []);
            }
            groupedData.get(client).push(item);
        });
        console.log("groupedData: ", groupedData)
        return groupedData;
    }

    const toggleRow = (client: any) => {
        console.log("client: ", client)
        if (collapsedRows.has(client)) {
            collapsedRows.delete(client);
        } else {
            collapsedRows.add(client);
        }
        setCollapsedRows(new Set(collapsedRows));
    };

    return (
        <Table className="table table-bordered table-striped">
            <Thead className="table-light sticky-top custom-table-header border-on-scroll">
                <Tr >
                    <Th className="col-2">Ficha</Th>
                    <Th>Cliente</Th>
                    <Th className={`${userRole == 'debt-collector' ? 'd-none' : ''}`}>Cobrador</Th>
                    <Th className={`${location.pathname == '/personal-credit-my-collections' ? 'd-none' : ''}`}>Detalle</Th>
                    <Th>Cuota</Th>
                    <Th>Vto del Pago</Th>
                    <Th>Fecha de pago</Th>
                    <Th>Saldo a pagar</Th>
                    <Th>Pagado</Th>
                    <Th>Acción</Th>
                </Tr>
            </Thead>
            <Tbody>
                {Array.from(groupedData.keys()).map((client) => {
                    const value = groupedData.get(client);

                    if (value.length == 1) {
                        const item = value[0];
                        return (

                            <Tr>
                                <Td>{item.clientNumber}</Td>
                                <Td>{capitalize(item.client)}</Td>
                                <Td className={`${userRole == 'debt-collector' ? 'd-none' : ''}`}>{capitalize(item.debtCollector)}</Td>
                                <Td className={`${location.pathname == '/personal-credit-my-collections' ? 'd-none' : 'col-lg-2 fw-500'}`}>{capitalize(item.detail)}</Td>
                                <Td>{capitalize(item.concept)}</Td>
                                <Td>{item.paymentDueDate}</Td>
                                <Td>
                                    <p className='payment-date'>{item.paymentDate}</p>
                                    <span className='pending-accountability'>
                                        Pendiente de rendir
                                    </span>
                                </Td>

                                <Td>{item.payment}</Td>
                                <Td>{item.actualPayment}</Td>
                                <td className='td-buttons col-lg-2 col-12'>{item.action}</td>
                            </Tr>
                        )
                    }
                    else {
                        const item = value[0]
                        return (
                            <>
                                <Tr>
                                    <Td>{item.clientNumber}</Td>
                                    <Td>{capitalize(item.client)}</Td>
                                    <Td className={`${userRole == 'debt-collector' ? 'd-none' : ''}`}>{capitalize(item.debtCollector)}</Td>
                                    <Td className={`${location.pathname == '/personal-credit-my-collections' ? 'd-none' : 'col-lg-2 fw-500'}`}>{capitalize(item.detail)}</Td>
                                    <td className='d-table-mobile'></td>
                                    <td className='d-table-mobile'></td>
                                    <td className='d-table-mobile'></td>
                                    <td className='d-table-mobile'></td>
                                    <td className='d-table-mobile'></td>
                                    <td className='d-flex justify-content-center'>
                                        <button className={`btn col-9 btn-sm d-flex justify-content-center ${collapsedRows.has(item.creditId) ? 'btn-hide-payment' : 'btn-secondary'}`} onClick={() => toggleRow(item.creditId)}>
                                            <span className={`${collapsedRows.has(item.creditId) ? 'd-none' : 'd-flex'}`}>Mostrar cuotas</span>
                                            <span className={`text-white ${!collapsedRows.has(item.creditId) ? 'd-none' : 'd-flex'}`}>Ocultar cuotas</span>
                                        </button>
                                    </td>
                                </Tr>

                                {collapsedRows.has(item.creditId) && value.map((item: any, index: any) => (
                                    <Tr key={item.id}>
                                        <td className='d-table-mobile'></td>
                                        <td className='d-table-mobile'></td>
                                        <td className={`d-table-mobile ${userRole == 'debt-collector' ? 'd-none' : ''}`}></td>
                                        <td className={`d-table-mobile ${location.pathname == '/personal-credit-my-collections' ? 'd-none' : 'col-lg-2 fw-500'}`}></td>
                                        <Td>{item.concept}</Td>
                                        <Td>{item.paymentDueDate}</Td>
                                        <Td>{item.paymentDate}</Td>
                                        <Td>{item.payment}</Td>
                                        <Td>{item.actualPayment}</Td>
                                        <td className='col-lg-2 col-12'>{item.action}</td>
                                    </Tr>
                                ))

                                }
                            </>


                        )
                    }
                })
                }
            </Tbody>
        </Table>
    );
}