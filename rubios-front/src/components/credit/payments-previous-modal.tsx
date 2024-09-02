import { Button, Modal, Table } from "react-bootstrap"
import TableResponsive from "../common/table-responsive"
import { PaymentDetailCreateDto, StatusPayment } from "../../entities/dto/payment-detail-create-dto"
import { useEffect, useState } from "react"
import { addDays, addMonths, format, parseISO } from "date-fns"
import { setPaymentsDetailCreateDto as setPaymentDetailPersonalCredit } from "../../redux/slices/credit-slice"
import { setPaymentsDetailCreateDto as setPaymentDetailSaleCredit } from "../../redux/slices/sale-credit-slice"

import { useAppDispatch, useAppSelector } from "../../redux/hooks/hooks"
import { RootState } from "../../redux/store/store"
import DatePicker from 'react-datepicker';
import { es } from "date-fns/locale"
import { useLocation } from "react-router-dom"
import { Tbody, Td, Th, Thead, Tr } from "react-super-responsive-table"
import useNumberFormatter from "../../redux/hooks/useNumberFormatter"

interface PaymentsPreviousModalProps {
    valuesForm: any,
    show: boolean,
    firstPayment: Date,
    onClose: () => void;
    paymentsDetailCreateDto: any;
    creditSelected: any;
    changed?: boolean;
    updateChanged?: () => void;
}

