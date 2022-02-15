import React, { useState, useEffect, useCallback } from 'react'
import Icon from 'react-icons-kit'
import { Link } from 'react-router-dom'
import { plus, trash2 } from 'react-icons-kit/feather'
import { CustomButton } from '../../components/button'
import { Container } from '../../components/container'
import { Card } from '../../components/card/Index'
import { DataTable } from '../../components/table/Index'
import { DeleteModal } from '../../components/modal/Delete'
import Requests from '../../utils/Requests/Index'

const Index = () => {
    const [isLoading, setLoading] = useState(true)
    const [limit, setLimit] = useState(10)
    const [totalItems, setTotalItems] = useState(0)

    const [data, setData] = useState([])
    const [searchLoading, setsearchLoading] = useState(false)
    const [isDelete, setDelete] = useState({ value: null, show: false, loading: false })
    const [header] = useState({
        headers: { Authorization: "Bearer " + localStorage.getItem('token') }
    })

    // Fetch data
    const fetchData = useCallback(async (page) => {
        setLoading(true)
        const response = await Requests.Deactivated.Index(page, limit, header)

        if (response) {
            setData(response.data)
            setTotalItems(response.pagination ? response.pagination.items : 0)
        }
        setLoading(false)
    }, [limit, header])

    // handle page change
    const handlePageChange = page => fetchData(page)

    // handle limit change
    const handleLimitChange = async (newLimit, page) => {
        setLoading(true)
        const response = await Requests.Deactivated.Index(page, newLimit, header)

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
        const response = await Requests.Deactivated.Search(data, header)
        if (response) setData(response.data)
        setsearchLoading(false)
    }

    // Handle search suggestion
    const handleSuggestion = async (value) => {
        let data = {
            results: [],
            message: null
        }
        const response = await Requests.Deactivated.Search(value, header)

        if (response && response.data && response.data.length) {
            for (let i = 0; i < response.data.length; i++) {
                const element = response.data[i]
                data.results.push(element.item.name)
            }
        } else {
            data.message = "No results found"
        }

        return data
    }

    // Handle delete
    const handleDelete = async () => {
        setDelete({ ...isDelete, loading: true })
        await Requests.Deactivated.Delete(isDelete.value._id, isDelete.value.type, header)
        fetchData()
        setDelete({ ...isDelete, show: false, loading: false })
    }

    const columns = [
        {
            name: 'Name',
            selector: row => row.item.name,
            sortable: true
        },
        {
            name: 'Type',
            selector: row => row.type,
            sortable: true
        },
        {
            name: 'Action',
            grow: 0,
            cell: row =>
                <CustomButton
                    style={{ padding: "6px 10px" }}
                    className="btn-danger rounded-circle border-0 mr-1"
                    onClick={() => setDelete({ value: row, show: true })}
                ><Icon icon={trash2} size={16} />
                </CustomButton>
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
                                    <div><h6 className="mb-0">Deactivated items</h6></div>
                                    <div className="ml-auto">
                                        <Link to="/dashboard/deactivated/create">
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
                                    placeholder={"Search item"}
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

            {/* Delete confirmation */}
            <DeleteModal
                show={isDelete.show}
                loading={isDelete.loading}
                message={<h6>Want to delete this item ?</h6>}
                onHide={() => setDelete({ value: null, show: false, loading: false })}
                doDelete={handleDelete}
            />
        </div>
    );
};

export default Index;