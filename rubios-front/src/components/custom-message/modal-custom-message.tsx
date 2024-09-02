import { useState } from "react";
import { Button, Modal } from "react-bootstrap";

interface ModalCustomMessageProps {
  title: string;
  message: string | null;
  show: boolean;
  onClose: ()=>void;
}

export const ModalCustomMessage = ({ title, message, show, onClose }: ModalCustomMessageProps) => {

  return (
    <Modal show={show} >
      <Modal.Header>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {message}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={onClose}>
          Aceptar
        </Button>

      </Modal.Footer>
    </Modal>
  )
};

export default ModalCustomMessage;