export const PaymentsPreviousModal = ({ valuesForm, show, firstPayment, onClose, paymentsDetailCreateDto, creditSelected, changed, updateChanged }: PaymentsPreviousModalProps) => {
    const dispatch = useAppDispatch();
    const location = useLocation();
    const route = location.pathname;
    const isCreate = (route == '/personal-credit-create' || route == '/sale-create') ? true : false;
    const formatNumber = useNumberFormatter();
    const [paymentsDetail, setPaymentsDetail] = useState<PaymentDetailCreateDto[]>(paymentsDetailCreateDto);
    const [isChecked, setIsChecked] = useState<boolean>(false);


    // console.log("creditSelected: ", creditSelected);
    // console.log("firstPayment: ", firstPayment);

    const handleCheckboxChange = (index: any) => {
        setIsChecked(!isChecked);
        const nuevosValores = deepCopy(paymentsDetail);

        const payment = nuevosValores[index];
        payment.status = (isChecked) ? StatusPayment.cancelled : StatusPayment.active;
        payment.paymentDate = (isChecked) ? ((payment.paymentDate) ? payment.paymentDate : payment.paymentDueDate) : null;
        setPaymentsDetail(nuevosValores);
    };

    const deepCopy=(obj: any): any =>{
        if (obj === null || typeof obj !== 'object') {
          // If the obj is not an object or is null, return it as is
          return obj;
        }
      
        if (Array.isArray(obj)) {
          // If obj is an array, create a new array and deep copy its elements
          return obj.map((element) => deepCopy(element));
        }
      
        // If obj is an object, create a new object and deep copy its properties
        const newObj: any = {};
        for (const key in obj) {
          if (obj.hasOwnProperty(key)) {
            newObj[key] = deepCopy(obj[key]);
          }
        }
      
        return newObj;
      }
      
    
      
      
      

    const handlePaymentChange = (index: any, value: any) => {
        const nuevosValores = deepCopy(paymentsDetail);
        console.log("nuevosValores", nuevosValores)
        console.log("parseFloat(value)", parseFloat(value))
        console.log("index", index)
        console.log("nuevosValores[index]", nuevosValores[index])
        nuevosValores[index].payment = parseFloat(value);
        setPaymentsDetail(nuevosValores);
    };

    const handlePaymentDateChange = (index: any, date: Date) => {
        const nuevosValores = deepCopy(paymentsDetail);
        const payment = nuevosValores[index];
        payment.paymentDate = date.toISOString();
        //console.log("fecha de pago seleccionada: ", payment.paymentDate);
        setPaymentsDetail(nuevosValores);
    }

    const columns: any = [
        {
            label: 'Nº',
            field: 'numberPayment',
            sort: 'asc',
            width: 250
        },
        {
            label: 'Vto del Pago',
            field: 'paymentDueDate',
            sort: 'asc',
            width: 250
        },
        {
            label: 'Fecha de pago',
            field: 'paymentDate',
            sort: 'asc',
            width: 250
        },
        {
            label: 'Pago',
            field: 'payment',
            sort: 'asc',
            width: 200
        },
        {
            label: 'Pagado',
            field: 'action',
            sort: 'asc',
            width: 200
        },
    ];

    const rows = paymentsDetail.map((payment, index) => ({
        id: index + 1,
        paymentDueDate: (
            <>
                <div className='col-12'>
                    <DatePicker
                        id="startDate"
                        disabled
                        locale={es}
                        dateFormat="dd/MM/yyyy"
                        className="form-control"
                        selected={new Date(payment.paymentDueDate)}
                        onChange={(date) => {
                        }
                        }
                        selectsStart
                        placeholderText="Selecciona una fecha" />
                </div>
            </>
        ),
        paymentDate: (
            <>
                {
                    payment.status == StatusPayment.cancelled ?
                        <div className='col-12'>
                            <DatePicker
                                id="startDate"
                                locale={es}
                                dateFormat="dd/MM/yyyy"
                                className="form-control"
                                selected={new Date(payment.paymentDate)}
                                onChange={(date: any) => {
                                    // console.log("fecha seleccionada: ", date);
                                    handlePaymentDateChange(index, date);
                                }
                                }
                                placeholderText="Selecciona una fecha" />
                        </div> : ('-')
                }
            </>
        ),
        payment: (
            <div>
                <input
                    className="form-control "
                    type="number"
                    value={paymentsDetail[index].payment}
                    onChange={(e: any) => {
                        handlePaymentChange(index, e.target.value)
                    }
                    }
                />
            </div>
        ),
        action: (
            <input
                type="checkbox"
                checked={(payment.status == StatusPayment.cancelled) ? true : false}
                onChange={() => { handleCheckboxChange(index) }}
            />
        )
    }));


    function getNextPaymenteDate(frequency: string, periodNumber: number, firstPayment: Date) {
        switch (frequency) {
            case 'Un pago':
                return firstPayment;
            case 'Semanal':
                return addDays(firstPayment, 7 * periodNumber);
            case 'Quincenal':
                return addDays(firstPayment, 15 * periodNumber);
            case 'Mensual':
                return addMonths(firstPayment, 1 * periodNumber);
            default:
                return firstPayment
        }

    }

    function getPaymentsToGenerate(values: any) {
        var payments = [];
        for (let i = 1; i < parseInt(values.numberPayment) + 1; i++) {
            const paymentDueDate = (i == 1) ? firstPayment : getNextPaymenteDate(values.paymentFrequency, i - 1, firstPayment);
            const payment: PaymentDetailCreateDto = {
                paymentDueDate: paymentDueDate.toISOString(),
                paymentDate: null,
                payment: values.payment,
                status: StatusPayment.active
            };
            payments.push(payment);
        };
        setPaymentsDetail(payments);
    }


    function savePaymentsDetailCreateDto() {
        if (route != '/sale-crate') {
            dispatch(setPaymentDetailPersonalCredit(paymentsDetail));
        } else {
            dispatch(setPaymentDetailSaleCredit(paymentsDetail));
        }
        if(updateChanged) {
            updateChanged();
        }
        onClose();
    }

    useEffect(() => {
        if (show && changed) {
            getPaymentsToGenerate(valuesForm);
        }
    }, [show])

    //console.log("rows: ", rows);

    return (
        <Modal show={show} size={'lg'}>
            <Modal.Header closeButton={true} onHide={onClose}>
                <Modal.Title>Detalle de pagos a generar</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <TableResponsive columns={columns} rows={rows} />
            </Modal.Body>
            <Modal.Footer>
                <Button variant="success" className="col-3" onClick={savePaymentsDetailCreateDto}>
                    Aceptar
                </Button>

            </Modal.Footer>
        </Modal>
    )
}