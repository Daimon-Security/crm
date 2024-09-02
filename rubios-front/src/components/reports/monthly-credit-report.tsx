import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks/hooks';
import { RootState } from '../../redux/store/store';
import { getMonthlyCredits } from '../../redux/slices/report-slice';
import { Bar, Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale,
    LinearScale,
    BarElement,
    Title,
} from 'chart.js';
import { Col, Row } from 'react-bootstrap';

ChartJS.register(ArcElement, Tooltip, Legend);
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);


export const MonthlyCreditReport = () => {
    const dispatch = useAppDispatch();
    const { monthlyCredits } = useAppSelector((state: RootState) => state.reports);
    console.log("monthlyCredits: ", monthlyCredits);




    function getOptions(title: string) {
        return {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top' as const,
                },
                title: {
                    display: true,
                    text: title,
                },
            },
        }
    };

    const monthLabels = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    function getData(data: any, color: string) {
        return {
            labels: data?.map((x: { month: number, count: number }) => monthLabels[x.month - 1]),
            datasets: [
                {
                    label: 'Cantidad',
                    data: data?.map((x: { month: number, count: number }) => x.count),
                    backgroundColor: color,
                }
            ],
        }
    };


    function getCredits() {
        dispatch(getMonthlyCredits());
    }

    useEffect(() => {
        getCredits();
    }, [])
    return (
        <>
            <Row className="border-top border-bottom p-2 mb-4 align-items-center d-flex justify-content-center">
                <h3 className='text-center'>Cantidad de créditos personales por mes</h3>

                <div style={{
                    width: '100%',
                    // height: '300px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
                    className='row height-bar'
                >

                    <Bar options={getOptions('')} data={getData(monthlyCredits?.personalCredits, 'rgba(251, 162, 21, 0.8)')} />
                </div>




                <div style={{
                    width: '100%',
                    // height: '300px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
                className='row height-bar'
                >

                    <Bar options={getOptions('Créditos personales en pesos')} data={getData(monthlyCredits?.personalCreditsInPesos, 'rgba(92, 106, 183, 0.8)')} />
                </div>

                <div style={{
                    width: '100%',
                    // height: '300px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
                className='row height-bar'
                >

                    <Bar options={getOptions('Créditos personales en dólares')} data={getData(monthlyCredits?.personalCreditsInDolars, 'rgba(35, 137, 93, 0.8)')} />
                </div>

            </Row>
            <h3 className='text-center'>Créditos por ventas</h3>
            <Row className="border-top border-bottom p-2 mb-4 align-items-center d-flex justify-content-center">
                
                <div style={{
                    width: '100%',
                    // height: '300px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
                className='row height-bar'
                >
                    <Bar options={getOptions('')} data={getData(monthlyCredits?.saleCredits, 'rgba(251, 162, 21, 0.8)')} />
                </div>

                <div style={{
                    width: '100%',
                    // height: '300px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
                className='row height-bar'
                >
                    <Bar options={getOptions('Créditos por ventas en pesos')} data={getData(monthlyCredits?.saleCreditsInPesos, 'rgba(92, 106, 183, 0.8)')} />
                </div>

                <div style={{
                    width: '100%',
                    // height: '300px',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
                className='row height-bar'
                >
                    <Bar options={getOptions('Créditos por ventas en dolares')} data={getData(monthlyCredits?.saleCreditsInDolars, 'rgba(35, 137, 93, 0.8)')} />

                </div>
            </Row>




        </>
    )
};

export default MonthlyCreditReport;