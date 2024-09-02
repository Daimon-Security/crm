import { MdArrowBack, MdCheck, MdClose } from 'react-icons/md';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import TableResponsive from '../common/table-responsive';
import { useLocation, useParams } from 'react-router-dom';
import '../styles.css';
import { Button, Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import DetailTable from '../accountability-collections/detail-table';
import { CommissionCreditDto } from '../../entities/dto/commission-credit-dto';
import TotalTableResponsiveCommissions from './total-table-responsive-commissions';
import useNumberFormatter from '../../redux/hooks/useNumberFormatter';

interface CommissionsDetailListProps {
    creditsDetailCommission: any,
    columnsTotal: any,
    rowsTotalPesos: any,
    rowsTotalDollar: any,
    title: string,
}

export const CommissionsDetailList = ({ creditsDetailCommission, columnsTotal, rowsTotalPesos, rowsTotalDollar, title }: CommissionsDetailListProps) => {
    const formatNumber = useNumberFormatter();
    const { id, type } = useParams();
    const columns = [
        {
            label: '#',
            field: 'id',
            sort: 'asc',
            //width: 100
        },
        {
            label: 'Cliente',
            field: 'client',
            sort: 'asc',
            //width: 250
        },
        {
            label: 'Fecha Crédito',
            field: 'date',
            sort: 'asc',
            //width: 250
        },
        {
            label: 'Capital',
            field: 'principal',
            sort: 'asc',
            //width: 200
        },
        {
            label: 'Interés',
            field: 'interest',
            sort: 'asc',
            //width: 200
        },
        {
            label: '% Comisión',
            field: 'rateCommission',
            sort: 'asc',
            //width: 200
        },
        {
            label: 'Comisión',
            field: 'commission',
            sort: 'asc',
            //width: 200
        },
        {
            label: 'Fecha de Pago',
            field: 'commissionPaymentDate',
            sort: 'asc',
            //width: 200
        },
    ];

    const rowsCreditPesos: any = creditsDetailCommission.filter((x: any) => x.typeCurrency == 'peso').map((detail: CommissionCreditDto, index: number) => ({
        id: index + 1,
        client: detail.client,
        date: detail.date,
        principal: formatNumber(detail.principal),
        interest: formatNumber(detail.interest),
        rateCommission: detail.rateCommission,
        commission: formatNumber(detail.commission),
        commissionPaymentDate: detail.commissionPaymentDate
    }));

    const rowsCreditDollar: any = creditsDetailCommission.filter((x: any) => x.typeCurrency == 'dolar').map((detail: CommissionCreditDto, index: number) => ({
        id: index + 1,
        client: detail.client,
        date: detail.date,
        principal: formatNumber(detail.principal),
        interest: formatNumber(detail.interest),
        rateCommission: detail.rateCommission,
        commission: formatNumber(detail.commission),
        commissionPaymentDate: detail.commissionPaymentDate
    }));

    function getTitle() {
        return (type == '1') ?'Comisiones Créditos Personales':'Comisiones Créditos por Ventas';
    }

    return (
        <div className='px-2'>
            <Row className="border-top border-bottom p-2 mb-4 align-items-center d-flex justify-content-beetwen">
                <h4>{getTitle()}</h4>
            </Row>
            <Row className="border-top border-bottom p-2 mb-4 align-items-center d-flex justify-content-beetwen">
                <Col lg={1} xs={2}>
                    <Link className="bg-transparent border-0" to={`/commissions/${type}`}>
                        <MdArrowBack size={30} color="grey" />
                    </Link>
                </Col>
                <Col lg={11} xs={9} className="d-flex justify-content-center text-center row">
                    <Col lg={12} xs={12}>
                        <h3>{title}</h3>
                    </Col>
                </Col>
            </Row>
            <DetailTable
                title="Pesos"
                columnsDetail={columns}
                columnsTotal={columnsTotal}
                rowsDetail={rowsCreditPesos}
                rowsTotal={rowsTotalPesos}
                commissions={true}
            />
            <div className='d-lg-none bg-table-total'>
                <TableResponsive columns={columnsTotal} rows={rowsTotalPesos} />
            </div>
            <div className='d-flex justify-content-end'>
                <div className='col-8'>
                    <TotalTableResponsiveCommissions rows={rowsTotalPesos} />
                </div>
            </div>
            <DetailTable
                title="Dolares"
                columnsDetail={columns}
                columnsTotal={columnsTotal}
                rowsDetail={rowsCreditDollar}
                rowsTotal={rowsTotalDollar}
                commissions={true}
            />
            <div className='d-lg-none bg-table-total'>
                <TableResponsive columns={columnsTotal} rows={rowsTotalDollar} />
            </div>
            <div className='d-flex justify-content-end'>
                <div className='col-8'>
                    <TotalTableResponsiveCommissions rows={rowsTotalDollar} />
                </div>
            </div>
        </div>
    );
};
export default CommissionsDetailList;