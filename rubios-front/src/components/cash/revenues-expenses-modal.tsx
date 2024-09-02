import { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/hooks";
import { RootState } from "../../redux/store/store";
import { addExpense, addRevenue } from "../../redux/slices/cash-slice";

interface RevenuesExpensesModalProps {
    type: number;
    show: boolean;
    close: () => void;
}

export const RevenuesExpensesModal = ({ type, show, close }: RevenuesExpensesModalProps) => {
    const dispatch = useAppDispatch();
    const { cash, isLoading } = useAppSelector((state: RootState) => state.cash);
    const newRecord: any = {
        concept: '',
        currencyType: 'peso',
        amount: 0,
        type: 1
    }
    const [record, setRecord] = useState(newRecord);

    function save() {
        console.log("record: ", record);
        if (cash) {
            if (type == 1) {
                dispatch(addRevenue(record, cash.id, close));
            } else {
                dispatch(addExpense(record, cash.id, close));
            }
        }

    }

    useEffect(() => {
        setRecord(newRecord);
    }, [show])

    return (
        <Modal show={show} size="lg" centered>
            <Modal.Header className="justify-content-center">
                <Modal.Title>{`Nuevo ${type == 1 ? 'Ingreso' : 'Egreso'}`}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="row d-flex">
                    {
                        type == 1 ?
                            <div className="form-group col-lg-6 col-12">
                                <label htmlFor="total" className='mb-2'>Concepto</label>
                                <input className="form-control" type="text" value={record.concept}
                                    onChange={(e: any) => {
                                        const concept = e.target.value;
                                        setRecord({ ...record, concept })
                                    }
                                    }
                                />
                            </div> :
                            <div className="form-group col-lg-6 col-12">
                                <label htmlFor="total" className='mb-2'>Tipo</label>
                                <select
                                    className="form-control"
                                    value={record.type}
                                    onChange={(e: any) => {
                                        const type = e.target.value;
                                        setRecord({ ...record, type })
                                    }}
                                >
                                    <option value='1'>Retiro</option>
                                    <option value='2'>Otros</option>
                                </select>
                            </div>
                    }
                    <div className="form-group col-lg-3 col-5">
                        <label htmlFor="total" className='mb-2'>Moneda</label>
                        <select
                            className="form-control"
                            value={record.currencyType}
                            onChange={(e: any) => {
                                const currencyType = e.target.value;
                                setRecord({ ...record, currencyType })
                            }}
                        >
                            <option value='peso'>Peso</option>
                            <option value='dolar'>Dolar</option>
                        </select>
                    </div>
                    <div className="form-group col-lg-3 col-7">
                        <label htmlFor="total" className='mb-2'>Importe</label>
                        <input className="form-control" type="number" value={record.amount}
                            onChange={(e: any) => {
                                const amount = e.target.value;
                                setRecord({ ...record, amount })
                            }
                            }
                        />
                    </div>
                    {
                        type == 2 ?
                            <div className="form-group col-12 mt-2">
                                <label htmlFor="total" className='mb-2'>Concepto</label>
                                <input className="form-control" type="text" value={record.concept}
                                    disabled={record.type == 1}
                                    onChange={(e: any) => {
                                        const concept = e.target.value;
                                        setRecord({ ...record, concept })
                                    }
                                    }
                                />
                            </div> : ('')
                    }

                </div>
            </Modal.Body>
            <Modal.Footer className="justify-content-center">
                <Button variant="secondary" className="col-lg-3 col-4" onClick={close}>
                    Cancelar
                </Button>
                <Button variant="primary" className="col-lg-3 col-4" onClick={save}>
                    Guardar
                </Button>
                {isLoading ?
                    <div className="spinner-border text-primary mt-2" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div> : ('')
                }

            </Modal.Footer>
        </Modal>
    )
};
export default RevenuesExpensesModal;