import React, { useState, useRef } from 'react'
import './style.scss'
import Icon from 'react-icons-kit'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { chevronLeft } from 'react-icons-kit/feather'
import { SearchableSelect } from '../../components/select'
import { ExtractOption } from '../../utils/Helpers'
import Requests from '../../utils/Requests/Index'

const Create = () => {
    const selectInputRef = useRef()
    const { register, handleSubmit, errors } = useForm()
    const [isLoading, setLoading] = useState(false)
    const [elementErr, setElementErr] = useState(null)
    const [toggle, setToggle] = useState({ assignTo: null, items: [] })
    const [header] = useState({
        headers: { Authorization: "Bearer " + localStorage.getItem('token') }
    })

    // Handle Assign
    const handleAssign = async event => {
        if (selectInputRef.current) await selectInputRef.current.select.clearValue()
        setToggle({ assignTo: event.target.value, items: [] })
    }

    // Handle search
    const handleSearch = async ({ inputValue, field }) => {
        let response

        if (field === "category") {
            response = await Requests.Options.Category(inputValue, header)
        }

        if (field === "brand") {
            response = await Requests.Options.Brand(inputValue, header)
        }

        if (field === "vendor") {
            response = await Requests.Options.Vendor(inputValue, header)
        }

        if (field === "product") {
            response = await Requests.Options.Product(inputValue, header)
        }

        if (field === "customer") {
            response = await Requests.Options.Customer(inputValue, header)
        }

        if (response.data && response.data.length) return response.data
    }

    // Submit Form
    const onSubmit = async (data) => {

        if (toggle.assignTo && toggle.assignTo !== "Anything" && toggle.items.length < 1) {
            return setElementErr(`${toggle.assignTo} is required.`)
        }

        const formData = {
            ...data,
            assign: toggle
        }

        setLoading(true)
        await Requests.Coupon.Store(formData, header)
        setLoading(false)
    }

    return (
        <div className="store-coupon pb-4">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12 col-padding">
                        <div className="card border-0 shadow-sm">
                            <div className="card-header p-3 p-lg-4 bg-white">
                                <div className="d-flex">
                                    <div>
                                        <h6 className="mb-0">Create Coupon</h6>
                                    </div>
                                    <div className="ml-auto pt-2">
                                        <Link
                                            to="/dashboard/coupon"
                                            type="button"
                                            className="btn shadow-none rounded-circle"
                                        >
                                            <Icon icon={chevronLeft} size={22} />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body p-4">
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <div className="row">

                                        {/* Name */}
                                        <div className="col-12 col-lg-6">
                                            <div className="form-group mb-4">
                                                {errors.name && errors.name.message ? (
                                                    <p className="text-danger">{errors.name && errors.name.message}</p>
                                                ) : <p>Name</p>}

                                                <input
                                                    type="text"
                                                    name="name"
                                                    className="form-control shadow-none"
                                                    placeholder="Enter Coupon Name"
                                                    ref={register({
                                                        required: "Name is required"
                                                    })}
                                                />
                                            </div>
                                        </div>

                                        {/* Code */}
                                        <div className="col-12 col-lg-6">
                                            <div className="form-group mb-4">
                                                {errors.code && errors.code.message ? (
                                                    <p className="text-danger">{errors.code && errors.code.message}</p>
                                                ) : <p>Code</p>}

                                                <input
                                                    type="text"
                                                    name="code"
                                                    className="form-control shadow-none"
                                                    placeholder="Enter Coupon Code"
                                                    ref={register({
                                                        required: "Code is required"
                                                    })}
                                                />
                                            </div>
                                        </div>

                                        {/* Type */}
                                        <div className="col-12 col-lg-6">
                                            <div className="form-group mb-4">
                                                {errors.type && errors.type.message ? (
                                                    <p className="text-danger">{errors.type && errors.type.message}</p>
                                                ) : <p>Type</p>}

                                                <select
                                                    name="type"
                                                    className="form-control shadow-none"
                                                    ref={register({
                                                        required: "Type is required"
                                                    })}
                                                >
                                                    <option value="Flat">Flat</option>
                                                    <option value="Percentage">Percentage</option>
                                                </select>
                                            </div>
                                        </div>

                                        {/* Amount */}
                                        <div className="col-12 col-lg-6">
                                            <div className="form-group mb-4">
                                                {errors.amount && errors.amount.message ? (
                                                    <p className="text-danger">{errors.amount && errors.amount.message}</p>
                                                ) : <p>Amount</p>}

                                                <input
                                                    type="number"
                                                    name="amount"
                                                    className="form-control shadow-none"
                                                    placeholder="Enter amount"
                                                    ref={register({
                                                        required: "Amount is required"
                                                    })}
                                                />
                                            </div>
                                        </div>

                                        {/* Valid Till */}
                                        <div className="col-12 col-lg-6">
                                            <div className="form-group mb-4">
                                                {errors.validTill && errors.validTill.message ? (
                                                    <p className="text-danger">{errors.validTill && errors.validTill.message}</p>
                                                ) : <p>Valid Till</p>}

                                                <input
                                                    type="date"
                                                    name="validTill"
                                                    className="form-control shadow-none"
                                                    placeholder="Enter Coupon Validity"
                                                    ref={register({
                                                        required: "Valid date is required"
                                                    })}
                                                />
                                            </div>
                                        </div>

                                        {/* Uses limit */}
                                        <div className="col-12 col-lg-6">
                                            <div className="form-group mb-4">
                                                {errors.useLimit && errors.useLimit.message ?
                                                    <p className="text-danger">{errors.useLimit && errors.useLimit.message}</p>
                                                    : <p>Uses limitation</p>}

                                                <input
                                                    type="number"
                                                    name="useLimit"
                                                    className="form-control shadow-none"
                                                    placeholder="Enter limitation"
                                                    ref={register({ required: "Limitation is required" })}
                                                />
                                            </div>
                                        </div>

                                        {/* Minimum Value */}
                                        <div className="col-12 col-lg-6">
                                            <div className="form-group mb-4">
                                                <p>Minimum Value</p>

                                                <input
                                                    type="number"
                                                    name="priceDiscount"
                                                    className="form-control shadow-none"
                                                    placeholder="Enter price discount"
                                                    defaultValue={0}
                                                    ref={register()}
                                                />
                                            </div>
                                        </div>

                                        {/* Maximum Value */}
                                        <div className="col-12 col-lg-6">
                                            <div className="form-group mb-4">
                                                {errors.priceLimit && errors.priceLimit.message ?
                                                    <p className="text-danger">{errors.priceLimit && errors.priceLimit.message}</p>
                                                    : <p>Maximum Value</p>}

                                                <input
                                                    type="number"
                                                    name="priceLimit"
                                                    className="form-control shadow-none"
                                                    placeholder="Enter limitation"
                                                    ref={register({ required: "Discount limitation is required" })}
                                                />
                                            </div>
                                        </div>


                                        {/* Assign To */}
                                        <div className="col-12">
                                            <div className="form-group mb-4">
                                                {errors.assignTo && errors.assignTo.message ?
                                                    <p className="text-danger">{errors.assignTo && errors.assignTo.message}</p>
                                                    : <p>Assign To</p>}

                                                <select
                                                    name="assignTo"
                                                    className="form-control shadow-none"
                                                    ref={register({ required: "Assign to is required" })}
                                                    onChange={handleAssign}
                                                >
                                                    <option value="">-- Select option --</option>
                                                    {[
                                                        'Anything',
                                                        'Brand',
                                                        'Category',
                                                        'Vendor',
                                                        'Product',
                                                        'Customer'
                                                    ].map((item, i) =>
                                                        <option key={i} value={item}>{item}</option>
                                                    )}
                                                </select>
                                            </div>
                                        </div>

                                        {/* Category */}
                                        {toggle.assignTo === 'Category' ?
                                            <div className="col-12">
                                                <div className="form-group mb-4">
                                                    {elementErr ? <p className="text-danger">{elementErr}</p> : <p>Category</p>}

                                                    <SearchableSelect
                                                        isMulti
                                                        borderRadius={4}
                                                        placeholder="Select category"
                                                        search={inputValue => handleSearch({ inputValue, field: "category" })}
                                                        values={data => {
                                                            setToggle(exToggle => ({ ...exToggle, items: ExtractOption(data) }))
                                                            setElementErr(null)
                                                        }}
                                                    />
                                                </div>
                                            </div>

                                            // Brand
                                            : toggle.assignTo === 'Brand' ?
                                                <div className="col-12">
                                                    <div className="form-group mb-4">
                                                        {elementErr ? <p className="text-danger">{elementErr}</p> : <p>Brand</p>}

                                                        <SearchableSelect
                                                            isMulti
                                                            borderRadius={4}
                                                            placeholder="Select brand"
                                                            search={inputValue => handleSearch({ inputValue, field: "brand" })}
                                                            values={data => {
                                                                setToggle(exToggle => ({ ...exToggle, items: ExtractOption(data) }))
                                                                setElementErr(null)
                                                            }}
                                                        />
                                                    </div>
                                                </div>

                                                // Vendor
                                                : toggle.assignTo === 'Vendor' ?
                                                    <div className="col-12">
                                                        <div className="form-group mb-4">
                                                            {elementErr ? <p className="text-danger">{elementErr}</p> : <p>Vendor</p>}

                                                            <SearchableSelect
                                                                isMulti
                                                                borderRadius={4}
                                                                placeholder="Select vendor"
                                                                search={inputValue => handleSearch({ inputValue, field: "vendor" })}
                                                                values={data => {
                                                                    setToggle(exToggle => ({ ...exToggle, items: ExtractOption(data) }))
                                                                    setElementErr(null)
                                                                }}
                                                            />
                                                        </div>
                                                    </div>

                                                    // Product
                                                    : toggle.assignTo === 'Product' ?
                                                        <div className="col-12">
                                                            <div className="form-group mb-4">
                                                                {elementErr ? <p className="text-danger">{elementErr}</p> : <p>Product</p>}

                                                                <SearchableSelect
                                                                    isMulti
                                                                    borderRadius={4}
                                                                    placeholder="Select product"
                                                                    search={inputValue => handleSearch({ inputValue, field: "product" })}
                                                                    values={data => {
                                                                        setToggle(exToggle => ({ ...exToggle, items: ExtractOption(data) }))
                                                                        setElementErr(null)
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>

                                                        // Customer
                                                        : toggle.assignTo === 'Customer' ?
                                                            <div className="col-12">
                                                                <div className="form-group mb-4">
                                                                    {elementErr ? <p className="text-danger">{elementErr}</p> : <p>Customer</p>}

                                                                    <SearchableSelect
                                                                        isMulti
                                                                        borderRadius={4}
                                                                        placeholder="Select customer"
                                                                        search={inputValue => handleSearch({ inputValue, field: "customer" })}
                                                                        values={data => {
                                                                            setToggle(exToggle => ({ ...exToggle, items: ExtractOption(data) }))
                                                                            setElementErr(null)
                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>
                                                            : null}


                                        {/* Inside Dhaka */}
                                        <div className="col-12 col-lg-6">
                                            <div className="form-group mb-4">
                                                <p>Inside Dhaka</p>

                                                <input
                                                    type="number"
                                                    name="insideDhaka"
                                                    className="form-control shadow-none"
                                                    placeholder="Enter amount"
                                                    defaultValue={0}
                                                    ref={register()}
                                                />
                                            </div>
                                        </div>

                                        {/* Outside Dhaka */}
                                        <div className="col-12 col-lg-6">
                                            <div className="form-group mb-4">
                                                <p>Outside Dhaka</p>

                                                <input
                                                    type="number"
                                                    name="outsideDhaka"
                                                    className="form-control shadow-none"
                                                    placeholder="Enter amount"
                                                    defaultValue={0}
                                                    ref={register()}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <button type="submit" className="btn shadow-none" disabled={isLoading}>
                                            {isLoading ? 'Creating...' : 'Create'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Create;