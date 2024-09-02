import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks/hooks';
import { RootState } from '../../redux/store/store';
import { getTotalExpiredPending, getUnpaidCurrentMonth, getUnpaidCurrentWeek, getTotalExpiredPendingSale, getUnpaidCurrentMonthSale, getUnpaidCurrentWeekSale, getTotalBalances } from '../../redux/slices/report-slice';
import { Nav, NavItem, NavLink, Row } from 'react-bootstrap';
import useNumberFormatter from '../../redux/hooks/useNumberFormatter';
import ExpiredCreditReport from './expired-credits-report';
import BorderCard from '../dashboard/border-card';

const ProgressBar = ({ total, partial, color, backColor }: { total: any, partial: any, color?: string, backColor: string }) => {
    let progress = (partial / total) * 100;
    if (isNaN(progress)) {
        progress = 0;
    }
    return (
        <div className="progress"
            style={
                { backgroundColor: backColor }
            }
        >
            <div
                className="progress-bar"
                role="progressbar"
                style={
                    {
                        width: `${progress}%`,
                        backgroundColor: color ? color : "#fff"
                    }}
            >
                {progress.toFixed(1)}%
            </div>
        </div>
    );
};



export const UnpaidTotalsReport = () => {
    const dispatch = useAppDispatch();
    const { unpaidCurrentMonth,
        unpaidCurrentWeek,
        totalExpiredPending,
        unpaidCurrentMonthSale,
        unpaidCurrentWeekSale,
        totalExpiredPendingSale,
        totalBalances
    } = useAppSelector((state: RootState) => state.reports);
    const formatNumber = useNumberFormatter();
    const [activeTab, setActiveTab] = useState('personal-credit');
    const toggleTab = (tab: any) => {
        if (activeTab !== tab) {
            setActiveTab(tab);
        }
    };


    function getUnpaid() {
        dispatch(getUnpaidCurrentMonth(1));
        dispatch(getUnpaidCurrentWeek(2));
        dispatch(getTotalExpiredPending());


        dispatch(getUnpaidCurrentMonthSale(1));
        dispatch(getUnpaidCurrentWeekSale(2));
        dispatch(getTotalExpiredPendingSale());
        dispatch(getTotalBalances());
    }

    useEffect(() => {

        getUnpaid();
    }, []);



    return (
        <div className='row'>
            <div className="px-5">
                <Nav className="row d-flex">
                    <NavItem className={`col-6 justify-content-center align-items-center d-flex border border-1 cursor-hand ${activeTab === 'personal-credit' ? 'active bg-secondary' : 'bg-transapent'}`}
                        onClick={() => toggleTab('personal-credit')}
                    >
                        <NavLink
                        >
                            <h5 className={`${activeTab === 'personal-credit' ? 'text-white' : 'text-dark'}`}>Personales</h5>
                        </NavLink>
                    </NavItem>
                    <NavItem className={`col-6 justify-content-center align-items-center d-flex border border-1 cursor-hand ${activeTab === 'sale-credit' ? 'active bg-secondary' : 'bg-transapent'}`}
                        onClick={() => toggleTab('sale-credit')}
                    >
                        <NavLink
                        >
                            <h5 className={`${activeTab === 'sale-credit' ? 'text-white' : 'text-dark'}`}>Por ventas</h5>
                        </NavLink>
                    </NavItem>
                </Nav>
            </div>
            {
                activeTab == 'personal-credit' ?
                    <div className='my-2 px-4 '>

                        <div className='row pb-3 bg-report-peso'>
                            <div className="col-12 col p-1 mb-2 bg-peso">
                                <h3 className='text-center'>Pesos</h3>
                            </div>

                            <div className='col-4'>
                                <BorderCard
                                    title="saldos vencidos pendientes de cobro:"
                                    total={`$${formatNumber(totalExpiredPending?.pesos)}`}
                                    colorClass="danger"
                                ></BorderCard>
                            </div>
                            <div className='col-4'>
                                <BorderCard
                                    title="Deuda total"
                                    total={`$${formatNumber(totalBalances?.personalCredits?.balancePeso)}`}
                                    colorClass="info"
                                ></BorderCard>
                            </div>
                            <div className='col-4'>
                                <BorderCard
                                    title="Cantidad de créditos activos"
                                    total={totalBalances?.personalCredits?.totalRecordsPeso}
                                    colorClass="active"
                                ></BorderCard>
                            </div>
                            <div className='col-lg-6 col-12'>
                                <div className='card px-0'>
                                    <div className='card-header'>Cobranzas de la semana</div>
                                    <div className='card-body'>
                                        <div className='py-1 row'>
                                            <div className='col-6'>
                                                cobrado: <span className='fw-bold'>${formatNumber(unpaidCurrentWeek?.pesos?.paid)}</span>
                                            </div>

                                            <div className='col-6'>
                                                pendiente: <span className='fw-bold'>${formatNumber(+unpaidCurrentWeek?.pesos?.current - +unpaidCurrentWeek?.pesos?.paid)}</span>
                                            </div>
                                        </div>
                                        <ProgressBar total={unpaidCurrentWeek?.pesos?.current} partial={unpaidCurrentWeek?.pesos?.paid} color="rgba(92, 106, 183, 0.8)" backColor='#66709575' />
                                    </div>
                                    <div className='card-footer d-flex justify-content-end'>total<span className='fw-bold mx-2'>${formatNumber(unpaidCurrentWeek?.pesos?.current)}</span></div>
                                </div>



                            </div>
                            <div className='col-lg-6 col-12'>
                                <div className='card px-0'>
                                    <div className='card-header'>Cobranzas del mes</div>
                                    <div className='card-body'>
                                        <div className='py-1 row'>
                                            <div className='col-6'>
                                                cobrado: <span className='fw-bold'>${formatNumber(unpaidCurrentMonth?.pesos?.paid)}</span>
                                            </div>

                                            <div className='col-6'>
                                                pendiente: <span className='fw-bold'>${formatNumber(unpaidCurrentMonth?.pesos?.pending)}</span>
                                            </div>
                                        </div>
                                        <ProgressBar total={unpaidCurrentMonth?.pesos?.current} partial={unpaidCurrentMonth?.pesos?.paid} color="rgba(92, 106, 183, 0.8)" backColor='#66709575' />
                                    </div>

                                    <div className='card-footer d-flex justify-content-end'>total <span className='fw-bold mx-2'>${formatNumber(+unpaidCurrentMonth?.pesos?.current)}</span></div>
                                </div>
                            </div>

                        </div>
                        <div className='row bg-report-dolar'>
                            <div className="col-12 col p-1 mb-2 bg-dolar">
                                <h3 className='text-center'>Dólares</h3>
                            </div>
                            <div className='col-4'>
                                <BorderCard
                                    title="saldos vencidos pendientes de cobro:"
                                    total={`$${formatNumber(totalExpiredPending?.dolars)}`}
                                    colorClass="danger"
                                ></BorderCard>
                            </div>
                            <div className='col-4'>
                                <BorderCard
                                    title="Deuda total"
                                    total={`$${formatNumber(totalBalances?.personalCredits?.balanceDolar)}`}
                                    colorClass="info"
                                ></BorderCard>
                            </div>
                            <div className='col-4'>
                                <BorderCard
                                    title="Cantidad de créditos activos"
                                    total={totalBalances?.personalCredits?.totalRecordsDolar}
                                    colorClass="active"
                                ></BorderCard>
                            </div>
                            <div className='col-lg-6 col-12'>
                                <div className='card px-0'>
                                    <div className='card-header'>Cobranzas de la semana</div>
                                    <div className='card-body'>
                                        <div className='py-1 row'>
                                            <div className='col-6'>
                                                cobrado: <span className='fw-bold'>${formatNumber(unpaidCurrentWeek?.dolars?.paid)}</span>
                                            </div>
                                            <div className='col-6'>
                                                pendiente: <span className='fw-bold'>${formatNumber(unpaidCurrentWeek?.dolars?.pending)}</span>
                                            </div>
                                        </div>
                                        <ProgressBar total={unpaidCurrentWeek?.dolars?.current} partial={unpaidCurrentWeek?.dolars?.paid} color="rgba(35, 137, 93, 0.8)" backColor='#597c545c' />
                                    </div>
                                    <div className='card-footer d-flex justify-content-end'>
                                        <span>total <span className='fw-bold mx-2'>${formatNumber(unpaidCurrentWeek?.dolars?.current)}</span></span>
                                    </div>
                                </div>
                            </div>
                            <div className='col-lg-6 col-12'>
                                <div className='card px-0'>
                                    <div className='card-header'>Cobranzas del mes</div>
                                    <div className='card-body'>
                                        <div className='py-1 row'>
                                            <div className='col-6'>
                                                cobrado: <span className='fw-bold'>${formatNumber(unpaidCurrentMonth?.dolars?.paid)}</span>
                                            </div>
                                            <div className='col-6'>
                                                pendiente: <span className='fw-bold'>${formatNumber(unpaidCurrentMonth?.dolars?.pending)}</span>
                                            </div>
                                        </div>
                                        <ProgressBar total={unpaidCurrentMonth?.dolars?.current} partial={unpaidCurrentMonth?.dolars?.paid} color="rgba(35, 137, 93, 0.8)" backColor='#597c545c' />
                                    </div>
                                    <div className='card-footer d-flex justify-content-end'>total <span className='fw-bold mx-2'>${formatNumber(+unpaidCurrentMonth?.dolars?.current)}</span></div>
                                </div>
                            </div>

                        </div>

                    </div > :

                    <div className='my-2 px-4 '>
                        <div className='row pb-3 bg-report-peso'>
                            <div className="border-top border-bottom p-1 mb-2 align-items-center d-flex justify-content-center bg-peso">
                                <h3 className='text-center'>Pesos</h3>
                            </div>
                            <div className='col-4'>
                                <BorderCard
                                    title="saldos vencidos pendientes de cobro:"
                                    total={`$${formatNumber(totalExpiredPendingSale?.pesos)}`}
                                    colorClass="danger"
                                ></BorderCard>
                            </div>
                            <div className='col-4'>
                                <BorderCard
                                    title="Deuda total"
                                    total={`$${formatNumber(totalBalances?.saleCredits?.balancePeso)}`}
                                    colorClass="info"
                                ></BorderCard>
                            </div>
                            <div className='col-4'>
                                <BorderCard
                                    title="Cantidad de créditos activos"
                                    total={totalBalances?.saleCredits?.totalRecordsPeso}
                                    colorClass="active"
                                ></BorderCard>
                            </div>
                            <div className='col-lg-6 col-12'>
                                <div className='card px-0'>
                                    <div className='card-header'>Cobranzas de la semana</div>
                                    <div className='card-body'>
                                        <div className='py-1 row'>
                                            <div className='col-6'>
                                                cobrado: <span className='fw-bold'>${formatNumber(unpaidCurrentWeekSale?.pesos?.paid)}</span>
                                            </div>

                                            <div className='col-6'>
                                                pendiente: <span className='fw-bold'>${formatNumber(unpaidCurrentWeekSale?.pesos?.pending)}</span>
                                            </div>
                                        </div>
                                        <ProgressBar total={unpaidCurrentWeekSale?.pesos?.current} partial={unpaidCurrentWeekSale?.pesos?.paid} color="rgba(92, 106, 183, 0.8)" backColor='#66709575' />
                                    </div>
                                    <div className='card-footer d-flex justify-content-end'>total<span className='fw-bold mx-2'>${formatNumber(unpaidCurrentWeekSale?.pesos?.current)}</span></div>
                                </div>



                            </div>
                            <div className='col-lg-6 col-12'>
                                <div className='card px-0'>
                                    <div className='card-header'>Cobranzas del mes</div>
                                    <div className='card-body'>
                                        <div className='py-1 row'>
                                            <div className='col-6'>
                                                cobrado: <span className='fw-bold'>${formatNumber(unpaidCurrentMonthSale?.pesos?.paid)}</span>
                                            </div>

                                            <div className='col-6'>
                                                pendiente: <span className='fw-bold'>${formatNumber(unpaidCurrentMonthSale?.pesos?.pending)}</span>
                                            </div>
                                        </div>
                                        <ProgressBar total={unpaidCurrentMonthSale?.pesos?.current} partial={unpaidCurrentMonthSale?.pesos?.paid} color="rgba(92, 106, 183, 0.8)" backColor='#66709575' />
                                    </div>

                                    <div className='card-footer d-flex justify-content-end'>total <span className='fw-bold mx-2'>${formatNumber(+unpaidCurrentMonthSale?.pesos?.current)}</span></div>
                                </div>
                            </div>


                        </div>
                        <div className='row bg-report-dolar'>
                            <div className="col-12 col p-1 mb-2 bg-dolar">
                                <h3 className='text-center'>Dólares</h3>
                            </div>
                            <div className='col-4'>
                                <BorderCard
                                    title="saldos vencidos pendientes de cobro:"
                                    total={`$${formatNumber(totalExpiredPendingSale?.dolars)}`}
                                    colorClass="danger">

                                </BorderCard>
                            </div>
                            <div className='col-4'>
                                <BorderCard
                                    title="Deuda total"
                                    total={`$${formatNumber(totalBalances?.saleCredits?.balanceDolar)}`}
                                    colorClass="info"
                                ></BorderCard>
                            </div>
                            <div className='col-4'>
                                <BorderCard
                                    title="Cantidad de créditos activos"
                                    total={totalBalances?.saleCredits?.totalRecordsDolar}
                                    colorClass="active"
                                ></BorderCard>
                            </div>
                            <div className='col-lg-6 col-12'>
                                <div className='card px-0'>
                                    <div className='card-header'>Cobranzas de la semana</div>
                                    <div className='card-body'>
                                        <div className='py-1 row'>
                                            <div className='col-6'>
                                                cobrado: <span className='fw-bold'>${formatNumber(unpaidCurrentWeekSale?.dolars?.paid)}</span>
                                            </div>
                                            <div className='col-6'>
                                                pendiente: <span className='fw-bold'>${formatNumber(unpaidCurrentWeekSale?.dolars?.pending)}</span>
                                            </div>
                                        </div>
                                        <ProgressBar total={unpaidCurrentWeekSale?.dolars?.current} partial={unpaidCurrentWeekSale?.dolars?.paid} color="rgba(35, 137, 93, 0.8)" backColor='#597c545c' />
                                    </div>
                                    <div className='card-footer d-flex justify-content-end'>
                                        <span>total <span className='fw-bold mx-2'>${formatNumber(unpaidCurrentWeekSale?.dolars?.current)}</span></span>
                                    </div>
                                </div>
                            </div>
                            <div className='col-lg-6 col-12'>
                                <div className='card px-0'>
                                    <div className='card-header'>Cobranzas del mes</div>
                                    <div className='card-body'>
                                        <div className='py-1 row'>
                                            <div className='col-6'>
                                                cobrado: <span className='fw-bold'>${formatNumber(unpaidCurrentMonthSale?.dolars?.paid)}</span>
                                            </div>
                                            <div className='col-6'>
                                                pendiente: <span className='fw-bold'>${formatNumber(unpaidCurrentMonthSale?.dolars?.pending)}</span>
                                            </div>
                                        </div>
                                        <ProgressBar total={unpaidCurrentMonthSale?.dolars?.current} partial={unpaidCurrentMonthSale?.dolars?.paid} color="rgba(35, 137, 93, 0.8)" backColor='#597c545c' />
                                    </div>
                                    <div className='card-footer d-flex justify-content-end'>total <span className='fw-bold mx-2'>${formatNumber(+unpaidCurrentMonthSale?.dolars?.current)}</span></div>
                                </div>
                            </div>

                        </div>

                    </div >
            }




        </div>

    )
};

export default UnpaidTotalsReport;