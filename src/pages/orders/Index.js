import React, { useCallback, useEffect, useState } from 'react'
import Icon from 'react-icons-kit'
import { Link, useHistory } from 'react-router-dom'
import { androidNotifications, androidNotificationsOff } from 'react-icons-kit/ionicons'
import { plus, eye, printer, info, x, edit2 } from 'react-icons-kit/feather'
import { DataTable } from '../../components/table/Index'
import { formatDateWithAMPM } from '../../utils/Helpers'
import { CustomButton } from '../../components/button'
import { ProductModal } from '../../components/modal/product/Index'
import { SearchableSelect, SingleSelect } from '../../components/select'
import { Container } from '../../components/container'
import { Card } from '../../components/card/Index'
import { useQuery } from '../../components/query/Index'
import { districts } from '../../utils/districts'

import Requests from '../../utils/Requests/Index'
import ExportCSV from '../../components/exportCSV/Index'
const Index = () => {
    const history = useHistory()
    const queryParams = useQuery()
    const [totalItems, setTotalItems] = useState(0)

    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [closeFilter, setCloseFilter] = useState(false)
    const [searchLoading, setsearchLoading] = useState(false)
    const [product, setProduct] = useState({ values: [], show: false })
    const [header] = useState({
        headers: { Authorization: "Bearer " + localStorage.getItem('token') }
    })

    // Fetch data
    const fetchData = useCallback(async (query) => {
        setLoading(true)
        const response = await Requests.Order.Index(query, header)

        if (response) {
            setData(response.data)
            setTotalItems(response.pagination ? response.pagination.items : 0)
        }
        setLoading(false)
    }, [header])



    useEffect(() => {
        // fetchData(1)
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
        queryParams.user,
        queryParams.deliveryAddress,
        queryParams.shippingArea,
        queryParams.paymentMethod,
        queryParams.paymentStatus,
        queryParams.status,
        queryParams.followUp,
        queryParams.from,
        queryParams.to,
        fetchData
    ])

    // handle page change
    const handlePageChange = page => {
        let params = { ...queryParams }
        params.page = page

        const queryString = Object.keys(params).map(key => `${key}=${params[key]}`).join('&')
        history.push(`/dashboard/order?${queryString}`)
    }

    // handle limit change
    const handleLimitChange = async (newLimit, page) => {
        setLoading(true)
        let params = { ...queryParams }
        params.page = page
        params.limit = newLimit

        const queryString = Object.keys(params).map(key => `${key}=${params[key]}`).join('&')
        history.push(`/dashboard/order?${queryString}`)
        setLoading(false)
    }

    // Handle search
    const handleSearch = async data => {
        setsearchLoading(true)
        const response = await Requests.Order.Search(data, header)
        if (response) setData(response.data)
        setsearchLoading(false)
    }

    // Handle search suggestion
    const handleWithSuggestion = async (value) => {
        let data = {
            results: [],
            message: null
        }
        const response = await Requests.Order.Search(value, header)

        if (response && response.data && response.data.length) {
            for (let i = 0; i < response.data.length; i++) {
                const element = response.data[i]
                // data.results.push(element.name + "-" + element.orderCode)
                data.results.push(element.orderCode)
            }
        } else {
            data.message = "No results found"
        }

        return data
    }

    // ------------------------ Filter item ---------------
    const handleFilter = async ({ query, field }) => {
        let results = []

        // Customer 
        if (field === "user") {
            const response = await Requests.Order.SearchCustomer(query, header)

            if (response.data && response.data.length) {
                for (let i = 0; i < response.data.length; i++) {
                    const element = response.data[i]
                    results.push({
                        value: element._id,
                        label: element.name + " - " + element.phone
                    })
                }
            }
        }

        if (field === "delivery-address") {
            const response = await Requests.Order.FilterItem(query, header)
            results = [...response.data]
        }

        return results
    }

    // ------------------------ Filter by URL ---------------
    const handleFilterByUrl = (field, value) => {
        let item = { [field]: value }
        let params = {
            ...queryParams,
            ...item,
            page: queryParams.page || 1,
            limit: queryParams.limit || 10
        }

        const queryString = Object.keys(params).map(key => `${key}=${params[key]}`).join('&')
        history.replace(`/dashboard/order?${queryString}`)
        setCloseFilter(true)
    }

    // handle filter clear
    const onClear = async () => {
        setCloseFilter(false)
        history.push(`/dashboard/order`)
    }

    const customStyles = {
        rows: {
            style: {
                minHeight: '60px',
            }
        }
    }

    const columns = [
        {
            name: 'Created At',
            selector: row => formatDateWithAMPM(row.createdAt),
            sortable: true,
            minWidth: "200px"
        },
        {
            name: 'Customer',
            selector: row => row.name,
            sortable: true
        },
        {
            name: 'Order Code',
            selector: row => <Link to={`/dashboard/order/${row._id}/show`}>{row.orderCode}</Link>,
            sortable: true,
            minWidth: "120px"
        },
        {
            name: 'Phone',
            selector: row => row.phone,
            sortable: true,
            minWidth: "130px"
        },
        {
            name: 'Delivery Address',
            selector: row => row.deliveryAddress,
            sortable: true,
            grow: 2
        },
        {
            name: 'Products',
            cell: row =>
                <CustomButton
                    style={{ padding: "6px 10px" }}
                    className="btn-info rounded-circle border-0 mr-1"
                    onClick={() => setProduct({ values: row.products, show: true })}
                ><Icon icon={info} size={16} />
                </CustomButton>
        },
        {
            name: <span>Order Value <br /> (Without D.Charge)</span>,
            selector: row => row.subTotalPrice,
            sortable: true,
            minWidth: "180px"
        },
        {
            name: 'Delivery Charge',
            selector: row => row.deliveryCharge,
            sortable: true,
            minWidth: "180px"
        },
        {
            name: 'Coupon Code',
            cell: row => row.coupon ? row.coupon.code : "N/A",
            minWidth: "180px"
        },
        {
            name: <p>Discount <br /> on Price</p>,
            minWidth: "100px",
            cell: row => row.coupon ? row.coupon.priceDiscount : "N/A"
        },
        {
            name: <p>Discount on Shipping <br /> Charge (Inside-Dhaka)</p>,
            minWidth: "150px",
            cell: row => row.coupon ? row.coupon.insideDhaka : "N/A"
        },
        {
            name: <p>Discount on Shipping <br /> Charge (Outside-Dhaka)</p>,
            minWidth: "150px",
            cell: row => row.coupon ? row.coupon.outsideDhaka : "N/A"
        },
        {
            name: 'Payment Status',
            selector: row => row.paymentStatus,
            sortable: true,
            minWidth: "150px"
        },
        {
            name: 'Paid (Amount)',
            selector: row => row.amountPaid,
            sortable: true,
            minWidth: "150px"
        },
        {
            name: 'Due (Amount)',
            selector: row => row.amountDue,
            sortable: true,
            minWidth: "150px"
        },
        {
            name: 'Payment Method',
            selector: row => row.paymentMethod,
            sortable: true,
            minWidth: "150px"
        },
        {
            name: 'Delivered (Date)',
            selector: row => row.deliveredDate ? row.deliveredDate : "N/A",
            sortable: true,
            minWidth: "170px"
        },
        {
            name: 'Status',
            selector: row => row.status,
            sortable: true
        },
        {
            name: 'Follow Up',
            sortable: true,
            cell: row =>
                <div>
                    {row.followUp ?
                        <Icon icon={androidNotifications} size={20} />
                        :
                        <Icon icon={androidNotificationsOff} style={{ color: "rgba(85, 85, 85, 0.541)" }} size={20} />
                    }
                </div>
        },
        {
            name: 'Action',
            grow: 0,
            minWidth: '150px',
            cell: row =>
                <div>
                    <Link to={`/dashboard/order/${row._id}/show`}>
                        <CustomButton
                            style={{ padding: "6px 10px" }}
                            className="btn-success rounded-circle border-0"
                        ><Icon icon={eye} size={16} />
                        </CustomButton>
                    </Link>

                    <Link to={`/dashboard/order/${row._id}/edit`}>
                        <CustomButton
                            style={{ padding: "6px 10px" }}
                            className="btn-primary rounded-circle border-0 mx-1"
                        ><Icon icon={edit2} size={16} />
                        </CustomButton>
                    </Link>

                    <Link to={`/dashboard/order/${row._id}/invoice`}>
                        <CustomButton
                            style={{ padding: "6px 10px" }}
                            className="btn-success rounded-circle border-0"
                        ><Icon icon={printer} size={16} />
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

                                {/* page header */}
                                <div className="d-flex">
                                    <div><h6 className="mb-0 d-inline">List of Orders - {data.length ? data.length : 0}</h6></div>
                                    <div className="ml-auto"><ExportCSV csvData={data} fileName={'Orders'} /></div>
                                    <div className="pl-2">
                                        <Link to="/dashboard/order/create">
                                            <CustomButton className="btn-primary border-0 rounded-circle circle__padding">
                                                <Icon icon={plus} size={22} />
                                            </CustomButton>
                                        </Link>
                                    </div>

                                    {closeFilter ?
                                        <CustomButton
                                            className="btn-danger border-0 rounded-circle circle__padding ml-2"
                                            onClick={onClear}
                                        ><Icon icon={x} size={22} />
                                        </CustomButton>
                                        : null
                                    }
                                </div>

                                {/* Filter container */}
                                <Container.Row className="pt-2 px-2">

                                    {/* Customer */}
                                    <Container.Column className="col-md-6 col-xl-3 px-1 mb-2">
                                        <SearchableSelect
                                            isMulti={false}
                                            placeholder="Customer"
                                            search={query => handleFilter({ query, field: "user" })}
                                            values={event => handleFilterByUrl("user", event.value)}
                                        />
                                    </Container.Column>

                                    {/* Delivery address */}
                                    <Container.Column className="col-md-6 col-xl-3 px-1 mb-2">
                                        <SearchableSelect
                                            isMulti={false}
                                            placeholder="Delivery address"
                                            search={query => handleFilter({ query, field: "delivery-address" })}
                                            values={event => handleFilterByUrl("deliveryAddress", event.value)}
                                        />
                                    </Container.Column>

                                    {/* Shipping Area */}
                                    <Container.Column className="col-md-6 col-xl-3 px-1 mb-2">
                                        <SingleSelect
                                            placeholder="Shipping area"
                                            options={districts}
                                            borderRadius={25}
                                            value={event => handleFilterByUrl("shippingArea", event.value)}
                                        />
                                    </Container.Column>

                                    {/* Payment Method */}
                                    <Container.Column className="col-md-6 col-xl-3 px-1 mb-2">
                                        <SingleSelect
                                            placeholder="Payment Method"
                                            borderRadius={25}
                                            options={[
                                                { label: "COD", value: "COD" },
                                                { label: "SSLCOMMERZ", value: "SSLCOMMERZ" }
                                            ]}
                                            value={event => handleFilterByUrl("paymentMethod", event.value)}
                                        />
                                    </Container.Column>

                                    {/* Payment Status */}
                                    <Container.Column className="col-md-6 col-xl-3 px-1 mb-2">
                                        <SingleSelect
                                            placeholder="Payment Status"
                                            borderRadius={25}
                                            options={[
                                                { label: "Paid", value: "Paid" },
                                                { label: "Pending", value: "Pending" },
                                                { label: "Partially Paid", value: "Partially Paid" }
                                            ]}
                                            value={event => handleFilterByUrl("paymentStatus", event.value)}
                                        />
                                    </Container.Column>

                                    {/* Order Status */}
                                    <Container.Column className="col-md-6 col-xl-3 px-1 mb-2">
                                        <SingleSelect
                                            placeholder="Order Status"
                                            options={[
                                                { label: "Created", value: "Created" },
                                                { label: "Pending", value: "Pending" },
                                                { label: "Confirmed", value: "Confirmed" },
                                                { label: "Picked", value: "Picked" },
                                                { label: "Received in Warehouse", value: "Received in Warehouse" },
                                                { label: "Packed", value: "Packed" },
                                                { label: "Handed Over to Courier", value: "Handed Over to Courier" },
                                                { label: "Delivered", value: "Delivered" },
                                                { label: "Cancelled", value: "Cancelled" },
                                                { label: "Ready to Refund", value: "Ready to Refund" },
                                                { label: "Refunded", value: "Refunded" }
                                            ]}
                                            borderRadius={25}
                                            value={event => handleFilterByUrl("status", event.value)}
                                        />
                                    </Container.Column>

                                    {/* Follow Up */}
                                    <Container.Column className="col-md-6 col-lg-12 col-xl-3 px-1 mb-2">
                                        <SingleSelect
                                            placeholder="Follow-Up status"
                                            borderRadius={25}
                                            options={[
                                                { label: "In follow-up", value: true },
                                                { label: "Not in follow-up", value: false }
                                            ]}
                                            value={event => handleFilterByUrl("followUp", event.value)}
                                        />
                                    </Container.Column>

                                    {/* Date range filter */}
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

                            <Card.Body className="p-0">
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
                                    placeholder={"Search order"}
                                    search={handleSearch}
                                    suggestion={handleWithSuggestion}
                                    searchLoading={searchLoading}
                                    clearSearch={() => fetchData(1)}
                                />
                            </Card.Body>
                        </Card.Simple>
                    </Container.Column>
                </Container.Row>
            </Container.Fluid>

            {/* Product list modal */}
            <ProductModal
                show={product.show}
                data={product.values}
                onHide={() => setProduct({ values: [], show: false })}
            />
        </div>
    );
}

export default Index;


// http://localhost:3000/product/dell-latitude-5410-10th-gen-intel-core-i5-10210u-laptop-with-512-ssd-1624439546497
// https://www.daraz.com.bd/products/1-pair-2-piece-wasp-pubg-finger-sleeves-thumb-finger-gloves-for-mobile-gaming-controller-i182258190-s1138990385.html?spm=a2a0e.home.flashSale.2.735212f7ucHdfp&search=1&mp=1&c=fs
// https://www.rokomari.com/book/213376/message