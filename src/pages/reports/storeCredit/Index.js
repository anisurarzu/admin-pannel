import React, { useCallback, useEffect, useState } from 'react'
import './style.scss'
import Requests from '../../../utils/Requests/Index'
import { SingleSelect } from '../../../components/select'
import { DataTable } from '../../../components/table/Index'
import { PreLoader } from '../../../components/loading/Index'

import ExportCSV from '../../../components/exportCSV/Index'


const Index = () => {
    const [data, setData] = useState([])
    const [isFilter, setFilter] = useState(false)
    const [isLoading, setLoading] = useState(true)
    const [sheetData, setSheetData] = useState([])
    const [categories, setCategories] = useState([])
    const [vendors, setVendors] = useState([])
    const [subCategories, setSubCategories] = useState([])
    const [leafCategories, setLeafCategories] = useState([])
    const [brands, setBrands] = useState([])
    const [category, setCategory] = useState(null)
    const [subCategory, setSubCategory] = useState(null)
    const [leafCategory, setLeafCategory] = useState(null)
    const [vendor, setVendor] = useState(null)
    const [brand, setBrand] = useState(null)
    const [status, setStatus] = useState(null)
    const [from, setFrom] = useState(null)
    const [to, setTo] = useState(null)
    const [totalSell, setTotalSell] = useState(0)
    const [totalPurchase, setTotalPurchase] = useState(0)
    const [totalDiscount, setTotalDiscount] = useState(0)
    const [totalProfit, setTotalProfit] = useState(0)
    const [busketSize, setBusketSize] = useState(0)

    const [header] = useState({
        headers: { Authorization: "Bearer " + localStorage.getItem('token') }
    })
    const statuses = [
        {
            label: 'All',
            value: 'All',
        },
        {
            label: 'Created',
            value: 'Created',
        },
        {
            label: 'Pending',
            value: 'Pending',
        },
        {
            label: 'Confirmed',
            value: 'Confirmed',
        },
        {
            label: 'Picked',
            value: 'Picked',
        },
        {
            label: 'Received in Warehouse',
            value: 'Received in Warehouse',
        },
        {
            label: 'Packed',
            value: 'Packed',
        },
        {
            label: 'Handed Over to Courier',
            value: 'Handed Over to Courier',
        },
        {
            label: 'Delivered',
            value: 'Delivered',
        },
        {
            label: 'Canceled',
            value: 'Canceled',
        },
        {
            label: 'Ready to Refund',
            value: 'Ready to Refund',
        },
        {
            label: 'Refunded',
            value: 'Refunded',
        }
    ]

    // Fetch data
    const fetchData = useCallback(async () => {
        const response = await Requests.Reports.StoreCredit(header)
        if (response) {
            let sheetArr = []
            setData(response.data)
            setTotalSell(response.totalSell)
            setTotalPurchase(response.totalPurchase)
            setTotalDiscount(response.totalDiscount)
            setTotalProfit(response.totalProfit)
            setBusketSize(response.busketSize)
            setLoading(false)
            setSheetData(sheetArr)
        }

        const optionResponse = await Requests.Options.Index(header)
        if (optionResponse) {
            setBrands(optionResponse.brands)
            setVendors(optionResponse.vendors)
            setCategories(optionResponse.mainCategories)
        }
        setLoading(false)
    }, [header])

    useEffect(() => {
        fetchData()
    }, [header, fetchData])

    // FIlter items
    const handleFilter = async data => {
        setFilter(true)
        let fData = {
            category: category,
            subCategory: subCategory,
            leafCategory: leafCategory,
            vendor: vendor,
            brand: brand,
            status: status,
            from: from,
            to: to,
        }
        const response = await Requests.Reports.Filter(fData, header)
        setData(response.data)
        setFilter(false)
    }

    const columns = [
        {
            name: 'O.Status',
            sortable: true,
            selector: row => row.status
        },
        {
            name: 'Category',
            sortable: true,
            grow: 0,
            selector: row => row.category ? row.category : "N/A"
        },
        {
            name: 'Sub Category',
            sortable: true,
            selector: row => row.subCategory ? row.subCategory : "N/A"
        },
        {
            name: 'Leaf Category',
            sortable: true,
            grow: 0,
            selector: row => row.leafCategory ? row.leafCategory : "N/A"
        },
        {
            name: 'Brand',
            sortable: true,
            selector: row => row.brand ? row.brand : "N/A"
        },
        {
            name: 'Vendor',
            sortable: true,
            selector: row => row.vendor ? row.vendor : "N/A"
        },
        {
            name: 'Product',
            sortable: true,
            selector: row => row.product_name ? row.product_name : "N/A"
        },
        {
            name: 'Date',
            sortable: true,
            grow: 1,
            selector: row => row.createdAt ? row.createdAt : "N/A"
        },
        {
            name: 'Quantity',
            sortable: true,
            selector: row => row.quantity
        },
        {
            name: 'Sale price',
            sortable: true,
            selector: row => row.selling_price
        },
        {
            name: 'Purchase price',
            sortable: true,
            selector: row => row.purchase_price
        },
        {
            name: 'Discount',
            sortable: true,
            selector: row => row.discount
        },
        {
            name: 'Profit',
            sortable: true,
            selector: row => row.profit
        }
    ]

    if (isLoading) return <PreLoader />

    return (
        <div className="report-index">
            <div className="container-fluid">
                <div className="row">

                    {/* Filter form */}
                    <div className="col-12 col-padding">
                        <div className="card border-0 shadow-sm">
                            <div className="card-header p-3 p-lg-4 bg-white">
                                <h6 className="mt-0 mb-3">Store Credit</h6>
                            </div>

                            <div className="card-body">
                                <div className="row">
                                    <div className="col-lg-10">
                                        <form>
                                            <div className="row">
                                                <div className="col-md-6">

                                                    {/* Category */}
                                                    <div className="form-group mb-3">
                                                        <p>Category</p>

                                                        <SingleSelect
                                                            placeholder={'Category'}
                                                            options={categories}
                                                            value={event => {
                                                                setCategory(event.value)
                                                                setSubCategories(event.child ? event.child : null)
                                                            }}
                                                        />
                                                    </div>

                                                    {/* Sub Category */}
                                                    <div className="form-group mb-3">
                                                        <p>Sub Category</p>

                                                        <SingleSelect
                                                            placeholder={'Sub-Category'}
                                                            options={subCategories}
                                                            value={event => {
                                                                setSubCategory(event.value)
                                                                setLeafCategories(event.child ? event.child : null)
                                                            }}
                                                        />
                                                    </div>

                                                    {/* Leaf Category */}
                                                    <div className="form-group mb-3">
                                                        <p>Leaf Category</p>

                                                        <SingleSelect
                                                            placeholder={'Leaf-Category'}
                                                            options={leafCategories}
                                                            value={event => setLeafCategory(event.value)}
                                                        />
                                                    </div>

                                                    {/* Vendor */}
                                                    <div className="form-group mb-3">
                                                        <p>Vendor</p>

                                                        <SingleSelect
                                                            placeholder={'vendor'}
                                                            options={vendors}
                                                            value={event => setVendor(event.value)}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-md-6">
                                                    {/* Brand */}
                                                    <div className="form-group mb-3">
                                                        <p>Brand</p>

                                                        <SingleSelect
                                                            placeholder={'brand'}
                                                            options={brands}
                                                            value={event => setBrand(event.value)}
                                                        />
                                                    </div>

                                                    {/* From */}
                                                    <div className="form-group mb-3">
                                                        <p>From</p>
                                                        <input
                                                            type="date"
                                                            name="from"
                                                            className={"form-control shadow-none"}
                                                            onChange={event => setFrom(event.target.value)}
                                                        />
                                                    </div>

                                                    {/* To */}
                                                    <div className="form-group mb-3">
                                                        <p>To</p>
                                                        <input
                                                            type="date"
                                                            name="to"
                                                            className={"form-control shadow-none"}
                                                            onChange={event => setTo(event.target.value)}
                                                        />
                                                    </div>

                                                    {/* Order status */}
                                                    <div className="form-group mb-3">
                                                        <p>Order Status</p>

                                                        <SingleSelect
                                                            placeholder={'status'}
                                                            options={statuses}
                                                            value={event => setStatus(event.value)}
                                                        />
                                                    </div>
                                                </div>

                                                {/* Submit button */}
                                                <div className="col-md-12 pt-2 pb-3">
                                                    <button
                                                        type="button"
                                                        onClick={handleFilter}
                                                        className="btn shadow-none btn-block"
                                                        disabled={isFilter}
                                                    >{isFilter ? 'Filtering...' : 'Filter'}</button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                    <div className="col-lg-2 text-right">
                                        <ExportCSV csvData={sheetData} fileName={'Registered_buyers'} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Item card group */}
                    <div className="col-12 px-3 px-lg-4">
                        <div className="row px-1">

                            <div className="col-6 col-sm-6 col-lg-4 col-xl-3 rounded text-center p-2">
                                <div className="bg-white p-4">
                                    <h6 className="mb-0">Total Selling</h6>
                                    <p className="mb-0">{totalSell ? totalSell.toFixed(1) : 0} TK</p>
                                </div>
                            </div>

                            <div className="col-6 col-sm-6 col-lg-4 col-xl-3 rounded text-center p-2">
                                <div className="bg-white p-4">
                                    <h6 className="mb-0">Total Purchase</h6>
                                    <p className="mb-0">{totalPurchase ? totalPurchase.toFixed(1) : 0} TK</p>
                                </div>
                            </div>

                            <div className="col-6 col-sm-6 col-lg-4 col-xl-3 rounded text-center p-2">
                                <div className="bg-white p-4">
                                    <h6 className="mb-0">Total Discount</h6>
                                    <p className="mb-0">{totalDiscount ? totalDiscount.toFixed(1) : 0} TK</p>
                                </div>
                            </div>

                            <div className="col-6 col-sm-6 col-lg-4 col-xl-3 rounded text-center p-2">
                                <div className="bg-white p-4">
                                    <h6 className="mb-0">Total Profit</h6>
                                    <p className="mb-0">{totalProfit ? totalProfit.toFixed(1) : 0} TK</p>
                                </div>
                            </div>

                            <div className="col-6 col-sm-6 col-lg-4 col-xl-3 rounded text-center p-2">
                                <div className="bg-white p-4">
                                    <h6 className="mb-0">Busket Size</h6>
                                    <p className="mb-0">{busketSize ? busketSize.toFixed(1) : 0} TK</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Data table component for show data */}
                    <div className="col-12 col-padding">
                        <div className="card border-0 shadow-sm">
                            <div className="card-body p-0">
                                <DataTable
                                    fixedHeader
                                    fixedHeaderScrollHeight="600px"
                                    columns={columns}
                                    data={data}
                                    loading={isLoading}
                                />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Index;