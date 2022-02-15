import React, { useState } from 'react'
import './style.scss'
import 'react-toastify/dist/ReactToastify.css'
import Icon from 'react-icons-kit'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { chevronLeft } from 'react-icons-kit/feather'
import Requests from '../../utils/Requests/Index'

toast.configure({ autoClose: 2000 })
const Create = () => {
    const { register, handleSubmit, errors, reset } = useForm()
    const [isLoading, setLoading] = useState(false)
    const [header] = useState({
        headers: { Authorization: "Bearer " + localStorage.getItem('token') }
    })

    // Submit Form
    const onSubmit = async (data) => {
        try {
            setLoading(true)
            await Requests.Customer.Store(data, header)
            setLoading(false)
            reset()
        } catch (error) {
            if (error) console.log(error)
        }
    }

    return (
        <div className="store-customer pb-4">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12 col-padding">
                        <div className="card border-0 shadow-sm">
                            <div className="card-header p-3 p-lg-4 bg-white">
                                <div className="d-flex">
                                    <div><h6 className="mb-0">Create Customer</h6></div>
                                    <div className="ml-auto">
                                        <Link
                                            to="/dashboard/customer"
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

                                    {/* Name */}
                                    <div className="form-group mb-4">
                                        {errors.name && errors.name.message ? (
                                            <p className="text-danger">{errors.name && errors.name.message}</p>
                                        ) : <p>Name</p>}

                                        <input
                                            type="text"
                                            name="name"
                                            className="form-control shadow-none"
                                            placeholder="Enter customer name"
                                            ref={register({
                                                required: "Name is required"
                                            })}
                                        />
                                    </div>

                                    {/* E-mail */}
                                    <div className="form-group mb-4">
                                        {errors.email && errors.email.message ? (
                                            <p className="text-danger">{errors.email && errors.email.message}</p>
                                        ) : <p>E-mail</p>
                                        }

                                        <input
                                            type="text"
                                            name="email"
                                            className="form-control shadow-none"
                                            placeholder="Enter e-mail"
                                            ref={register({
                                                // required: "E-mail is required",
                                                pattern: {
                                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                    message: "Invalid email address"
                                                }
                                            })}
                                        />
                                    </div>

                                    {/* Phone */}
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
                                                required: "Phone is required",
                                                pattern: {
                                                    value: /^(?:\+88|01)?\d+$/,
                                                    message: "Phone number is not valid."
                                                }
                                            })}
                                        />
                                    </div>

                                     {/* District */}
                                     <div className="form-group mb-4">
                                        {errors.district && errors.district.message ? (
                                            <p className="text-danger">{errors.district && errors.district.message}</p>
                                        ) : <p>District</p>}

                                        <input
                                            type="text"
                                            name="district"
                                            className="form-control shadow-none"
                                            placeholder="Enter district"
                                            ref={register({
                                                required: "District is required"
                                            })}
                                        />
                                    </div>

                                    {/* Password */}
                                    <div className="form-group mb-4">
                                        <p>Password</p>

                                        <input
                                            type="text"
                                            readOnly
                                            className="form-control shadow-none"
                                            placeholder="Deafult password (12345678)"
                                        />
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
