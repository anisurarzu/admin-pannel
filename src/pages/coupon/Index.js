import React, { useCallback, useEffect, useState } from 'react'
import './style.scss'
import Icon from 'react-icons-kit'
import { Link } from 'react-router-dom'
import { plus, eye, edit2, trash2, x } from 'react-icons-kit/feather'
import { DataTable } from '../../components/table/Index'
import { CustomButton } from '../../components/button'
import { Container } from '../../components/container'
import { Card } from '../../components/card/Index'
import { formatDateWithAMPM } from '../../utils/Helpers'

import { DeleteModal } from '../../components/modal/Delete'
import { RangeFilter } from '../../components/rangeFilter/Index'
import { SingleSelect } from '../../components/select'

import Requests from '../../utils/Requests/Index'

const Index = () => {
    const [isLoading, setLoading] = useState(true)
    const [limit, setLimit] = useState(10)
    const [totalItems, setTotalItems] = useState(0)

    const [data, setData] = useState([])
    const [closeFilter, setCloseFilter] = useState(false)
    const [searchLoading, setsearchLoading] = useState(false)
    const [isRangeFilterLoading, setRangeFilterLoading] = useState(false)
    const [isDelete, setDelete] = useState({ value: null, show: false, loading: false })
    const [header] = useState({
        headers: { Authorization: "Bearer " + localStorage.getItem('token') }
    })

    // Fetch data
    const fetchData = useCallback(async (page) => {
        setLoading(true)
        const response = await Requests.Coupon.Index(page, limit, header)

        if (response) {
            setData(response.data)
            setTotalItems(response.pagination ? response.pagination.items : 0)
        }
        setLoading(false)
    }, [limit, header])

    const handlePageChange = page => fetchData(page)

    const handleLimitChange = async (newLimit, page) => {
        setLoading(true)
        const response = await Requests.Coupon.Index(page, newLimit, header)

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
        const response = await Requests.Coupon.Search(data, header)
        if (response) setData(response.data)
        setsearchLoading(false)
    }

    // Handle search suggestion
    const handleSuggestion = async (value) => {
        let data = {
            results: [],
            message: null
        }
        const response = await Requests.Coupon.Search(value, header)

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

    // Handle range filter
    const handleRangeFilter = async (data) => {
        setRangeFilterLoading(true)
        setCloseFilter(true)
        const response = await Requests.Coupon.DateRangeFilter(data, header)
        setData(response.data)
        setRangeFilterLoading(false)
    }

    // Handle selection
    const handleItemSelection = async data => {
        setLoading(true)
        setCloseFilter(true)
        const response = await Requests.Coupon.Filter(data, header)

        setData(response.data)
        setLoading(false)
    }

    const columns = [
        {
            name: 'Name',
            selector: row => row.name,
            sortable: true,
            grow: 2
        },
        {
            name: 'Code',
            selector: row => row.code,
            sortable: true
        },
        {
            name: 'Type',
            selector: row => row.type,
            sortable: true
        },
        {
            name: 'Amount',
            selector: row => row.amount,
            sortable: true
        },
        {
            name: 'Price Discount',
            selector: row => row.priceDiscount,
            sortable: true
        },
        {
            name: 'Valid Till',
            selector: row => formatDateWithAMPM(row.validTill),
            sortable: true,
            grow: 2
        },
        {
            name: 'Uses Limit',
            selector: row => row.useLimit,
            sortable: true
        },
        {
            name: 'Assign TO',
            selector: row => row.assignTo,
            sortable: true
        },
        {
            name: 'Action',
            grow: 0,
            minWidth: '150px',
            cell: row =>
                <div>
                    <Link to={`/dashboard/coupon/${row._id}/show`}>
                        <CustomButton
                            style={{ padding: "6px 10px" }}
                            className="btn-primary rounded-circle border-0"
                        ><Icon icon={eye} size={16} />
                        </CustomButton>
                    </Link>

                    <Link to={`/dashboard/coupon/${row._id}/edit`}>
                        <CustomButton
                            style={{ padding: "6px 10px" }}
                            className="btn-success rounded-circle border-0 mx-1"
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

    // Handle delete
    const handleDelete = async () => {
        setDelete({ ...isDelete, loading: true })

        await Requests.Coupon.Delete(isDelete.value._id, header)
        fetchData()
        setDelete({ ...isDelete, show: false, loading: false })
    }

    return (
        <div className="pb-4">
            <Container.Fluid>
                <Container.Row>
                    <Container.Column className="col-padding">
                        <Card.Simple className="border-0">
                            <Card.Header className="border-0 bg-white px-4 pt-4 pb-0">

                                {/* title container */}
                                <div className="d-flex">
                                    <div><h6 className="mb-0">Coupon List</h6></div>
                                    <div className="ml-auto">
                                        <Link to="/dashboard/coupon/create">
                                            <CustomButton className="btn-primary border-0 rounded-circle circle__padding">
                                                <Icon icon={plus} size={22} />
                                            </CustomButton>
                                        </Link>

                                        {closeFilter ?
                                            <CustomButton
                                                className="btn-danger border-0 rounded-circle circle__padding ml-1"
                                                onClick={() => {
                                                    fetchData(1)
                                                    setCloseFilter(false)
                                                }}
                                            >
                                                <Icon icon={x} size={22} />
                                            </CustomButton>
                                            : null
                                        }
                                    </div>
                                </div>

                                {/* Filter container */}
                                <Container.Row className="pt-2 px-2">

                                    {/* Type */}
                                    <Container.Column className="col-md-6 col-xl-2 px-1 mb-2">
                                        <SingleSelect
                                            placeholder="Type"
                                            borderRadius={25}
                                            options={[{ label: "Flat", value: "Flat" }, { label: "Percentage", value: "Percentage" }]}
                                            value={event => handleItemSelection({ value: event.value, field: "type" })}
                                        />
                                    </Container.Column>

                                    {/* Assign To */}
                                    <Container.Column className="col-md-6 col-xl-2 px-1 mb-2">
                                        <SingleSelect
                                            placeholder="Assign To"
                                            borderRadius={25}
                                            options={[
                                                { label: "Anything", value: "Anything" },
                                                { label: "Brand", value: "Brand" },
                                                { label: "Category", value: "Category" },
                                                { label: "Vendor", value: "Vendor" },
                                                { label: "Product", value: "Product" },
                                                { label: "Customer", value: "Customer" }
                                            ]}
                                            value={event => handleItemSelection({ value: event.value, field: "assignTo" })}
                                        />
                                    </Container.Column>

                                    {/* Date range filter */}
                                    <Container.Column className="col-xl-8 px-1 mb-2">
                                        <RangeFilter
                                            loading={isRangeFilterLoading}
                                            filter={handleRangeFilter}
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

                                    searchable
                                    placeholder={"Search coupon"}
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
                message={<h6>Want to delete this coupon ?</h6>}
                onHide={() => setDelete({ value: null, show: false, loading: false })}
                doDelete={handleDelete}
            />
        </div>
    );
}

export default Index;
