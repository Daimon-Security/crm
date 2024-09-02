import { Col, Row } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/hooks";
import { RootState } from "../../redux/store/store";
import UserForm from "./user-form";
import { getById, setUserSelected, update } from "../../redux/slices/user-slice";
import { useNavigate, useParams } from "react-router";
import { UserDto, RoleType } from '../../entities/dto/user-dto';
import { useEffect, useState } from "react";
import Loading from "../common/loading";
import ModalCustomMessage from "../custom-message/modal-custom-message";

export const UserEdit = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const [showModalCustomMessage, setShowModalCustomMessage] = useState<boolean>(false);
    const [userLoaded, setUserLoaded] = useState(false);
    const { userSelected, message, isLoading } = useAppSelector((state: RootState) => state.users);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const user: any = { ...userSelected };
    const convertedInitialValues = {
        ...user,
    };

    function handleCloseModalCustomMessage() {
        setShowModalCustomMessage(false);
        setIsSubmitting(false)
    }

    function goTo(){
        setShowModalCustomMessage(false);
        navigate('/users')
    }

    const submit = async (values: any, actions: any) => {
        if (userSelected && user && user.id) {
            user.lastName = values.lastName;
            user.name = values.name;
            user.roleName = RoleType[values.roleName as keyof typeof RoleType];
            user.address = values.address;
            user.phoneNumber = values.phoneNumber;
            user.email = values.email;
            user.password = (values.password)?values.password: null
            // Despacha la acción con el objeto credit modificado
            await dispatch(update(user.id, user, setShowModalCustomMessage, goTo));
        }
    }



    async function getUsers() {
        console.log("ID: ", id);
        if (id) {
            await dispatch(getById(id));
            setUserLoaded(true)
        }
    }

    useEffect(() => {
        // user.roleName = RoleType[user.roleName as keyof typeof RoleType];
        getUsers();
    }, [id])

    if (!userLoaded) {
        return <Loading /> // Puedes mostrar un indicador de carga
    }

    return (
        <Row className='justify-content-center p-3'>
            <Col sm={10} className="bg-body-tertiary shadow p-3 mb-2 bg-white rounded">
                <Row className="justify-content-center border-bottom border-bottom-1 pb-2">
                    <Col lg="4">
                        <h3 className="text-center">Modificación de Usuario</h3>
                    </Col>
                </Row>

                <UserForm initialValuesForm={convertedInitialValues} submit={submit} isLoading={isLoading} submitting={isSubmitting}></UserForm>
                <ModalCustomMessage title={'Gestión de Usuarios'} message={message} show={showModalCustomMessage} onClose={handleCloseModalCustomMessage} />

            </Col>
        </Row>
    )
};

export default UserEdit;