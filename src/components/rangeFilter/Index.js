import React, { useState } from 'react'
import './style.scss'
import { useForm } from 'react-hook-form'

export const RangeFilter = (props) => {
    const { register, handleSubmit } = useForm()
    const [error, setError] = useState(false)

    const onSubmit = async (data) => {
        if (data.from || data.to) {
            props.filter(data)
            return setError(false)
        }
        return setError(true)
    }

    return (
        <div>
            <form className="form-sm" onSubmit={handleSubmit(onSubmit)}>
                <div className="d-md-flex">
                    
                    {/* From */}
                    <div className="mb-2 mb-lg-0">
                        <input
                            type="date"
                            name="start_from"
                            ref={register()}
                            className={error ? "form-control shadow-none error" : "form-control shadow-none"}
                        />
                    </div>
                    <div className="px-1 pb-1 pt-md-2 pb-md-0"><p className="mb-0">To</p></div>

                    {/* To */}
                    <div className="mb-2 mb-lg-0">
                        <input
                            type="date"
                            name="end_to"
                            ref={register()}
                            className={error ? "form-control shadow-none error" : "form-control shadow-none"}
                        />
                    </div>

                    <div className="text-right pl-md-2">
                        <button type="submit" className="btn shadow-none px-4" disabled={props.loading}>{props.loading ? 'Loading ...' : 'Filter'}</button>
                    </div>
                </div>
            </form>
        </div>
    );
};