import React, { useCallback, useEffect, useState } from 'react'
import Icon from 'react-icons-kit'
import { Link } from 'react-router-dom'
import { plus, edit2, trash2 } from 'react-icons-kit/feather'
import { DataTable } from '../../components/table/Index'
import { CustomButton } from '../../components/button'
import { DeleteModal } from '../../components/modal/Delete'

import Requests from '../../utils/Requests/Index'

const Index = () => {
    const [isLoading, setLoading] = useState(true)
    const [data, setData] = useState([])
    const [isDelete, setDelete] = useState({ value: null, show: false, loading: false })
    const [header] = useState({
        headers: { Authorization: "Bearer " + localStorage.getItem('token') }
    })

    // Fetch data
    const fetchData = useCallback(async () => {
        const response = await Requests.Role.Index(header)
        if (response) setData(response.data)

        setLoading(false)
    }, [header])

    useEffect(() => {
        fetchData()
    }, [header, fetchData])

    // Handle delete
    const handleDelete = async () => {
        setDelete({ ...isDelete, loading: true })

        await Requests.Role.Delete(isDelete.value._id, header)
        fetchData()
        setDelete({ ...isDelete, show: false, loading: false })
    }

    const customStyles = {
        rows: {
            style: {
                minHeight: '100px auto',
            }
        }
    }

    const columns = [
        {
            name: 'Role',
            sortable: true,
            selector: row => row.role
        },
        {
            name: 'Permissions',
            sortable: true,
            selector: row =>
                <ul className="pl-3 my-2">
                    {row.rights && row.rights.map((permission, i) =>
                        <li key={i}><p className="text-capitalize mb-1">{permission}</p></li>
                    )}
                </ul>
        },
        {
            name: 'Action',
            grow: 0,
            minWidth: '150px',
            cell: row =>
                <div className="py-2">
                    <Link to={`/dashboard/role/${row._id}/edit`}>
                        <CustomButton
                            style={{ padding: "6px 10px" }}
                            className="btn-success rounded-circle border-0 mr-1"
                        ><Icon icon={edit2} size={16} />
                        </CustomButton>
                    </Link>

                    <CustomButton
                        style={{ padding: "6px 10px" }}
                        className="btn-danger rounded-circle border-0"
                        onClick={() => setDelete({ value: row, show: true })}
                    ><Icon icon={trash2} size={16} />
                    </CustomButton>
                </div>
        }
    ]

    return (
        <div className="banner-index pb-4">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12 col-padding">
                        <div className="card border-0 shadow-sm">
                            <div className="card-header p-3 p-lg-4 bg-white">
                                <div className="d-flex">
                                    <div><h6 className="mb-0">Role List</h6></div>
                                    <div className="ml-auto">
                                        <Link
                                            to="/dashboard/role/create"
                                            type="button"
                                            className="btn shadow-none rounded-circle"
                                        >
                                            <Icon icon={plus} size={22} />
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {/* Data table component for show data */}
                            <div className="card-body p-0">
                                <DataTable
                                    fixedHeader
                                    fixedHeaderScrollHeight="580px"
                                    customStyles={customStyles}
                                    columns={columns}
                                    data={data}
                                    loading={isLoading}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete confirmation */}
            <DeleteModal
                show={isDelete.show}
                loading={isDelete.loading}
                message={<h6>Want to delete this role ?</h6>}
                onHide={() => setDelete({ value: null, show: false, loading: false })}
                doDelete={handleDelete}
            />
        </div>
    );
}

export default Index;