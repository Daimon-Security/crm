import { Col, Row } from "react-bootstrap";
import SaleForm from "./sale-form";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/hooks";
import { getSearchClients } from "../../redux/slices/client-slice";
import { getAll as getProducts } from "../../redux/slices/product-slice";
import { getAll as getCategories } from "../../redux/slices/category-slice";
import { getSaleByIdDetailAnnull, saleCancel, setSaleSelected} from "../../redux/slices/sale-slice";
import { RootState } from "../../redux/store/store";
import { useNavigate, useParams } from "react-router";
import Loading from "../common/loading";
import CustomMessage from "../common/custom-message/custom-message";
import SaleFormPayment from "./sale-form-payment";
import { getDebtCollectors } from "../../redux/slices/user-slice";
import useNumberFormatter from "../../redux/hooks/useNumberFormatter";

export const SaleCancel = () => {
    const dispatch = useAppDispatch();
    const { id } = useParams();
    const navigate = useNavigate();
    const formatNumber = useNumberFormatter();
    const [saleLoaded, setSaleLoaded] = useState(false);
    const { saleSelected, type, isLoading } = useAppSelector((state: RootState) => state.sales);
    const sale: any = { ...saleSelected };
    const [showCustomMessage, setShowCustomMessage] = useState(false);
    const [showSalePayment, setShowSalePayment] = useState<boolean>(false);
    const paymentTypeRef='Contado';
   console.log("venta a anular: ", sale);
    const initialValuesSaleCash: any = {
        clientId: sale.clientId,
        payment: formatNumber(sale?.payment),
        total: sale.total,
        date: new Date(sale.date),
        categoryId: '',
        productId: '',
        quantity: 0,
        price: '',
        paymentType: sale.paymentType,
        typeCurrency: (sale) ? sale?.typeCurrency : 'peso',

    };

    const initialValuesSaleCredit: any = {
        paymentType: sale.paymentType,
        numberPayment: sale.numberPayment,
        paymentFrequency: sale.paymentFrequency,
        interestRate: (sale.paymentType == 'Contado')?'5':sale.interestRate,
        debtCollectorId: sale.debtCollectorId,
        commission: sale.commission,
        payment: sale.payment,
        firstPayment: new Date(sale.firstPayment),
        downPayment: (sale) ? sale.downPayment : '0.00',
    }


    const submit = (values: any, saleDetails: any, total: any, date: any) => {
      handleOpenCustomMessageModal();
    }

    async function cancel(){
        console.log("sale selected cancel: ", saleSelected);
        if (saleSelected) await dispatch(saleCancel(saleSelected?.id, navigate));
        handleCloseCustomMessageModal();
        dispatch(setSaleSelected(null));
        //navigate('/sales');
    }

    const handleOpenCustomMessageModal = () => {
        setShowCustomMessage(true);
    };

    const handleCloseCustomMessageModal = () => {
        setShowCustomMessage(false);
    };

    function handleShowSalePayment() {
        //console.log("mostrando forma de pago1: ", showSalePayment);
        setShowSalePayment(!showSalePayment);
       // console.log("mostrando forma de pago2: ", showSalePayment);
    }

    function getMessage(){
        if(sale.paymentType == paymentTypeRef){
            return '¿Seguro que quiere anular esta venta?'
        }else{
            return '¿Seguro que quiere anular esta venta? Al anular la venta, se anulará también el crédito otorgado como forma de pago.'
        }
    }
    

    async function getSale() {
        console.log("id: ", id);
        if (id) await dispatch(getSaleByIdDetailAnnull(id));
        setSaleLoaded(true);
    }

    useEffect(() => {
        console.log("useEffect");
        getSale()
    }, [])

    useEffect(() => {
        dispatch(getSearchClients(type))
        dispatch(getProducts())
        dispatch(getCategories());
        dispatch(getDebtCollectors());
    }, [])

    if (!saleLoaded) {
        return <Loading /> // Puedes mostrar un indicador de carga
    }

    return (
        <Row className='justify-content-center p-3'>
            <Col sm={10} className="bg-body-tertiary shadow p-3 mb-2 bg-white rounded">
                <Row className="justify-content-center border-bottom border-bottom-1 pb-2">
                    <Col lg="4">
                        <h3 className='text-center'>Cancelar Venta</h3>
                    </Col>
                </Row>
                {!showSalePayment ?
                    <SaleForm initialValues={initialValuesSaleCash} saleDetailsInitial={sale.saleDetails} submit={()=>{}} handleHideSalePayment={handleShowSalePayment} />
                    :
                    <SaleFormPayment initialValues={initialValuesSaleCredit} dateSale={initialValuesSaleCredit.firstPayment} submit={handleOpenCustomMessageModal} totalSale={(sale.total)?sale?.total?.toString():'0.00'} handleHideSalePayment={handleShowSalePayment} 
                    isLoading={isLoading}/>
                }

                {/* <SaleForm initialValues={initialValuesForm} submit={submit} saleDetailsInitial={sale.saleDetails} /> */}
            </Col>
             <CustomMessage
                title={'Anular venta'}
                message={getMessage()}
                acceptBtnName={'Anular'}
                cancelBtnName={'Cancelar'}
                onCloseModal={handleCloseCustomMessageModal}
                operation={cancel}
                showModal={showCustomMessage}
                typeOperation="remove"
            />
        </Row>
    )
};

export default SaleCancel;