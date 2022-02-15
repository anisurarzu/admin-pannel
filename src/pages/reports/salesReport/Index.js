import React, { useCallback, useEffect, useState } from 'react'
import './style.scss'
import { useQuery } from '../../../components/query/Index'
import { DataTable } from '../../../components/table/Index'

import Requests from '../../../utils/Requests/Index'
import ExportCSV from '../../../components/exportCSV/Index'
import SalesFilter from '../../../components/salesFilter/Index'

const Index = () => {
    let { type, value } = useQuery()

    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([])
    const [header] = useState({
        headers: { Authorization: "Bearer " + localStorage.getItem('token') }
    })

    // Fetch data
    const fetchData = useCallback(async () => {
        setLoading(true)
        const response = await Requests.Sales.SalesReport(type, value, header)

        if (response.status) setData(response.data)
        setLoading(false)
    }, [type, value, header])

    useEffect(() => {
        if (type && value) fetchData()
    }, [type, value, header, fetchData])


    const columns = [
        {
            name: 'O. Code',
            sortable: true,
            selector: row => row.orderCode
        },
        {
            name: 'U.O. Count',
            sortable: true,
            grow: 0,
            selector: row => row.uniqueOrderCount
        },
        {
            name: 'Customer',
            sortable: true,
            selector: row => row.customer
        },
        {
            name: 'Channel',
            sortable: true,
            grow: 0,
            selector: row => row.channel
        },
        {
            name: 'Location',
            sortable: true,
            selector: row => row.location
        },
        {
            name: 'Area',
            sortable: true,
            selector: row => row.area
        },
        {
            name: 'P. SKU',
            sortable: true,
            selector: row => row.productSKU
        },
        {
            name: 'P. Name',
            sortable: true,
            grow: 1,
            selector: row => row.productName
        },
        {
            name: 'Brand',
            sortable: true,
            selector: row => row.brand ? row.brand : "N/A"
        },
        {
            name: 'Vendor',
            sortable: true,
            selector: row => row.vendor
        },
        {
            name: 'Category',
            sortable: true,
            selector: row => row.category ? row.category : "N/A"
        },
        {
            name: 'Payment Status',
            sortable: true,
            selector: row => row.paymentStatus
        },
        {
            name: 'Status',
            sortable: true,
            selector: row => row.status
        },
        {
            name: 'Purchase Price',
            sortable: true,
            selector: row => "Tk. " + row.purchasePrice
        },
        {
            name: 'Listing Price',
            sortable: true,
            selector: row => "Tk. " + row.listingPrice
        },
        {
            name: 'Discount',
            sortable: true,
            selector: row => "Tk. " + row.itemDiscount
        },
        {
            name: 'Sale Price',
            sortable: true,
            selector: row => "Tk. " + row.sellingPrice
        }
    ]

    return (
        <div className="report-index">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12 col-padding">
                        <div className="card border-0 shadow-sm mb-3">
                            <div className="card-header p-3 p-lg-4 bg-white">
                                <div className="d-flex">
                                    <div><h6 className="mt-2 mb-0">Sales report</h6></div>
                                    <div className="ml-auto">
                                        {data && data.length ? <ExportCSV csvData={data} fileName={'Sales_report'} /> : null}
                                    </div>
                                </div>
                            </div>

                            {/* Filter form */}
                            <div className="card-body p-0">
                                <SalesFilter updateItems={(data) => setData(data)} />
                            </div>
                        </div>

                        {/* Data table */}
                        <div className="card border-0 shadow-sm">
                            <div className="card-body p-0">
                                <DataTable
                                    fixedHeader
                                    fixedHeaderScrollHeight="600px"
                                    columns={columns}
                                    data={data}
                                    loading={loading}
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
