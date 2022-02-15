import React, { useEffect, useState } from 'react'
import './style.scss'
import _ from 'lodash'
import Icon from 'react-icons-kit'
import { Form } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { Link, useParams } from 'react-router-dom'
import { chevronLeft } from 'react-icons-kit/feather'
import { SingleSelect } from '../../components/select'
import { PreLoader } from '../../components/loading/Index'

import Requests from '../../utils/Requests/Index'


const Edit = () => {
    const { id } = useParams()
    const { register, handleSubmit, setError, clearErrors, errors } = useForm()
    const [admin, setAdmin] = useState({})
    const [isUpdate, setUpdate] = useState(false)
    const [isLoading, setLoading] = useState(false)
    const [roles, setRoles] = useState({ value: null, options: [] })
    const [status, setStatus] = useState(null)
    const [header] = useState({
        headers: { Authorization: "Bearer " + localStorage.getItem('token') }
    })

    useEffect(() => {
        const getData = async () => {
            let options = []
            setLoading(true)

            const response = await Requests.Admin.Show(id, header)
            const rolesRes = await Requests.Role.Index(header)
            if (rolesRes && rolesRes.status) {
                if (rolesRes.data && rolesRes.data.length) {
                    for (let i = 0; i < rolesRes.data.length; i++) {
                        const element = rolesRes.data[i]
                        options.push({ label: _.capitalize(element.role), value: element._id })
                    }
                }
            }

            if (response) {
                setAdmin(response.admin)
                setStatus(response.admin.accountStatus)
                setRoles(exRoles => ({ ...exRoles, options: options, value: { value: response.admin.role._id, label: response.admin.role.role } }))
            }

            setLoading(false)
        }

        getData()
    }, [id, header])

    // Handle role
    const handleRole = event => {
        setRoles(exRoles => ({ ...exRoles, value: event }))
        clearErrors(["role"])
    }

    // Handle checkbox
    const handleCheckBox = event => setStatus(event.target.value)

    // Submit Form
    const onSubmit = async (data) => {
        if (!roles.value) {
            return setError("role", {
                type: "manual",
                message: "Role is required!"
            })
        }

        let formData = { ...data, role: roles.value.value, accountStatus: status }

        setUpdate(true)
        await Requests.Admin.Update(id, formData, header)
        setUpdate(false)
    }

    if (isLoading) return <PreLoader />

    return (
        <div className="admin-create pb-4">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12 col-padding">
                        <div className="card border-0 shadow-sm">
                            <div className="card-header p-3 p-lg-4 bg-white">
                                <div className="d-flex">
                                    <div><h6 className="mb-0">Edit Admin</h6></div>
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
                                                    defaultValue={admin.name}
                                                    className="form-control shadow-none"
                                                    placeholder="Enter name"
                                                    ref={register({
                                                        required: "Name is required"
                                                    })}
                                                />
                                            </div>
                                        </div>

                                        {/* E-mail */}
                                        <div className="col-12 col-lg-6">
                                            <div className="form-group mb-4">
                                                <p>E-mail</p>

                                                <input
                                                    type="text"
                                                    defaultValue={admin.email}
                                                    className="form-control shadow-none"
                                                    disabled
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
                                                    disabled
                                                    type="text"
                                                    defaultValue={admin.phone}
                                                    className="form-control shadow-none"
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
                                                    defaultValue={admin.address ? admin.address.presentAddress : null}
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
                                                    defaultValue={admin.address ? admin.address.permanentAddress : null}
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
                                                    deafult={roles.value ? { value: roles.value.value, label: roles.value.label } : null}
                                                    options={roles.options}
                                                    value={data => handleRole(data)}
                                                />
                                            </div>
                                        </div>

                                        {/* Active Status */}
                                        <div className="col-12 col-lg-6">
                                            <div className="input-group mb-4 pt-4">
                                                <Form.Group controlId="isActive">
                                                    <Form.Check
                                                        type="checkbox"
                                                        value="Active"
                                                        label="Active"
                                                        checked={status === 'Active'}
                                                        onChange={handleCheckBox}
                                                    />
                                                </Form.Group>

                                                <Form.Group className="ml-3" controlId="isDeactive">
                                                    <Form.Check
                                                        type="checkbox"
                                                        value="Deactive"
                                                        label="Deactive"
                                                        checked={status === 'Deactive'}
                                                        onChange={handleCheckBox}
                                                    />
                                                </Form.Group>
                                            </div>
                                        </div>

                                        <div className="col-12 text-right">
                                            <button type="submit" className="btn shadow-none" disabled={isUpdate}>
                                                {isUpdate ? <span>Updating...</span> : <span>Update</span>}
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