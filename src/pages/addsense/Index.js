
import React, { useCallback, useEffect, useState } from 'react'
import './style.scss'
import Icon from 'react-icons-kit'
import { Link } from 'react-router-dom'
import { plus, trash2 } from 'react-icons-kit/feather'
import { CustomButton } from '../../components/button'
import { DataTable } from '../../components/table/Index'
import { DeleteModal } from '../../components/modal/Delete'
import Requests from '../../utils/Requests/Index'
import { edit2 } from 'react-icons-kit/feather'

const Index = () => {
    const [isLoading, setLoading] = useState(true)
    const [data, setData] = useState([])
    const [isDelete, setDelete] = useState({ value: null, show: false, loading: false })
    const [header] = useState({
        headers: { Authorization: "Bearer " + localStorage.getItem('token') }
    })

    // Fetch data
    const fetchData = useCallback(async () => {
        const response = await Requests.Addsense.Index(header)
        if (response) setData(response.data)

        setLoading(false)
    }, [header])

    useEffect(() => {
        fetchData()
    }, [header, fetchData])

    const columns = [
        {
            name: 'Image',
            grow: 1,
            cell: row => <img height={40} style={{ maxWidth: 150 }} alt={"Ads"} src={row.image} />
        },
        {
            name: 'Assign To',
            selector: row => row.type ? row.type : row.link.slice(0, 25) + ' ...',
            sortable: true
        },
        {
            name: 'Action',
            grow: 0,
            minWidth: '150px',
            cell: row =>
                <div>
                    <Link to={`/dashboard/addsense/${row._id}/edit`}>
                        <CustomButton
                            style={{ padding: "6px 10px" }}
                            className="btn-success rounded-circle border-0 mr-1"
                        ><Icon icon={edit2} size={16} />
                        </CustomButton>
                    </Link>

                    <CustomButton
                        style={{ padding: "6px 10px" }}
                        className="btn-danger rounded-circle border-0 mr-1"
                        onClick={() => setDelete({ value: row, show: true })}
                    ><Icon icon={trash2} size={16} />
                    </CustomButton>
                </div>

        }
    ]

    // Handle delete
    const handleDelete = async () => {
        setDelete({ ...isDelete, loading: true })

        await Requests.Addsense.Delete(isDelete.value._id, header)
        fetchData()
        setDelete({ ...isDelete, show: false, loading: false })
    }

    return (
        <div className="addsense-index pb-4">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12 col-padding">
                        <div className="card border-0 shadow-sm">
                            <div className="card-header p-3 p-lg-4 bg-white">
                                <div className="d-flex">
                                    <div><h6 className="mb-0">Addsense List</h6></div>
                                    <div className="ml-auto">
                                        <Link
                                            to="/dashboard/addsense/store"
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
                message={
                    <div>
                        <h6>Want to delete this Add ?</h6>
                        <img src={isDelete.value ? isDelete.value.image : null} className="img-fluid" height={150} alt="Banner" />
                    </div>
                }
                onHide={() => setDelete({ value: null, show: false, loading: false })}
                doDelete={handleDelete}
            />
        </div>
    );
}

export default Index;