import React from 'react'
import { useForm } from 'react-hook-form'

export const PaymentMethodForm = (props) => {
    const { register, handleSubmit, errors } = useForm()

    // Submit value
    const onSubmit = data => {
        let formData={
            ...data
        }
        if(props.paymentMethod === "Paid"){
            formData={
                paid_method:data.paid_method,
                reference:data.reference
            }
        }
        props.value(formData)
    }

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                {props.paymentMethod === "Paid" || props.paymentMethod === "Partial Paid" ?
                    <div className="row">

                        {/* Partial paid amount */}
                        {props.paymentMethod === "Partial Paid" ?
                            <div className="col-12 col-lg-6">
                                <div className="form-group mb-4">
                                    {errors.partial_paid_amount && errors.partial_paid_amount.message ?
                                        <p className="text-danger">{errors.partial_paid_amount && errors.partial_paid_amount.message}</p>
                                        : <p>Partial paid amount</p>}

                                    <input
                                        type="number"
                                        min={0}
                                        name="partial_paid_amount"
                                        className="form-control shadow-none"
                                        placeholder="Enter partial paid amount"
                                        // defaultValue={props.data && props.data.name ? props.data.name : null}
                                        ref={register({ required: "Partial paid amount is required" })}
                                    />
                                </div>
                            </div>
                            : null}

                        {/* Paid Method */}
                        <div className="col-12 col-lg-6">
                            <div className="form-group mb-4">
                                {errors.paid_method && errors.paid_method.message ?
                                    <p className="text-danger">{errors.paid_method && errors.paid_method.message}</p>
                                    : <p>Paid method</p>}

                                <input
                                    type="text"
                                    name="paid_method"
                                    className="form-control shadow-none"
                                    placeholder="Enter paid method"
                                    // defaultValue={props.data && props.data.name ? props.data.name : null}
                                    ref={register({ required: "Paid method is required" })}
                                />
                            </div>
                        </div>

                        {/* Reference / Transaction ID */}
                        {props.paymentMethod === "Partial Paid" ?
                            <div className="col-12">
                                <div className="form-group mb-4">
                                    {errors.reference && errors.reference.message ?
                                        <p className="text-danger">{errors.reference && errors.reference.message}</p>
                                        : <p>Reference / Transaction ID</p>}

                                    <input
                                        type="text"
                                        name="reference"
                                        className="form-control shadow-none"
                                        placeholder="Enter reference or transaction id"
                                        // defaultValue={props.data && props.data.name ? props.data.name : null}
                                        ref={register()}
                                    />
                                </div>
                            </div>
                            :
                            <div className="col-12 col-lg-6">
                                <div className="form-group mb-4">
                                    {errors.reference && errors.reference.message ?
                                        <p className="text-danger">{errors.reference && errors.reference.message}</p>
                                        : <p>Reference / Transaction ID</p>}

                                    <input
                                        type="text"
                                        name="reference"
                                        className="form-control shadow-none"
                                        placeholder="Enter reference or transaction id"
                                        // defaultValue={props.data && props.data.name ? props.data.name : null}
                                        ref={register()}
                                    />
                                </div>
                            </div>
                        }


                        {/* Submit button */}
                        <div className="col-12 text-center pt-3">
                            <button
                                type="submit"
                                className="btn shadow-none"
                                disabled={props.loading}
                            >{props.loading ? "Sumbmitting ..." : "Submit"}</button>
                        </div>

                    </div>
                    : null}
            </form>
        </div>
    );
}
