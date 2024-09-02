import { MdAddCircleOutline, MdFilterAlt, MdSearch } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";
import CustomMessage from "./custom-message/custom-message";
import DatatablePage from "../table";
import { useState } from "react";
import TableResponsive from "./table-responsive";
import { SearchByName } from './search-by-name';

interface CommonListProps {
    title: string;
    data: any;
    routeCreate: string;
    searchByName: (name: any) => void;
    handleCloseCustomMessageModal: () => void;
    showCustomMessage: boolean;
    remove: () => void;
    userRole: string | null;
    getOptions: ()=> void;

}

export const CommonList = ({ title, data, routeCreate, searchByName,
    handleCloseCustomMessageModal, showCustomMessage, remove, userRole, getOptions }: CommonListProps) => {
    const [nameSearch, setNameSearch] = useState<string>('');
    const location = useLocation();

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNameSearch(event.target.value);
    };

    return (
        <div className="p-3">
            <div className="border-top border-bottom py-2 mb-4 d-flex align-items-center justify-content-between">
                <h3>{title}</h3>
                {(userRole != 'debt-collector') ?
                    <Link to={routeCreate}>
                        <button className="btn btn-primary">Nuevo <MdAddCircleOutline /></button>
                    </Link> : ('')
                }
            </div>
            <div className="d-flex align-items-center mb-3 row">
                <SearchByName options={getOptions()} placeholder='escribe el nombre...' getByOption={searchByName} />
            </div>

            {
                location.pathname == '/clients' ?
                ('') : ('')
            }


            <CustomMessage
                title={'Eliminar registro'}
                message={'¿Seguro que quiere eliminar el registro?'}
                acceptBtnName={'Eliminar'}
                cancelBtnName={'Cancelar'}
                onCloseModal={handleCloseCustomMessageModal}
                operation={remove}
                showModal={showCustomMessage}
                typeOperation="remove"
            />

            <TableResponsive columns={data.columns} rows={data.rows} />
        </div>
    )
};

export default CommonList;