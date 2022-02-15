import React, { useCallback, useEffect, useState } from 'react'
import './style.scss'
import Icon from 'react-icons-kit'
import { x } from 'react-icons-kit/feather'
import { Link } from 'react-router-dom'
import { DataTable } from '../../../components/table/Index'
import { RangeFilter } from '../../../components/rangeFilter/Index'
import { Container } from '../../../components/container'
import { Card } from '../../../components/card/Index'
import { SearchableSelect } from '../../../components/select'
import { CustomButton } from '../../../components/button'

import Requests from '../../../utils/Requests/Index'
import ExportCSV from '../../../components/exportCSV/Index'

const Index = () => {
    const [isFilter, setFilter] = useState(false)
    const [isLoading, setLoading] = useState(true)
    const [limit, setLimit] = useState(10)
    const [totalItems, setTotalItems] = useState(0)

    const [data, setData] = useState([])
    const [sheetData, setSheetData] = useState([])
    const [closeFilter, setCloseFilter] = useState(false)
    const [header] = useState({
        headers: { Authorization: "Bearer " + localStorage.getItem('token') }
    })

    // Fetch data
    const fetchData = useCallback(async (page) => {
        setLoading(true)
        const response = await Requests.BestSale.Index(page, limit, header)

        if (response) {
            let xlsxData = []
            setData(response.data)
            setTotalItems(response.pagination ? response.pagination.items : 0)

            if (response.data && response.data.length) {
                for (let i = 0; i < response.data.length; i++) {
                    const element = response.data[i]
                    xlsxData.push({
                        name: element.name,
                        sku: element.sku,
                        sales_time: element.salesTime,
                        sales_quantity: element.salesQuantity
                    })
                }
                setSheetData(xlsxData)
            }
        }

        setLoading(false)
    }, [limit, header])

    useEffect(() => {
        fetchData(1)
    }, [header, fetchData])

    // handle page change
    const handlePageChange = page => fetchData(page)

    // handle limit change
    const handleLimitChange = async (newLimit, page) => {
        setLoading(true)
        const response = await Requests.BestSale.Index(page, newLimit, header)

        setData(response.data)
        setLimit(newLimit)
        setLoading(false)
    }

    // handle filter fields
    const handleFilterField = async ({ inputValue, field }) => {
        let response

        if (!field) response = { data: [] }
        if (field === "vendor") response = await Requests.Options.Vendor(inputValue, header)
        if (field === "brand") response = await Requests.Options.Brand(inputValue, header)
        if (field === "leaf-category") response = await Requests.Options.LeafCategory(inputValue, header)

        if (response.data && response.data.length) return response.data
        return []
    }

    // Handle filter by selected item
    const filterBySelectedItem = async data => {
        setLoading(true)
        setCloseFilter(true)
        const response = await Requests.BestSale.FilterByFields(data, header)

        setData(response.data)
        setLoading(false)
    }

    // FIlter items
    const handleFilterByDate = async data => {
        setFilter(true)
        setCloseFilter(true)
        const response = await Requests.BestSale.FilterByDate(data, header)
        setData(response.data)
        setFilter(false)
    }

    // data coulmns
    const columns = [
        {
            name: 'Product',
            sortable: true,
            grow: 1,
            minWidth: '300px',
            cell: row =>
                <div>
                    <p className="my-2"><Link to={`/dashboard/product/${row._id}/show`}>{row.name && row.name.length > 40 ? row.name.slice(0, 40) + ' ...' : row.name}</Link></p>
                    <p className="mb-2"><b>SKU: </b>{row.sku}</p>
                </div>
        },
        {
            name: 'Brand',
            sortable: true,
            selector: row => row.brand
        },
        {
            name: 'Vendor',
            sortable: true,
            selector: row => row.vendor
        },
        {
            name: 'Leaf-Category',
            sortable: true,
            selector: row => row.leafCategory
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
        <div className="pb-4">
            <Container.Fluid>
                <Container.Row>
                    <Container.Column className="col-padding">
                        <Card.Simple className="border-0">
                            <Card.Header className="bg-white border-0 p-3 p-lg-4">

                                {/* page header */}
                                <div className="d-flex">
                                    <div>
                                        <h6 className="mt-0 mb-3">Best selling products.</h6>
                                    </div>
                                    <div className="ml-auto">
                                        <ExportCSV
                                            csvData={sheetData}
                                            fileName={'Best_selling_products'}
                                        />
                                    </div>

                                    {closeFilter ?
                                        <CustomButton
                                            className="btn-danger border-0 rounded-circle circle__padding ml-2"
                                            onClick={() => {
                                                fetchData(1)
                                                setCloseFilter(false)
                                            }}
                                        >
                                            <Icon icon={x} size={22} />
                                        </CustomButton>
                                        : null
                                    }
                                </div>

                                {/* filter items conatiner */}
                                <Container.Row className="pt-2 px-2">

                                    {/* Vendor */}
                                    <Container.Column className="col-6 col-sm-4 col-xl-2 px-1 mb-2">
                                        <SearchableSelect
                                            isMulti={false}
                                            placeholder="Vendor"
                                            search={inputValue => handleFilterField({ inputValue, field: "vendor" })}
                                            values={event => filterBySelectedItem({ value: event.value, field: "vendor" })}
                                        />
                                    </Container.Column>

                                    {/* Brand */}
                                    <Container.Column className="col-6 col-sm-4 col-xl-2 px-1 mb-2">
                                        <SearchableSelect
                                            isMulti={false}
                                            placeholder="Brand"
                                            search={inputValue => handleFilterField({ inputValue, field: "brand" })}
                                            values={event => filterBySelectedItem({ value: event.value, field: "brand" })}
                                        />
                                    </Container.Column>

                                    {/* Leaf-Category */}
                                    <Container.Column className="col-6 col-sm-4 col-xl-2 px-1 mb-2">
                                        <SearchableSelect
                                            isMulti={false}
                                            placeholder="Leaf-Category"
                                            search={inputValue => handleFilterField({ inputValue, field: "leaf-category" })}
                                            values={event => filterBySelectedItem({ value: event.value, field: "leaf-category" })}
                                        />
                                    </Container.Column>

                                    {/* Range filter */}
                                    <Container.Column className="col-xl-6 px-1 mb-2">
                                        <RangeFilter
                                            loading={isFilter}
                                            filter={handleFilterByDate}
                                        />
                                    </Container.Column>

                                </Container.Row>
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