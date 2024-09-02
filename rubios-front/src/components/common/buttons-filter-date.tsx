import { Col, Row } from "react-bootstrap";
import { MdRefresh } from "react-icons/md";

interface ButtonsFilterProps {
    handleApplyFilter: () => void,
    handleOffApplyFilter: () => void
}

export const ButtonsFilter = ({ handleApplyFilter, handleOffApplyFilter }: ButtonsFilterProps) => {
    return (
            <div className='mb-3 col-6 d-flex justify-content-center'>
                <button className='btn btn-primary col-6' onClick={handleApplyFilter}>
                    Filtrar
                </button>
                <button className='btn btn-outline-danger ms-3 text-center col-4' onClick={handleOffApplyFilter}>
                    <MdRefresh size={20} />
                </button>
            </div>
    )
};

export default ButtonsFilter;