import React, { useCallback, useEffect, useState } from 'react'
import Icon from 'react-icons-kit'
import { Link } from 'react-router-dom'
import { eye, edit2, plus } from 'react-icons-kit/feather'
import { CustomButton } from '../../components/button'
import { DataTable } from '../../components/table/Index'
import { Container } from '../../components/container'
import { Card } from '../../components/card/Index'
import { Text } from '../../components/text'

import Requests from '../../utils/Requests/Index'

const Index = () => {
    const [isLoading, setLoading] = useState(false)
    const [limit, setLimit] = useState(10)
    const [totalItems, setTotalItems] = useState(0)
    const [data, setData] = useState([])

    const columns = [
        {
            name: 'Area',
            sortable: true,
            selector: row => row.area
        },
        {
            name: 'Action',
            grow: 0,
            minWidth: '150px',
            cell: row =>
                <div>
                    <Link to={`/dashboard/area/${row._id}/show`}>
                        <CustomButton
                            style={{ padding: "6px 10px" }}
                            className="btn-primary rounded-circle border-0"
                        ><Icon icon={eye} size={16} />
                        </CustomButton>
                    </Link>

                    <Link to={`/dashboard/area/${row._id}/edit`}>
                        <CustomButton
                            style={{ padding: "6px 10px" }}
                            className="btn-success rounded-circle border-0 mx-1"
                        ><Icon icon={edit2} size={16} />
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
                            <Card.Header className="bg-white border-0 p-3 p-lg-4">
                                <div className="d-flex">
                                    <div><Text className="fs-16 mt-2 mb-0">District list</Text></div>
                                    <div className="ml-auto">
                                        <Link to="/dashboard/district/create">
                                            <CustomButton className="btn-primary border-0 rounded-circle circle__padding">
                                                <Icon icon={plus} size={22} />
                                            </CustomButton>
                                        </Link>
                                    </div>
                                </div>
                            </Card.Header>
                            <Card.Body>
                                <DataTable
                                    columns={columns}
                                    data={data}
                                    loading={isLoading}
                                    totalRows={totalItems}
                                    pagination={true}
                                    paginationServer={true}
                                // handlePerRowsChange={handleLimitChange}
                                // handlePageChange={handlePageChange}
                                />
                            </Card.Body>
                        </Card.Simple>
                    </Container.Column>
                </Container.Row>
            </Container.Fluid>
        </div>
    );
}

export default Index;