import { Col, Row } from "react-bootstrap";
import SaleForm from "./sale-form";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/hooks";
import { getClients, getSearchClients } from "../../redux/slices/client-slice";
import { getAll as getProducts } from "../../redux/slices/product-slice";
import { getAll as getCategories } from "../../redux/slices/category-slice";
import { SaleCreateDto } from "../../entities/dto/sale-create-dto";
import { addSale } from "../../redux/slices/sale-slice";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { MdAddCircleOutline } from "react-icons/md";
import { SaleCreditCreateDto } from "../../entities/dto/sale-credit-create-dto";
import SaleFormPayment from "./sale-form-payment";
import { getDebtCollectors } from "../../redux/slices/user-slice";
import { RootState } from "../../redux/store/store";
import { CreditCreateDto } from "../../entities/dto/credit-create-dto";
import { StatusPayment } from "../../entities/dto/payment-detail-create-dto";

export const SaleCreate = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { paymentsDetailCreateDto} = useAppSelector((state: RootState) => state.saleCredits);
    const { clientSelected } = useAppSelector((state: RootState) => state.clients);
    const { isLoading } = useAppSelector((state: RootState) => state.sales);
    const [totalSale, setTotalSale] = useState<string>('0.00');
    const [showSalePayment, setShowSalePayment] = useState<boolean>(false);
    const [sale, setSale] = useState<SaleCreateDto | null>(null);
    const [saleCredit, setSaleCredit] = useState<SaleCreditCreateDto | null>(null);
    const [date, setDate] = useState<Date>(new Date());
    const type = '2 3';
    const initialValuesSaleCash: any = {
        clientId: (clientSelected) ? clientSelected.id : '',
        productId: '',
        quantity: 1,
        price: '',
        paymentType: (sale) ? sale?.paymentType : 'Contado',
        date: (sale) ? new Date(sale?.date) : new Date(),
        total: (sale) ? sale?.total.toFixed(2) : '0.00',
        typeCurrency: (sale) ? sale?.typeCurrency : 'peso',
    }


    const initialValuesSaleCredit: any = {
        paymentType: (sale) ? sale?.paymentType : 'Contado',
        numberPayment: (saleCredit) ? saleCredit.numberPayment : 1,
        paymentFrequency: (saleCredit) ? saleCredit.paymentFrequency : 'Un pago',
        interestRate: (saleCredit) ? saleCredit.interestRate : '5',
        debtCollectorId: saleCredit?.debtCollectorId,
        commission: (saleCredit) ? saleCredit.commission : '',
        payment: (saleCredit) ? saleCredit.payment.toFixed(2) : '0.00',
        downPayment: (saleCredit) ? saleCredit.downPayment : '0.00',
    }

    const createSaleCash = async (values: any, saleTotal: any, saleDetails: any, date: any) => {
        //console.log("total: ", saleTotal);
        setTotalSale(saleTotal);
        const newSale: SaleCreateDto = {
            clientId: values.clientId,
            date: new Date(date).toUTCString(),
            total: parseFloat(saleTotal),
            payment: (values.paymentType == 'Contado') ? parseFloat(saleTotal) : 0,
            paymentType: values.paymentType,
            saleDetails: saleDetails,
            typeCurrency: values.typeCurrency

        };
        setDate(date);
        setSale(newSale);
    }

    function getBalance(payment: number, numberPayment: number) {
        let balance = payment * numberPayment;
        if (paymentsDetailCreateDto.length > 0) {
            balance = paymentsDetailCreateDto.reduce((amount: number, payment: any) => {
                return (payment.status == StatusPayment.active) ? amount + parseFloat(payment.payment) : amount;
            }, 0)
        }
        return balance;
    }

    function createSaleCredit(values: any, saleTotal: any, payment: any, firstPayment: any) {
        const newSaleCredit: SaleCreditCreateDto = {
            clientId: (sale) ? sale?.clientId : values.clientId,
            debtCollectorId: values.debtCollectorId,
            date: new Date(date).toUTCString(),
            firstPayment: firstPayment,
            principal: parseFloat(saleTotal)-parseFloat(values.downPayment),
            payment: parseFloat(payment),
            numberPayment: values.numberPayment,
            interestRate: parseFloat(values.interestRate),
            paymentFrequency: values.paymentFrequency,
            commission: values.commission,
            paymentsDetail: paymentsDetailCreateDto,
            balance: getBalance(values.payment, parseInt(values.numberPayment)),
            typeCurrency: 'peso',
            downPayment: values.downPayment || 0
        };
        return newSaleCredit;
    }

    async function submitSale(values: any, saleTotal: any, payment: any, firstPayment: Date, isSubmitting: boolean) {
        const saleCredit = createSaleCredit(values, saleTotal, payment, firstPayment);
        if (sale) {
            sale.paymentType = values.paymentType;
            sale.payment = saleTotal;
            saleCredit.typeCurrency = sale.typeCurrency;
            saleCredit.downPayment = values.downPayment
        }
        setSaleCredit(saleCredit);
        if (isSubmitting) {
            if (values.paymentType != "Contado") {
                if (sale) {
                    sale.payment = 0;
                    sale.paymentType = values.paymentType;
                    sale.total = parseFloat(saleTotal);
                };
                if (sale) await dispatch(addSale(sale, saleCredit, navigate));
                //navigate('/sales')
            } else {
                if (sale) await dispatch(addSale(sale, null, navigate))
                //navigate('/sales')
            }
        }


    }

    function getFirstPayment() {
        return (saleCredit) ? new Date(saleCredit.firstPayment) : (sale) ? new Date(sale.date) : date;
    }



    function handleShowSalePayment() {
        setShowSalePayment(!showSalePayment);
    }


    useEffect(() => {
        dispatch(getSearchClients(type))
        dispatch(getProducts())
        dispatch(getCategories());
        dispatch(getDebtCollectors())
    }, [])

    return (
        <Row className='justify-content-center p-3'>
            <Col sm={10} className="bg-body-tertiary shadow p-3 mb-2 bg-white rounded">
                <Row className="justify-content-center border-bottom border-bottom-1 pb-2">
                    <Col lg="4">
                        <h3 className='text-center'>Nueva Venta</h3>
                    </Col>
                </Row>
                {!showSalePayment ?
                    <SaleForm initialValues={initialValuesSaleCash} saleDetailsInitial={(sale) ? sale.saleDetails : []} submit={createSaleCash} handleHideSalePayment={handleShowSalePayment} />
                    :
                    <SaleFormPayment initialValues={initialValuesSaleCredit} dateSale={getFirstPayment} submit={submitSale} totalSale={totalSale} handleHideSalePayment={handleShowSalePayment} 
                    isLoading={isLoading}/>
                }
            </Col>
        </Row>
    )
};

export default SaleCreate;