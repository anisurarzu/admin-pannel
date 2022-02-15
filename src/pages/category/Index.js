import React, { useCallback, useEffect, useState } from 'react'
import './style.scss'
import Icon from 'react-icons-kit'
import { Link } from 'react-router-dom'
import { plus } from 'react-icons-kit/feather'
import { PreLoader } from '../../components/loading/Index'

import Requests from '../../utils/Requests/Index'
import CategoryTable from '../../components/table/Category'

const Index = () => {
    const [isLoading, setLoading] = useState(true)
    const [items, setItems] = useState([])
    const [header] = useState({
        headers: { Authorization: "Bearer " + localStorage.getItem('token') }
    })

    // Fetch data
    const fetchData = useCallback(async () => {
        const data = await Requests.Category.Index(header)
        if (data) {
            setItems(data.categories)
            setLoading(false)
        }
        setLoading(false)
    }, [header])


    useEffect(() => {
        fetchData()
    }, [header, fetchData])

    if (isLoading) return <PreLoader />

    return (
        <div className="category-index pb-4">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12 col-padding">
                        <div className="card border-0">
                            <div className="card-header bg-white shadow-sm border-0 p-3 p-lg-4">
                                <div className="d-flex">
                                    <div><h6 className="mb-0">Category List</h6></div>
                                    <div className="ml-auto">
                                        <Link
                                            to="/dashboard/category/create"
                                            type="button"
                                            className="btn shadow-none rounded-circle"
                                        >
                                            <Icon icon={plus} size={22} />
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {/* Data table component for show data */}
                            <div className="card-body p-3 p-lg-4">
                                <CategoryTable items={items} refetch={fetchData} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Index;