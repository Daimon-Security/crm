import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import 'react-datepicker/dist/react-datepicker.css';

interface ProductFilterModalProps {
    show: boolean;
    onClose: () => void;
    onApplyFilter: (category: string | null) => void;
    offApplyFilter: () => void;
    options: any;
    apply: boolean

}

const ProductFilterModal = ({ show, onClose, onApplyFilter, offApplyFilter, options, apply }: ProductFilterModalProps) => {
    const [category, setCategory] = useState<string>('all');


    const handleApplyFilter = () => {
        onApplyFilter(category);
        onClose();
    };

    function handleOffApplyFilter() {
        setCategory('all');
        offApplyFilter();
    }


    return (
        <Modal show={show} onHide={onClose} onShow={() => {
            if (!apply) handleOffApplyFilter()}}>
            <Modal.Header closeButton>
                <Modal.Title>Aplicar filtros</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="mb-3">
                    <label htmlFor="category" className="form-label">Categoría</label>
                    <select
                        id="category"
                        className="form-select"
                        value={category}
                        onChange={(e) => {
                            setCategory(e.target.value);
                        }}
                    >
                        <option key='all' value='all'>Todos</option>
                        {
                            options.map((option: any, index: any) => (
                                <option key={option.value} value={option.value}>{option.name}</option>
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

export default ProductFilterModal;