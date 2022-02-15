import React from 'react'
import { Modal } from 'react-bootstrap'
import { Icon } from 'react-icons-kit'
import { x } from 'react-icons-kit/feather'
import { useForm } from 'react-hook-form'
import { CustomButton } from '../button'

export const OrderStatusModal = (props) => {
    const { register, handleSubmit, errors } = useForm()

    // Submit Form
    const onSubmit = async (data) => props.handleAction(data)

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
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-group">
                        {errors.comment && errors.comment.message ? (
                            <p className="text-danger">{errors.comment && errors.comment.message}</p>
                        ) : <p>Comment</p>}

                        <textarea
                            name="comment"
                            rows={5}
                            className="form-control shadow-none"
                            placeholder="Write comment"
                            ref={register({ required: props.status === "Cancelled" ? "Comment is required." : false })}
                        />
                    </div>

                    <div>
                        <CustomButton
                            type="submit"
                            disabled={props.loading}
                            className="btn-success border-0 mr-2"
                            style={{ padding: "7px 20px", fontSize: 14 }}
                        >{props.loading ? "Loading ..." : "Yes"}
                        </CustomButton>

                        <CustomButton
                            style={{ padding: "7px 20px", fontSize: 14 }}
                            className="btn-danger border-0 mr-2"
                            onClick={props.onHide}
                        >No</CustomButton>
                    </div>
                </form>
            </Modal.Body>
        </Modal>
    );
}
