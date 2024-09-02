import { Col, Row } from "react-bootstrap";
import ClientForm from "./client-form";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/hooks";
import { useNavigate, useParams } from "react-router-dom";
import { RootState } from "../../redux/store/store";
import { ClientCreateDto } from "../../entities/dto/ClientCreateDto";
import { add } from "../../redux/slices/client-slice";
import { useEffect, useState } from "react";
import ModalCustomMessage from "../custom-message/modal-custom-message";
import Loading from "../common/loading";

export const ClientCreate = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { type } = useParams();
    const { message } = useAppSelector((state: RootState) => state.clients);
    const { isLoading} = useAppSelector((state: RootState)=> state.loading);
    const [showModalCustomMessage, setShowModalCustomMessage] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const initialValuesForm: any = {
        lastName: '',
        name: '',
        address: '',
        phoneNumber: '',
        clientNumber: '', 
        type: type
    }

    function handleCloseModalCustomMessage() {
        setShowModalCustomMessage(false);
        setIsSubmitting(false)
    }
    
    function goTo() {
        navigate(`/clients/${type}`);
    }

    const submit = async (values: any) => {
        var client: ClientCreateDto = {
            lastName: values.lastName,
            name: values.name,
            address: values.address,
            phoneNumber: values.phoneNumber,
            clientNumber: values.clientNumber.toString(),
            type: parseInt(values.type)
        };
        setIsSubmitting(true);
        await dispatch(add(client, setShowModalCustomMessage, goTo));
    }

    return (
        <Row className='justify-content-center p-3'>
            <Col sm={6} className="bg-body-tertiary shadow p-3 mb-2 bg-white rounded">
                <Row className="justify-content-center border-bottom border-bottom-1 pb-2">
                    <Col lg="4">
                        <h3 className="text-center">Nuevo Cliente</h3>
                    </Col>
                </Row>

                <ClientForm initialValuesForm={initialValuesForm} submit={submit} submitting={isSubmitting} isLoading={isLoading}></ClientForm>
            </Col>
            <ModalCustomMessage title={'Gestión de Clientes'} message={message} show={showModalCustomMessage} onClose={handleCloseModalCustomMessage} />

        </Row>
    )
};

export default ClientCreate;