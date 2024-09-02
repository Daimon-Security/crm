import React, { useEffect } from 'react';
import { RootState } from '../../redux/store/store';
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from '../../redux/hooks/hooks';
import { getClients, getSearchClients } from '../../redux/slices/client-slice';
import { getDebtCollectors } from '../../redux/slices/user-slice';
import CreditForm from './personal-credit-form';
import { Col, Row } from 'react-bootstrap';
import { add, setCreditSelected } from '../../redux/slices/credit-slice';
import { CreditCreateDto } from '../../entities/dto/credit-create-dto';
import { setSaleSelected } from '../../redux/slices/sale-slice';
import { StatusPayment } from '../../entities/dto/payment-detail-create-dto';

//export const useAppDispatch: () => AppDispatch = useDispatch;

const PersonalCreditCreate = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { paymentFrequencies, paymentsDetailCreateDto, type, isLoading } = useAppSelector((state: RootState) => state.credits);
    const { clientSelected } = useAppSelector((state: RootState) => state.clients);
    //const {isLoading} = useAppSelector((state: RootState)=> state.loading);

    const initialValuesForm: any = {
        clientId: (clientSelected) ? clientSelected.id : '',
        debtCollectorId: '',
        date: new Date(),
        firstPayment: new Date(),
        principal: '',
        numberPayment: '1',
        interestRate: '5',
        payment: '',
        paymentFrequency: 'Un pago',
        information: '',
        typeCurrency: 'peso',
        commission: ''
    };

    function getBalance(payment: number, numberPayment: number) {
        let balance = payment * numberPayment;
        if (paymentsDetailCreateDto.length > 0) {
            balance = paymentsDetailCreateDto.reduce((amount: number, payment: any) => {
                return (payment.status == StatusPayment.active) ? amount + parseFloat(payment.payment) : amount;
            }, 0)
        }
        console.log("balance calculado: ", balance);
        return balance;
    }

    const submit = async (values: any, date: any, firstPayment: any) => {
        console.log("payments guardados para enviar: ", paymentsDetailCreateDto);
        var credit: CreditCreateDto = {
            clientId: parseInt(values.clientId),
            debtCollectorId: parseInt(values.debtCollectorId),
            date: date,
            firstPayment: firstPayment,
            principal: parseInt(values.principal),
            numberPayment: parseInt(values.numberPayment),
            payment: values.payment,
            interestRate: parseInt(values.interestRate),
            paymentFrequency: values.paymentFrequency,
            information: values.information,
            typeCurrency: values.typeCurrency,
            commission: parseInt(values.commission),
            paymentsDetail: paymentsDetailCreateDto,
            balance: getBalance(values.payment, parseInt(values.numberPayment))

        };
        await dispatch(add(credit, navigate));
       // navigate('/personal-credit-list')
    }

    useEffect(() => {
        dispatch(setCreditSelected(null));
        dispatch(getSearchClients(type));
        dispatch(getDebtCollectors());
    }, [])

    return (

        <Row className='justify-content-center p-3'>
            <Col sm={10} className="bg-body-tertiary shadow p-3 mb-2 bg-white rounded">
                <Row className="justify-content-center border-bottom border-bottom-1 pb-2">
                    <Col lg="4">
                        <h3 className='text-center'>Nuevo Crédito</h3>
                    </Col>
                </Row>

                <CreditForm initialValuesForm={initialValuesForm} submit={submit} creditSelected={null} paymentFrequencies={paymentFrequencies} isLoading={isLoading}/>
            </Col>
        </Row>

    )
}

export default PersonalCreditCreate;