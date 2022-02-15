
import React, { useCallback, useEffect, useState } from 'react'
import Icon from 'react-icons-kit'
import { Link } from 'react-router-dom'
import { eye, edit2, plus } from 'react-icons-kit/feather'
import { Text } from '../../components/text'
import { Card } from '../../components/card/Index'
import { Toastify } from '../../components/toastify'
import { Container } from '../../components/container'
import { CustomButton } from '../../components/button'
import { DataTable } from '../../components/table/Index'

import { CustomError } from '../../utils/error'
import Requests from '../../utils/Requests/Index'

const Index = () => {
    const [data, setData] = useState([])
    const [limit, setLimit] = useState(10)
    const [totalItems, setTotalItems] = useState(0)
    const [isLoading, setLoading] = useState(true)
    const [searchLoading, setsearchLoading] = useState(false)

    // fetch data
    const fetchData = useCallback(async (page) => {
        try {
            const response = await Requests.Services.Shipping.Area.Index(page, limit)
            if (response && response.status === 200) {
                setData(response.data.data)
                setTotalItems(response.data.pagination ? response.data.pagination.total_items : 0)
            }
            setLoading(false)
        } catch (error) {
            if (error) {
                setLoading(false)
                if (error.response) {
                    await CustomError(error.response)
                } else {
                    Toastify.Error("Something going wrong.")
                }
            }
        }
    }, [])

    useEffect(() => {
        fetchData(1)
    }, [fetchData])

    // handle page change
    const handlePageChange = page => fetchData(page)

    // handle limit change
    const handleLimitChange = async (newLimit, page) => {
        setLoading(true)
        const response = await Requests.Services.Shipping.Area.Index(page, newLimit)

        setData(response.data.data)
        setLimit(newLimit)
        setLoading(false)
    }

    // Handle search
    const handleSearch = async data => {
        setsearchLoading(true)
        const response = await Requests.Services.Shipping.Area.Search(data)
        if (response && response.status === 200) setData(response.data.data)
        setsearchLoading(false)
    }

    // Handle search suggestion
    const handleSuggestion = async (value) => {
        let data = {
            results: [],
            message: null
        }
        const response = await Requests.Services.Shipping.Area.Search(value)

        if (response && response.status === 200 && response.data.data && response.data.data.length) {
            for (let i = 0; i < response.data.data.length; i++) {
                const element = response.data.data[i]
                data.results.push(element.post_office)
            }
        } else {
            data.message = "No results found"
        }

        return data
    }

    // data columns style
    const customStyles = {
        rows: {
            style: {
                minHeight: '60px',
            }
        }
    }

    // data columns
    const columns = [
        {
            name: 'Upazila',
            sortable: true,
            selector: row => <Text className="fs-14 mb-1">{row.upazila} - {row.upazila_bn_name}</Text>
        },
        {
            name: 'Post office',
            sortable: true,
            selector: row => <Text className="fs-14 mb-1">{row.post_office} - {row.post_office_bn_name}</Text>
        },
        {
            name: 'Post code',
            sortable: true,
            selector: row => <Text className="fs-14 mb-1">{row.post_code}</Text>
        },
        {
            name: 'Action',
            grow: 0,
            cell: row =>
                <div>
                    <Link to={`/dashboard/area/${row._id}/edit`}>
                        <CustomButton
                            style={{ padding: "6px 10px" }}
                            className="btn-success rounded-circle border-0 mx-1"
                        ><Icon icon={edit2} size={16} />
                        </CustomButton>
                    </Link>
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
                                    <div><Text className="fs-16 mt-2 mb-0">Area list</Text></div>
                                    <div className="ml-auto">
                                        <Link to="/dashboard/area/create">
                                            <CustomButton className="btn-primary border-0 rounded-circle circle__padding">
                                                <Icon icon={plus} size={22} />
                                            </CustomButton>
                                        </Link>
                                    </div>
                                </div>
                            </Card.Header>
                            <Card.Body>
                                <DataTable
                                    data={data}
                                    columns={columns}
                                    loading={isLoading}
                                    totalRows={totalItems}
                                    customStyles={customStyles}
                                    pagination={true}
                                    paginationServer={true}
                                    handlePerRowsChange={handleLimitChange}
                                    handlePageChange={handlePageChange}

                                    searchable
                                    placeholder={"Search area"}
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
}

export default Index;