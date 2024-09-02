import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks/hooks';
import { RootState } from '../../redux/store/store';
import { getCreditsByDebtCollector } from '../../redux/slices/report-slice';
import { Pie } from 'react-chartjs-2';
import { Row } from 'react-bootstrap';


export const CreditsDebtCollectorReport = () => {
    const dispatch = useAppDispatch();
    const { creditsByDebtCollector } = useAppSelector((state: RootState) => state.reports);
    console.log("creditsByDebtCollector: ", creditsByDebtCollector);




    function getChartData(data: any, backgroundColor: string[], borderColor: string[]) {
        return {
            labels:  (data) ? Object.keys(data).map((key) => `${key} (${data[key]})`) : [],
            datasets: [{
                data: (data) ? Object.values(data) : [],
                backgroundColor,
                borderColor,
                borderWidth: 1
            }]
        }
    };

    function getCredits() {
        dispatch(getCreditsByDebtCollector())
    }

    useEffect(() => {
        getCredits()
    }, [])
    return (

        <>
            <Row className="border-top border-bottom p-2 mb-4 align-items-center d-flex justify-content-center">
                <h3 className='text-center'>Créditos por cobrador</h3>
            </Row>
            <div style={{
                width: '100%',
                height: '400px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <Pie
                    width={400} height={400}
                    data={getChartData(creditsByDebtCollector?.personalCredits,
                        ['rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(243, 248, 82, 0.8)', 'rgba(7, 199, 49, 0.8)', 'rgba(192, 192, 189, 0.8)'],
                        ['rgba(255,99,132,0.6)', 'rgba(54, 162, 235, 1)', 'rgba(243, 248, 82, 1)', 'rgba(7, 199, 49,  1)', 'rgba(192, 192, 189, 1)']
                    )}
                    options={{
                        responsive: true,
                        plugins: {
                            title: {
                              display: true,
                              text: 'Créditos personales',
                              font: {
                                size: 20,
                              }
                            },
                          }
                    }}
                />
            </div>
            <div className='my-5'></div>

            <div style={{
                width: '100%',
                height: '400px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <Pie
                    width={400} height={400}
                    data={getChartData(creditsByDebtCollector?.saleCredits,
                        ['rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(243, 248, 82, 0.8)', 'rgba(7, 199, 49, 0.8)', 'rgba(91, 91, 91, 0.8)'],
                        ['rgba(255,99,132,1)', 'rgba(54, 162, 235, 1)', 'rgba(243, 248, 82, 1)', 'rgba(7, 199, 49,  1)', 'rgba(91, 91, 91, 1)'] )}
                    options={{
                        responsive: true,
                        plugins: {
                            title: {
                              display: true,
                              text: 'Créditos por ventas',
                              font: {
                                size: 20,
                              }
                            },
                          }
                    }}
                />
            </div>
        </>
    )
};

export default CreditsDebtCollectorReport;