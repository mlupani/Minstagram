import React from 'react';
import Modal from 'react-bootstrap/Modal'

const ModalWindow = ({children, show, clase = "info-modal"}) => {

    return (
        <>
        <Modal dialogClassName={clase} backdrop="static" keyboard={false} aria-labelledby="contained-modal-title-vcenter" centered show={show}>
                {children}
        </Modal>
        </>
    )
}

export default ModalWindow;
