import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks/hooks';
import { RootState } from '../../redux/store/store';
import { getMonthlyCreditAmounts } from '../../redux/slices/report-slice';
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


export const MonthlyCreditAmountReport = () => {
    const dispatch = useAppDispatch();
    const { monthlyCreditAmounts } = useAppSelector((state: RootState) => state.reports);
    console.log("monthlyCreditAmounts: ", monthlyCreditAmounts);




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
        dispatch(getMonthlyCreditAmounts());
    }

    useEffect(() => {
        getCredits();
    }, [])
    return (
        <>
            <Row className="border-top border-bottom p-2 mb-4 align-items-center d-flex justify-content-center">
                <h3 className='text-center'>Créditos personales</h3>
            </Row>
            <div style={{
                width: '100%',
                height: '400px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
                className='row'
            >
                <Bar options={getOptions('Créditos personales en pesos')} data={getData(monthlyCreditAmounts?.personalCreditPesos, 'rgba(92, 106, 183, 0.8)')} />
                <div className='my-4'></div>
                <Bar options={getOptions('Créditos personales en dólares')} data={getData(monthlyCreditAmounts?.personalCreditDolars, 'rgba(35, 137, 93, 0.8)')} />
                <div className='my-4'></div>
                <Row className="border-top border-bottom p-2 mb-4 align-items-center d-flex justify-content-center">
                    <h3 className='text-center'>Créditos por ventas</h3>
                </Row>
                <Bar options={getOptions('Créditos por ventas en pesos')} data={getData(monthlyCreditAmounts?.saleCreditPesos, 'rgba(92, 106, 183, 0.8)')} />
                <div className='my-4'></div>                
                <Bar options={getOptions('Créditos por ventas en dólares')} data={getData(monthlyCreditAmounts?.saleCreditDolars, 'rgba(35, 137, 93, 0.8)')} />
            </div>

        </>
    )
};

export default MonthlyCreditAmountReport;