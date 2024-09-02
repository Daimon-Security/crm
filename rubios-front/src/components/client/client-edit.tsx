import { Col, Row } from "react-bootstrap";
import ClientForm from "./client-form";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/hooks";
import { useNavigate, useParams } from "react-router-dom";
import { RootState } from "../../redux/store/store";
import { ClientCreateDto } from "../../entities/dto/ClientCreateDto";
import { add, getById, update } from "../../redux/slices/client-slice";
import { useEffect, useState } from "react";
import ModalCustomMessage from "../custom-message/modal-custom-message";
import Loading from "../common/loading";

export const ClientEdit = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const { isError, clientSelected, message } = useAppSelector((state: RootState) => state.clients);
    const client: any = { ...clientSelected };
    const [showModalCustomMessage, setShowModalCustomMessage] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const { isLoading} = useAppSelector((state: RootState)=> state.loading);
    const [loadingClient, setLoadingClient] = useState<boolean>(false);

    function handleCloseModalCustomMessage() {
        setShowModalCustomMessage(false);
        setIsSubmitting(false)
    }

    function goTo(type: string) {        
        setShowModalCustomMessage(false);
        navigate(`/clients/${type}`);
    }

    const submit = async (values: any) => {
        if (clientSelected && client) {
            client.lastName = values.lastName;
            client.name = values.name;
            client.address = values.address;
            client.phoneNumber = values.phoneNumber;
            client.clientNumber = values.clientNumber.toString();
            client.type = parseInt(values.type);
            await dispatch(update(clientSelected.id, client, setShowModalCustomMessage, goTo, values.type));
        }
    }

    async function getClient() {
        if (id) {
            await dispatch(getById(id));
            setLoadingClient(true);
        }
    }

    useEffect(() => {
        getClient();
    }, [id])

    if (!loadingClient) {
        return <Loading/> // Puedes mostrar un indicador de carga
    }

    return (
        <Row className='justify-content-center p-3'>
            <Col sm={6} className="bg-body-tertiary shadow p-3 mb-2 bg-white rounded">
                <Row className="justify-content-center border-bottom border-bottom-1 pb-2">
                    <Col lg="6">
                        <h3 className="text-center">Modificación de Cliente</h3>
                    </Col>
                </Row>

                <ClientForm initialValuesForm={client} submit={submit} submitting={isSubmitting} isLoading={isLoading}></ClientForm>
            </Col>
            <ModalCustomMessage title={'Gestión de Clientes'} message={message} show={showModalCustomMessage} onClose={handleCloseModalCustomMessage} />
        </Row>
    )
};

export default ClientEdit;