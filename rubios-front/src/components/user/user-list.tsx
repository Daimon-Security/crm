import { MdAddCircleOutline, MdArrowBack } from "react-icons/md";
import { Link } from "react-router-dom";
import CommonList from "../common/list";
import { RootState } from "../../redux/store/store";
import { useEffect, useState } from "react";
import { ButtonsActions } from "../common/buttons-actions";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/hooks";
import { UserDto } from "../../entities/dto/user-dto";
import { deleteUser, getAll, getByUserName, getCreditsByUser, getCreditsDebtCollectorByClientName, setUserSelected } from "../../redux/slices/user-slice";
import { SearchByName } from '../common/search-by-name';
import Loading from "../common/loading";
import CreditList from "../credit/credit-list";
import TableResponsive from "../common/table-responsive";
import useNumberFormatter from "../../redux/hooks/useNumberFormatter";
import { Col, Row } from "react-bootstrap";
import PersonalCreditDetail from "../personal-credit/personal-credit-detail";
import SaleCreditDetail from "../sale-credit/sale-credit-detail";
import { CreditListDto } from "../../entities/dto/credit-list-dto";
import { setCreditSelected as setCredit } from "../../redux/slices/credit-slice";
import { setCreditSelected as setSaleCredit } from "../../redux/slices/sale-credit-slice";
import { getClients } from "../../redux/slices/client-slice";


