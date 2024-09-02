import { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";

interface FilterClientModalProps {
    show: boolean;
    onClose: () => void;
    onApplyFilter: (type: string) => void;
    offApplyFilter: () => void;


}

const FilterClientModal = ({ show, onClose, onApplyFilter, offApplyFilter }: FilterClientModalProps) => {
    const [type, setType] = useState<string>('')
    const clientTypes: any = [
        { value: 1, label: 'Crédito' },
        { value: 2, label: 'Venta' },
        // { value: 3, label: 'Credito-Venta' },
    ]
    const handleApplyFilter = () => {
        onApplyFilter(type);
        onClose();
    };

    function handleOffApplyFilter() {
        offApplyFilter();
    }

    return (
        <Modal size='sm' show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Aplicar filtros</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="mb-3">
                    <label htmlFor="status" className="form-label">Tipo de cliente</label>
                    <select
                        id="type"
                        className="form-select"
                        value={type}
                        onChange={(e) => {
                            setType(e.target.value);
                        }}
                    >
                        <option key='all' value='all'>Todos</option>
                        {

                            clientTypes.map((option: any) => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))
                        }
                    </select>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Cerrar
                </Button>
                <Button variant="primary" onClick={handleApplyFilter}>
                    Aplicar
                </Button>

            </Modal.Footer>
        </Modal>
    );
};

export default FilterClientModal;