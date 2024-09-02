import { Row } from 'react-bootstrap';
import { Pie } from 'react-chartjs-2';

interface GraphicExpiredCreditsProps {
    expiredCreditCount: any,
    unpaidClients: any[]
}

export const GraphicExpiredCredits = ({ expiredCreditCount, unpaidClients }: GraphicExpiredCreditsProps) => {
    const delay = unpaidClients.filter(x => x.delay <= 15);
    const delay15 = unpaidClients.filter(x => x.delay > 15 && x.delay <= 30);
    const delay30 = unpaidClients.filter(x => x.delay > 30 && x.delay <= 90)
    const delay90 = unpaidClients.filter(x => x.delay > 90);


    const expiredCredits = {
        ...(delay.length > 0 && { "menos de 15 días": delay.length }),
        ...(delay15.length > 0 && { "más de 15 días": delay15.length }),
        ...(delay30.length > 0 && { "más de 30 días": delay30.length }),
        ...(delay90.length > 0 && { "más de 90 días": delay90.length }),
    };

    function getChartData(data: any, backgroundColor: string[], borderColor: string[]) {
        return {
            labels: (data) ? Object.keys(data).map((key) => `${key} (${data[key]})`) : [],
            datasets: [{
                data: (data) ? Object.values(data) : [],
                backgroundColor,
                borderColor,
                borderWidth: 1
            }]
        }
    };

    return (
        <Row>
            <div
                className='col-lg-6'
                style={{
                    height: '400px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                <Pie
                    width={400} height={400}
                    data={getChartData(expiredCreditCount,
                        ['rgba(237, 9, 9, 0.8)', 'rgba(57, 176, 50, 0.678)', 'rgba(243, 248, 82, 0.8)', 'rgba(7, 199, 49, 0.8)', 'rgba(192, 192, 189, 0.8)'],
                        ['rgba(237, 9, 9, 1)', 'rgba(57, 176, 50, 1)', 'rgba(243, 248, 82, 0.8, 1)', 'rgba(7, 199, 49, 0.8, 1)', 'rgba(192, 192, 189, 0.3,1)']
                    )}
                    options={{
                        responsive: true,
                        plugins: {
                            title: {
                                display: true,
                                text: 'Estado de créditos',
                                font: {
                                    size: 20,
                                }
                            },
                        }
                    }}
                />
            </div>


            <div
                className='col-lg-6'
                style={{
                    height: '400px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                <Pie
                    width={400} height={400}
                    data={getChartData(expiredCredits,
                        ['rgba(219, 207, 62, 0.749)', 'rgba(237, 155, 9, 0.878)', 'rgba(237, 9, 9, 0.8)', 'rgba(5, 5, 5, 0.678)', 'rgba(57, 176, 50, 0.678)'],
                        ['rgba(252, 234, 16,1)', 'rgba(237, 155, 9, 1)', 'rgba(237, 9, 9, 1)', 'rgba(5, 5, 5, 0.678)', 'rgba(57, 176, 50, 1)']
                    )}
                    options={{
                        responsive: true,
                        plugins: {
                            title: {
                                display: true,
                                text: 'Distribución de créditos vencidos',
                                font: {
                                    size: 20,
                                }
                            },
                        }
                    }}
                />
            </div>
        </Row>
    )
}