import React, { useCallback, useEffect, useState } from 'react'
// import './style.scss'
import Icon from 'react-icons-kit'
import { Link } from 'react-router-dom'
import { plus, trash2 } from 'react-icons-kit/feather'
import { CustomButton } from '../../../components/button'
import { Container } from '../../../components/container'
import { Card } from '../../../components/card/Index'

import { DataTable } from '../../../components/table/Index'
import { edit2 } from 'react-icons-kit/feather'
import { DeleteModal } from '../../../components/modal/Delete'
import Requests from '../../../utils/Requests/Index'


const Index = () => {
    const [data, setData] = useState([])
    const [limit, setLimit] = useState(10)
    const [totalItems, setTotalItems] = useState(0)

    const [isLoading, setLoading] = useState(true)
    const [searchLoading, setsearchLoading] = useState(false)

    const [isDelete, setDelete] = useState({ value: null, show: false, loading: false })
    const [header] = useState({
        headers: { Authorization: "Bearer " + localStorage.getItem('token') }
    })

    // Fetch data
    const fetchData = useCallback(async (page) => {
        setLoading(true)
        const response = await Requests.Services.Shipping.District.Index(page, limit, header)

        if (response) {
            setData(response.data)
            setTotalItems(response.pagination ? response.pagination.items : 0)
        }

        setLoading(false)
    }, [limit, header])

    // handle pagination
    const handlePageChange = page => fetchData(page)

    // handle limit
    const handleLimitChange = async (newLimit, page) => {
        setLoading(true)
        const response = await Requests.Services.Shipping.District.Index(page, newLimit, header)

        setData(response.data)
        setLimit(newLimit)
        setLoading(false)
    }

    useEffect(() => {
        fetchData(1)
    }, [header, fetchData])

    // Handle search
    const handleSearch = async data => {
        setsearchLoading(true)
        const response = await Requests.Services.Shipping.District.Search(data, header)
        if (response) setData(response.data)
        setsearchLoading(false)
    }

    // Handle search suggestion
    const handleSuggestion = async (value) => {
        let data = {
            results: [],
            message: null
        }
        const response = await Requests.Services.Shipping.District.Search(value, header)

        if (response && response.data && response.data.length) {
            for (let i = 0; i < response.data.length; i++) {
                const element = response.data[i]
                data.results.push(element.name)
            }
        } else {
            data.message = "No results found"
        }

        return data
    }

    // Handle delete
    const handleDelete = async () => {
        setDelete({ ...isDelete, loading: true })

        await Requests.Services.Shipping.District.Delete(isDelete.value._id, header)
        fetchData(1)
        setDelete({ ...isDelete, show: false, loading: false })
    }

    const columns = [
        {
            name: 'Name',
            selector: row => row.name || "N/A",
            sortable: true
        },
        {
            name: 'Bengali name',
            selector: row => row.bn_name || "N/A",
            sortable: true
        },
        {
            name: 'Division',
            selector: row => row.division && row.division.name ?
            row.division.bn_name?
            `${row.division.name} - ${row.division.bn_name}`
            : row.division.name : "N/A",
            sortable: true
        },
        {
            name: 'Action',
            grow: 0,
            minWidth: '110px',
            cell: row =>
                <div>
                    <Link to={`/dashboard/shipping/district/${row._id}/edit`}>
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
        <div className="pb-4">
            <Container.Fluid>
                <Container.Row>
                    <Container.Column className="col-padding">
                        <Card.Simple className="border-0">
                            <Card.Header className="bg-white border-0 p-3 p-lg-4">
                                <div className="d-flex">
                                    <div><h6 className="mb-0">District List</h6></div>
                                    <div className="ml-auto">
                                        <Link to="/dashboard/shipping/district/create">
                                            <CustomButton className="btn-primary border-0 rounded-circle circle__padding">
                                                <Icon icon={plus} size={22} />
                                            </CustomButton>
                                        </Link>
                                    </div>
                                </div>
                            </Card.Header>

                            <Card.Body className="p-0">
                                <DataTable
                                    fixedHeader
                                    fixedHeaderScrollHeight="580px"
                                    columns={columns}
                                    data={data}
                                    loading={isLoading}
                                    totalRows={totalItems}
                                    pagination={true}
                                    paginationServer={true}
                                    handlePerRowsChange={handleLimitChange}
                                    handlePageChange={handlePageChange}

                                    searchable
                                    placeholder={"Search district"}
                                    search={handleSearch}
                                    suggestion={handleSuggestion}
                                    searchLoading={searchLoading}
                                    clearSearch={() => fetchData(1)}
                                />
                            </Card.Body>
                        </Card.Simple>
                    </Container.Column>
                </Container.Row>
            </Container.Fluid>

            {/* Delete confirmation */}
            <DeleteModal
                show={isDelete.show}
                loading={isDelete.loading}
                message={
                    <div>
                        <h6>Want to delete this District ?</h6>
                        {/* <img src={isDelete.value ? isDelete.value.image : null} className="img-fluid" height={150} alt="Banner" /> */}
                    </div>
                }
                onHide={() => setDelete({ value: null, show: false, loading: false })}
                doDelete={handleDelete}
            />
        </div>
    );
}

export default Index;