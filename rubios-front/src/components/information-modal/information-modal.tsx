interface InformationModalProps {
    title: string;
    body: any;
    acceptBtnName: string;
    cancelBtnName: string;
    operation: () => void;
    showModal: boolean;
    onCloseModal: () => void;
}

export const InformationModal = ({ title, body, acceptBtnName, cancelBtnName, operation, showModal, onCloseModal }: InformationModalProps) => {
    return (
        // <!--Modal -->
        <div className='modal' style={{ display: showModal ? 'block' : 'none' }} aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog  modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">{title}</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={onCloseModal}></button>
                    </div>
                    <div className="modal-body">
                        {body}
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onCloseModal} data-bs-dismiss="modal">{cancelBtnName}</button>
                        {/* <button type="button" className="btn btn-success" onClick={operation}>{acceptBtnName}</button> */}
                    </div>
                </div>
            </div>
        </div>

    )
};

export default InformationModal;
