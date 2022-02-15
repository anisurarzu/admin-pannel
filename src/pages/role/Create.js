import React, { useCallback, useEffect, useState } from 'react'
import _ from 'lodash'
import Icon from 'react-icons-kit'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { chevronLeft } from 'react-icons-kit/feather'
import { MultiSelect } from '../../components/select'

import Requests from '../../utils/Requests/Index'

const Create = () => {
    const { register, handleSubmit, setError, clearErrors, errors } = useForm()
    const [isLoading, setLoading] = useState(false)
    const [permissions, setPermissions] = useState({ values: [], options: [] })
    const [header] = useState({
        headers: { Authorization: "Bearer " + localStorage.getItem('token') }
    })

    // fetch permissions
    const fetchData = useCallback(async () => {
        try {
            let options = []

            const response = await Requests.Role.Routes(header)
            if (response.data && response.data.length) {
                for (let i = 0; i < response.data.length; i++) {
                    const element = response.data[i]
                    options.push({ label: _.capitalize(element.group), value: element.group })
                }
            }

            setPermissions(exPermission => ({ ...exPermission, options: options }))
        } catch (error) {
            if (error) console.log(error)
        }
    }, [header])

    useEffect(() => {
        fetchData()
    }, [header, fetchData])

    // Handle permission
    const handlePermission = data => {
        setPermissions(exPermission => ({ ...exPermission, values: data }))
        clearErrors(["permission"])
    }

    // Submit Form
    const onSubmit = async (data) => {
        try {
            if (!permissions.values.length) {
                return setError("permission", {
                    type: "manual",
                    message: "Permission is required!"
                })
            }

            const formData = {
                ...data,
                rights: permissions.values.map(item => item.value)
            }

            setLoading(true)
            await Requests.Role.Store(formData, header)
            setLoading(false)
        } catch (error) {
            if (error) console.log(error)
        }
    }

    return (
        <div className="store-banner pb-4">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12 col-padding">
                        <div className="card border-0 shadow-sm">
                            <div className="card-header p-3 p-lg-4 bg-white">
                                <div className="d-flex">
                                    <div><h6 className="mb-0">Create Role</h6></div>
                                    <div className="ml-auto">
                                        <Link
                                            to="/dashboard/role"
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

                                    {/* Role */}
                                    <div className="form-group mb-4">
                                        {errors.role && errors.role.message ?
                                            <p className="text-danger">{errors.role && errors.role.message}</p>
                                            : <p>Role</p>}

                                        <input
                                            type="text"
                                            name="role"
                                            className="form-control shadow-none"
                                            placeholder="Enter role title"
                                            ref={register({ required: "Role title is required" })}
                                        />
                                    </div>

                                    {/* Permission */}
                                    <div className="form-group mb-4">
                                        {errors.permission && errors.permission.message ?
                                            <p className="text-danger">{errors.permission && errors.permission.message}</p>
                                            : <p>Select perission</p>}

                                        <MultiSelect
                                            placeholder="permission"
                                            options={permissions.options}
                                            values={data => handlePermission(data)}
                                            refs={register}
                                        />
                                    </div>

                                    <div className="text-right">
                                        <button type="submit" className="btn shadow-none" disabled={isLoading}>
                                            {isLoading ? 'Creating ...' : 'Create'}
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