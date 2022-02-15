import React, { useCallback, useEffect, useState } from 'react'
import Icon from 'react-icons-kit'
import { Link, useHistory } from 'react-router-dom'
import { plus, edit2, eye, x } from 'react-icons-kit/feather'
import { useQuery } from '../../components/query/Index'
import { CustomButton } from '../../components/button'
import { DataTable } from '../../components/table/Index'
import { SearchableSelect } from '../../components/select'
import { Container } from '../../components/container'
import { Card } from '../../components/card/Index'

import Requests from '../../utils/Requests/Index'

const Pending = () => {
    const history = useHistory()
    const queryParams = useQuery()
    const [totalItems, setTotalItems] = useState(0)

    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [closeFilter, setCloseFilter] = useState(false)
    const [searchLoading, setsearchLoading] = useState(false)
    const [header] = useState({
        headers: { Authorization: "Bearer " + localStorage.getItem('token') }
    })

    // Fetch data
    const fetchData = useCallback(async (query) => {
        setLoading(true)
        const response = await Requests.PendingProduct.Index(query, header)

        if (response) {
            setData(response.data)
            setTotalItems(response.pagination ? response.pagination.items : 0)
        }
        setLoading(false)
    }, [header])

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
        header,
        queryParams.limit,
        queryParams.page,
        queryParams.mainCategory,
        queryParams.subCategory,
        queryParams.leafCategory,
        queryParams.brand,
        queryParams.vendor,
        queryParams.status,
        queryParams.uploader,
        queryParams.auditor,
        queryParams.from,
        queryParams.to,
        fetchData
    ])

    // handle page change
    const handlePageChange = page => {
        let params = { ...queryParams }
        params.page = page

        const queryString = Object.keys(params).map(key => `${key}=${params[key]}`).join('&')
        history.push(`/dashboard/product/pending/items?${queryString}`)
    }

    // handle limit change
    const handleLimitChange = async (newLimit, page) => {
        setLoading(true)
        let params = { ...queryParams }
        params.page = page
        params.limit = newLimit

        const queryString = Object.keys(params).map(key => `${key}=${params[key]}`).join('&')
        history.push(`/dashboard/product/pending/items?${queryString}`)
        setLoading(false)
    }

    let handleFilterByUrl = (field, value) => {
        let item = { [field]: value }
        let params = {
            ...queryParams,
            ...item,
            page: queryParams.page || 1,
            limit: queryParams.limit || 10
        }

        const queryString = Object.keys(params).map(key => `${key}=${params[key]}`).join('&')
        history.replace(`/dashboard/product/pending/items?${queryString}`)
        setCloseFilter(true)
    }

    const handleFilter = async (data) => {
        let results = []
        const response = await Requests.Product.FilterItem(data, header)

        if (response.data && response.data.length) {
            for (let i = 0; i < response.data.length; i++) {
                const element = response.data[i]
                results.push({
                    value: element._id,
                    label: element.name
                })
            }
        }
        return results
    }

    // Handle search
    const handleSearch = async data => {
        setsearchLoading(true)
        const response = await Requests.PendingProduct.Search(data, header)
        if (response) setData(response.data)
        setsearchLoading(false)
    }

    // Handle search suggestion
    const handleSuggestion = async (value) => {
        let data = {
            results: [],
            message: null
        }
        const response = await Requests.PendingProduct.Search(value, header)

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

    // handle filter close
    const onClear = async () => {
        setCloseFilter(false)
        history.push(`/dashboard/product/pending/items`)
    }

    // Custom style for rows
    const customStyles = {
        rows: {
            style: {
                minHeight: '60px',
            }
        }
    }

    // data rows
    const columns = [
        {
            name: 'Image',
            grow: 0,
            cell: row => <img height={40} alt={"Product"} src={row.thumbnail} />,
        },
        {
            name: 'Name',
            selector: row => row.name.slice(0, 40) + " ...",
            sortable: true
        },
        {
            name: 'SKU',
            selector: row => row.sku,
            sortable: true
        },
        {
            name: 'Purchase Price',
            selector: row => row.purchasePrice,
            sortable: true
        },
        {
            name: 'Sale Price',
            selector: row => row.salePrice,
            sortable: true
        },
        {
            name: 'Stock Amount',
            selector: row => row.stockAmount,
            sortable: true
        },
        {
            name: 'Vendor',
            sortable: true,
            grow: 1,
            selector: row => row.vendor
        },
        {
            name: 'Action',
            grow: 0,
            minWidth: '120px',
            cell: row =>
                <div>
                    <Link to={`/dashboard/product/${row._id}/show`}>
                        <CustomButton
                            style={{ padding: "6px 10px" }}
                            className="btn-primary rounded-circle border-0 mr-1"
                        ><Icon icon={eye} size={16} />
                        </CustomButton>
                    </Link>

                    <Link to={`/dashboard/product/${row._id}/edit`}>
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
                            <Card.Header className="border-0 bg-white px-4 pt-4 pb-0">

                                {/* Title container */}
                                <div className="d-flex">
                                    <div><h6 className="mb-0">Pending Products ({totalItems})</h6></div>
                                    <div className="ml-auto">
                                        <Link to="/dashboard/product/create">
                                            <CustomButton className="btn-primary border-0 rounded-circle circle__padding">
                                                <Icon icon={plus} size={22} />
                                            </CustomButton>
                                        </Link>

                                        {closeFilter ?
                                            <CustomButton
                                                type="button"
                                                className="btn-danger border-0 rounded-circle circle__padding ml-1"
                                                onClick={onClear}
                                            >
                                                <Icon icon={x} size={22} />
                                            </CustomButton>
                                            : null
                                        }
                                    </div>
                                </div>

                                {/* Filter items */}
                                <Container.Row className="pt-2 px-2">

                                    {/* Category */}
                                    <Container.Column className="col-6 col-md-3 mb-2 px-1">
                                        <SearchableSelect
                                            placeholder="Category"
                                            search={query => handleFilter({ query, field: "category" })}
                                            values={event => handleFilterByUrl("mainCategory", event.value)}
                                        />
                                    </Container.Column>

                                    {/* Sub-Category */}
                                    <Container.Column className="col-6 col-md-3 mb-2 px-1">
                                        <SearchableSelect
                                            placeholder="Sub-category"
                                            search={query => handleFilter({ query, field: "sub-category" })}
                                            values={event => handleFilterByUrl("subCategory", event.value)}
                                        />
                                    </Container.Column>

                                    {/* Leaf-Category */}
                                    <Container.Column className="col-6 col-md-3 mb-2 px-1">
                                        <SearchableSelect
                                            placeholder="Leaf-category"
                                            search={query => handleFilter({ query, field: "leaf-category" })}
                                            values={event => handleFilterByUrl("leafCategory", event.value)}
                                        />
                                    </Container.Column>

                                    {/* Brand */}
                                    <Container.Column className="col-6 col-md-3 mb-2 px-1">
                                        <SearchableSelect
                                            placeholder="Brand"
                                            search={query => handleFilter({ query, field: "brand" })}
                                            values={event => handleFilterByUrl("brand", event.value)}
                                        />
                                    </Container.Column>
                                </Container.Row>

                                <Container.Row className="px-2">

                                    {/* Vendor */}
                                    <Container.Column className="col-6 col-md-3 mb-2 px-1">
                                        <SearchableSelect
                                            placeholder="Vendor"
                                            search={query => handleFilter({ query, field: "vendor" })}
                                            values={event => handleFilterByUrl("vendor", event.value)}
                                        />
                                    </Container.Column>

                                    {/* Date from */}
                                    <Container.Column className="col-sm-6 col-md-3 mb-2 px-1">
                                        <div className="form-group mb-0">
                                            <input
                                                type="date"
                                                className="form-control shadow-none"
                                                style={{ borderRadius: 25, fontSize: 14, minHeight: 42 }}
                                                onChange={event => handleFilterByUrl("from", event.target.value)}
                                            />
                                        </div>
                                    </Container.Column>

                                    {/* Date to */}
                                    <Container.Column className="col-sm-6 col-md-3 mb-2 px-1">
                                        <div className="form-group mb-0">
                                            <input
                                                type="date"
                                                className="form-control shadow-none"
                                                style={{ borderRadius: 25, fontSize: 14, minHeight: 42 }}
                                                onChange={event => handleFilterByUrl("to", event.target.value)}
                                            />
                                        </div>
                                    </Container.Column>
                                </Container.Row>
                            </Card.Header>
                            <Card.Body>
                                <DataTable
                                    fixedHeader
                                    fixedHeaderScrollHeight="580px"
                                    customStyles={customStyles}
                                    columns={columns}
                                    data={data}
                                    loading={loading}
                                    totalRows={totalItems}
                                    pagination={true}
                                    paginationServer={true}
                                    handlePerRowsChange={handleLimitChange}
                                    handlePageChange={handlePageChange}

                                    searchable
                                    placeholder={"Search product"}
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

export default Pending;