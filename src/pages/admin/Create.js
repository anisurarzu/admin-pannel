import React, { useCallback, useEffect, useState } from 'react'
import './style.scss'
import _ from 'lodash'
import Icon from 'react-icons-kit'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { chevronLeft } from 'react-icons-kit/feather'

import { SingleSelect } from '../../components/select'
import Requests from '../../utils/Requests/Index'

const Create = () => {
    const { register, handleSubmit, setError, clearErrors, errors } = useForm()
    const [isLoading, setLoading] = useState(false)
    const [roles, setRoles] = useState({ value: null, options: [] })
    const [header] = useState({
        headers: { Authorization: "Bearer " + localStorage.getItem('token') }
    })

    // Fetch Data
    const fetchData = useCallback(async () => {
        try {
            let options = []

            const response = await Requests.Role.Index(header)
            if (response && response.status) {
                if (response.data && response.data.length) {
                    for (let i = 0; i < response.data.length; i++) {
                        const element = response.data[i]
                        options.push({ label: _.capitalize(element.role), value: element._id })
                    }
                }
            }

            setRoles(exRoles => ({ ...exRoles, options: options }))
        } catch (error) {
            if (error) console.log(error)
        }
    }, [header])

    useEffect(() => {
        fetchData()
    }, [header, fetchData])

    // Handle role
    const handleRole = event => {
        setRoles(exRoles => ({ ...exRoles, value: event.value }))
        clearErrors(["role"])
    }

    // Submit Form
    const onSubmit = async (data) => {

        if (!roles.value) {
            return setError("role", {
                type: "manual",
                message: "Role is required!"
            })
        }

        let formData = { ...data, role: roles.value }

        setLoading(true)
        await Requests.Admin.Store(formData, header)
        setLoading(false)
    }


    return (
        <div className="admin-create pb-4">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12 col-padding">
                        <div className="card border-0 shadow-sm">
                            <div className="card-header p-3 p-lg-4 bg-white">
                                <div className="d-flex">
                                    <div><h6 className="mb-0">Create Admin</h6></div>
                                    <div className="ml-auto">
                                        <Link
                                            to="/dashboard/admin"
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
                                        <div className="col-12">
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

                                        {/* Present address */}
                                        <div className="col-12">
                                            <div className="form-group mb-4">
                                                {errors.presentAddress && errors.presentAddress.message ? (
                                                    <p className="text-danger">{errors.presentAddress && errors.presentAddress.message}</p>
                                                ) : <p>Present address</p>}

                                                <input
                                                    type="text"
                                                    name="presentAddress"
                                                    className="form-control shadow-none"
                                                    placeholder="Enter present address"
                                                    ref={register({
                                                        required: "Present address is required"
                                                    })}
                                                />
                                            </div>
                                        </div>

                                        {/* permanent address */}
                                        <div className="col-12">
                                            <div className="form-group mb-4">
                                                {errors.permanentAddress && errors.permanentAddress.message ? (
                                                    <p className="text-danger">{errors.permanentAddress && errors.permanentAddress.message}</p>
                                                ) : <p>Permanent address</p>}

                                                <input
                                                    type="text"
                                                    name="permanentAddress"
                                                    className="form-control shadow-none"
                                                    placeholder="Enter permanent address"
                                                    ref={register({
                                                        required: "Permanent address is required"
                                                    })}
                                                />
                                            </div>
                                        </div>


                                        {/* Role */}
                                        <div className="col-12 col-lg-6">
                                            <div className="form-group mb-4">
                                                {errors.role && errors.role.message ?
                                                    <p className="text-danger">{errors.role && errors.role.message}</p>
                                                    : <p>Role</p>}

                                                <SingleSelect
                                                    placeholder="role"
                                                    options={roles.options}
                                                    value={data => handleRole(data)}
                                                />
                                            </div>
                                        </div>


                                        {/* Password */}
                                        <div className="col-12 col-lg-6">
                                            <div className="form-group mb-4">
                                                {errors.password && errors.password.message ? (
                                                    <p className="text-danger">{errors.password && errors.password.message}</p>
                                                ) : <p>Password</p>
                                                }

                                                <input
                                                    type="password"
                                                    name="password"
                                                    className="form-control shadow-none"
                                                    placeholder="Enter password"
                                                    ref={register({
                                                        required: "Please enter password",
                                                        minLength: {
                                                            value: 8,
                                                            message: "Minimun length 8 character"
                                                        }
                                                    })}
                                                />
                                            </div>
                                        </div>

                                        <div className="col-12 text-right">
                                            <button type="submit" className="btn shadow-none" disabled={isLoading}>
                                                {isLoading ? <span>Submitting...</span> : <span>Submit</span>}
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

export default Create;
