import React, { useCallback, useEffect, useState } from 'react'
import './style.scss'
import { dateFormate } from '../../../utils/Helpers'
import { DataTable } from '../../../components/table/Index'

import Requests from '../../../utils/Requests/Index'
import ExportCSV from '../../../components/exportCSV/Index'
import { RangeFilter } from '../../../components/rangeFilter/Index'

const Index = () => {
    const [isFilter, setFilter] = useState(false)
    const [isLoading, setLoading] = useState(true)
    const [limit, setLimit] = useState(10)
    const [totalItems, setTotalItems] = useState(0)

    const [data, setData] = useState([])
    const [sheetData, setSheetData] = useState([])
    const [header] = useState({
        headers: { Authorization: "Bearer " + localStorage.getItem('token') }
    })

    // Fetch data
    const fetchData = useCallback(async (page) => {
        setLoading(true)
        const response = await Requests.Buyer.Index(page, limit, header)

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
        const response = await Requests.Buyer.Index(page, newLimit, header)

        setData(response.data)
        setLimit(newLimit)
        setLoading(false)
    }

    useEffect(() => {
        fetchData(1)
    }, [header, fetchData])

    // FIlter items
    const handleFilter = async data => {
        setFilter(true)
        const response = await Requests.Buyer.Filter(data, header)

        if (response) {
            setData(response.data)
            setFilter(false)
        }
    }

    const columns = [
        {
            name: 'Name',
            sortable: true,
            selector: row => row.name ? row.name : "N/A"
        },
        {
            name: 'E-mail',
            sortable: true,
            selector: row => row.email ? row.email : "N/A"
        },
        {
            name: 'Phone',
            sortable: true,
            selector: row => row.phone ? row.phone : "N/A"
        },
        {
            name: 'Created At',
            grow: 1,
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
                                <h6 className="mt-0 mb-3">Buyer's List</h6>
                                <div className="d-md-flex">
                                    <div>
                                        <RangeFilter
                                            loading={isFilter}
                                            filter={handleFilter}
                                        />
                                    </div>
                                    <div className="text-right pt-2 pt-md-0 pl-2">
                                        <ExportCSV csvData={sheetData} fileName={'Registered_buyers'} />
                                    </div>
                                </div>
                            </div>

                            {/* Data table component for show data */}
                            <div className="card-body p-0">
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
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Index;