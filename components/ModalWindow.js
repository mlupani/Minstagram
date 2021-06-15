import React, {useState} from 'react';
import Modal from 'react-bootstrap/Modal'

const ModalWindow = ({children, show}) => {

    return (
        <>
        <Modal backdrop="static" keyboard={false} dialogClassName="info-modal" aria-labelledby="contained-modal-title-vcenter" centered show={show}>
                {children}
        </Modal>
        </>
    )
}

export default ModalWindow;
