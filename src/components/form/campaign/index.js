import React, { useState, useRef } from 'react'
// import DatePicker from 'react-datepicker'
import TimePicker from 'react-time-picker'
import { Form } from 'react-bootstrap'
import { Controller, useForm } from 'react-hook-form'

import { SearchableSelect } from '../../select'
import { SingleFileUploader } from '../../fileUploader/Index'
import Requests from '../../../utils/Requests/Index'
import { DatePickerNew } from '../../datePickerNew/Index'

const BASE_URL_SM = "https://campaign.api.eazybest.com/uploads/campaign/sm/"
const BASE_URL_LG = "https://campaign.api.eazybest.com/uploads/campaign/lg/"


export const CampaignForm = (props) => {
    const onClearRef = useRef()
    const { control, register, handleSubmit, errors, setError, clearErrors } = useForm()
    const [smImage, setSmImage] = useState(props.data ? BASE_URL_SM + props.data.banner_sm : null)
    const [lgImage, setLgImage] = useState(props.data ? BASE_URL_LG + props.data.banner_lg : null)
    const [smImageEdit, setSmImageEdit] = useState({ value: null, error: null })
    const [lgImageEdit, setLgImageEdit] = useState({ value: null, error: null })
    const [startDate, setStartDate] = useState(props.data && props.data.start_from_date ? props.data.start_from_date : new Date());
    const [endDate, setEndDate] = useState(props.data && props.data.end_to_date ? props.data.end_to_date : new Date());

    const [assignTo, setAssignTo] = useState(props.data ? props.data.assign_to : 'Brand')
    const [assignItems, setAssignItems] = useState(
        props.data ?
            [...props.data.assign_items.map(item => { return item._id })]
            : []
    )

    const [header] = useState({
        headers: { Authorization: "Bearer " + localStorage.getItem('token') }
    })

    /* handle search */
    const handleSearch = async (data) => {
        try {
            let response
            let results = []

            if (assignTo === "Brand") {
                response = await Requests.Options.Brand(data, header)
            }

            else if (assignTo === "Category") {
                response = await Requests.Options.Category(data, header)
            }

            else if (assignTo === "Sub-category") {
                response = await Requests.Options.SubCategory(data, header)
            }

            else if (assignTo === "Leaf-category") {
                response = await Requests.Options.LeafCategory(data, header)
            }

            else if (assignTo === "Vendor") {
                response = await Requests.Options.Vendor(data, header)
            }

            else if (assignTo === "Product") {
                response = await Requests.Options.Product(data, header)
            }

            else {
                results = []
            }

            if (response && response.data && response.data.length > 0) {
                for (let i = 0; i < response.data.length; i++) {
                    const element = response.data[i]
                    results.push({
                        value: element.value,
                        label: element.label
                    })
                }
            }

            return results
        } catch (error) {
            if (error) {
                console.log(error.response)
            }
        }
    }

    /* submit form */
    const onSubmit = async (data) => {
        let is_error = false

        if (!smImage) {
            setError("banner_sm", {
                type: "manual",
                message: "Small banner is required."
            })
            is_error = true
        }

        if (!lgImage) {
            setError("banner_lg", {
                type: "manual",
                message: "Large banner is required."
            })
            is_error = true
        }

        if (!assignItems.length) {
            setError("assign_items", {
                type: "manual",
                message: `${assignTo} is required.`
            })
            is_error = true
        }

        // Time validation check
        if (data.start_time && data.end_time && startDate && endDate) {
            if (Date.parse(startDate) === Date.parse(endDate)) {
                if (data.start_time > data.end_time) {
                    setError("end_time", {
                        type: "manual",
                        message: `End time is smaller or before time from the start time.`
                    })
                    is_error = true
                }
            }
        }

        // Maximum amount validation check
        if (data.min_order_amount && data.max_order_amount) {
            if (parseInt(data.min_order_amount) > parseInt(data.max_order_amount)) {
                setError("max_order_amount", {
                    type: "manual",
                    message: `Maximum order amount is smaller than the minimum order amount.`
                })
                is_error = true
            }
        }

        // Maximum quantity validation check
        if (data.min_quantity && data.max_quantity) {
            if (parseInt(data.min_quantity) > parseInt(data.max_quantity)) {
                setError("max_quantity", {
                    type: "manual",
                    message: `Maximum quantity is smaller than the minimum quantity.`
                })
                is_error = true
            }
        }

        if (is_error) return

        let formData = new FormData()
        formData.append('title', data.title)
        formData.append('description', data.description)

        formData.append('start_from_date', startDate)
        formData.append('end_to_date', endDate)
        formData.append('start_time', data.start_time)
        formData.append('end_time', data.end_time)

        formData.append('discount_type', data.discount_type)
        formData.append('discount_amount', data.discount_amount)
        formData.append('min_order_amount', data.min_order_amount)
        formData.append('max_order_amount', data.max_order_amount)
        formData.append('min_quantity', data.min_quantity)
        formData.append('max_quantity', data.max_quantity)
        formData.append('assign_to', data.assign_to)
        formData.append('is_active', data.is_active)
        formData.append('is_cod_button_hidden', data.is_cod_button_hidden)
        formData.append('assign_items', JSON.stringify(assignItems))
        formData.append('banner_sm', smImage)
        formData.append('banner_lg', lgImage)


        props.onSubmit(formData)
        console.log(assignItems)
    }

    /* submit update */
    const onSubmitImages = () => {
        let is_error = false

        if (!smImageEdit.value) {
            setSmImageEdit({ ...smImageEdit, error: "Small banner is required." })
            is_error = true
        }

        if (!lgImageEdit.value) {
            setLgImageEdit({ ...lgImageEdit, error: "Large banner is required." })
            is_error = true
        }

        if (is_error) return

        let formData = new FormData()
        formData.append('banner_sm', smImageEdit.value)
        formData.append('banner_lg', lgImageEdit.value)

        props.onImgSubmit(formData)
    }


    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>

                <div className="row">

                    {/* Title */}
                    <div className="col-12">
                        <div className="form-group mb-4">
                            {errors.title && errors.title.message ? (
                                <p className="text-danger">{errors.title && errors.title.message}</p>
                            ) : <p>Title</p>}

                            <input
                                type="text"
                                name="title"
                                className="form-control shadow-none"
                                placeholder="Enter campaign title"
                                defaultValue={props.data ? props.data.title : null}
                                ref={register({ required: "Title is required" })}
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div className="col-12">
                        <div className="form-group mb-4">
                            {errors.description && errors.description.message ? (
                                <p className="text-danger">{errors.description && errors.description.message}</p>
                            ) : <p>Description</p>}

                            <textarea
                                type="text"
                                rows={4}
                                name="description"
                                className="form-control shadow-none"
                                placeholder="Enter campaign title"
                                defaultValue={props.data ? props.data.description : null}
                                ref={register({ required: "Description is required" })}
                            />
                        </div>
                    </div>

                    {/* Start from date */}
                    <div className="col-12 col-lg-6">
                        <div className="form-group mb-4">
                            {errors.start_from_date && errors.start_from_date.message ? (
                                <p className="text-danger">{errors.start_from_date && errors.start_from_date.message}</p>
                            ) : <p>Start date</p>}

                            {/* <Controller
                                name={"start_from_date"}
                                control={control}
                                rules={{ required: "Start date is required." }}
                                defaultValue={props.data ? props.data.start_from_date : null}
                                render={({ onChange,value }) => (
                                    <DatePicker
                                        className="form-control shadow-none"
                                        placeholderText="Select date"
                                        selected={props.data ? new Date(props.data.start_from_date) : value}
                                        onChange={(date) => onChange(date)}
                                    />
                                )}
                            /> */}

                            <DatePickerNew
                                selected={data => {
                                    setStartDate(data)
                                    if (endDate && data) {
                                        if (Date.parse(endDate) < Date.parse(data)) {
                                            setError("start_from_date", {
                                                type: "manual",
                                                message: `Start date is larger or after date from the end date.`
                                            })
                                        }
                                        else {
                                            clearErrors("start_from_date")
                                        }
                                    }
                                }}
                                deafultValue={startDate}
                            />
                        </div>
                    </div>

                    {/* End to date */}
                    <div className="col-12 col-lg-6">
                        <div className="form-group mb-4">
                            {errors.end_to_date && errors.end_to_date.message ? (
                                <p className="text-danger">{errors.end_to_date && errors.end_to_date.message}</p>
                            ) : <p>End date</p>}

                            {/* <Controller
                                name={"end_to_date"}
                                control={control}
                                rules={{ required: "End date is required." }}
                                defaultValue={props.data ? props.data.end_to_date : null}
                                render={({ onChange, value }) => (
                                    <DatePicker
                                        className="form-control shadow-none"
                                        placeholderText="Select date"
                                        selected={props.data ? new Date(props.data.end_to_date) : value}
                                        onChange={onChange}
                                    />
                                )}
                            /> */}

                            <DatePickerNew
                                selected={data => {
                                    setEndDate(data)
                                    if (startDate && data) {
                                        if (Date.parse(startDate) > Date.parse(data)) {
                                            setError("end_to_date", {
                                                type: "manual",
                                                message: `End date is smaller or before date from the start date.`
                                            })
                                        }
                                        else {
                                            clearErrors("end_to_date")
                                        }
                                    }
                                }}
                                deafultValue={endDate}
                            />
                        </div>
                    </div>

                    {/* Start Time */}
                    <div className="col-12 col-lg-6">
                        <div className="form-group mb-4">
                            {errors.start_time && errors.start_time.message ? (
                                <p className="text-danger">{errors.start_time && errors.start_time.message}</p>
                            ) : <p>Start time</p>}

                            <Controller
                                name={"start_time"}
                                control={control}
                                rules={{ required: "Start time is required." }}
                                defaultValue={props.data ? props.data.start_time : null}
                                render={({ onChange, value }) => (
                                    <TimePicker
                                        value={props.data ? props.data.start_time : value}
                                        onChange={onChange}
                                    />
                                )}
                            />
                        </div>
                    </div>

                    {/* End Time */}
                    <div className="col-12 col-lg-6">
                        <div className="form-group mb-4">
                            {errors.end_time && errors.end_time.message ? (
                                <p className="text-danger">{errors.end_time && errors.end_time.message}</p>
                            ) : <p>End time</p>}

                            <Controller
                                name={"end_time"}
                                control={control}
                                rules={{ required: "End time is required." }}
                                defaultValue={props.data ? props.data.end_time : null}
                                render={({ onChange, value }) => (
                                    <TimePicker
                                        value={props.data ? props.data.end_time : value}
                                        onChange={onChange}
                                    />
                                )}
                            />
                        </div>
                    </div>

                    {/* Discount type */}
                    <div className="col-12 col-lg-6">
                        <div className="form-group mb-4">
                            {errors.discount_type && errors.discount_type.message ? (
                                <p className="text-danger">{errors.discount_type && errors.discount_type.message}</p>
                            ) : <p>Discount type</p>}

                            <select
                                name="discount_type"
                                className="form-control shadow-none"
                                ref={register({ required: "Discount type is required" })}
                                defaultValue={props.data ? props.data.discount_type : null}
                            >
                                <option value="Flat">Flat</option>
                                <option value="Percentage">Percentage</option>
                            </select>
                        </div>
                    </div>

                    {/* Discount amount */}
                    <div className="col-12 col-lg-6">
                        <div className="form-group mb-4">
                            {errors.discount_amount && errors.discount_amount.message ? (
                                <p className="text-danger">{errors.discount_amount && errors.discount_amount.message}</p>
                            ) : <p>Discount amount</p>}

                            <input
                                type="number"
                                name="discount_amount"
                                className="form-control shadow-none"
                                placeholder="Enter amount"
                                defaultValue={props.data ? props.data.discount_amount : null}
                                ref={register({ required: "Amount is required" })}
                            />
                        </div>
                    </div>

                    {/* Minimum order amount */}
                    <div className="col-12 col-lg-6">
                        <div className="form-group mb-4">
                            <p>Minimum order amount</p>

                            <input
                                type="number"
                                min={1}
                                name="min_order_amount"
                                className="form-control shadow-none"
                                placeholder="Enter amount"
                                defaultValue={props.data ? props.data.min_order_amount : null}
                                ref={register()}
                            />
                        </div>
                    </div>

                    {/* Maximum order amount */}
                    <div className="col-12 col-lg-6">
                        <div className="form-group mb-4">
                            {errors.max_order_amount && errors.max_order_amount.message ? (
                                <p className="text-danger">{errors.max_order_amount && errors.max_order_amount.message}</p>
                            ) : <p>Maximum order amount</p>}


                            <input
                                type="number"
                                min={1}
                                name="max_order_amount"
                                className="form-control shadow-none"
                                placeholder="Enter amount"
                                defaultValue={props.data ? props.data.max_order_amount : null}
                                ref={register()}
                            />
                        </div>
                    </div>

                    {/* Minimum product quantity */}
                    <div className="col-12 col-lg-6">
                        <div className="form-group mb-4">
                            <p>Minimum product quantity</p>

                            <input
                                type="number"
                                min={1}
                                name="min_quantity"
                                className="form-control shadow-none"
                                placeholder="Enter amount"
                                defaultValue={props.data ? props.data.min_quantity : null}
                                ref={register()}
                            />
                        </div>
                    </div>

                    {/* Maximum product quantity */}
                    <div className="col-12 col-lg-6">
                        <div className="form-group mb-4">
                            {errors.max_quantity && errors.max_quantity.message ? (
                                <p className="text-danger">{errors.max_quantity && errors.max_quantity.message}</p>
                            ) : <p>Maximum product quantity</p>}


                            <input
                                type="number"
                                min={1}
                                name="max_quantity"
                                className="form-control shadow-none"
                                placeholder="Enter amount"
                                defaultValue={props.data ? props.data.max_quantity : null}
                                ref={register()}
                            />
                        </div>
                    </div>

                    {/* Assign To */}
                    <div className="col-12">
                        <div className="form-group mb-4">
                            <p>Assign To</p>

                            <select
                                name="assign_to"
                                className="form-control shadow-none"
                                ref={register({ required: "Assign to is required" })}
                                defaultValue={props.data ? props.data.assign_to : null}
                                onChange={event => {
                                    setAssignItems([])
                                    onClearRef.current.select.setState({ value: null })
                                    clearErrors("assign_items")
                                    setAssignTo(event.target.value)
                                }}
                            >
                                <option value="Brand">Brand</option>
                                <option value="Category">Category</option>
                                <option value="Sub-category">Sub-category</option>
                                <option value="Leaf-category">Leaf-category</option>
                                <option value="Vendor">Vendor</option>
                                <option value="Product">Product</option>
                            </select>
                        </div>
                    </div>

                    {/* Assign items */}
                    <div className='col-12'>
                        <div className="form-group mb-4">
                            {errors.assign_items && errors.assign_items.message ? (
                                <p className="text-danger">{errors.assign_items && errors.assign_items.message}</p>
                            ) : <p>Select {assignTo.toLowerCase()}</p>}

                            <SearchableSelect
                                isMulti
                                borderRadius={4}
                                refs={onClearRef}
                                placeholder={assignTo}
                                defaultValue={props.data && props.data.assign_items && props.data.assign_items.length > 0 ?
                                    props.data.assign_items.map(item => {
                                        return {
                                            label: item.name,
                                            value: item._id
                                        }
                                    })
                                    : null
                                }
                                search={query => handleSearch(query)}
                                values={event => {
                                    setAssignItems(event.map(item => { return item.value }))
                                    clearErrors("assign_items")
                                }}
                            />
                        </div>
                    </div>

                    {/* Active-deactive checkbox */}
                    <div className="col-12">
                        <div className="form-group mb-4">
                            <Form.Group className="mb-3" controlId="formBasicCheckbox">
                                <Form.Check
                                    type="checkbox"
                                    label="Make active"
                                    name="is_active"
                                    defaultChecked={props.data ? props.data.is_active : false}
                                    ref={register()}
                                />
                            </Form.Group>
                        </div>
                    </div>

                    {/* Enable-disable COD button */}
                    <div className="col-12">
                        <div className="form-group mb-4">
                            <Form.Group className="mb-3" controlId="formBasicCheckbox1">
                                <Form.Check
                                    type="checkbox"
                                    label="Hide COD button."
                                    name="is_cod_button_hidden"
                                    defaultChecked={props.data ? props.data.is_cod_button_hidden : false}
                                    ref={register()}
                                />
                            </Form.Group>
                        </div>
                    </div>

                    {/* Small image */}
                    {props.formType && props.formType === "create" ?
                        <div className="col-12 col-lg-6">
                            <SingleFileUploader
                                width={200}
                                height={120}
                                title={'Small banner'}
                                default={props.data ? BASE_URL_SM + props.data.banner_sm : null}
                                error={errors.banner_sm && errors.banner_sm.message ? errors.banner_sm.message : null}
                                dataHandeller={data => {
                                    setSmImage(data.image)
                                    clearErrors("banner_sm")
                                }}
                            />
                        </div>
                        : null
                    }

                    {/* Large image */}
                    {props.formType && props.formType === "create" ?
                        <div className="col-12 col-lg-6">
                            <SingleFileUploader
                                width={250}
                                height={120}
                                title={'Large banner'}
                                default={props.data ? BASE_URL_LG + props.data.banner_lg : null}
                                error={errors.banner_lg && errors.banner_lg.message ? errors.banner_lg.message : null}
                                dataHandeller={data => {
                                    setLgImage(data.image)
                                    clearErrors("banner_lg")
                                }}
                            />
                        </div>
                        : null
                    }
                </div>

                {/* Submit button */}
                <div className="text-right">
                    <button type="submit" className="btn shadow-none" disabled={props.loading}>
                        {props.loading ? 'Loading...' : props.formType === "edit" ? "Save changes" : "Create"}
                    </button>
                </div>
            </form>

            {/* Image update section */}
            {props.formType && props.formType === "edit" ?
                <div className="row mt-4">

                    {/* Small image */}
                    <div className="col-12 col-lg-6">
                        <SingleFileUploader
                            width={200}
                            height={120}
                            title={'Small banner'}
                            default={props.data ? BASE_URL_SM + props.data.banner_sm : null}
                            error={smImageEdit.error || null}
                            dataHandeller={data => setSmImageEdit({ value: data.image, error: null })}
                        />
                    </div>

                    {/* Large image */}
                    <div className="col-12 col-lg-6">
                        <SingleFileUploader
                            width={250}
                            height={120}
                            title={'Large banner'}
                            default={props.data ? BASE_URL_LG + props.data.banner_lg : null}
                            error={lgImageEdit.error || null}
                            dataHandeller={data => setLgImageEdit({ value: data.image, error: null })}
                        />
                    </div>

                    <div className="col-12 text-center">
                        <button
                            type="button"
                            className="btn btn-primary font-15 px-4 py-3 border-0 rounded shadow-none"
                            disabled={props.imgLoading}
                            onClick={() => onSubmitImages()}
                        >
                            {props.imgLoading ? 'Loading...' : "Update images"}
                        </button>
                    </div>
                </div>
                : null
            }
        </div>
    );
}
