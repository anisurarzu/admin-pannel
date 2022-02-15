import React, { useState, useEffect, useCallback } from 'react'
import Icon from 'react-icons-kit'
import { Link } from 'react-router-dom'
import { plus, eye, edit2 } from 'react-icons-kit/feather'
import { DataTable } from '../../components/table/Index'
import { CustomButton } from '../../components/button'
import { Container } from '../../components/container'
import { Card } from '../../components/card/Index'

import Requests from '../../utils/Requests/Index'
import { ShortName } from '../../components/shortName/Index'

const Index = () => {
    const [isLoading, setLoading] = useState(true)
    const [limit, setLimit] = useState(10)
    const [totalItems, setTotalItems] = useState(0)

    const [data, setData] = useState([])
    const [searchLoading, setsearchLoading] = useState(false)
    const [header] = useState({
        headers: { Authorization: "Bearer " + localStorage.getItem('token') }
    })

    // Fetch data
    const fetchData = useCallback(async (page) => {
        setLoading(true)
        const response = await Requests.Vendor.Index(page, limit, header)

        if (response) {
            setData(response.data)
            console.log(response.data);
            setTotalItems(response.pagination ? response.pagination.items : 0)
        }
        setLoading(false)
    }, [limit, header])

    // handle page change
    const handlePageChange = page => fetchData(page)

    // handle limit change
    const handleLimitChange = async (newLimit, page) => {
        setLoading(true)
        const response = await Requests.Vendor.Index(page, newLimit, header)

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
        // console.log(data);
        const response = await Requests.Vendor.Search(data, header)
        if (response) setData(response.data)
        setsearchLoading(false)
    }

    // Handle search suggestion
    const handleSuggestion = async (value) => {
        let data = {
            results: [],
            message: null
        }
        // console.log(value);
        const response = await Requests.Vendor.Search(value, header)

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

    const columns = [
        {
            name: 'Image',
            grow: 0,
            cell: row =>
                <div>
                    {row.image ?
                        <img height={40} width={50} alt={"Vendor"} src={row.image} />
                        : <ShortName
                            x={45}
                            y={45}
                            size={20}
                            name={row.name}
                        />}

                </div>
        },
        {
            name: 'Name',
            selector: row => row.name,
            sortable: true
        },
        {
            name: 'E-mail',
            selector: row => row.email,
            sortable: true
        },
        {
            name: 'Phone',
            selector: row => row.phone,
            sortable: true
        },
        {
            name: 'Address',
            selector: row => row.address,
            sortable: true,
            grow: 2
        },
        {
            name: 'Products',
            selector: row => row.products.length || 0,
            sortable: true
        },
        {
            name: 'Action',
            grow: 0,
            minWidth: '150px',
            cell: row =>
                <div>
                    <Link to={`/dashboard/vendor/${row._id}/show`}>
                        <CustomButton
                            style={{ padding: "6px 10px" }}
                            className="btn-primary rounded-circle border-0 mr-1"
                        ><Icon icon={eye} size={16} />
                        </CustomButton>
                    </Link>

                    <Link to={`/dashboard/vendor/${row._id}/edit`}>
                        <CustomButton
                            style={{ padding: "6px 10px" }}
                            className="btn-success rounded-circle border-0"
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
                                    <div><h6 className="mb-0">Vendor List</h6></div>
                                    <div className="ml-auto">
                                        <Link to="/dashboard/vendor/create">
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
                                    placeholder={"Search vendor"}
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