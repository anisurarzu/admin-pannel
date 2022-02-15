import React from 'react'
import Modal from 'react-bootstrap/Modal'
import { Icon } from 'react-icons-kit'
import { ic_clear } from 'react-icons-kit/md'

export const ProductModal = (props) => {
    return (
        <div>
            <Modal
                show={props.show}
                onHide={props.onHide}
                dialogClassName="custom-delete-modal"
            >
                <Modal.Header>
                    <div className="d-flex w-100">
                        <div><h6 className="mb-0">Products</h6></div>
                        <div className="ml-auto">
                            <button
                                type="button"
                                disabled={props.loading}
                                className="btn btn-sm btn-light shadow-none rounded-circle p-1"
                                onClick={props.onHide}
                            >
                                <Icon icon={ic_clear} size={25} />
                            </button>
                        </div>
                    </div>
                </Modal.Header>
                <Modal.Body className="p-4">
                    <ol className="pl-3 m-0">
                        {props.data && props.data.length ?
                            props.data.map((item, i) =>
                                <li key={i}>{item.name}</li>
                            ) : null
                        }
                    </ol>
                </Modal.Body>
            </Modal>
        </div>
    );
}