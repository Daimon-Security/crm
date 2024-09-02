import { useAppDispatch, useAppSelector } from "../../redux/hooks/hooks";
import { RootState } from "../../redux/store/store";
import { useEffect, useState } from "react";
import { deleteCredit, getAll, getByClientName, getSearchCredits, setCreditSelected } from '../../redux/slices/credit-slice';
import CreditList from "../credit/credit-list";
import PersonalCreditDetail from "./personal-credit-detail";
import { CreditListDto } from "../../entities/dto/credit-list-dto";

export const PersonalCreditList = () => {
    const dispatch = useAppDispatch();
    const { userRole } = useAppSelector((state: RootState) => state.users);
    const { credits, creditSelected, type, paymentFrequencies } = useAppSelector((state: RootState) => state.credits);
    const [apply, setApply] = useState<boolean>(false);
    const [showDetail, setShowDetail] = useState<boolean>(false);
    const [active, setActive] = useState<string>('history');

    const statusCredits: any = [
        { value: 1, label: 'Activo' },
        { value: 2, label: 'Cancelado' },
        { value: 3, label: 'Moroso' },
        { value: 4, label: 'Incobrable' },
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


    const remove = () => {
        if (creditSelected) {
            console.log("eliminando credito: ", creditSelected);
            dispatch(deleteCredit(creditSelected.id));
        }
        //handleCloseCustomMessageModal();

    };

    function selectCredit(credit: CreditListDto) {
        if(!creditSelected || creditSelected.id != credit.id) dispatch(setCreditSelected(credit));
    }


    return (
        <>

            <CreditList
                credits={credits}
                title='Créditos Personales'
                btnAdd='Nuevo'
                btnAddRoute='/personal-credit-create'
                remove={remove}
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
            <PersonalCreditDetail setShowDetail={setShowDetail} hide={showDetail} activeTab={'history'}/>

        </>
    )
}

export default PersonalCreditList;