import React, { useCallback, useEffect, useState } from 'react'
import Icon from 'react-icons-kit'
import { Link } from 'react-router-dom'
import { plus, edit2, trash2, eye } from 'react-icons-kit/feather'
import { CustomButton } from '../../../components/button'
import { Container } from '../../../components/container'
import { Card } from '../../../components/card/Index'
import { DataTable } from '../../../components/table/Index'
import { DeleteModal } from '../../../components/modal/Delete'

import Requests from '../../../utils/Requests/Index'

const Index = () => {
    const [data, setData] = useState([])
    const [limit, setLimit] = useState(10)
    const [totalItems, setTotalItems] = useState(0)
    const [isLoading, setLoading] = useState(true)

    const [isDelete, setDelete] = useState({ value: null, show: false, loading: false })
    const [header] = useState({
        headers: { Authorization: "Bearer " + localStorage.getItem('token') }
    })

    // Fetch data
    const fetchData = useCallback(async (page) => {
        const response = await Requests.University.PostIndex(page, limit, header)
        if (response) {
            setData(response.data)
            setTotalItems(response.pagination ? response.pagination.items : 0)
        }
        setLoading(false)
    }, [limit, header])

    useEffect(() => {
        fetchData(1)
    }, [header, fetchData])

    // handle pagination
    const handlePageChange = page => fetchData(page)

    // handle limit
    const handleLimitChange = async (newLimit, page) => {
        setLoading(true)
        const response = await Requests.University.PostIndex(page, newLimit, header)

        setData(response.data)
        setLimit(newLimit)
        setLoading(false)
    }

    // Handle delete
    const handleDelete = async () => {
        setDelete({ ...isDelete, loading: true })

        await Requests.University.PostDelete(isDelete.value._id, header)
        fetchData()
        setDelete({ ...isDelete, show: false, loading: false })
    }

    const columns = [
        {
            name: 'Category',
            cell: row => row.category
        },
        {
            name: 'Title',
            selector: row => row.title,
            sortable: true
        },
        {
            name: 'Action',
            grow: 0,
            minWidth: '150px',
            cell: row =>
                <div>
                    <Link to={`/dashboard/university/post/${row._id}/show`}>
                        <CustomButton
                            style={{ padding: "6px 10px" }}
                            className="btn-primary rounded-circle border-0 mr-1"
                        ><Icon icon={eye} size={16} />
                        </CustomButton>
                    </Link>

                    <Link to={`/dashboard/university/post/${row._id}/edit`}>
                        <CustomButton
                            style={{ padding: "6px 10px" }}
                            className="btn-success rounded-circle border-0 mr-1"
                        ><Icon icon={edit2} size={16} />
                        </CustomButton>
                    </Link>

                    <CustomButton
                        style={{ padding: "6px 10px" }}
                        className="btn-danger rounded-circle border-0"
                        onClick={() => setDelete({ value: row, show: true })}
                    ><Icon icon={trash2} size={16} />
                    </CustomButton>
                </div>
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
                                    <div><h6 className="mb-0">All post List</h6></div>
                                    <div className="ml-auto">
                                        <Link to="/dashboard/university/post/create">
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
                message={<h6>Want to delete this Post ?</h6>}
                onHide={() => setDelete({ value: null, show: false, loading: false })}
                doDelete={handleDelete}
            />
        </div>
    );
}

export default Index;
