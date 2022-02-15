import React, { useCallback, useEffect, useState } from 'react'
import Icon from 'react-icons-kit'
import { eye, x } from 'react-icons-kit/feather'
import { Link } from 'react-router-dom'
import { CustomButton } from '../../components/button'
import { formatDateWithAMPM } from '../../utils/Helpers'
import { DataTable } from '../../components/table/Index'
import { Container } from '../../components/container'
import { Card } from '../../components/card/Index'
import { RangeFilter } from '../../components/rangeFilter/Index'

import Requests from '../../utils/Requests/Index'

const Index = () => {
    const [isLoading, setLoading] = useState(true)
    const [limit, setLimit] = useState(10)
    const [totalItems, setTotalItems] = useState(0)

    const [data, setData] = useState([])
    const [searchLoading, setsearchLoading] = useState(false)
    const [closeFilter, setCloseFilter] = useState(false)
    const [isRangeFilterLoading, setRangeFilterLoading] = useState(false)
    const [header] = useState({
        headers: { Authorization: "Bearer " + localStorage.getItem('token') }
    })

    // Fetch data
    const fetchData = useCallback(async (page) => {
        setLoading(true)
        const response = await Requests.Refund.Index(page, limit, header)

        if (response) {
            setData(response.data)
            setTotalItems(response.pagination ? response.pagination.items : 0)
        }
        setLoading(false)
    }, [limit, header])

    useEffect(() => {
        fetchData(1)
    }, [header, fetchData])

    // handle page change
    const handlePageChange = page => fetchData(page)

    // handle limit change
    const handleLimitChange = async (newLimit, page) => {
        setLoading(true)
        const response = await Requests.Refund.Index(page, newLimit, header)

        setData(response.data)
        setLimit(newLimit)
        setLoading(false)
    }

    // Handle search
    const handleSearch = async data => {
        setsearchLoading(true)
        const response = await Requests.Refund.Search(data, header)
        if (response) setData(response.data)
        setsearchLoading(false)
    }

    // Handle search suggestion
    const handleSuggestion = async (value) => {
        let data = {
            results: [],
            message: null
        }
        const response = await Requests.Refund.Search(value, header)

        if (response && response.data && response.data.length) {
            for (let i = 0; i < response.data.length; i++) {
                const element = response.data[i]
                data.results.push(element.orderCode)
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
        const response = await Requests.Refund.FilterByDateRange(data, header)
        setData(response.data)
        setRangeFilterLoading(false)
    }

    const columns = [
        {
            name: 'Date & Time',
            selector: row => formatDateWithAMPM(row.createdAt),
            sortable: true
        },
        {
            name: 'Customer',
            selector: row => row.user.name,
            sortable: true
        },
        {
            name: 'Order Code',
            selector: row => row.orderCode,
            sortable: true
        },
        {
            name: 'Total',
            selector: row => row.totalAmount,
            sortable: true
        },
        {
            name: 'Status',
            selector: row => row.status,
            sortable: true
        },
        {
            name: 'Action',
            grow: 0,
            minWidth: '80px',
            cell: row =>
                <Link to={`/dashboard/refund/${row._id}/show`}>
                    <CustomButton
                        style={{ padding: "6px 10px" }}
                        className="btn-primary rounded-circle border-0"
                    ><Icon icon={eye} size={16} />
                    </CustomButton>
                </Link>
        }
    ]

    return (
        <div className="pb-4">
            <Container.Fluid>
                <Container.Row>
                    <Container.Column className="col-padding">
                        <Card.Simple className="border-0">
                            <Card.Header className="bg-white border-0 p-3 p-lg-4">

                                {/* Page header */}
                                <div className="d-flex mb-3">
                                    <div><h6 className="mb-0">Refund Requests</h6></div>
                                    {closeFilter &&
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
                                    }
                                </div>

                                {/* Date range filter */}
                                <Container.Row className="px-2">
                                    <Container.Column className="col-12 px-1 mb-2">
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
                                    placeholder={"Search request"}
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
        </div>
    );
};

export default Index;