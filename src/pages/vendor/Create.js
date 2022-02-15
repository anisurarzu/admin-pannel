import React, { useState } from 'react'
import './style.scss'
import Icon from 'react-icons-kit'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { chevronLeft, plus } from 'react-icons-kit/feather'
import Requests from '../../utils/Requests/Index'

const Create = () => {
    const { register, handleSubmit, errors } = useForm()
    const [isLoading, setLoading] = useState(false)
    const [payment, setPayment] = useState('Cash')
    const [payPeriod, setPayPeriod] = useState({ value: null, error: null })
    const [header] = useState({
        headers: { Authorization: "Bearer " + localStorage.getItem('token') }
    })
    const [thumbnail, setThumbnail] = useState({ value: null, preview: null, error: null })


    // Pay system handeller
    const paySystemHandeller = event => {
        const value = event.target.value
        setPayment(value)

        if (value === 'Cash') setPayPeriod({ value: null, error: null })
    }

    // Thumbnail handeller
    const thumbnailHandeller = event => {
        let file = event.target.files[0]
        if (file) {
            const size = parseInt(file.size) / 1000
            if (size > 700) {
                setThumbnail({ ...thumbnail, error: 'Select less than 700KB file.' })
                return
            }
            setThumbnail({ value: file, preview: URL.createObjectURL(file), error: null })
        }
    }

    // Submit Form
    const onSubmit = async (data) => {

        if (payment === 'Credit') {
            if (!payPeriod.value) return setPayPeriod({ ...payPeriod, error: 'Pay period is required.' })
        }
        // if (!thumbnail.value) return setThumbnail({ ...thumbnail, error: 'Thumbnail is required.' })

        // console.log(thumbnail.value);

        let formData = new FormData()
        formData.append('name', data.name)
        formData.append('email', data.email)
        formData.append('phone', data.phone)
        formData.append('address', data.address)
        formData.append('accountName', data.accountName)
        formData.append('accountNumber', data.accountNumber)
        formData.append('branchName', data.branchName)
        formData.append('routingNumber', data.routingNumber)
        formData.append('tradeLicence', data.tradeLicence)
        formData.append('pickupLocation', data.pickupLocation)
        formData.append('paymentSystem', data.paymentSystem)
        formData.append('personOneName', data.personOnename)
        formData.append('personOnePhone', data.personOnePhone)
        formData.append('personOneEmail', data.personOneEmail)
        formData.append('personTwoName', data.personTwoName)
        formData.append('personTwoPhone', data.personTwoPhone)
        formData.append('personTwoEmail', data.personTwoEmail)
        formData.append('keyAccountManager', data.keyAccountManager)
        formData.append('secondaryKeyAccountManager', data.secondaryKeyAccountManager)
        formData.append('payPeriod', payPeriod.value ? payPeriod.value : null)

        // Basic image
        if (thumbnail.value) {
            formData.append('image', thumbnail.value)    
        }
        

        // const vendorData = {
        //     ...data,
        //     payPeriod: payPeriod.value ? payPeriod.value : null
        // }

        setLoading(true)
        await Requests.Vendor.Store(formData, header)
        return setLoading(false)
    }

    return (
        <div className="create-vendor pb-4">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12 col-padding">
                        <div className="card border-0 shadow-sm">
                            <div className="card-header p-3 p-lg-4 bg-white">
                                <div className="d-flex">
                                    <div><h6 className="mb-0">Create vendor</h6></div>
                                    <div className="ml-auto">
                                        <Link
                                            to="/dashboard/vendor"
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

                                    {/* Baic info */}
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
                                                    placeholder="Enter name"
                                                    ref={register({
                                                        required: "Name is required",
                                                        minLength: {
                                                            value: 5,
                                                            message: "Minimun length 5 character"
                                                        }
                                                    })}
                                                />
                                            </div>
                                        </div>

                                        {/* E-mail */}
                                        <div className="col-12 col-lg-6">
                                            <div className="form-group mb-4">
                                                {errors.email && errors.email.message ? (
                                                    <p className="text-danger">{errors.email && errors.email.message}</p>
                                                ) : <p>E-mail</p>}

                                                <input
                                                    type="text"
                                                    name="email"
                                                    className="form-control shadow-none"
                                                    placeholder="Enter e-mail"
                                                    ref={register({
                                                        required: "E-mail is required",
                                                        pattern: {
                                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                            message: "Invalid email address"
                                                        }
                                                    })}
                                                />
                                            </div>
                                        </div>

                                        {/* Phone */}
                                        <div className="col-12 col-lg-6">
                                            <div className="form-group mb-4">
                                                {errors.phone && errors.phone.message ? (
                                                    <p className="text-danger">{errors.phone && errors.phone.message}</p>
                                                ) : <p>Phone</p>}

                                                <input
                                                    type="text"
                                                    name="phone"
                                                    className="form-control shadow-none"
                                                    placeholder="Enter phone number"
                                                    ref={register({
                                                        required: "Phone number required",
                                                        pattern: {
                                                            value: /^(?:\+88|01)?\d+$/,
                                                            message: "Phone number is not valid."
                                                        }
                                                    })}
                                                />
                                            </div>
                                        </div>

                                        {/* Address */}
                                        <div className="col-12 col-lg-6">
                                            <div className="form-group mb-4">
                                                {errors.address && errors.address.message ? (
                                                    <p className="text-danger">{errors.address && errors.address.message}</p>
                                                ) : <p>Address</p>}

                                                <input
                                                    type="text"
                                                    name="address"
                                                    className="form-control shadow-none"
                                                    placeholder="Enter address"
                                                    ref={register({
                                                        required: "Address is required"
                                                    })}
                                                />
                                            </div>
                                        </div>

                                    </div>


                                    {/* Bank info */}
                                    <div className="row">
                                        <div className="col-12 pt-2">
                                            <p className="text-muted mb-0">Bank information</p>
                                            <hr />
                                        </div>

                                        {/* Account name */}
                                        <div className="col-12 col-lg-6">
                                            <div className="form-group mb-4">
                                                {errors.accountName && errors.accountName.message ? (
                                                    <p className="text-danger">{errors.accountName && errors.accountName.message}</p>
                                                ) : <p>Account name</p>}

                                                <input
                                                    type="text"
                                                    name="accountName"
                                                    className="form-control shadow-none"
                                                    placeholder="Enter account name"
                                                    ref={register({
                                                        required: "Account name is required"
                                                    })}
                                                />
                                            </div>
                                        </div>

                                        {/* Account number */}
                                        <div className="col-12 col-lg-6">
                                            <div className="form-group mb-4">
                                                {errors.accountNumber && errors.accountNumber.message ? (
                                                    <p className="text-danger">{errors.accountNumber && errors.accountNumber.message}</p>
                                                ) : <p>Account number</p>}

                                                <input
                                                    type="number"
                                                    name="accountNumber"
                                                    className="form-control shadow-none"
                                                    placeholder="Enter account number"
                                                    ref={register({
                                                        required: "Account number is required"
                                                    })}
                                                />
                                            </div>
                                        </div>

                                        {/* Branch */}
                                        <div className="col-12 col-lg-6">
                                            <div className="form-group mb-4">
                                                {errors.branchName && errors.branchName.message ? (
                                                    <p className="text-danger">{errors.branchName && errors.branchName.message}</p>
                                                ) : <p>Bank & Branch</p>}

                                                <input
                                                    type="text"
                                                    name="branchName"
                                                    className="form-control shadow-none"
                                                    placeholder="Enter brnach name"
                                                    ref={register({
                                                        required: "Branch name is required"
                                                    })}
                                                />
                                            </div>
                                        </div>

                                        {/* Routing Number */}
                                        <div className="col-12 col-lg-6">
                                            <div className="form-group mb-4">
                                                {errors.routingNumber && errors.routingNumber.message ? (
                                                    <p className="text-danger">{errors.routingNumber && errors.routingNumber.message}</p>
                                                ) : <p>Routing Number</p>}

                                                <input
                                                    type="text"
                                                    name="routingNumber"
                                                    className="form-control shadow-none"
                                                    placeholder="Enter routing number"
                                                    ref={register({
                                                        required: "Routing number is required"
                                                    })}
                                                />
                                            </div>
                                        </div>


                                    </div>


                                    {/* Business & payment info */}
                                    <div className="row">
                                        <div className="col-12 pt-2">
                                            <p className="text-muted mb-0">Business & payment information</p>
                                            <hr />
                                        </div>

                                        {/* Trade licence */}
                                        <div className="col-12 col-lg-6">
                                            <div className="form-group mb-4">
                                                {errors.tradeLicence && errors.tradeLicence.message ? (
                                                    <p className="text-danger">{errors.tradeLicence && errors.tradeLicence.message}</p>
                                                ) : <p>Trade licence</p>}

                                                <input
                                                    type="text"
                                                    name="tradeLicence"
                                                    className="form-control shadow-none"
                                                    placeholder="Enter trade licence"
                                                    ref={register({
                                                        required: "Trade licence is required"
                                                    })}
                                                />
                                            </div>
                                        </div>

                                        {/* Pick Up location */}
                                        <div className="col-12 col-lg-6">
                                            <div className="form-group mb-4">
                                                {errors.pickupLocation && errors.pickupLocation.message ? (
                                                    <p className="text-danger">{errors.pickupLocation && errors.pickupLocation.message}</p>
                                                ) : <p>Pick Up location</p>}

                                                <input
                                                    type="text"
                                                    name="pickupLocation"
                                                    className="form-control shadow-none"
                                                    placeholder="Enter pick up location"
                                                    ref={register({
                                                        required: "Pick up location is required"
                                                    })}
                                                />
                                            </div>
                                        </div>

                                        {/* Payment system */}
                                        <div className="col-12">
                                            <div className="form-group mb-4">
                                                {errors.paymentSystem && errors.paymentSystem.message ? (
                                                    <p className="text-danger">{errors.paymentSystem && errors.paymentSystem.message}</p>
                                                ) : <p>Payment system</p>}

                                                <select
                                                    name="paymentSystem"
                                                    className="form-control shadow-none"
                                                    onChange={paySystemHandeller}
                                                    ref={register({
                                                        required: "Payment system is required"
                                                    })}
                                                >
                                                    <option value="Cash">Cash</option>
                                                    <option value="Credit">Credit</option>
                                                </select>
                                            </div>
                                        </div>

                                        {/* Payment period */}
                                        {payment === 'Credit' ?
                                            <div className="col-12">
                                                <div className="form-group mb-4">
                                                    {payPeriod.error ? (
                                                        <p className="text-danger">{payPeriod.error}</p>
                                                    ) : <p>Payment pay period</p>}

                                                    <select
                                                        className="form-control shadow-none"
                                                        onChange={(event) => setPayPeriod({ value: event.target.value, error: null })}
                                                        defaultValue={null}
                                                    >
                                                        <option value={null}>-- Select period --</option>
                                                        <option value="Every 10 days">Every 10 days</option>
                                                        <option value="Every 15 days">Every 15 days</option>
                                                        <option value="Every 20 days">Every 20 days</option>
                                                        <option value="Every 30 days">Every 30 days</option>
                                                    </select>
                                                </div>
                                            </div>
                                            : null}

                                    </div>


                                    {/* Contact person 1 */}
                                    <div className="row">
                                        <div className="col-12 pt-2">
                                            <p className="text-muted mb-0">Contact person 1</p>
                                            <hr />
                                        </div>

                                        {/* Name */}
                                        <div className="col-12 col-lg-4">
                                            <div className="form-group mb-4">
                                                {errors.personOneName && errors.personOneName.message ? (
                                                    <p className="text-danger">{errors.personOneName && errors.personOneName.message}</p>
                                                ) : <p>Name</p>}

                                                <input
                                                    type="text"
                                                    name="personOneName"
                                                    className="form-control shadow-none"
                                                    placeholder="Enter name"
                                                    ref={register({
                                                        required: "Name is required"
                                                    })}
                                                />
                                            </div>
                                        </div>

                                        {/* Phone */}
                                        <div className="col-12 col-lg-4">
                                            <div className="form-group mb-4">
                                                {errors.personOnePhone && errors.personOnePhone.message ? (
                                                    <p className="text-danger">{errors.personOnePhone && errors.personOnePhone.message}</p>
                                                ) : <p>Phone</p>}

                                                <input
                                                    type="text"
                                                    name="personOnePhone"
                                                    className="form-control shadow-none"
                                                    placeholder="Enter phone number"
                                                    ref={register({
                                                        required: "Phone number required",
                                                        pattern: {
                                                            value: /^(?:\+88|01)?\d+$/,
                                                            message: "Phone number is not valid."
                                                        }
                                                    })}
                                                />
                                            </div>
                                        </div>

                                        {/* E-mail */}
                                        <div className="col-12 col-lg-4">
                                            <div className="form-group mb-4">
                                                {errors.personOneEmail && errors.personOneEmail.message ? (
                                                    <p className="text-danger">{errors.personOneEmail && errors.personOneEmail.message}</p>
                                                ) : <p>E-mail</p>}

                                                <input
                                                    type="text"
                                                    name="personOneEmail"
                                                    className="form-control shadow-none"
                                                    placeholder="Enter e-mail"
                                                    ref={register({
                                                        required: "E-mail is required",
                                                        pattern: {
                                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                            message: "Invalid email address"
                                                        }
                                                    })}
                                                />
                                            </div>
                                        </div>
                                    </div>


                                    {/* Contact person 2 */}
                                    <div className="row">
                                        <div className="col-12 pt-2">
                                            <p className="text-muted mb-0">Contact person 2</p>
                                            <hr />
                                        </div>

                                        {/* Name */}
                                        <div className="col-12 col-lg-4">
                                            <div className="form-group mb-4">
                                                {errors.personTwoName && errors.personTwoName.message ? (
                                                    <p className="text-danger">{errors.personTwoName && errors.personTwoName.message}</p>
                                                ) : <p>Name</p>}

                                                <input
                                                    type="text"
                                                    name="personTwoName"
                                                    className="form-control shadow-none"
                                                    placeholder="Enter name"
                                                    ref={register({
                                                        required: "Name is required"
                                                    })}
                                                />
                                            </div>
                                        </div>

                                        {/* Phone */}
                                        <div className="col-12 col-lg-4">
                                            <div className="form-group mb-4">
                                                {errors.personTwoPhone && errors.personTwoPhone.message ? (
                                                    <p className="text-danger">{errors.personTwoPhone && errors.personTwoPhone.message}</p>
                                                ) : <p>Phone</p>}

                                                <input
                                                    type="text"
                                                    name="personTwoPhone"
                                                    className="form-control shadow-none"
                                                    placeholder="Enter phone number"
                                                    ref={register({
                                                        required: "Phone number required",
                                                        pattern: {
                                                            value: /^(?:\+88|01)?\d+$/,
                                                            message: "Phone number is not valid."
                                                        }
                                                    })}
                                                />
                                            </div>
                                        </div>

                                        {/* E-mail */}
                                        <div className="col-12 col-lg-4">
                                            <div className="form-group mb-4">
                                                {errors.personTwoEmail && errors.personTwoEmail.message ? (
                                                    <p className="text-danger">{errors.personTwoEmail && errors.personTwoEmail.message}</p>
                                                ) : <p>E-mail</p>}

                                                <input
                                                    type="text"
                                                    name="personTwoEmail"
                                                    className="form-control shadow-none"
                                                    placeholder="Enter e-mail"
                                                    ref={register({
                                                        required: "E-mail is required",
                                                        pattern: {
                                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                            message: "Invalid email address"
                                                        }
                                                    })}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Management info */}
                                    <div className="row">
                                        <div className="col-12 pt-2">
                                            <p className="text-muted mb-0">Management info</p>
                                            <hr />
                                        </div>

                                        {/* Key Account Manager */}
                                        <div className="col-12 col-lg-6">
                                            <div className="form-group mb-4">
                                                {errors.keyAccountManager && errors.keyAccountManager.message ? (
                                                    <p className="text-danger">{errors.keyAccountManager && errors.keyAccountManager.message}</p>
                                                ) : <p>Key account manager</p>}

                                                <select
                                                    name="keyAccountManager"
                                                    className="form-control shadow-none"
                                                    ref={register({
                                                        required: "Manager is required"
                                                    })}
                                                >
                                                    <option value="Iftekhar Ahmed">Iftekhar Ahmed</option>
                                                </select>
                                            </div>
                                        </div>

                                        {/* Secondary Key Account Manager */}
                                        <div className="col-12 col-lg-6">
                                            <div className="form-group mb-4">
                                                {errors.secondaryKeyAccountManager && errors.secondaryKeyAccountManager.message ? (
                                                    <p className="text-danger">{errors.secondaryKeyAccountManager && errors.secondaryKeyAccountManager.message}</p>
                                                ) : <p>Secondayr key account manager</p>}

                                                <select
                                                    name="secondaryKeyAccountManager"
                                                    className="form-control shadow-none"
                                                    ref={register({
                                                        required: "Manager is required"
                                                    })}
                                                >
                                                    <option value="Peona Afrose">Peona Afrose</option>
                                                </select>
                                            </div>
                                        </div>

                                    </div>

                                    {/* Thumbnail upload & preview Container */}
                                    <div className="row mb-3 mb-lg-4">
                                        <div className="col-12">
                                            <div>
                                                {thumbnail.error ?
                                                    <p className="text-danger mb-0 ml-2">{thumbnail.error}</p>
                                                    : <p className="mb-0 ml-2">Thumbnail</p>}
                                            </div>

                                            <div className="d-flex">
                                                <div className="thumbnail-container">
                                                    <div className="image border">
                                                        <input
                                                            type="file"
                                                            accept=".jpg, .png, .jpeg"
                                                            className="upload"
                                                            onChange={thumbnailHandeller}
                                                        />
                                                        <div className="flex-center flex-column">
                                                            <Icon icon={plus} size={22} />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* image preview */}
                                                {thumbnail.preview ?
                                                    <div className="thumbnail-container text-center">
                                                        <div className="image border">
                                                            <img src={thumbnail.preview} className="img-fluid" alt="..." />
                                                        </div>
                                                    </div>
                                                    : null}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-12 text-right">
                                            <button type="submit" className="btn shadow-none" disabled={isLoading}>
                                                {isLoading ? 'Creating...' : 'Create'}
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
}

export default Create;
