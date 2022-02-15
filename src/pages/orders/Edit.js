import React, { useState, useEffect, useCallback, useRef } from 'react'
import Icon from 'react-icons-kit'
import { useForm } from 'react-hook-form'
import { Link, useParams } from 'react-router-dom'
import { chevronLeft } from 'react-icons-kit/feather'
import { PreLoader } from '../../components/loading/Index'
import { CustomButton } from '../../components/button'
import { SingleSelect } from '../../components/select'
import { districts } from '../../utils/location/districts'
import Requests from '../../utils/Requests/Index'

const Edit = () => {
    const { id } = useParams()
    const selectedField = useRef()
    const { register, handleSubmit, errors } = useForm()
    const [isLoading, setLoading] = useState(true)
    const [update, setUpdate] = useState(false)
    const [data, setData] = useState({})

    const [shippingArea, setShippingArea] = useState({ value: null, error: null })
    const [postCode, setPostCode] = useState({ value: null, options: [], error: null })
    const [postOffice, setPostOffice] = useState(null)
    const [upzila, setUpzila] = useState(null)

    const [header] = useState({
        headers: { Authorization: "Bearer " + localStorage.getItem('token') }
    })

    // Fetch data
    const fetchData = useCallback(async () => {
        const response = await Requests.Order.Show(id, header)
        if (response) {
            setData(response.data)
            setShippingArea(exArea => ({ ...exArea, value: response.data.shippingArea }))
            setPostOffice(response.data.postOffice)

            const result = districts.find(district => district.value === response.data.shippingArea)
            setPostCode(exCode => ({ ...exCode, value: response.data.postCode, options: result.postCodes }))
            setUpzila(response.data.upazila)
        }
        setLoading(false)
    }, [id, header])

    useEffect(() => {
        fetchData()
    }, [id, header, fetchData])

    // Submit Form
    const onSubmit = async (data) => {
        const formData = {
            ...data,
            shippingArea: shippingArea.value,
            postCode: postCode.value,
            postOffice,
            upazila: upzila
        }

        setUpdate(true)
        await Requests.Order.UpdateAddress(id, formData, header)
        setUpdate(false)
    }

    if (isLoading) return <PreLoader />

    return (
        <div className="order-show-container pb-4">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12 col-padding">
                        <div className="card border-0 shadow-sm">
                            <div className="card-header p-3 bg-white">
                                <div className="d-flex">
                                    <div><h6 className="mt-2 mb-0">Edit Order</h6></div>
                                    <div className="ml-auto">
                                        <Link to="/dashboard/order">
                                            <CustomButton
                                                style={{ padding: "7px 9px" }}
                                                className="btn-primary rounded-circle border-0 m-0"
                                            >
                                                <Icon icon={chevronLeft} size={20} />
                                            </CustomButton>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body p-3">
                                <form onSubmit={handleSubmit(onSubmit)}>

                                    <div className="row">

                                        {/* Shipping Area */}
                                        <div className="col-12 col-lg-6">
                                            <div className="form-group mb-4">
                                                {shippingArea.error ? <p className="text-danger">{shippingArea.error}</p> : <p>Shipping Area</p>}

                                                <SingleSelect
                                                    placeholder="area"
                                                    error={shippingArea.error}
                                                    options={districts}
                                                    deafult={shippingArea.value ? { label: shippingArea.value, value: shippingArea.value } : null}
                                                    value={event => {
                                                        setShippingArea({ value: event.value, error: null })
                                                        setPostCode(exPostCode => ({ ...exPostCode, options: event.postCodes }))

                                                        if (selectedField.current) {
                                                            selectedField.current.select.clearValue()
                                                            setPostCode(exPostCode => ({ ...exPostCode, value: null }))
                                                            setPostOffice(null)
                                                            setUpzila(null)
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        {/* Delivery address */}
                                        <div className="col-12 col-lg-6">
                                            <div className="form-group mb-3">
                                                {errors.deliveryAddress && errors.deliveryAddress.message ? (
                                                    <p className="text-danger">{errors.deliveryAddress && errors.deliveryAddress.message}</p>
                                                ) : <p>Delivery address</p>}

                                                <input
                                                    type="text"
                                                    name="deliveryAddress"
                                                    className="form-control shadow-none"
                                                    placeholder="Enter address"
                                                    defaultValue={data.deliveryAddress}
                                                    ref={register({ required: "Delivery address is required" })}
                                                />
                                            </div>
                                        </div>

                                        {/* Post Code */}
                                        <div className="col-12">
                                            <div className="form-group mb-4">
                                                {postCode.error ? <p className="text-danger">{postCode.error}</p> : <p>Post office / Post code</p>}

                                                <SingleSelect
                                                    refs={selectedField}
                                                    options={postCode.options}
                                                    placeholder={'post code'}
                                                    deafult={postCode.value ? { label: postCode.value, value: postCode.value } : null}
                                                    value={event => {
                                                        if (event) {
                                                            setPostCode({ ...postCode, value: event.value, error: null })
                                                            setPostOffice(event.postOffice)
                                                            setUpzila(event.upazila)
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </div>

                                    </div>

                                    <div className="text-right">
                                        <CustomButton
                                            type="submit"
                                            className="btn-success border-0 px-4 shadow-none"
                                            disabled={update}
                                        >
                                            {update ? 'Updating ...' : 'Update'}
                                        </CustomButton>
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

export default Edit;