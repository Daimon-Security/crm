interface CustomMessageProps {
    title: string;
    message: any;
    acceptBtnName: string;
    cancelBtnName: string;
    operation: () => void;
    showModal: boolean;
    onCloseModal: () => void;
    typeOperation: string
}

export const CustomMessage = ({ title, message, acceptBtnName, cancelBtnName, operation, showModal, onCloseModal, typeOperation }: CustomMessageProps) => {
    return (
        // <!--Modal -->
        <div className='modal' style={{ display: showModal ? 'block' : 'none' }} id="staticBackdrop" aria-labelledby="exampleModalLabel" data-bs-keyboard="false" data-bs-backdrop="static" aria-hidden="true">
            <div className="modal-dialog  modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">{title}</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={onCloseModal}></button>
                    </div>
                    <div className="modal-body">
                        {message}
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary col-4" onClick={onCloseModal} data-bs-dismiss="modal">{cancelBtnName}</button>
                        <button type="button" className={typeOperation == 'add' ? 'btn btn-success col-4' : 'btn btn-danger col-4'} onClick={operation}>{acceptBtnName}</button>
                    </div>
                </div>
            </div>
        </div>

    )
};

export default CustomMessage;
