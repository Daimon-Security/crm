import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks/hooks';
import { RootState } from '../../redux/store/store';
import { getExpiredCreditCount, getUnpaidClients } from '../../redux/slices/report-slice';
import { Row } from 'react-bootstrap';
import { GraphicExpiredCredits } from './graphic-expired-credits';


export const ExpiredCreditReport = () => {
    const dispatch = useAppDispatch();
    const { expiredCreditCountPersonalCredit, expiredCreditCountSaleCredit } = useAppSelector((state: RootState) => state.reports);
    const { unpaidClientsPersonal, unpaidClientsSale } = useAppSelector((state: RootState) => state.reports);




    function getUnpaid() {
        dispatch(getUnpaidClients(1));
        dispatch(getUnpaidClients(2));
    }

    function getCredits() {
        dispatch(getExpiredCreditCount())
    }

    useEffect(() => {
        getCredits();
        getUnpaid();
    }, []);



    return (
        <>
            <div className='my-2 px-2'>
                <div className="border-top border-bottom p-2 mb-4 align-items-center d-flex justify-content-center">
                    <h3 className='text-center'>Créditos Personales</h3>
                </div>
                <GraphicExpiredCredits expiredCreditCount={expiredCreditCountPersonalCredit} unpaidClients={unpaidClientsPersonal} />

            </div>
            <div className='mt-5 my-2 px-2'>
                <div className="border-top border-bottom p-2 mb-4 align-items-center d-flex justify-content-center">
                    <h3 className='text-center'>Créditos por Ventas</h3>
                </div>
                <GraphicExpiredCredits expiredCreditCount={expiredCreditCountSaleCredit} unpaidClients={unpaidClientsSale} />

            </div>
        </>

    )
};

export default ExpiredCreditReport;