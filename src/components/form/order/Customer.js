import React from 'react'
import { useForm } from 'react-hook-form'

export const Customer = (props) => {
    const { register, handleSubmit, errors } = useForm()


    // Submit value
    const onSubmit = data => {
        props.value(data)
    }

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row">

                    {/* Name */}
                    <div className="col-12 col-lg-6">
                        <div className="form-group mb-4">
                            {errors.name && errors.name.message ?
                                <p className="text-danger">{errors.name && errors.name.message}</p>
                                : <p>Name</p>}

                            <input
                                type="text"
                                name="name"
                                className="form-control shadow-none"
                                placeholder="Enter name"
                                defaultValue={props.data && props.data.name ? props.data.name : null}
                                ref={register({ required: "Name is required" })}
                            />
                        </div>
                    </div>

                    {/* E-mail */}
                    <div className="col-12 col-lg-6">
                        <div className="form-group mb-4">
                            {errors.email && errors.email.message ?
                                <p className="text-danger">{errors.email && errors.email.message}</p>
                                : <p>E-mail</p>}

                            <input
                                type="text"
                                name="email"
                                className="form-control shadow-none"
                                placeholder="Enter e-mail"
                                defaultValue={props.data && props.data.email ? props.data.email : null}
                                ref={register({
                                    required: "E-mail is required",
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "Invalid email address"
                                    }
                                })}
                            />
                        </div>
                    </div>

                    {/* Phone */}
                    <div className="col-12 col-lg-6">
                        <div className="form-group mb-4">
                            {errors.phone && errors.phone.message ?
                                <p className="text-danger">{errors.phone && errors.phone.message}</p>
                                : <p>Phone</p>}

                            <input
                                type="text"
                                name="phone"
                                className="form-control shadow-none"
                                placeholder="Enter phone number"
                                defaultValue={props.data && props.data.phone ? props.data.phone : null}
                                ref={register({
                                    required: "Phone is required",
                                    pattern: {
                                        value: /^(?:\+88|01)?\d+$/,
                                        message: "Phone number is not valid."
                                    }
                                })}
                            />
                        </div>
                    </div>

                    {/* Payment method */}
                    {/* <div className="col-12 col-lg-6">
                        <div className="form-group mb-4">
                            {errors.paymentMethod && errors.paymentMethod.message ?
                                <p className="text-danger">{errors.paymentMethod && errors.paymentMethod.message}</p>
                                : <p>Payment method</p>}

                            <select
                                name="paymentMethod"
                                className="form-control shadow-none"
                                ref={register({ required: "Payment method is required" })}
                            >
                                <option value="">--- Select Option ---</option>
                                <option value="COD">COD</option>
                                <option value="SSLCOMMERZ">SSLCOMMERZE</option>
                            </select>
                        </div>
                    </div> */}

                    {/* Delivery Address */}
                    <div className="col-12 col-lg-6">
                        <div className="form-group mb-4">
                            {errors.deliveryAddress && errors.deliveryAddress.message ?
                                <p className="text-danger">{errors.deliveryAddress && errors.deliveryAddress.message}</p>
                                : <p>Delivery Address</p>}

                            <input
                                type="text"
                                name="deliveryAddress"
                                className="form-control shadow-none"
                                placeholder="Enter address"
                                defaultValue={props.data && props.data.deliveryAddress ? props.data.deliveryAddress : null}
                                ref={register({ required: "Address is required" })}
                            />
                        </div>
                    </div>

                    {/* Submit button */}
                    <div className="col-12 text-center pt-3">
                        <button
                            type="submit"
                            className="btn shadow-none"
                            disabled={props.loading}
                        >{props.loading ? "Creating ..." : "Create Order"}</button>
                    </div>

                </div>
            </form>
        </div>
    );
}
