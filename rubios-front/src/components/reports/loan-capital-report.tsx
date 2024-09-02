import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/hooks"
import { RootState } from "../../redux/store/store"
import TableResponsive from "../common/table-responsive";
import Loading from "../common/loading";
import { useDispatch } from 'react-redux';
import { getLoanPrincipal } from "../../redux/slices/report-slice";

export const LoanCapitalReport = () => {
    const dispatch = useAppDispatch();
    const { loanPrincipalList } = useAppSelector((state: RootState) => state.reports);
    const [reportLoaded, setReportLoaded] = useState<boolean>(false);
    const columns = [
        {
            label: '#',
            field: 'id'
        },
        {
            label: 'Nº Ficha',
            field: 'clientNumber'
        },
        {
            label: 'Cliente',
            field: 'client'
        },
        {
            label: 'Tipo',
            field: 'type'
        },
        {
            label: 'Estado',
            field: 'status'
        },
        {
            label: 'Capital',
            field: 'principal'
        }
    ];

    const rows = loanPrincipalList.map((x: any, index: any) => ({
        id: index + 1,
        clientNumber: x.clientNumber,
        client: x.client,
        type: x.type,
        status: x.status,
        principal: x.principal
    }))

    async function getLoanPrincipalReport() {
        await dispatch(getLoanPrincipal());
        setReportLoaded(true);
    }

    useEffect(() => {
        getLoanPrincipalReport()
    }, [])

    if (!reportLoaded) {
        return <Loading />
    }

    return (
        <div className="p-3">
            <div className="border-top border-bottom py-2 mb-4 d-flex align-items-center justify-content-between">
                <h3>Capital Prestado</h3>
            </div>
            <TableResponsive columns={columns} rows={rows} />
        </div>
    )
}