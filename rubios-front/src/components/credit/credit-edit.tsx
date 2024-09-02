import { Col, Row } from "react-bootstrap";
import CreditForm from "../personal-credit/personal-credit-form";

interface CreditEditProps{
    title: string;
    selectedStatusCredit: string;
    setStatusCredit: (status: string)=>void;
    statusCredits: any;
    credit: any;
    submit:(values: any, date: any, firstPayment: any)=>void;
    creditSelected: any,
    paymentFrequencies: any,
    isLoading: boolean
}

export const CreditEdit = ({title, selectedStatusCredit, setStatusCredit, statusCredits, credit, submit, creditSelected, paymentFrequencies,
    isLoading}: CreditEditProps) => {
 

    return (
        <Row className='justify-content-center p-3'>
            <Col sm={10} className="bg-body-tertiary shadow p-3 mb-2 bg-white rounded">
                <Row className="justify-content-center pb-2">
                    <Col lg="4">
                        <h3 className="text-center">{title}</h3>
                    </Col>
                </Row>
                <Row className="justify-content-center border-bottom border-bottom-1 pb-2">
                    <Col lg="4" className="text-center">
                        <label htmlFor="status" className="form-label">Estado</label>
                        <select
                            id="status"
                            className="p-1 m-2 border border-1 rounded"
                            value={selectedStatusCredit}
                            onChange={(e) => {
                                setStatusCredit(e.target.value);
                            }}
                        >
                            {

                                statusCredits.map((option: any) => (
                                    <option key={option.value} value={option.value}>{option.name}</option>
                                ))
                            }
                        </select>
                    </Col>
                </Row>

                <CreditForm initialValuesForm={credit} submit={submit}  creditSelected={creditSelected} paymentFrequencies={paymentFrequencies} isLoading={isLoading}/>
            </Col>
        </Row>

    )
}