import React, { useCallback, useEffect, useState } from 'react'
import Icon from 'react-icons-kit'
import {
    trash2,
    checkCircle,
    alertTriangle,
    x
} from 'react-icons-kit/feather'

import { CustomButton } from '../../components/button'
import { DataTable } from '../../components/table/Index'
import { DeleteModal } from '../../components/modal/Delete'
import { Container } from '../../components/container'
import { Card } from '../../components/card/Index'
import { SearchableSelect, SingleSelect } from '../../components/select'

import Requests from '../../utils/Requests/Index'


const Index = () => {
    const [isLoading, setLoading] = useState(true)
    const [limit, setLimit] = useState(10)
    const [totalItems, setTotalItems] = useState(0)

    const [data, setData] = useState([])
    // const [isUpdate, setUpdate] = useState(null)
    const [closeFilter, setCloseFilter] = useState(false)
    const [isDelete, setDelete] = useState({ value: null, show: false, loading: false })
    const [header] = useState({
        headers: { Authorization: "Bearer " + localStorage.getItem('token') }
    })

    // Fetch data
    const fetchData = useCallback(async (page) => {
        setLoading(true)
        const response = await Requests.RatingReview.Index(page, limit, header)

        if (response) {
            setData(response.data)
            setTotalItems(response.pagination ? response.pagination.items : 0)
        }

        setLoading(false)
    }, [limit, header])

    // handle page change
    const handlePageChange = page => fetchData(page)

    // handle limit change
    const handleLimitChange = async (newLimit, page) => {
        setLoading(true)
        const response = await Requests.RatingReview.Index(page, newLimit, header)

        setData(response.data)
        setLimit(newLimit)
        setLoading(false)
    }

    useEffect(() => {
        fetchData(1)
    }, [header, fetchData])

    // handle update
    // const handleUpdate = async (id, status) => {
    //     setUpdate(id)
    //     await Requests.RatingReview.Update(id, status, header)
    //     fetchData(1)
    //     setUpdate(null)
    // }

    // Handle delete
    const handleDelete = async () => {
        setDelete({ ...isDelete, loading: true })

        await Requests.RatingReview.Delete(isDelete.value._id, header)
        fetchData()
        setDelete({ ...isDelete, show: false, loading: false })
    }

    // Handle search item
    const handleSearchItem = async ({ inputValue, field }) => {
        let response

        if (!field) response = { data: [] }

        if (field === "customer") {
            response = await Requests.Options.Customer(inputValue, header)
        }

        if (field === "product") {
            response = await Requests.Options.Product(inputValue, header)
        }

        if (response.data && response.data.length) return response.data
        return []
    }

    // Handle filter
    const handleFilter = async (value, field) => {
        setLoading(true)
        const response = await Requests.RatingReview.FilterItems(value, field, header)
        if (response) setData(response.data)
        setLoading(false)
    }

    const columns = [
        {
            name: 'Customer',
            width: "200px",
            selector: row => row.user,
            sortable: true
        },
        {
            name: '',
            grow: 0,
            cell: row => <img height={40} width={50} alt={"Product"} src={row.product.thumbnail} />
        },
        {
            name: 'Product',
            grow: 0,
            selector: row => row.product.name,
            sortable: true
        },
        {
            name: 'Rating',
            grow: 0,
            selector: row => row.rating,
            sortable: true
        },
        {
            name: 'Type',
            grow: 0,
            sortable: true,
            cell: row =>
                row.type === "Unverified" ?
                    <span className="text-danger">{row.type}</span>
                    : <span className="text-success">{row.type}</span>
        },
        {
            name: 'Review',
            grow: 1,
            selector: row => row.review,
            sortable: true
        },
        {
            name: 'Status',
            grow: 0,
            cell: row =>
                row.status === "Pending" ?
                    <Icon icon={alertTriangle} className="text-danger">{row.status}</Icon>
                    : <Icon icon={checkCircle} className="text-success">{row.status}</Icon>
        },
        {
            name: 'Action',
            grow: 0,
            minWidth: '80px',
            cell: row =>
                <div>
                    {/* {row.status === 'Pending' ?
                        <CustomButton
                            style={{ padding: "6px 10px", fontSize: 14, fontWeight: 600 }}
                            className="btn-success rounded border-0 mr-2"
                            onClick={() => handleUpdate(row._id, 'Approved')}
                            disabled={isUpdate && isUpdate === row._id}
                        >{isUpdate && isUpdate === row._id ? 'Loading...' : 'Approve'}</CustomButton>
                        :
                        <CustomButton
                            style={{ padding: "6px 10px", fontSize: 14, fontWeight: 600 }}
                            className="btn-danger rounded border-0 mr-2"
                            onClick={() => handleUpdate(row._id, 'Pending')}
                            disabled={isUpdate && isUpdate === row._id}
                        >{isUpdate && isUpdate === row._id ? 'Loading...' : 'Remove'}</CustomButton>
                    } */}

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

                                {/* title container */}
                                <div className="d-flex mb-3">
                                    <div><h6 className="mb-0">Ratings & Reviews</h6></div>
                                    {closeFilter ?
                                        <div className="ml-auto">

                                            <CustomButton
                                                className="btn-danger border-0 rounded-circle circle__padding ml-1"
                                                onClick={() => {
                                                    fetchData(1)
                                                    setCloseFilter(false)
                                                }}
                                            >
                                                <Icon icon={x} size={22} />
                                            </CustomButton>
                                        </div>
                                        : null
                                    }
                                </div>

                                {/* Filter items */}
                                <Container.Row className="px-2">

                                    {/* Rating Filter */}
                                    <Container.Column className="col-sm-6 col-md-4 px-1 mb-2">
                                        <SingleSelect
                                            placeholder="rating"
                                            borderRadius={25}
                                            options={[
                                                { label: 5, value: 5 },
                                                { label: 4, value: 4 },
                                                { label: 3, value: 3 },
                                                { label: 2, value: 2 },
                                                { label: 1, value: 1 }
                                            ]}
                                            value={event => handleFilter(event.value, "rating")}
                                        />
                                    </Container.Column>

                                    {/* Type Filter */}
                                    <Container.Column className="col-sm-6 col-md-4 px-1 mb-2">
                                        <SingleSelect
                                            placeholder="type"
                                            borderRadius={25}
                                            options={[
                                                { label: "Verified", value: "Verified" },
                                                { label: "Unverified", value: "Unverified" }
                                            ]}
                                            value={event => handleFilter(event.value, "type")}
                                        />
                                    </Container.Column>

                                    {/* Status Filter */}
                                    <Container.Column className="col-sm-6 col-md-4 px-1 mb-2">
                                        <SingleSelect
                                            placeholder="status"
                                            borderRadius={25}
                                            options={[
                                                { label: "Pending", value: "Pending" },
                                                { label: "Approved", value: "Approved" }
                                            ]}
                                            value={event => handleFilter(event.value, "status")}
                                        />
                                    </Container.Column>

                                    {/* Customer filter */}
                                    <Container.Column className="col-sm-6 px-1 mb-2">
                                        <SearchableSelect
                                            placeholder="Type customer ..."
                                            borderRadius={25}
                                            search={inputValue => handleSearchItem({ inputValue, field: "customer" })}
                                            values={data => handleFilter(data.value, "customer")}
                                        />
                                    </Container.Column>

                                    {/* Product filter */}
                                    <Container.Column className="col-sm-6 px-1 mb-2">
                                        <SearchableSelect
                                            placeholder="Type product ..."
                                            borderRadius={25}
                                            search={inputValue => handleSearchItem({ inputValue, field: "product" })}
                                            values={data => handleFilter(data.value, "product")}
                                        />
                                    </Container.Column>
                                </Container.Row>
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
                message={<h6>Want to delete this Review ?</h6>}
                onHide={() => setDelete({ value: null, show: false, loading: false })}
                doDelete={handleDelete}
            />
        </div>
    );
};

export default Index;