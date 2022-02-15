import React, { useCallback, useEffect, useState } from 'react'
import './style.scss'
import { DataTable } from '../../../components/table/Index'
import Requests from '../../../utils/Requests/Index'
import ExportCSV from '../../../components/exportCSV/Index'

const Index = () => {
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
        const response = await Requests.PerformedCategory.Index(page, limit, header)

        if (response) {
            let xlsxData = []
            setData(response.data)
            setTotalItems(response.pagination ? response.pagination.items : 0)

            if (response.data && response.data.length) {
                for (let i = 0; i < response.data.length; i++) {
                    const element = response.data[i]
                    xlsxData.push({
                        name: element.name,
                        salesTime: element.salesTime,
                        salesQuantity: element.salesQuantity
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
        const response = await Requests.PerformedCategory.Index(page, newLimit, header)

        setData(response.data)
        setLimit(newLimit)
        setLoading(false)
    }

    useEffect(() => {
        fetchData(1)
    }, [header, fetchData])

    const columns = [
        {
            name: 'Name',
            grow: 1,
            sortable: true,
            selector: row => row.name
        },
        {
            name: 'Sales Time',
            sortable: true,
            selector: row => row.salesTime
        },
        {
            name: 'Sales Qunt.',
            sortable: true,
            selector: row => row.salesQuantity
        }
    ]

    return (
        <div className="report-index">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12 col-padding">
                        <div className="card border-0 shadow-sm">
                            <div className="card-header p-3 p-lg-4 bg-white">
                                <div className="d-flex">
                                    <div><h6 className="mt-2 mb-0">Best performed category</h6></div>
                                    <div className="ml-auto">
                                        <ExportCSV csvData={sheetData} fileName={'Best_performed_category'} />
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