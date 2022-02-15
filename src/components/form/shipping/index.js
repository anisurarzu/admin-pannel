import React, { useState, useRef, useEffect, useCallback } from 'react'
import TimePicker from 'react-time-picker'
import { Controller, useForm } from 'react-hook-form'
import { MultiSelect, SearchableSelect } from '../../select'
import { DatePickerNew } from '../../datePickerNew/Index'
import Requests from '../../../utils/Requests/Index'


export const ShippingForm = (props) => {
    const onClearRef = useRef()
    const { control, register, handleSubmit, errors, setError, clearErrors } = useForm()
    const [assignTo, setAssignTo] = useState(props.data ? props.data.assign_to : 'Brand')
    const [startDate, setStartDate] = useState(props.data && props.data.start_from ? props.data.start_from : new Date());
    const [endDate, setEndDate] = useState(props.data && props.data.end_to ? props.data.end_to : new Date());
    const [division, setDivision] = useState([])
    const [divisionLabel, setDivisionLabel] = useState(null)
    const [districtLabel, setDistrictLabel] = useState(null)

    const [selectedDivision, setSelectedDivision] = useState(props.data && props.data.division && props.data.division.length > 0 ?
        [...props.data.district.map(item => { return item._id })]
        : [])
    const [selectedDistrict, setSelectedDistrict] = useState(props.data && props.data.district && props.data.district.length > 0 ?
        [...props.data.district.map(item => { return item._id })]
        : [])
    const [area, setArea] = useState(props.data && props.data.area && props.data.area.length > 0 ?
        [...props.data.area.map(item => { return item._id })]
        : [])
    const [assignItems, setAssignItems] = useState(
        props.data && props.data.assign_items && props.data.assign_items.length > 0 ?
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

    /* handle search area */
    const handleSearchArea = async (data) => {
        try {
            let results = []

            const response = await Requests.Services.Shipping.Area.SearchbyDistrict(data, selectedDistrict, header)
            if (response && response.data && response.data.length > 0) {
                for (let i = 0; i < response.data.length; i++) {
                    const element = response.data[i]
                    results.push({
                        value: element._id,
                        label: `${element.post_office}(${element.post_office_bn_name})-${element.post_code}`
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

    // Fetch division data
    const fetchDevisionData = useCallback(async (page) => {
        try {
            const items = []
            const response = await Requests.Services.Shipping.Division.Index(page, 10, header)
            if (response) {
                if (response.data && response.data.length > 0) {
                    for (let i = 0; i < response.data.length; i++) {
                        const element = response.data[i]
                        items.push({
                            label: element.name,
                            value: element._id,
                        })
                    }
                }
            }
            setDivision(items)
        } catch (error) {
            if (error) console.log(error);
        }
    }, [header])

    // Handle district search
    const handleDistrictSearch = async (inputValue) => {
        try {
            const items = []
            const response = await Requests.Services.Shipping.District.SearchbyDivision(inputValue, selectedDivision, header)
            if (response) {
                if (response.data && response.data.length > 0) {
                    for (let i = 0; i < response.data.length; i++) {
                        const element = response.data[i]
                        items.push({
                            label: element.name,
                            value: element._id,
                        })
                    }
                }
            }
            return items
        } catch (error) {
            if (error) return []
        }
    }

    useEffect(() => {
        fetchDevisionData(1)
    }, [header, fetchDevisionData])

    /* submit form */
    const onSubmit = async (data) => {
        let is_error = false

        if (!selectedDivision.length) {
            setError("selectedDivision", {
                type: "manual",
                message: "Division is required."
            })
            is_error = true
        }

        // if (!area) {
        //     setError("area", {
        //         type: "manual",
        //         message: `Area is required.`
        //     })
        //     is_error = true
        // }

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

        const formData = {
            ...data,
            division: selectedDivision,
            district: selectedDistrict,
            area: area,
            assign_to: assignTo,
            start_from: startDate,
            end_to: endDate,
            assign_items: JSON.stringify(assignItems)
        }
        // console.log(formData);
        props.onSubmit(formData)
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
                                placeholder="Enter shipping title"
                                defaultValue={props.data ? props.data.title : null}
                                ref={register({ required: "Title is required" })}
                            />
                        </div>
                    </div>

                    {/* Start from date */}
                    <div className="col-12 col-lg-6">
                        <div className="form-group mb-4">
                            {errors.start_from && errors.start_from.message ? (
                                <p className="text-danger">{errors.start_from && errors.start_from.message}</p>
                            ) : <p>Start date</p>}

                            {/* <Controller
                                name={"start_from"}
                                control={control}
                                rules={{ required: "Start date is required." }}
                                defaultValue={props.data ? props.data.start_from : null}
                                render={({ onChange, value }) => (
                                    <DatePicker
                                        className="form-control shadow-none"
                                        placeholderText="Select date"
                                        selected={props.data ? new Date(props.data.start_from) : value}
                                        onChange={onChange}
                                    />
                                )}
                            /> */}

                            <DatePickerNew
                                selected={data => {
                                    setStartDate(data)
                                    if (endDate && data) {
                                        if (Date.parse(endDate) < Date.parse(data)) {
                                            setError("start_from", {
                                                type: "manual",
                                                message: `Start date is larger or after date from the end date.`
                                            })
                                        }
                                        else {
                                            clearErrors("start_from")
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
                            {errors.end_to && errors.end_to.message ? (
                                <p className="text-danger">{errors.end_to && errors.end_to.message}</p>
                            ) : <p>End date</p>}

                            {/* <Controller
                                name={"end_to"}
                                control={control}
                                rules={{ required: "End date is required." }}
                                defaultValue={props.data ? props.data.end_to : null}
                                render={({ onChange, value }) => (
                                    <DatePicker
                                        className="form-control shadow-none"
                                        placeholderText="Select date"
                                        selected={props.data ? new Date(props.data.end_to) : value}
                                        onChange={onChange}
                                    />
                                )}
                            /> */}

                            <DatePickerNew
                                selected={data => {
                                    setEndDate(data)
                                    if (startDate && data) {
                                        if (Date.parse(startDate) > Date.parse(data)) {
                                            setError("end_to", {
                                                type: "manual",
                                                message: `End date is smaller or before date from the start date.`
                                            })
                                        }
                                        else {
                                            clearErrors("end_to")
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
                            {errors.min_order_amount && errors.min_order_amount.message ? (
                                <p className="text-danger">{errors.min_order_amount && errors.min_order_amount.message}</p>
                            ) : <p>Minimum order amount</p>}

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
                            {errors.min_quantity && errors.min_quantity.message ? (
                                <p className="text-danger">{errors.min_quantity && errors.min_quantity.message}</p>
                            ) : <p>Minimum product quantity</p>}

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

                    {/* Division */}
                    <div className="col-12">
                        <div className="form-group mb-4">
                            {errors.selectedDivision && errors.selectedDivision.message ?
                                <p className="text-danger fs-13 mb-0">{errors.selectedDivision && errors.selectedDivision.message}</p>
                                : <p className="fs-13 mb-0">Division <span className="text-danger">*</span></p>}
                            <MultiSelect
                                placeholder=" division"
                                deafult={props.data && props.data.division ? props.data.division : null}
                                options={division}
                                values={event => {
                                    setSelectedDivision(event.map(item => { return item.value }))
                                    event.map(item => setDivisionLabel(item.label))
                                    clearErrors("selectedDivision")
                                }}
                            />
                        </div>
                    </div>

                    {/* select district */}
                    {selectedDistrict && selectedDivision.length > 0 && divisionLabel !== "All" ?
                        <div className="col-12">
                            <div className="form-group mb-4">
                                {errors.selectedDistrict && errors.selectedDistrict.message ?
                                    <p className="text-danger fs-13 mb-0">{errors.selectedDistrict && errors.selectedDistrict.message}</p>
                                    : <p className="fs-13 mb-0"> District </p>}

                                <SearchableSelect
                                    isMulti
                                    placeholder="Search district"
                                    defaultValue={
                                        // props.data && props.data.district ?
                                        // {
                                        //     label: props.data.district.name,
                                        //     value: props.data.district._id
                                        // }
                                        props.data &&
                                            props.data.district &&
                                            props.data.district.length > 0 ?
                                            props.data.district.map(item => {
                                                return {
                                                    label: item.name,
                                                    value: item._id
                                                }
                                            })
                                            : null
                                    }
                                    search={inputValue => handleDistrictSearch(inputValue)}
                                    values={data => {
                                        setSelectedDistrict(data.map(item => { return item.value }))
                                        data.map(item => setDistrictLabel(item.label))
                                        clearErrors("selectedDistrict")
                                    }
                                    }
                                    borderRadius={5}
                                />
                            </div>
                        </div>
                        : null}

                    {/* Area */}
                    {selectedDistrict && selectedDistrict.length > 0 && districtLabel !== "All" ?
                        <div className="col-12">
                            <div className="form-group mb-4">
                                {errors.area && errors.area.message ? (
                                    <p className="text-danger">{errors.area && errors.area.message}</p>
                                ) : <p>Area</p>}

                                <SearchableSelect
                                    isMulti
                                    borderRadius={4}
                                    refs={onClearRef}
                                    placeholder={"area"}
                                    defaultValue={
                                        // props.data && props.data.area ?
                                        // {
                                        //     value: props.data.area._id,
                                        //     label: `${props.data.area.post_office}(${props.data.area.post_office_bn_name})-${props.data.area.post_code}`
                                        // }
                                        // : null
                                        props.data &&
                                            props.data.area &&
                                            props.data.area.length > 0 ?
                                            props.data.area.map(item => {
                                                return {
                                                    value: item._id,
                                                    label: `${item.post_office}(${item.post_office_bn_name})-${item.post_code}`
                                                }
                                            })
                                            : null
                                    }
                                    search={query => handleSearchArea(query)}
                                    values={event => {
                                        setArea(event.map(item => { return item.value }))
                                        clearErrors("area")
                                    }}
                                />
                            </div>
                        </div>
                        : null}

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
                                defaultValue={
                                    props.data &&
                                        props.data.assign_items &&
                                        props.data.assign_items.length > 0 ?
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
                </div>

                {/* Submit button */}
                <div className="text-right">
                    <button type="submit" className="btn shadow-none" disabled={props.loading}>
                        {props.loading ? 'Loading...' : props.formType === "edit" ? "Save changes" : "Create"}
                    </button>
                </div>
            </form >
        </div >
    );
}
