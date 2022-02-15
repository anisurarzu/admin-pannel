import React, { useCallback, useEffect, useState } from 'react'
import Icon from 'react-icons-kit'
import { Link } from 'react-router-dom'
import { plus, edit2, trash2 } from 'react-icons-kit/feather'
import Requests from '../../../utils/Requests/Index'

import { Container } from '../../../components/container'
import { Card } from '../../../components/card/Index'
import { DeleteModal } from '../../../components/modal/Delete'
import { DataTable } from '../../../components/table/Index'
import { CustomButton } from '../../../components/button'


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
        setLoading(true)
        const response = await Requests.University.CategoryIndex(page, limit, header)

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
        const response = await Requests.University.CategoryIndex(page, newLimit, header)

        setData(response.data)
        setLimit(newLimit)
        setLoading(false)
    }

    const columns = [
        {
            name: 'Image',
            grow: 0,
            minWidth: "150px",
            cell: row => <img
                src={row.image}
                height={40}
                className="img-fluid"
                alt={row.name}
            />
        },
        {
            name: 'Name',
            selector: row => row.name,
            sortable: true
        },
        {
            name: 'Action',
            grow: 0,
            minWidth: '150px',
            cell: row =>
                <div>
                    <Link to={`/dashboard/university/category/${row._id}/edit`}>
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

    // Handle delete
    const handleDelete = async () => {
        setDelete({ ...isDelete, loading: true })

        await Requests.University.CategoryDelete(isDelete.value._id, header)
        fetchData()
        setDelete({ ...isDelete, show: false, loading: false })
    }

    return (
        <div className="pb-4">
            <Container.Fluid>
                <Container.Row>
                    <Container.Column className="col-padding">
                        <Card.Simple className="border-0">
                            <Card.Header className="bg-white border-0 p-3 p-lg-4">
                                <div className="d-flex">
                                    <div><h6 className="mb-0">Eazybest University Category List</h6></div>
                                    <div className="ml-auto">
                                        <Link to="/dashboard/university/category/create">
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
                message={
                    <div>
                        <h6>Want to delete this category ?</h6>
                        <img src={isDelete.value ? isDelete.value.image : null} className="img-fluid" height={150} alt="Category banner" />
                    </div>
                }
                onHide={() => setDelete({ value: null, show: false, loading: false })}
                doDelete={handleDelete}
            />
        </div>
    );
}

export default Index;
