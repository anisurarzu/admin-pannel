import React, { useCallback, useEffect, useState } from 'react'
import _ from 'lodash'
import Icon from 'react-icons-kit'
import { Link, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { chevronLeft } from 'react-icons-kit/feather'
import { MultiSelect } from '../../components/select'
import { PreLoader } from '../../components/loading/Index'

import Requests from '../../utils/Requests/Index'


const Create = () => {
    const { id } = useParams()
    const { register, handleSubmit, setError, clearErrors, errors } = useForm()
    const [data, setData] = useState(null)
    const [isUpdate, setUpdate] = useState(false)
    const [isLoading, setLoading] = useState(true)
    const [permissions, setPermissions] = useState({ values: [], options: [] })
    const [header] = useState({
        headers: { Authorization: "Bearer " + localStorage.getItem('token') }
    })

    // fetch permissions
    const fetchData = useCallback(async () => {
        try {
            let options = []
            let selectedOptions = []

            const response = await Requests.Role.Routes(header)
            const roleResponse = await Requests.Role.Show(id, header)

            if (roleResponse && roleResponse.status) {
                setData(roleResponse.data)

                if (roleResponse.data.rights && roleResponse.data.rights.length) {
                    for (let i = 0; i < roleResponse.data.rights.length; i++) {
                        const element = roleResponse.data.rights[i]
                        selectedOptions.push({ _id: element, name: _.capitalize(element) })
                    }
                }
            }

            if (response.data && response.data.length) {
                for (let i = 0; i < response.data.length; i++) {
                    const element = response.data[i]
                    options.push({ label: _.capitalize(element.group), value: element.group })
                }
            }

            setPermissions({ options: options, values: selectedOptions })
            setLoading(false)
        } catch (error) {
            if (error) console.log(error)
        }
    }, [id, header])

    useEffect(() => {
        fetchData()
    }, [id, header, fetchData])

    // Handle permission
    const handlePermission = data => {
        setPermissions(exPermission => ({ ...exPermission, values: data.map(item => ({ _id: item.value, name: _.capitalize(item.label) })) }))
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
                rights: permissions.values.map(item => item._id)
            }

            setUpdate(true)
            await Requests.Role.Update(id, formData, header)
            setUpdate(false)
        } catch (error) {
            if (error) console.log(error)
        }
    }

    if (isLoading) return <PreLoader />

    return (
        <div className="store-banner pb-4">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12 col-padding">
                        <div className="card border-0 shadow-sm">
                            <div className="card-header p-3 p-lg-4 bg-white">
                                <div className="d-flex">
                                    <div><h6 className="mb-0">Edit Role</h6></div>
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
                                            defaultValue={data && data.role ? data.role : null}
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
                                            deafult={permissions.values}
                                            values={data => handlePermission(data)}
                                            refs={register}
                                        />
                                    </div>

                                    <div className="text-right">
                                        <button type="submit" className="btn shadow-none" disabled={isUpdate}>
                                            {isUpdate ? 'Updating ...' : 'Update'}
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