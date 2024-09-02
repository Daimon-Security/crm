import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/hooks";
import CommissionsDetailList from "./commissions-detail-list";
import { RootState } from "../../redux/store/store";
import { useEffect, useState } from "react";
import { getCommissionCreditDetailHistory } from "../../redux/slices/report-slice";
import Loading from "../common/loading";
import useNumberFormatter from "../../redux/hooks/useNumberFormatter";

interface DetailTotalCommission {
    totalCommissionPeso: number,
    totalCommissionDollar: number
}

export const CommissionsHistoryList = () => {
    const dispatch = useAppDispatch();
    const formatNumber = useNumberFormatter();
    const { id, type } = useParams();
    const { isLoading } = useAppSelector((state: RootState) => state.loading);
    const { commissionsCredits, start, end } = useAppSelector((state: RootState) => state.reports);
    const [detailPaymentcommission, setDetail] = useState<DetailTotalCommission>({
        totalCommissionPeso: 0,
        totalCommissionDollar: 0
    });
    const columnsTotal = [{
        label: 'Comisiónes cobradas',
        field: 'commission',
        sort: 'asc',
        //width: 200
    }];
    const rowsTotalPesos = [{
        commission: formatNumber(detailPaymentcommission?.totalCommissionPeso),
    }
    ];

    const rowsTotalDollar = [{
        commission: formatNumber(detailPaymentcommission?.totalCommissionDollar),
    }
    ];

    function getTotal() {
        let detailTotal: DetailTotalCommission = {
            totalCommissionPeso: 0,
            totalCommissionDollar: 0
        }
        commissionsCredits?.creditsDetailCommission.forEach((detail: any) => {
            if (detail.typeCurrency == 'peso') detailTotal.totalCommissionPeso = detailTotal.totalCommissionPeso + parseFloat(detail.commission);
            if (detail.typeCurrency == 'dolar') detailTotal.totalCommissionDollar = detailTotal.totalCommissionDollar + parseFloat(detail.commission);
        });
        setDetail(detailTotal);
    }

    function getTitle() {
        return (type == '1') ? `Historial de pago de comisiones de ${commissionsCredits?.debtCollectorName}` :
            `Historial de pago de comisiones de ${commissionsCredits?.debtCollectorName}`
    }

    async function getDetail() {
        if (id && type) {
            await dispatch(getCommissionCreditDetailHistory(id, type));
        }
    }


    useEffect(() => {
        getTotal();
    }, [commissionsCredits])

    useEffect(() => {
        getDetail();
    }, [id]);

    if (isLoading) {
        return <Loading /> // Puedes mostrar un indicador de carga
    }


    return (
        <>
            {
                commissionsCredits ?
                    <CommissionsDetailList
                        creditsDetailCommission={commissionsCredits?.creditsDetailCommission}
                        columnsTotal={columnsTotal}
                        rowsTotalPesos={rowsTotalPesos}
                        rowsTotalDollar={rowsTotalDollar}
                        title={getTitle()}
                    /> : ('')
            }
        </>
    )
};
export default CommissionsHistoryList;