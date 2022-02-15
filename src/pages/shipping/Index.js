import React, { useCallback, useEffect, useState } from 'react'
import Icon from 'react-icons-kit'
import { Link, useHistory } from 'react-router-dom'
import { edit2, plus, trash2, x } from 'react-icons-kit/feather'
import { CustomButton } from '../../components/button'
import { DeleteModal } from '../../components/modal/Delete'
import { DataTable } from '../../components/table/Index'
import { formatDateWithAMPM } from '../../utils/Helpers'
import { Container } from '../../components/container'
import { Card } from '../../components/card/Index'
import { SingleSelect } from '../../components/select'
import { useQuery } from '../../components/query/Index'

import Requests from '../../utils/Requests/Index'

const Index = () => {
    const [isLoading, setLoading] = useState(true)
    const [limit, setLimit] = useState(10)
    const history = useHistory()
    const [totalItems, setTotalItems] = useState(0)
    const queryParams = useQuery()
    const [data, setData] = useState([])
    const [closeFilter, setCloseFilter] = useState(false)
    const [isDelete, setDelete] = useState({ value: null, show: false, loading: false })
    const [header] = useState({
        headers: { Authorization: "Bearer " + localStorage.getItem('token') }
    })

    // Fetch data
    const fetchData = useCallback(async (query) => {
        setLoading(true)
        const response = await Requests.Services.Shipping.MainShipping.Index(query, header)

        if (response) {
            setData(response.data)
            setTotalItems(response.pagination ? response.pagination.items : 0)
        }
        setLoading(false)
    }, [header])


    // handle page change
    const handlePageChange = page => fetchData(page)

    // handle limit change
    const handleLimitChange = async (newLimit, page) => {
        setLoading(true)
        const response = await Requests.Services.Shipping.MainShipping.Index(page, newLimit, header)

        setData(response.data)
        setLimit(newLimit)
        setLoading(false)
    }


    useEffect(() => {
        if (queryParams) {
            let params = { ...queryParams }
            params.page = queryParams.page || 1
            params.limit = queryParams.limit || 10
            const queryString = Object.keys(params).map(key => `${key}=${params[key]}`).join('&')
            fetchData(queryString)
            setCloseFilter(true)
        }
    }, [
        queryParams.limit,
        queryParams.page,
        queryParams.assign_to,
        queryParams.discount_type,
        queryParams.start_from,
        queryParams.end_to,
        fetchData
    ])

    /* handle filter by URL params */
    const handleFilterByUrl = (field, value) => {
        let item = { [field]: value }
        let params = {
            ...queryParams,
            ...item,
            page: queryParams.page || 1,
            limit: queryParams.limit || 10
        }
        const queryString = Object.keys(params).map(key => `${key}=${params[key]}`).join('&')
        history.replace(`/dashboard/shipping?${queryString}`)
        setCloseFilter(true)
    }

    // Handle delete
    const handleDelete = async () => {
        setDelete({ ...isDelete, loading: true })

        await Requests.Services.Shipping.MainShipping.Delete(isDelete.value._id, header)
        fetchData(1)
        setDelete({ ...isDelete, show: false, loading: false })
    }

    const columns = [
        {
            name: 'Title',
            selector: row => row.title || "N/A",
            sortable: true
        },
        {
            name: 'Assign To',
            selector: row => row.assign_to || "N/A",
            sortable: true
        },
        {
            name: 'Type',
            selector: row => row.discount_type || "N/A",
            sortable: true
        },
        {
            name: 'Start From',
            selector: row => formatDateWithAMPM(row.start_from) || "N/A",
            sortable: true
        },
        {
            name: 'End To',
            selector: row => formatDateWithAMPM(row.end_to) || "N/A",
            sortable: true
        },
        {
            name: 'Action',
            grow: 0,
            minWidth: '150px',
            cell: row =>
                <div>
                    {/* <Link to={`/dashboard/shipping/${row._id}/show`}>
                        <CustomButton
                            style={{ padding: "6px 10px" }}
                            className="btn-primary rounded-circle border-0"
                        ><Icon icon={eye} size={16} />
                        </CustomButton>
                    </Link> */}

                    <Link to={`/dashboard/shipping/${row._id}/edit`}>
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

    return (
        <div className="pb-4">
            <Container.Fluid>
                <Container.Row>
                    <Container.Column className="col-padding">
                        <Card.Simple className="border-0">
                            <Card.Header className="bg-white border-0 p-3 p-lg-4">

                                {/* title container */}
                                <div className="d-flex">
                                    <div><h6 className="mb-0">Shipping List</h6></div>
                                    <div className="ml-auto">
                                        <Link to="/dashboard/shipping/create">
                                            <CustomButton className="btn-primary border-0 rounded-circle circle__padding">
                                                <Icon icon={plus} size={22} />
                                            </CustomButton>
                                        </Link>

                                        {closeFilter ?
                                            <CustomButton
                                                className="btn-danger border-0 rounded-circle circle__padding ml-1"
                                                onClick={() => {
                                                    setCloseFilter(false)
                                                    history.push(`/dashboard/shipping`)
                                                }}
                                            >
                                                <Icon icon={x} size={22} />
                                            </CustomButton>
                                            : null
                                        }
                                    </div>
                                </div>

                                {/* Filter items */}
                                <Container.Row className="pt-2 px-2">

                                    {/* Assign To */}
                                    <Container.Column className="col-sm-3 px-1 mb-2">
                                        <SingleSelect
                                            placeholder="Assign To"
                                            borderRadius={25}
                                            options={[
                                                { label: "Anything", value: "Anything" },
                                                { label: "Brand", value: "Brand" },
                                                { label: "Category", value: "Category" },
                                                { label: "Sub-category", value: "Sub-category" },
                                                { label: "Leaf-category", value: "Leaf-category" },
                                                { label: "Vendor", value: "Vendor" },
                                                { label: "Product", value: "Product" },
                                                { label: "Customer", value: "Customer" }
                                            ]}
                                            value={event => handleFilterByUrl("assign_to", event.value)}
                                        />
                                    </Container.Column>

                                    {/* Type */}
                                    <Container.Column className="col-sm-3 px-1 mb-2">
                                        <SingleSelect
                                            placeholder="Type"
                                            borderRadius={25}
                                            options={[
                                                { label: "Flat", value: "Flat" },
                                                { label: "Percentage", value: "Percentage" }
                                            ]}
                                            value={event => handleFilterByUrl("discount_type", event.value)}
                                        />
                                    </Container.Column>

                                    {/* Date range filter */}
                                    <Container.Column className="col-sm-3 px-1 mb-2">
                                        <div className="form-group mb-0">
                                            <input
                                                type="date"
                                                className="form-control shadow-none"
                                                style={{ borderRadius: 25, fontSize: 14, minHeight: 42 }}
                                                onChange={event => handleFilterByUrl("start_from", event.target.value)}
                                            />
                                        </div>
                                    </Container.Column>
                                    <Container.Column className="col-sm-3 px-1 mb-2">
                                        <div className="form-group mb-0">
                                            <input
                                                type="date"
                                                className="form-control shadow-none"
                                                style={{ borderRadius: 25, fontSize: 14, minHeight: 42 }}
                                                onChange={event => handleFilterByUrl("end_to", event.target.value)}
                                            />
                                        </div>
                                    </Container.Column>

                                    {/* <Container.Column className="col-xl-8 px-1 mb-2">
                                        <RangeFilter
                                            loading={isRangeFilterLoading}
                                            filter={handleRangeFilter}
                                        />
                                    </Container.Column> */}
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
                message={<h6>Want to delete this shipping ?</h6>}
                onHide={() => setDelete({ value: null, show: false, loading: false })}
                doDelete={handleDelete}
            />
        </div>
    );
}

export default Index;
