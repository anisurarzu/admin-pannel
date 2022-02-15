import React, { useState } from 'react'
import { Icon } from 'react-icons-kit'
import { useForm } from 'react-hook-form'
import { ic_clear } from 'react-icons-kit/md'
import Modal from 'react-bootstrap/Modal'
import Requests from '../../../utils/Requests/Index'

const Index = (props) => {
    const { register, handleSubmit, errors } = useForm()
    const [isLoading, setLoading] = useState(false)
    const [header] = useState({
        headers: { Authorization: "Bearer " + localStorage.getItem('token') }
    })

    // Submit Form
    const onSubmit = async data => {
        try {
            setLoading(true)
            const formData = {
                ...data,
                reciver: props.reciver
            }

            await Requests.Order.SendDeliveryInfo(formData, header)
            setLoading(false)
            props.onHide()

        } catch (error) {
            if (error) setLoading(false)
        }
    }

    return (
        <div>
            <Modal
                show={props.show}
                onHide={props.onHide}
                dialogClassName="custom-delete-modal"
                backdrop="static"
                keyboard={false}
                centered
            >
                <Modal.Header>
                    <div className="d-flex w-100">
                        <div><h6 className="mb-0 mt-2">Send delivery info to customer.</h6></div>
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
                    <form onSubmit={handleSubmit(onSubmit)}>

                        {/* Delivered by */}
                        <div className="form-group mb-4">
                            {errors.deliveredBy && errors.deliveredBy.message ?
                                <p className="text-danger">{errors.deliveredBy && errors.deliveredBy.message}</p>
                                : <p>Delivered by</p>}

                            <input
                                type="text"
                                name="deliveredBy"
                                placeholder="Enter your name"
                                className="form-control shadow-none"
                                ref={register({ required: "Delivered by is required." })}
                            />
                        </div>

                        {/* Contact */}
                        <div className="form-group mb-4">
                            {errors.contact && errors.contact.message ?
                                <p className="text-danger">{errors.contact && errors.contact.message}</p>
                                : <p>Contact</p>}

                            <input
                                type="text"
                                name="contact"
                                placeholder="Enter contact number"
                                className="form-control shadow-none"
                                ref={register({ required: "Contact is required." })}
                            />
                        </div>

                        {/* Tracking ID */}
                        <div className="form-group mb-4">
                            {errors.trackingId && errors.trackingId.message ?
                                <p className="text-danger">{errors.trackingId && errors.trackingId.message}</p>
                                : <p>Tracking ID</p>}

                            <input
                                type="text"
                                name="trackingId"
                                placeholder="Enter tracking ID"
                                className="form-control shadow-none"
                                ref={register({ required: "Tracking ID is required." })}
                            />
                        </div>

                        <div className="text-right">
                            <button type="submit" className="btn shadow-none" disabled={isLoading}>{isLoading ? 'Sending...' : 'Send'}</button>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default Index;