export const UserList = () => {
    const dispatch = useAppDispatch();
    const formatNumber = useNumberFormatter();
    const { isLoading } = useAppSelector((state: RootState) => state.loading);
    const { userRole, users, userSelected, credits } = useAppSelector((state: RootState) => state.users);
    const saleCreditSelected = useAppSelector((state: RootState) => state.saleCredits.creditSelected);
    const creditSelected = useAppSelector((state: RootState) => state.credits.creditSelected);
    const { clients } = useAppSelector((state: RootState) => state.clients);
    const [showCustomMessage, setShowCustomMessage] = useState(false);
    const [showCredits, setShowCredits] = useState(false);
    const [showDetail, setShowDetail] = useState<boolean>(false);
    const [creditType, setCreditType] = useState<number>(1);


    const handleOpenCustomMessageModal = (user: UserDto) => {
        dispatch(setUserSelected(user));
        setShowCustomMessage(true);
    };

    const handleCloseCustomMessageModal = () => {
        setShowCustomMessage(false);
    };

    const goToEdit = (user: any) => {
        dispatch(setUserSelected(user));
    };

    const remove = async () => {
        if (userSelected) {
            await dispatch(deleteUser(userSelected.id));

            handleCloseCustomMessageModal();
        }

    };

    const goToDetail = () => { }

    const searchByName = (name: any) => {
        dispatch(getByUserName(name));
    };


    const rows = users.map((user: UserDto, index: number) => ({
        id: index + 1,
        user: user.lastName + " " + user.name,
        role: user.roleName,
        phoneNumber: user.phoneNumber,
        address: user.address,
        email: user.email,
        actions: (
            <>
                <ButtonsActions entity={user} openModal={handleOpenCustomMessageModal} goToEdit={goToEdit}
                    goToDetail={goToDetail} userRole={userRole} routeEdit={`/user/${user.id}/edit`} />
                <button className="btn btn-success mb-1" onClick={() => { getCredits(user) }}> Créditos</button>
            </>

        ),
    }));

    const data = {
        columns: [
            {
                label: '#',
                field: 'id',
                sort: 'asc',
                ////width: 50
            },
            {
                label: 'Apellido y Nombre',
                field: 'user',
                sort: 'asc',
                ////width: 80
            },
            {
                label: 'Tipo',
                field: 'role',
                sort: 'asc',
                //width: 100
            },
            {
                label: 'Teléfono',
                field: 'phoneNumber',
                sort: 'asc',
                //width: 50
            },
            {
                label: 'Dirección',
                field: 'address',
                sort: 'asc',
                //width: 50
            },
            {
                label: 'Email',
                field: 'email',
                sort: 'asc',
                //width: 50
            },
            {
                label: 'Acciones',
                field: 'actions',
                sort: 'asc',
                //width: 100
            }
        ],
        rows: rows
    };

    const rowCredits = credits.map((credit: any, index: any) => ({
        clientNumber: credit.clientNumber,
        client: credit.client,
        date: credit.date,
        typeCurrency: credit.typeCurrency.toUpperCase(),
        principal: formatNumber(credit.principal),
        interest: formatNumber(credit.interest),
        balance: formatNumber(credit.balance),
        paymentFrequency: credit.paymentFrequency,
        numberPayment: credit.numberPayment,
        payment: formatNumber(credit.payment),
        type: (credit.type == 1) ? 'Personal' : 'Venta',
        action: (
            <button className="btn btn-success" onClick={() => { selectCredit(credit) }}>Detalle</button>
        )
    }));

    const dataCredits = {
        columns: [
            {
                label: 'Ficha',
                field: 'clientNumber',
                sort: 'asc',
                ////width: 50
            },
            {
                label: 'Cliente',
                field: 'client',
                sort: 'asc',
                ////width: 80
            },
            {
                label: 'Fecha',
                field: 'date',
                sort: 'asc',
                //width: 50
            },
            {
                label: 'Moneda',
                field: 'typeCurrency',
                sort: 'asc',
                //width: 50
            },
            {
                label: 'Capital',
                field: 'principal',
                sort: 'asc',
                //width: 50
            },
            {
                label: 'Interés',
                field: 'interest',
                sort: 'asc',
                //width: 50
            },
            {
                label: 'Saldo',
                field: 'balance',
                sort: 'asc',
            },
            {
                label: 'Frecuencia',
                field: 'paymentFrequency',
                sort: 'asc',
                //width: 50
            },
            {
                label: 'Nº de pagos',
                field: 'numberPayment',
                sort: 'asc',
                //width: 50
            },
            {
                label: 'Pago',
                field: 'payment',
                sort: 'asc',
                //width: 50
            },
            {
                label: 'Tipo',
                field: 'type',
                sort: 'asc',
                //width: 50
            },
            {
                label: 'Crédito',
                field: 'action',
                sort: 'asc',
                //width: 50
            }
        ],
        // rows: [...credits],
        rows: rowCredits
    };

    function selectCredit(credit: CreditListDto) {
        setShowDetail(true);
        if (credit.type) setCreditType(credit.type);
        if (credit.type == 1) {
            if (!creditSelected || creditSelected.id != credit.id) dispatch(setCredit(credit));
        } else {
            if (!creditSelected || creditSelected.id != credit.id) dispatch(setSaleCredit(credit));

        }
    }

    function getCredits(user: UserDto) {
        setShowCredits(true);
        dispatch(setUserSelected(user));
        dispatch(getCreditsByUser(user.id));
    }

    function getOptionsUsers() {
        return users.map((option: any) => {
            return { id: option.id, label: option.lastName + " " + option.name }
        })
    }

    function getOptionsClients() {
        return clients.map((option: any) => {
            return { id: option.id, label: option.lastName + " " + option.name }
        })
    }

    const searchByClient = (client: number) => {
        console.log("client searchByName: ", client);
        if(userSelected)dispatch(getCreditsDebtCollectorByClientName(userSelected.id, client));
    };

    async function getUsersList() {
        await dispatch(getAll());
    }

    useEffect(() => {
        getUsersList();
        dispatch(getClients());
    }, [])

    if (isLoading) {
        return <Loading /> // Puedes mostrar un indicador de carga
    }

    return (
        <>
            <div className={`${showCredits ? 'd-none' : 'd-block'}`}>
                <CommonList
                    title='Usuarios'
                    data={data}
                    routeCreate="/user-create"
                    searchByName={searchByName}
                    handleCloseCustomMessageModal={handleCloseCustomMessageModal}
                    showCustomMessage={showCustomMessage}
                    remove={remove}
                    userRole={userRole}
                    getOptions={getOptionsUsers}
                />
            </div>
            <div className={`${showCredits ? 'd-block' : 'd-none'}`}>
                {!showDetail ?
                    <div>
                        <Row className="border-top border-bottom p-2 mb-4 align-items-center d-flex justify-content-start">
                            <Col lg={1} xs={2}>
                                <button className="bg-transparent border-0" onClick={() => {
                                    setShowCredits(false);
                                }
                                }>
                                    <MdArrowBack size={30} color="grey" />
                                </button>
                            </Col>
                            <Col lg={11} xs={10}>
                                <h3>Créditos asignados a {userSelected?.lastName} {userSelected?.name}</h3>
                            </Col>
                        </Row>
                        <div className="px-2">
                            <div className="d-flex align-items-center mb-3 row">
                                <SearchByName options={getOptionsClients()} placeholder='escribe el nombre de un cliente...' getByOption={searchByClient} />
                            </div>
                            <TableResponsive columns={dataCredits.columns} rows={dataCredits.rows} />
                        </div>
                    </div>
                    :
                    <div>
                        {creditType == 1 ?
                            <PersonalCreditDetail setShowDetail={setShowDetail} hide={showDetail} activeTab={'history'} /> :
                            <SaleCreditDetail setShowDetail={setShowDetail} hide={showDetail} activeTab="history" />
                        }
                    </div>
                }
            </div >
        </>
    )
};

export default UserList;