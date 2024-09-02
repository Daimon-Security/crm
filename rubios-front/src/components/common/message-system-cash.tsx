import { Button, Modal } from "react-bootstrap"
import Loading from "./loading"

export const MessageSystemCash = ({showMessage, isLoading, cash, message, closeMessage}: any) =>{
    return(
        <Modal show={showMessage} >
        <Modal.Header>
          <Modal.Title>{'Mensaje del Sistema'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {
            isLoading ?
              <Loading /> : ('')
          }
          {
            cash ?
              <div>{'Debe abrir la caja para poder operar.'}</div> :
              <div>{message}</div>
          }
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={closeMessage}>
            Aceptar
          </Button>

        </Modal.Footer>
      </Modal>
    )
}