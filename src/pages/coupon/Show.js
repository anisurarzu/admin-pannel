import React, { useState, useEffect, useCallback } from 'react'
import './style.scss'
import Icon from 'react-icons-kit'
import { Link, useParams } from 'react-router-dom'
import { chevronLeft } from 'react-icons-kit/feather'
import { PreLoader } from '../../components/loading/Index'
import { StringShort, dateFormate } from '../../utils/Helpers'

import Requests from '../../utils/Requests/Index'
import CouponShowTable from '../../components/table/CouponShow'

const Show = () => {
    const { id } = useParams()
    const [isLoading, setLoading] = useState(true)
    const [coupon, setCoupon] = useState({})
    const [items, setItems] = useState([])
    const [header] = useState({
        headers: { Authorization: "Bearer " + localStorage.getItem('token') }
    })

    // Fetch data
    const fetchData = useCallback(async () => {
        const data = await Requests.Coupon.Show(id, header)
        if (data) {
            setCoupon(data)

            if (data.brands && data.brands.length) {
                setItems(data.brands)
            } else if (data.categories && data.categories.length) {
                setItems(data.categories)
            } else if (data.customers && data.customers.length) {
                setItems(data.customers)
            } else if (data.products && data.products.length) {
                setItems(data.products)
            } else if (data.vendors && data.vendors.length) {
                setItems(data.vendors)
            } else {
                setItems([])
            }

            setLoading(false)
        }
        setLoading(false)
    }, [id, header])

    useEffect(() => {
        fetchData()
    }, [id, header, fetchData])

    if (isLoading) return <PreLoader />

    return (
        <div className="show-coupon pb-4">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12 col-padding">
                        <div className="card border-0 shadow-sm">
                            <div className="card-header p-3 p-lg-4 bg-white">
                                <div className="d-flex">
                                    <div><h6 className="mb-0">{coupon.name}</h6></div>
                                    <div className="ml-auto">
                                        <Link
                                            to="/dashboard/coupon"
                                            type="button"
                                            className="btn shadow-none rounded-circle"
                                        >
                                            <Icon icon={chevronLeft} size={22} />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body p-4">
                                <div className="d-sm-flex coupon-profile-container">
                                    {/* Name circle */}
                                    {coupon.name ?
                                        <div className="name-circle rounded-circle flex-center flex-column">
                                            <h1>{StringShort(coupon.name)}</h1>
                                        </div>
                                        : null}

                                    {/* Content container */}
                                    <div className="flex-fill content-container pl-sm-4">
                                        <table className="table-sm">
                                            <tbody>
                                                <tr>
                                                    <td className="title-td">Name</td>
                                                    <td>: {coupon.name}</td>
                                                </tr>
                                                <tr>
                                                    <td className="title-td">Code</td>
                                                    <td>: {coupon.code}</td>
                                                </tr>
                                                <tr>
                                                    <td className="title-td">Type</td>
                                                    <td>: {coupon.type}</td>
                                                </tr>
                                                <tr>
                                                    <td className="title-td">Assign to</td>
                                                    <td>: {coupon.assignTo}</td>
                                                </tr>
                                                <tr>
                                                    <td className="title-td">Amount</td>
                                                    <td>: {coupon.amount}</td>
                                                </tr>
                                                <tr>
                                                    <td className="title-td">Use Limit</td>
                                                    <td>: {coupon.useLimit ? coupon.useLimit : 0} Times</td>
                                                </tr>
                                                <tr>
                                                    <td className="title-td">Minimum Value</td>
                                                    <td>: {coupon.priceDiscount ? coupon.priceDiscount + " tk." : 0}</td>
                                                </tr>
                                                <tr>
                                                    <td className="title-td">Maximum Value</td>
                                                    <td>: {coupon.priceLimit ? coupon.priceLimit + " tk." : 0}</td>
                                                </tr>
                                                <tr>
                                                    <td className="title-td">Inside Dhaka</td>
                                                    <td>: {coupon.insideDhaka ? coupon.insideDhaka + " tk." : 0}</td>
                                                </tr>
                                                <tr>
                                                    <td className="title-td">Outside Dhaka</td>
                                                    <td>: {coupon.outsideDhaka ? coupon.outsideDhaka + " tk." : 0}</td>
                                                </tr>
                                                <tr>
                                                    <td className="title-td">Valid till</td>
                                                    <td>: {dateFormate(coupon.validTill)}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row coupon-items-container">
                    <div className="col-12 col-padding">
                        <div className="card border-0 shadow-sm">
                            <div className="card-header bg-white border-0">
                                <h6 className="mb-0">{coupon.assignTo}'s</h6>
                            </div>
                            <div className="card-body">
                                <CouponShowTable assign={coupon.assignTo} items={items} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Show;