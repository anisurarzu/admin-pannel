import React, { useCallback, useEffect, useState, useRef } from 'react'
import 'react-toastify/dist/ReactToastify.css'
import Icon from 'react-icons-kit'
import { Form } from 'react-bootstrap'
import { Link, useHistory } from 'react-router-dom'
import { toast } from 'react-toastify'
import { single } from 'react-icons-kit/entypo'
import { plus, edit2, info, eye, check, x } from 'react-icons-kit/feather'
import { useQuery } from '../../components/query/Index'
import { CustomButton } from '../../components/button'
import { DataTable } from '../../components/table/Index'
import { SearchableSelect, SingleSelect } from '../../components/select'
import { Container } from '../../components/container'
import { Card } from '../../components/card/Index'

import Requests from '../../utils/Requests/Index'

toast.configure({ autoClose: 10000 })
const Index = () => {
    const onClearRef = useRef()
    const history = useHistory()
    const queryParams = useQuery()
    const [totalItems, setTotalItems] = useState(0)

    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [closeFilter, setCloseFilter] = useState(false)
    const [searchLoading, setsearchLoading] = useState(false)
    const [audit, setAudit] = useState({ value: null, loading: false })
    const [header] = useState({
        headers: { Authorization: "Bearer " + localStorage.getItem('token') }
    })

    // Fetch data
    const fetchData = useCallback(async (query) => {
        setLoading(true)
        const response = await Requests.Product.Index(query, header)

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
        history.push(`/dashboard/product?${queryString}`)
    }

    // handle limit change
    const handleLimitChange = async (newLimit, page) => {
        setLoading(true)
        let params = { ...queryParams }
        params.page = page
        params.limit = newLimit

        const queryString = Object.keys(params).map(key => `${key}=${params[key]}`).join('&')
        history.push(`/dashboard/product?${queryString}`)
        setLoading(false)
    }

    // Handle search
    const handleSearch = async data => {
        setsearchLoading(true)
        const response = await Requests.Product.Search(data, header)
        if (response) setData(response.data)
        setsearchLoading(false)
        setCloseFilter(true)
    }

    // Handle search suggestion
    const handleSuggestion = async (value) => {
        let data = {
            results: [],
            message: null
        }
        console.log(value);
        const response = await Requests.Product.Search(value, header)

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

    // Handle status
    const handleStatus = async (data) => {
        try {
            let errors = []

            if (data.brand && !data.brand.isActive) errors = [...errors, 'Item deactivated from brand.']
            if (!data.vendor.isActive) errors = [...errors, 'Item deactivated from vendor.']
            if (!data.mainCategory.isActive) errors = [...errors, 'Item deactivated from category.']

            if (errors && errors.length) {
                for (let i = 0; i < errors.length; i++) {
                    const element = errors[i]
                    toast.error(element)
                }
                return
            }

            const response = await Requests.Product.UpdateStatus(data._id, header)
            if (response) fetchData(1)
        } catch (error) {
            if (error) console.log(error)
        }
    }

    // ------------------------ Filter item ---------------
    const handleFilterByUrl = (field, value) => {
        let item = { [field]: value }
        let params = {
            ...queryParams,
            ...item,
            page: queryParams.page || 1,
            limit: queryParams.limit || 10
        }

        const queryString = Object.keys(params).map(key => `${key}=${params[key]}`).join('&')
        history.replace(`/dashboard/product?${queryString}`)
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

    // handle audit
    const handleAudit = async data => {
        setAudit({ value: data, loading: true })
        await Requests.Product.Audit(data, header)
        fetchData(1)
        setAudit({ value: null, loading: false })
    }

    // handle filter close
    const onClear = async () => {
        onClearRef.current.select.setState({ value: null })
        setCloseFilter(false)
        history.push(`/dashboard/product`)
    }

    const customStyles = {
        rows: {
            style: {
                minHeight: '60px',
            }
        }
    }

    // Data columns
    const columns = [
        {
            name: 'Image',
            grow: 0,
            cell: row => <img height={40} alt={"Product"} src={row.thumbnail} />,
        },
        {
            name: 'Name',
            sortable: true,
            minWidth: '200px',
            cell: row => <a target="_blank" rel="noreferrer" href={`https://eazybest.com/product/${row.slug}`}>{row.name.slice(0, 25) + " ..."}</a>
        },
        {
            name: 'SKU',
            sortable: true,
            minWidth: '150px',
            selector: row => row.sku
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
            name: 'Stock',
            sortable: true,
            grow: 0,
            cell: row =>
                <div>
                    {row.stockStatus === "In Stock".toString() ?
                        <Icon icon={check} size={15} className="text-success" /> :
                        <Icon icon={x} size={15} className="text-warning" />
                    }
                </div>
        },
        {
            name: '',
            sortable: true,
            grow: 0,
            cell: row =>
                <Form.Check
                    type="switch"
                    id={row._id}
                    value={row.isActive}
                    defaultChecked={row.isActive}
                    onChange={() => handleStatus(row)}
                />
        },
        {
            name: 'Status',
            sortable: true,
            grow: 0,
            cell: row =>
                <div>
                    {row.isActive ?
                        <Icon icon={single} size={35} className="text-success" /> :
                        <Icon icon={single} size={35} className="text-warning" />
                    }
                </div>
        },
        {
            name: 'Audit By',
            sortable: true,
            minWidth: '150px',
            selector: row => row.auditBy
        },
        {
            name: 'Audit',
            sortable: true,
            grow: 0,
            minWidth: '120px',
            cell: row =>
                row.isAudit ?
                    <CustomButton
                        className="btn-success border-0"
                        style={{ fontSize: 14, padding: "3px 12px" }}
                        disabled={audit.value && audit.value === row._id}
                        onClick={() => handleAudit(row._id)}
                    >{audit.value && audit.value === row._id && audit.loading ? "Loading ..." : "Yes"}</CustomButton>
                    :
                    <CustomButton
                        className="btn-danger border-0"
                        style={{ fontSize: 14, padding: "3px 12px" }}
                        disabled={audit.value && audit.value === row._id}
                        onClick={() => handleAudit(row._id)}
                    >{audit.value && audit.value === row._id && audit.loading ? "Loading ..." : "No"}</CustomButton>
        },
        {
            name: 'Uploaded By',
            sortable: true,
            minWidth: '150px',
            selector: row => row.createdBy
        },
        {
            name: 'Updated By',
            sortable: true,
            grow: 2,
            minWidth: '150px',
            selector: row => row.updatedBy
        },
        {
            name: 'Upload Date',
            sortable: true,
            minWidth: '200px',
            selector: row => row.createdAt
        },
        {
            name: 'Last Update',
            sortable: true,
            minWidth: '200px',
            selector: row => row.updatedAt
        },
        {
            name: 'Action',
            grow: 0,
            minWidth: '160px',
            cell: row =>
                <div>

                    {/* product show button */}
                    <Link to={`/dashboard/product/${row._id}/show`}>
                        <CustomButton
                            style={{ padding: "6px 10px" }}
                            className="btn-primary rounded-circle border-0"
                        ><Icon icon={eye} size={16} />
                        </CustomButton>
                    </Link>

                    {/* product edit button */}
                    <Link to={`/dashboard/product/${row._id}/edit`}>
                        <CustomButton
                            style={{ padding: "6px 10px" }}
                            className="btn-success rounded-circle border-0 mx-1"
                        ><Icon icon={edit2} size={16} />
                        </CustomButton>
                    </Link>

                    {/* slug edit button */}
                    <Link to={`/dashboard/product/${row._id}/edit/slug`}>
                        <CustomButton
                            style={{ padding: "6px 10px" }}
                            className="btn-danger rounded-circle border-0"
                        ><Icon icon={info} size={16} />
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
                                    <div><h6 className="mb-0">Products List ({totalItems})</h6></div>
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
                                            refs={onClearRef}
                                            placeholder="Category"
                                            search={query => handleFilter({ query, field: "category" })}
                                            values={event => handleFilterByUrl("mainCategory", event.value)}
                                        />
                                    </Container.Column>

                                    {/* Sub-Category */}
                                    <Container.Column className="col-6 col-md-3 mb-2 px-1">
                                        <SearchableSelect
                                            refs={onClearRef}
                                            placeholder="Sub-category"
                                            search={query => handleFilter({ query, field: "sub-category" })}
                                            values={event => handleFilterByUrl("subCategory", event.value)}
                                        />
                                    </Container.Column>

                                    {/* Leaf-Category */}
                                    <Container.Column className="col-6 col-md-3 mb-2 px-1">
                                        <SearchableSelect
                                            refs={onClearRef}
                                            placeholder="Leaf-category"
                                            search={query => handleFilter({ query, field: "leaf-category" })}
                                            values={event => handleFilterByUrl("leafCategory", event.value)}
                                        />
                                    </Container.Column>

                                    {/* Brand */}
                                    <Container.Column className="col-6 col-md-3 mb-2 px-1">
                                        <SearchableSelect
                                            refs={onClearRef}
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
                                            refs={onClearRef}
                                            placeholder="Vendor"
                                            search={query => handleFilter({ query, field: "vendor" })}
                                            values={event => handleFilterByUrl("vendor", event.value)}
                                        />
                                    </Container.Column>

                                    {/* Status */}
                                    <Container.Column className="col-6 col-md-3 mb-2 px-1">
                                        <SingleSelect
                                            refs={onClearRef}
                                            placeholder="Status"
                                            borderRadius={25}
                                            options={[
                                                { label: "Activated", value: true },
                                                { label: "Deactivated", value: false }
                                            ]}
                                            value={event => handleFilterByUrl("status", event.value)}
                                        />
                                    </Container.Column>

                                    {/* Content uploader */}
                                    <Container.Column className="col-6 col-md-3 mb-2 px-1">
                                        <SearchableSelect
                                            refs={onClearRef}
                                            placeholder="Content uploader"
                                            search={query => handleFilter({ query, field: "uploader" })}
                                            values={event => handleFilterByUrl("uploader", event.value)}
                                        />
                                    </Container.Column>

                                    {/* Content auditor */}
                                    <Container.Column className="col-6 col-md-3 mb-2 px-1">
                                        <SearchableSelect
                                            refs={onClearRef}
                                            placeholder="Content auditor"
                                            search={query => handleFilter({ query, field: "auditor" })}
                                            values={event => handleFilterByUrl("auditor", event.value)}
                                        />
                                    </Container.Column>
                                </Container.Row>

                                {/* Date range filter */}
                                <Container.Row className="px-2">
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
                            <Card.Body className="pt-0">
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
        </div >
    );
};

export default Index;


