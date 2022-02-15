import React from 'react'
import { useForm } from 'react-hook-form'

export const CouponApply = (props) => {
    const { register, handleSubmit, errors } = useForm()

    // Submit coupon
    const onSubmit = data => props.value(data)

    return (
        <div className="coupon-container">
            <form onSubmit={handleSubmit(onSubmit)}>

                {props.message.type && props.message.value ?
                    <p className={props.message.type === "success" ? "text-success mb-1" : "text-danger mb-1"} style={{ fontSize: 12 }}>{props.message.value}</p>
                    : null}

                <div className="d-flex">
                    <div className="flex-fill pe-2">
                        <input
                            type="text"
                            name="code"
                            placeholder="Enter coupon code"
                            className={errors.code ? "form-control shadow-none errorr" : "form-control shadow-none"}
                            style={{ fontSize: 14, height: 43 }}
                            ref={register({ required: true })}
                        />
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="btn shadow-none rounded px-4 ml-2"
                            disabled={props.loading}>
                            {props.loading ? 'Applying...' : 'Apply'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
