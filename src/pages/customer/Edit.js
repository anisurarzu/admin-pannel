import React, { useCallback, useEffect, useState } from 'react'
import './style.scss'
import 'react-toastify/dist/ReactToastify.css'
import Icon from 'react-icons-kit'
import { toast } from 'react-toastify'
import { Link, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { chevronLeft } from 'react-icons-kit/feather'
import Requests from '../../utils/Requests/Index'

import { PreLoader } from '../../components/loading/Index'

toast.configure({ autoClose: 2000 })
const Edit = () => {
    const { id } = useParams()
    const { register, handleSubmit, errors } = useForm()
    const [customer, setCustomer] = useState({})
    const [isLoading, setLoading] = useState(true)
    const [isUpdate, setUpdate] = useState(false)
    const [header] = useState({
        headers: { Authorization: "Bearer " + localStorage.getItem('token') }
    })

    // Fetch data
    const fetchData = useCallback(async () => {
        const data = await Requests.Customer.Show(id, header)
        if (data) setCustomer(data)
        setLoading(false)
    }, [id, header])

    useEffect(() => {
        fetchData()
    }, [id, header, fetchData])

    // Submit Form
    const onSubmit = async (data) => {
        try {
            setUpdate(true)
            await Requests.Customer.Update(id, data, header)
            setUpdate(false)
        } catch (error) {
            if (error) console.log(error)
        }
    }

    if (isLoading) return <PreLoader />

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
                                            defaultValue={customer ? customer.name : null}
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
                                            defaultValue={customer ? customer.email : null}
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

                                    {/* Phone */}
                                    <div className="form-group mb-4">
                                        {errors.phone && errors.phone.message ? (
                                            <p className="text-danger">{errors.phone && errors.phone.message}</p>
                                        ) : <p>Phone</p>}

                                        <input
                                            type="text"
                                            name="phone"
                                            defaultValue={customer ? customer.phone : null}
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

                                    <div className="text-right">
                                        <button type="submit" className="btn shadow-none" disabled={isUpdate}>
                                            {isUpdate ? 'Updating...' : 'Update'}
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

export default Edit;
