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
                onHide={props.onHide}
            >
                <Modal.Header>
                    <div className="d-flex w-100">
                        <div><h6 className="mb-0 mt-2">Change password.</h6></div>
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

                        {/* New password */}
                        <div className="form-group mb-4">
                            {errors.password && errors.password.message ? (
                                <p className="text-danger">{errors.password && errors.password.message}</p>
                            ) : <p>New password</p>}

                            <input
                                type="password"
                                name="password"
                                placeholder="Enter password"
                                className="form-control shadow-none"
                                ref={register({
                                    required: "New password is required.",
                                    minLength: {
                                        value: 8,
                                        message: "Minimun length 8 character"
                                    }
                                })}
                            />
                        </div>

                        <div className="text-right">
                            <button type="submit" className="btn shadow-none" disabled={props.loading}>{props.loading ? 'Loading ...' : 'Chnage'}</button>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default Index;