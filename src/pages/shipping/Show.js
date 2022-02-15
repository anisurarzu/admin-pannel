import React, { useState, useEffect, useCallback } from 'react'
import Icon from 'react-icons-kit'
import { Link, useParams } from 'react-router-dom'
import { chevronLeft } from 'react-icons-kit/feather'
import { PreLoader } from '../../components/loading/Index'
import CouponShowTable from '../../components/table/CouponShow'
import Requests from '../../utils/Requests/Index'

const Show = () => {
    const { id } = useParams()
    const [isLoading, setLoading] = useState(true)
    const [shipping, setShipping] = useState({})
    const [items, setItems] = useState([])
    const [header] = useState({
        headers: { Authorization: "Bearer " + localStorage.getItem('token') }
    })

    // Fetch data
    const fetchData = useCallback(async () => {
        const data = await Requests.Shipping.Show(id, header)
        if (data) {
            setShipping(data)

            if (data.brands && data.brands.length) {
                setItems(data.brands)
            }
            else if (data.categories && data.categories.length) {
                setItems(data.categories)
            }
            else if (data.subCategories && data.subCategories.length) {
                setItems(data.subCategories)
            }
            else if (data.leafCategories && data.leafCategories.length) {
                setItems(data.leafCategories)
            }
            else if (data.customers && data.customers.length) {
                setItems(data.customers)
            }
            else if (data.products && data.products.length) {
                setItems(data.products)
            }
            else if (data.vendors && data.vendors.length) {
                setItems(data.vendors)
            }
            else {
                setItems([])
            }
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
                                    <div><h6 className="mb-0">Shipping information</h6></div>
                                    <div className="ml-auto">
                                        <Link
                                            to="/dashboard/shipping"
                                            type="button"
                                            className="btn shadow-none rounded-circle"
                                        >
                                            <Icon icon={chevronLeft} size={22} />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body p-4">
                                <table className="table-sm">
                                    <tbody>
                                        <tr>
                                            <td className="title-td">Assign To</td>
                                            <td>: {shipping.assignTo}</td>
                                        </tr>
                                        <tr>
                                            <td className="title-td">Discount Type</td>
                                            <td>: {shipping.type}</td>
                                        </tr>
                                        <tr>
                                            <td className="title-td">Discount Amount</td>
                                            <td>: {shipping.type === "Percentage" ? shipping.discountAmount + "%" : "Tk. " + shipping.discountAmount}</td>
                                        </tr>
                                        <tr>
                                            <td className="title-td">Inside Dhaka</td>
                                            <td>: Tk. {shipping.insideDhaka}</td>
                                        </tr>
                                        <tr>
                                            <td className="title-td">Outside Dhaka</td>
                                            <td>: Tk. {shipping.outsideDhaka}</td>
                                        </tr>
                                        <tr>
                                            <td className="title-td">Start From</td>
                                            <td>: {shipping.startFrom}</td>
                                        </tr>
                                        <tr>
                                            <td className="title-td">End To</td>
                                            <td>: {shipping.endTo}</td>
                                        </tr>
                                    </tbody>
                                </table>

                            </div>
                        </div>
                    </div>
                </div>

                <div className="row coupon-items-container">
                    <div className="col-12 col-padding">
                        <div className="card border-0 shadow-sm">
                            <div className="card-header bg-white border-0">
                                <h6 className="mb-0">Assign for {shipping.assignTo}'s</h6>
                            </div>

                            <div className="card-body">
                                <CouponShowTable assign={shipping.assignTo} items={items} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Show;