import React, { useCallback, useEffect, useState } from 'react'
import './style.scss'
import Requests from '../../../utils/Requests/Index'
import { dateFormate } from '../../../utils/Helpers'
import { DataTable } from '../../../components/table/Index'

import ExportCSV from '../../../components/exportCSV/Index'
import { RangeFilter } from '../../../components/rangeFilter/Index'

const Index = () => {
    const [isFilter, setFilter] = useState(false)
    const [isLoading, setLoading] = useState(true)
    const [limit, setLimit] = useState(10)
    const [totalItems, setTotalItems] = useState(0)

    const [data, setData] = useState([])
    const [sheetData, setSheetData] = useState([])
    const [searching, setSearching] = useState(false)

    const [header] = useState({
        headers: { Authorization: "Bearer " + localStorage.getItem('token') }
    })

    // Fetch data
    const fetchData = useCallback(async (page) => {
        setLoading(true)
        const response = await Requests.BuyerPurchase.Index(page, limit, header)

        if (response) {
            let xlsxData = []
            setData(response.data)
            setTotalItems(response.pagination ? response.pagination.items : 0)

            if (response.data && response.data.length) {
                for (let i = 0; i < response.data.length; i++) {
                    const element = response.data[i]
                    xlsxData.push({
                        name: element.name,
                        email: element.email,
                        phone: element.phone,
                        order_code: element.orderCode,
                        shipping_area: element.shippingArea,
                        delivery_address: element.deliveryAddress,
                        payment_method: element.paymentMethod,
                        sub_total_price: element.subTotalPrice,
                        total_price: element.totalPrice,
                        date: dateFormate(element.createdAt)
                    })
                }
                setSheetData(xlsxData)
            }
        }

        setLoading(false)
    }, [limit, header])

    const handlePageChange = page => fetchData(page)

    const handleLimitChange = async (newLimit, page) => {
        setLoading(true)
        const response = await Requests.BuyerPurchase.Index(page, newLimit, header)

        setData(response.data)
        setLimit(newLimit)
        setLoading(false)
    }

    useEffect(() => {
        fetchData(1)
    }, [header, fetchData])

    // Filter items
    const handleFilter = async data => {
        setFilter(true)
        const response = await Requests.BuyerPurchase.Filter(data, header)
        setData(response.data)
        setFilter(false)
    }

    // Handle search
    const handleSearch = async data => {
        setSearching(true)
        const response = await Requests.BuyerPurchase.Search({ query: data.query }, header)
        if (response) setData(response.data)
        setSearching(false)
    }

    const customStyles = {
        rows: {
            style: {
                minHeight: '100px auto',
            }
        }
    }

    const columns = [
        {
            name: 'Buyer',
            grow: 2,
            cell: row =>
                <div className="py-2">
                    <p className="text-capitalize mb-1 mb-1">{row.name ? row.name : 'N/A'}</p>
                    <p className="text-lowercase mb-1">{row.email ? row.email : 'N/A'}</p>
                    <p className="mb-0">{row.phone ? row.phone : 'N/A'}</p>
                </div>
        },
        {
            name: 'O.Code',
            sortable: true,
            selector: row => row.orderCode
        },
        {
            name: 'Addresses',
            grow: 2,
            cell: row =>
                <div className="py-2">
                    <p className="text-capitalize mb-1"><i className="text-muted">Shipping Area: </i>{row.shippingArea}</p>
                    <p className="text-capitalize mb-0"><i className="text-muted">Deliver Address: </i>{row.deliveryAddress}</p>
                </div>
        },
        {
            name: 'Payment',
            grow: 2,
            cell: row =>
                <div className="py-2">
                    <p className="text-capitalize mb-1"><i className="text-muted">Sub-total: </i>{row.subTotalPrice} tk.</p>
                    <p className="text-capitalize mb-0"><i className="text-muted">Total (+Deliver charge): </i>{row.totalPrice} tk.</p>
                </div>
        },
        {
            name: 'Created At',
            sortable: true,
            selector: row => dateFormate(row.createdAt)
        }
    ]

    return (
        <div className="report-index">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12 col-padding">
                        <div className="card border-0 shadow-sm">
                            <div className="card-header p-3 p-lg-4 bg-white">
                                <h6 className="mt-0 mb-3">Buyer purchases</h6>
                                <div className="d-xl-flex">
                                    <div className="d-md-flex pl-xl-2">
                                        <div>
                                            <RangeFilter
                                                loading={isFilter}
                                                filter={handleFilter}
                                            />
                                        </div>
                                        <div className="text-right pt-2 pt-md-0 pl-2">
                                            <ExportCSV csvData={sheetData} fileName={'Buyers_purchase_history'} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Data table component for show data */}
                            <div className="card-body p-0">
                                <DataTable
                                    fixedHeader
                                    fixedHeaderScrollHeight="580px"
                                    customStyles={customStyles}
                                    columns={columns}
                                    data={data}
                                    loading={isLoading}
                                    totalRows={totalItems}
                                    pagination={true}
                                    paginationServer={true}
                                    handlePerRowsChange={handleLimitChange}
                                    handlePageChange={handlePageChange}
                                    searchable
                                    search={handleSearch}
                                    searching={searching}
                                    clearSearch={() => fetchData(1)}
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