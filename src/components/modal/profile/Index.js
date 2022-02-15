import React from 'react'
import './style.scss'
import { Icon } from 'react-icons-kit'
import Modal from 'react-bootstrap/Modal'
import { useForm } from 'react-hook-form'
import { ic_clear } from 'react-icons-kit/md'

const Index = (props) => {
    const { register, handleSubmit, errors } = useForm()

    // Submit Form
    const onSubmit = data => props.update(data)

    return (
        <div>
            <Modal
                show={props.show}
                dialogClassName="custom-profile-modal"
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header>
                    <div className="d-flex w-100">
                        <div><h6 className="mb-0 mt-2">Edit Info.</h6></div>
                        <div className="ml-auto">
                            <button
                                type="button"
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
                        {/* Name */}
                        <div className="form-group mb-4">
                            {errors.name && errors.name.message ? (
                                <p className="text-danger">{errors.name && errors.name.message}</p>
                            ) : <p>Name</p>}

                            <input
                                type="text"
                                name="name"
                                defaultValue={props.data.name}
                                placeholder="Enter your name"
                                className="form-control shadow-none"
                                ref={register({ required: "Name is required." })}
                            />
                        </div>

                        {/* Present address */}
                        <div className="form-group mb-4">
                            {errors.presentAddress && errors.presentAddress.message ? (
                                <p className="text-danger">{errors.presentAddress && errors.presentAddress.message}</p>
                            ) : <p>Present address</p>}

                            <input
                                type="text"
                                name="presentAddress"
                                placeholder="Enter address"
                                className="form-control shadow-none"
                                defaultValue={props.data.address.presentAddress}
                                ref={register({ required: "Present address is required." })}
                            />
                        </div>

                        {/* Permanent address */}
                        <div className="form-group mb-4">
                            {errors.permanentAddress && errors.permanentAddress.message ? (
                                <p className="text-danger">{errors.permanentAddress && errors.permanentAddress.message}</p>
                            ) : <p>Permanent address</p>}

                            <input
                                type="text"
                                name="permanentAddress"
                                placeholder="Enter address"
                                className="form-control shadow-none"
                                defaultValue={props.data.address.permanentAddress}
                                ref={register({ required: "Permanent address is required." })}
                            />
                        </div>

                        <div className="text-right">
                            <button type="submit" className="btn shadow-none" disabled={props.loading}>{props.loading ? 'Updating...' : 'Update'}</button>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default Index;