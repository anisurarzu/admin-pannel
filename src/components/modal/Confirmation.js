import React from 'react'
import { Modal } from 'react-bootstrap'
import { Icon } from 'react-icons-kit'
import { x } from 'react-icons-kit/feather'
import { CustomButton } from '../button'

export const ConfirmationModal = (props) => {
    return (
        <Modal
            show={props.show}
            onHide={props.onHide}
            size="md"
            centered
            className="custom-modal"
        >
            <Modal.Header>
                <div className="d-flex w-100">
                    <div><h6 className="mt-2 mb-0">Are tou sure?</h6></div>
                    <div className="ml-auto">
                        <CustomButton
                            onClick={props.onHide}
                            className="btn-danger rounded-circle border-0"
                            style={{ padding: "7px 10px" }}
                        ><Icon icon={x} size={18} />
                        </CustomButton>
                    </div>
                </div>
            </Modal.Header>
            <Modal.Body>
                {props.message}

                <div className="pt-4">
                    <CustomButton
                        disabled={props.loading}
                        className="btn-danger border-0 mr-2"
                        style={{ padding: "7px 20px", fontSize: 14 }}
                        onClick={props.doDelete}
                    >{props.loading ? "Loading ..." : "Yes"}
                    </CustomButton>

                    <CustomButton
                        style={{ padding: "7px 20px", fontSize: 14 }}
                        className="btn-gray border-0 mr-2"
                        onClick={props.onHide}
                    >No</CustomButton>
                </div>
            </Modal.Body>
        </Modal>
    );
}
