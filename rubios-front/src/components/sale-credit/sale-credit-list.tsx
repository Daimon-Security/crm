import { useAppDispatch, useAppSelector } from "../../redux/hooks/hooks";
import { RootState } from "../../redux/store/store";
import { useEffect, useState } from "react";
import { MdFilterAlt, MdSearch, MdAddCircleOutline, MdArticle, MdEdit } from 'react-icons/md';
import { getAll as getUsers } from '../../redux/slices/user-slice';
import { Link } from "react-router-dom";
import { statusCreditOptions } from "../constants/status-credit";
import Loading from "../common/loading";
import TableResponsive from "../common/table-responsive";
import { SearchByName } from "../common/search-by-name";
import { getSearchClients } from "../../redux/slices/client-slice";
import { getAll, getByClientName, getSearchCredits, setCreditSelected } from "../../redux/slices/sale-credit-slice";
import CreditList from "../credit/credit-list";
import { CreditListDto } from "../../entities/dto/credit-list-dto";
import useNumberFormatter from "../../redux/hooks/useNumberFormatter";
import SaleCreditDetail from "./sale-credit-detail";

export const SaleCreditList = () => {
    const dispatch = useAppDispatch();
    const { userRole } = useAppSelector((state: RootState) => state.users);
    const { type, credits, paymentFrequencies, creditSelected } = useAppSelector((state: RootState) => state.saleCredits);
    const [apply, setApply] = useState<boolean>(false);
    const [showDetail, setShowDetail] = useState<boolean>(false);
    const statusCredits: any = [
        { value: 1, label: 'Activo' },
        { value: 2, label: 'Cancelado' },
        { value: 3, label: 'Moroso' },
        { value: 4, label: 'Incobrable' },
        { value: 5, label: 'Anulado' },
    ]

    const searchCreditsFilter = (status: string | null, user: string | null, typeCurrency: string | null, paymentFrequency: string | null, startDate: Date | null, endDate: Date | null) => {
        // Aquí puedes aplicar el filtro en tu tabla según los valores seleccionados
        setApply(true);
        user = (userRole == 'debt-collector' && user == 'all') ? null : user;
        if (status) dispatch(getSearchCredits(status, user, typeCurrency, paymentFrequency, startDate, endDate))
    };


    const searchByClient = (client: number) => {
        //console.log("searchByName")
        dispatch(getByClientName(client));
    };

    function selectCredit(credit: CreditListDto) {
        if(!creditSelected || creditSelected.id != credit.id) dispatch(setCreditSelected(credit))
    }


    return (
        <>
                <CreditList
                    credits={credits}
                    title='Créditos por Venta'
                    btnAdd='Nuevo'
                    btnAddRoute='/personal-credit-create'
                    remove={() => { }}
                    apply={apply}
                    paymentFrequencies={paymentFrequencies}
                    statusCredits={statusCredits}
                    setApply={setApply}
                    type={type}
                    getSearchCredits={searchCreditsFilter}
                    getCredits={() => dispatch(getAll())}
                    getByClientName={searchByClient}
                    setShowDetail={setShowDetail}
                    selectCredit={selectCredit}
                    hide={showDetail}

                />
                <SaleCreditDetail setShowDetail={setShowDetail} hide={showDetail} activeTab="history"/>

        </>
    )
}

export default SaleCreditList;