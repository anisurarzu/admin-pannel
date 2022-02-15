import React, { useState, useEffect, useCallback, useRef } from 'react'
import './style.scss'
import Icon from 'react-icons-kit'
import { Link, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { chevronLeft } from 'react-icons-kit/feather'
import { MultiSelect } from '../../components/select'
import { DatePicker } from '../../components/datepicker/Index'
import { PreLoader } from '../../components/loading/Index'
import Requests from '../../utils/Requests/Index'

const Edit = () => {
    const selectInputRef = useRef()
    const { register, handleSubmit, errors } = useForm()
    const { id } = useParams()
    const [isLoading, setLoading] = useState(true)
    const [isUpdate, setUpdate] = useState(false)
    const [coupon, setCoupon] = useState(null)
    const [elementErr, setElementErr] = useState(null)

    const [category, setCategory] = useState({ value: [], options: [] })
    const [brand, setBrand] = useState({ value: [], options: [] })
    const [vendor, setVendor] = useState({ value: [], options: [] })
    const [product, setProduct] = useState({ value: [], options: [] })
    const [customer, setCustomer] = useState({ value: [], options: [] })

    const [header] = useState({
        headers: { Authorization: "Bearer " + localStorage.getItem('token') }
    })

    // Fetch data
    const fetchData = useCallback(async () => {
        const data = await Requests.Coupon.Show(id, header)
        const response = await Requests.Options.Index(header)

        if (data) setCoupon(data)
        if (response) {
            setCategory(exCategory => ({ ...exCategory, options: response.mainCategories }))
            setBrand(exBrand => ({ ...exBrand, options: response.brands }))
            setVendor(exVendor => ({ ...exVendor, options: response.vendors }))
            setProduct(exProduct => ({ ...exProduct, options: response.products }))
            setCustomer(exCustomer => ({ ...exCustomer, options: response.customers }))
        }

        setLoading(false)
    }, [id, header])

    useEffect(() => {
        fetchData()
    }, [id, header, fetchData])

    // filter & return only ID from selected array
    const getId = data => {
        let values = []
        if (data.length) {
            for (let i = 0; i < data.length; i++) {
                const element = data[i]
                if (element._id) {
                    values.push(element._id)
                } else if (element.value) {
                    values.push(element.value)
                } else {
                    values.push(element)
                }
            }
            return values
        }
    }

    // Handle assign to
    const handleAssignTo = async (event) => {
        if (selectInputRef.current) {
            await selectInputRef.current.select.clearValue()
        }

        if (event.target.value === 'Anything') {
            setCoupon({ ...coupon, brands: null, categories: null, vendors: null, products: null, customers: null })
        }
        setCoupon({ ...coupon, assignTo: event.target.value })
    }

    // Handle category
    const handleCategory = async (data) => {
        const values = await getId(data)
        setCoupon({ ...coupon, brands: null, categories: values, vendors: null, products: null, customers: null })
    }

    // Handle brand
    const handleBrandSelect = async (data) => {
        const values = await getId(data)
        setCoupon({ ...coupon, brands: values, categories: null, vendors: null, products: null, customers: null })
    }

    // Handle vendor
    const handleVendor = async (data) => {
        const values = await getId(data)
        setCoupon({ ...coupon, brands: null, categories: null, vendors: values, products: null, customers: null })
    }

    // Handle product
    const handleProduct = async (data) => {
        const values = await getId(data)
        setCoupon({ ...coupon, brands: null, categories: null, vendors: null, products: values, customers: null })
    }

    // Handle customer
    const handleCustomer = async (data) => {
        const values = await getId(data)
        setCoupon({ ...coupon, brands: null, categories: null, vendors: null, products: null, customers: values })
    }

    // Submit Form
    const onSubmit = async (data) => {
        if (coupon.assignTo === 'Brand' && !coupon.brands) {
            setElementErr({ ...elementErr, message: 'Select brand.' })
            return
        } else if (coupon.assignTo === 'Category' && !coupon.categories) {
            setElementErr({ ...elementErr, message: 'Select category.' })
            return
        } else if (coupon.assignTo === 'Vendor' && !coupon.vendors) {
            setElementErr({ ...elementErr, message: 'Select vendor.' })
            return
        } else if (coupon.assignTo === 'Product' && !coupon.products) {
            setElementErr({ ...elementErr, message: 'Select product.' })
            return
        } else if (coupon.assignTo === 'Customer' && !coupon.customers) {
            setElementErr({ ...elementErr, message: 'Select customer.' })
            return
        } else {
            setElementErr(null)
        }

        setUpdate(true)
        const couponData = {
            name: coupon.name,
            code: coupon.code,
            type: coupon.type,
            amount: coupon.amount,
            validTill: coupon.validTill,
            assignTo: coupon.assignTo,
            brands: coupon.brands && coupon.brands.length ? JSON.stringify(getId(coupon.brands)) : null,
            categories: coupon.categories && coupon.categories.length ? JSON.stringify(getId(coupon.categories)) : null,
            vendors: coupon.vendors && coupon.vendors.length ? JSON.stringify(getId(coupon.vendors)) : null,
            products: coupon.products && coupon.products.length ? JSON.stringify(getId(coupon.products)) : null,
            customers: coupon.customers && coupon.customers.length ? JSON.stringify(getId(coupon.customers)) : null,
            useLimit: data.useLimit,
            priceDiscount:data.priceDiscount,
            priceLimit: data.priceLimit,
            insideDhaka: data.insideDhaka,
            outsideDhaka: data.outsideDhaka
        }

        await Requests.Coupon.Update(id, couponData, header)
        setUpdate(false)
    }

    if (isLoading) return <PreLoader />

    return (
        <div className="store-coupon pb-4">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12 col-padding">
                        <div className="card border-0 shadow-sm">
                            <div className="card-header p-3 p-lg-4 bg-white">
                                <div className="d-flex">
                                    <div>
                                        <h6 className="mb-0">Edit {coupon.name}</h6>
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
                                                    defaultValue={coupon.name}
                                                    className="form-control shadow-none"
                                                    placeholder="Enter Coupon Name"
                                                    ref={register({ required: "Name is required" })}
                                                    onChange={(event) => setCoupon({ ...coupon, name: event.target.value })}
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
                                                    defaultValue={coupon.code}
                                                    className="form-control shadow-none"
                                                    placeholder="Enter Coupon Code"
                                                    ref={register({ required: "Code is required" })}
                                                    onChange={(event) => setCoupon({ ...coupon, code: event.target.value })}
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
                                                    defaultValue={coupon.type}
                                                    className="form-control shadow-none"
                                                    ref={register({ required: "Type is required" })}
                                                    onChange={(event) => setCoupon({ ...coupon, type: event.target.value })}
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
                                                    defaultValue={coupon.amount}
                                                    className="form-control shadow-none"
                                                    placeholder="Enter amount"
                                                    ref={register({ required: "Amount is required" })}
                                                    onChange={(event) => setCoupon({ ...coupon, amount: event.target.value })}
                                                />
                                            </div>
                                        </div>

                                        {/* Valid Till */}
                                        <div className="col-12 col-lg-6">
                                            <div className="form-group mb-4">
                                                {errors.validTill && errors.validTill.message ? (
                                                    <p className="text-danger">{errors.validTill && errors.validTill.message}</p>
                                                ) : <p>Valid Till</p>}

                                                <DatePicker
                                                    deafultValue={coupon.validTill}
                                                    selected={(data) => setCoupon({ ...coupon, validTill: data })}
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
                                                    defaultValue={coupon.useLimit}
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
                                                    defaultValue={coupon.priceDiscount}
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
                                                    defaultValue={coupon.priceLimit}
                                                    ref={register({ required: "Discount limitation is required" })}
                                                />
                                            </div>
                                        </div>


                                        {/* Discount limit */}
                                        {/* <div className="col-12 col-lg-6">
                                            <div className="form-group mb-4">
                                                {errors.priceLimit && errors.priceLimit.message ?
                                                    <p className="text-danger">{errors.priceLimit && errors.priceLimit.message}</p>
                                                    : <p>Discount limitation</p>}

                                                <input
                                                    type="number"
                                                    name="priceLimit"
                                                    className="form-control shadow-none"
                                                    placeholder="Enter limitation"
                                                    defaultValue={coupon.priceLimit}
                                                    ref={register({ required: "Discount limitation is required" })}
                                                />
                                            </div>
                                        </div> */}

                                        {/* Assign To */}
                                        <div className="col-12">
                                            <div className="form-group mb-4">
                                                <p>Assign To</p>

                                                <select
                                                    name="assignTo"
                                                    className="form-control shadow-none"
                                                    defaultValue={coupon.assignTo}
                                                    onChange={handleAssignTo}
                                                >
                                                    <option value="Anything">Anything</option>
                                                    <option value="Brand">Brand</option>
                                                    <option value="Category">Category</option>
                                                    <option value="Vendor">Vendor</option>
                                                    <option value="Product">Product</option>
                                                    <option value="Customer">Customer</option>
                                                </select>
                                            </div>
                                        </div>

                                        {/* Category */}
                                        {coupon.assignTo === 'Category' ?
                                            <div className="col-12">
                                                <div className="form-group mb-4">
                                                    {elementErr && elementErr.message ? <p className="text-danger">{elementErr.message}</p> : <p>Category</p>}

                                                    <MultiSelect
                                                        refs={selectInputRef}
                                                        placeholder={'category'}
                                                        options={category.options}
                                                        values={handleCategory}
                                                        deafult={coupon.categories}
                                                    />
                                                </div>
                                            </div>

                                            // Brand
                                            : coupon.assignTo === 'Brand' ?
                                                <div className="col-12">
                                                    <div className="form-group mb-4">
                                                        {elementErr && elementErr.message ? <p className="text-danger">{elementErr.message}</p> : <p>Brand</p>}

                                                        <MultiSelect
                                                            refs={selectInputRef}
                                                            placeholder={'brand'}
                                                            options={brand.options}
                                                            deafult={coupon.brands}
                                                            values={handleBrandSelect}
                                                        />
                                                    </div>
                                                </div>

                                                // Vendor
                                                : coupon.assignTo === 'Vendor' ?
                                                    <div className="col-12">
                                                        <div className="form-group mb-4">
                                                            {elementErr && elementErr.message ? <p className="text-danger">{elementErr.message}</p> : <p>Vendor</p>}

                                                            <MultiSelect
                                                                refs={selectInputRef}
                                                                placeholder={'vendor'}
                                                                options={vendor.options}
                                                                deafult={coupon.vendors}
                                                                values={handleVendor}
                                                            />
                                                        </div>
                                                    </div>

                                                    // Product
                                                    : coupon.assignTo === 'Product' ?
                                                        <div className="col-12">
                                                            <div className="form-group mb-4">
                                                                {elementErr && elementErr.message ? <p className="text-danger">{elementErr.message}</p> : <p>Product</p>}

                                                                <MultiSelect
                                                                    refs={selectInputRef}
                                                                    placeholder={'product'}
                                                                    options={product.options}
                                                                    deafult={coupon.products}
                                                                    values={handleProduct}
                                                                />
                                                            </div>
                                                        </div>

                                                        // Customer
                                                        : coupon.assignTo === 'Customer' ?
                                                            <div className="col-12">
                                                                <div className="form-group mb-4">
                                                                    {elementErr && elementErr.message ? <p className="text-danger">{elementErr.message}</p> : <p>Customer</p>}

                                                                    <MultiSelect
                                                                        refs={selectInputRef}
                                                                        placeholder={'customer'}
                                                                        options={customer.options}
                                                                        deafult={coupon.customers}
                                                                        values={handleCustomer}
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
                                                    defaultValue={coupon.insideDhaka}
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
                                                    defaultValue={coupon.outsideDhaka}
                                                    ref={register()}
                                                />
                                            </div>
                                        </div>



                                        <div className="col-12 text-right">
                                            <button type="submit" className="btn shadow-none" disabled={isUpdate}>
                                                {isUpdate ? 'Updating...' : 'Update'}
                                            </button>
                                        </div>

                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Edit;