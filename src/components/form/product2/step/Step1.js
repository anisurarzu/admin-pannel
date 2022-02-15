import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { CustomButton } from '../../../button'
import { Container } from '../../../container'
import { SearchableSelect } from '../../../select'

import Requests from '../../../../utils/Requests/Index'

export const Step1 = (props) => {
    const { register, handleSubmit, errors } = useForm()
    const [vendor, setVendor] = useState({ value: null, error: null })
    const [brand, setBrand] = useState({ value: null })
    const [header] = useState({ headers: { Authorization: "Bearer " + localStorage.getItem('token') } })

    // Handle filter
    const handleFilter = async ({ inputValue, field }) => {
        let response

        if (field === "brand") response = await Requests.Options.Brand(inputValue, header)
        if (field === "vendor") response = await Requests.Options.Vendor(inputValue, header)

        if (response.data && response.data.length) return response.data
        return []
    }

    // Submit Data & go next
    const onSubmit = async (data) => {
        if (!vendor.value) return setVendor({ value: null, error: 'Vendor is required' })

        const formData = {
            ...data,
            vendor: vendor.value,
            brand: brand.value
        }

        console.log(formData)
        props.nextStep()
    }


    return (
        <div>
            <h6 className="text-muted mb-3">{props.title}</h6>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Container.Row>

                    {/* Name */}
                    <Container.Column>
                        <div className="form-group mb-4">
                            {errors.name && errors.name.message ? (
                                <p className="text-danger">{errors.name && errors.name.message}</p>
                            ) : <p>Name</p>}

                            <input
                                type="text"
                                name="name"
                                className="form-control shadow-none"
                                placeholder="Enter product name"
                                ref={register({ required: "Name is required" })}
                            />
                        </div>
                    </Container.Column>

                    {/* Vendor */}
                    <Container.Column>
                        <div className="form-group mb-4">
                            {vendor.error ? <p className="text-danger">{vendor.error}</p> : <p>Vendor</p>}

                            <SearchableSelect
                                borderRadius={4}
                                placeholder={'Select vendor'}
                                search={inputValue => handleFilter({ inputValue, field: "vendor" })}
                                values={data => setVendor({ ...vendor, value: data.value, error: null })}
                            />
                        </div>
                    </Container.Column>

                    {/* Brand */}
                    <Container.Column>
                        <div className="form-group mb-4">
                            <p>Brand</p>

                            <SearchableSelect
                                borderRadius={4}
                                placeholder={'Select brand'}
                                search={inputValue => handleFilter({ inputValue, field: "brand" })}
                                values={data => setBrand({ ...vendor, value: data.value, error: null })}
                            />
                        </div>
                    </Container.Column>

                    {/* Submit & go next */}
                    <Container.Column className="text-right">
                        <CustomButton
                            type="submit"
                            className="btn-success border-0"
                        >Next</CustomButton>
                    </Container.Column>

                </Container.Row>
            </form>
        </div>
    );
}
