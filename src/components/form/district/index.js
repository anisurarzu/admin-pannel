import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Text } from '../../text'
import { FormGroup } from '../../formGroup'
import { CustomButton } from '../../button'
import { MultiSelect } from '../../select'

export const DistrictForm = (props) => {
    const { register, handleSubmit, setError, errors } = useForm()
    const [areas, setAreas] = useState([])

    // Submit Form
    const onSubmit = data => {
        if (!areas.length) {
            return setError("areas", {
                type: "manual",
                message: "Area is require"
            })
        }

        const formData = {
            ...data,
            areas
        }

        console.log(formData)
    }

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>

                {/* Name */}
                <FormGroup>
                    {errors.name && errors.name.message ?
                        <Text className="mb-0 fs-13 text-danger">{errors.name.message}</Text> :
                        <Text className="mb-0 fs-13 text-muted">District name</Text>
                    }

                    <input
                        type="text"
                        name="name"
                        className="form-control shadow-none"
                        placeholder="Enter district name"
                        defaultValue={props.data ? props.data.name : null}
                        ref={register({ required: "Name is required" })}
                    />
                </FormGroup>

                {/* Bengali Name */}
                <FormGroup>
                    {errors.bn_name && errors.bn_name.message ?
                        <Text className="mb-0 fs-13 text-danger">{errors.bn_name.message}</Text> :
                        <Text className="mb-0 fs-13 text-muted">Bengali name</Text>
                    }

                    <input
                        type="text"
                        name="bn_name"
                        className="form-control shadow-none"
                        placeholder="Enter bengali name"
                        defaultValue={props.data ? props.data.bn_name : null}
                        ref={register({ required: "Bengali name is required" })}
                    />
                </FormGroup>

                {/* Area */}
                <FormGroup>
                    {errors.areas && errors.areas.message ?
                        <Text className="mb-0 fs-13 text-danger">{errors.areas.message}</Text> :
                        <Text className="mb-0 fs-13 text-muted">Area</Text>
                    }

                    <MultiSelect
                        placeholder="area"
                        options={[]}
                        values={event => console.log(event)}
                    // value={event => {
                    //     setAreas(event.value)
                    //     clearErrors("area")
                    // }}
                    />
                </FormGroup>


                {/* Submit button */}
                <div className="text-right">
                    <CustomButton
                        type="submit"
                        className="btn-primary border-0"
                        disabled={props.loading}
                    >
                        <Text className="fs-15 mb-0">{props.loading ? "Creating..." : "Create"}</Text>
                    </CustomButton>
                </div>
            </form>
        </div>
    );
}
