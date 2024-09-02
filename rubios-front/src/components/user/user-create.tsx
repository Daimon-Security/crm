import React, { useEffect, useState } from 'react';
import { RootState } from '../../redux/store/store';
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from '../../redux/hooks/hooks';
import { Col, Row } from 'react-bootstrap';
import { UserDto } from '../../entities/dto/user-dto';
import UserForm from './user-form';
import { UserCreateDto } from '../../entities/dto/user-create-dto';
import { add } from '../../redux/slices/user-slice';
import Loading from '../common/loading';
import ModalCustomMessage from '../custom-message/modal-custom-message';

//export const useAppDispatch: () => AppDispatch = useDispatch;

const UserCreate = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { message, isLoading } = useAppSelector((state: RootState) => state.users);
    const [showModalCustomMessage, setShowModalCustomMessage] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const initialValuesForm: any = {
        lastName: '',
        name: '',
        roleName: '',
        address: '',
        phoneNumber: '',
        email: '',
        userName: '',
        password: '',
        repeatPassword: ''

    }

    function handleCloseModalCustomMessage() {
        setShowModalCustomMessage(false);
        setIsSubmitting(false)
    }

    function goTo(){
        setShowModalCustomMessage(false);
        navigate('/users')
    }

    const submit = async (values: any) => {
        var user: UserCreateDto = {
            lastName: values.lastName,
            name: values.name,
            roleName: values.roleName,
            address: values.address,
            phoneNumber: values.phoneNumber,
            email: values.email,
            userName: values.userName,
            password: values.password
        };
        await dispatch(add(user, setShowModalCustomMessage, goTo));
        //if (!isLoading) navigate('/users')
    }

    return (
        <Row className='justify-content-center p-3'>
        <Col sm={10} className="bg-body-tertiary shadow p-3 mb-2 bg-white rounded">
            <Row className="justify-content-center border-bottom border-bottom-1 pb-2">
                <Col lg="4">
                        <h3 className="text-center">Nuevo Usuario</h3>
                    </Col>
                </Row>

                <UserForm initialValuesForm={initialValuesForm} submit={submit} isLoading={isLoading} submitting={isSubmitting}></UserForm>
                <ModalCustomMessage title={'Gestión de Usuarios'} message={message} show={showModalCustomMessage} onClose={handleCloseModalCustomMessage} />

            </Col>
        </Row>
    )
}

export default UserCreate;