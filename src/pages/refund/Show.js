import React, { useState, useEffect, useCallback } from 'react'
import './style.scss'
import Icon from 'react-icons-kit'
import { Link, useParams } from 'react-router-dom'
import { chevronLeft } from 'react-icons-kit/feather'
import { PreLoader } from '../../components/loading/Index'
import { StringShort } from '../../utils/Helpers'
import Requests from '../../utils/Requests/Index'

const Show = () => {
    const { id } = useParams()
    const [isLoading, setLoading] = useState(true)
    const [isUpdate, setUpdate] = useState(false)
    const [item, setItem] = useState({})
    const [header] = useState({
        headers: { Authorization: "Bearer " + localStorage.getItem('token') }
    })

    // Fetch data
    const fetchData = useCallback(async () => {
        const data = await Requests.Refund.Show(id, header)
        if (data) {
            setItem(data)
            setLoading(false)
        }
        setLoading(false)
    }, [id, header])

    useEffect(() => {
        fetchData()
    }, [id, header, fetchData])

    // Handle status
    const handleStatus = async (event) => {
        try {
            setUpdate(true)
            const status = event.target.value
            await Requests.Refund.Update(id, status, header)
            setUpdate(false)

        } catch (error) {
            if (error) setUpdate(false)
        }
    }

    if (isLoading) return <PreLoader />

    return (
        <div className="refund-show">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12 col-padding">
                        <div className="card border-0 shadow-sm">
                            <div className="card-header p-3 p-lg-4 bg-white">
                                <div className="d-flex">
                                    <div><h6 className="mb-0">{item.user.name}</h6></div>
                                    <div className="ml-auto">
                                        <Link
                                            to="/dashboard/refund"
                                            type="button"
                                            className="btn shadow-none rounded-circle"
                                        >
                                            <Icon icon={chevronLeft} size={22} />
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {/* Customer info. */}
                            <div className="card-body p-4">
                                <div className="d-md-flex customer-profile-container">
                                    {/* Name circle */}
                                    {item.user ?
                                        <div className="name-circle rounded-circle flex-center flex-column">
                                            <h1>{StringShort(item.user.name)}</h1>
                                        </div>
                                        : null}

                                    {/* Content container */}
                                    <div className="flex-fill content-container pl-md-4">
                                        <table className="table-sm">
                                            <tbody>
                                                <tr>
                                                    <td className="title-td">Name</td>
                                                    <td>: {item.user.name}</td>
                                                </tr>
                                                <tr>
                                                    <td className="title-td">E-mail</td>
                                                    <td className="text-lowercase">: {item.user.email}</td>
                                                </tr>
                                                <tr>
                                                    <td className="title-td">Phone</td>
                                                    <td>: {item.user.phone}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="text-right pt-3 pt-md-5">
                                        <select
                                            style={{ width: 170, fontSize: 14 }}
                                            className="form-control shadow-none"
                                            defaultValue={item.status}
                                            onChange={handleStatus}
                                            disabled={isUpdate}
                                        >
                                            <option value="Return requested">Return requested</option>
                                            <option value="Sent over courier">Sent over courier</option>
                                            <option value="EB warehouse">EB warehouse</option>
                                            <option value="Canceled">Canceled</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Complain info */}
                <div className="row">
                    <div className="col-12 col-padding">
                        <div className="card border-0 shadow-sm">
                            <div className="card-body">
                                <h6 className="mb-0 pl-1">Complain info.</h6>
                                <hr className="my-3" />
                                <div className="row">
                                    <div className="col-12">
                                        <table className="table-sm">
                                            <tbody>
                                                <tr>
                                                    <td className="title-td">Courier</td>
                                                    <td>: {item.courier ? item.courier : 'N/A'}</td>
                                                </tr>
                                                <tr>
                                                    <td className="title-td">Courier Tracking / Recipient ID</td>
                                                    <td>: {item.trackingId ? item.trackingId : 'N/A'}</td>
                                                </tr>
                                                <tr>
                                                    <td className="title-td">Order code</td>
                                                    <td>: {item.orderCode ? item.orderCode : 'N/A'}</td>
                                                </tr>
                                                <tr>
                                                    <td className="title-td">Quantity</td>
                                                    <td>: {item.product ? item.product.quantity : 'N/A'}</td>
                                                </tr>
                                                <tr>
                                                    <td className="title-td">Total amount</td>
                                                    <td>: {item.totalAmount ? item.totalAmount + ' tk' : 'N/A'}</td>
                                                </tr>
                                                <tr>
                                                    <td className="title-td">Status</td>
                                                    <td>: {item.status}</td>
                                                </tr>
                                                <tr>
                                                    <td className="title-td">Complain</td>
                                                    <td>: {item.complain ? item.complain : 'N/A'}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Complain images */}
                                    {item.images ?
                                        <div className="col-12 image-gallery">
                                            {item.images && item.images.map((image, i) =>
                                                <div className="card image-card" key={i}>
                                                    <img src={image} className="img-fluid" alt="..." />
                                                </div>
                                            )}
                                        </div>
                                        : null}
                                </div>

                            </div>
                        </div>
                    </div>
                </div>

                {/* Product details */}
                <div className="row">
                    <div className="col-12 col-padding">
                        <div className="card border-0 shadow-sm">
                            <div className="card-body">

                                <h6 className="mb-0 pl-1">Product details</h6>
                                <hr className="my-3" />
                                <div className="row">
                                    <div className="col-12">
                                        <div className="d-lg-flex">
                                            <div className="text-center">
                                                <img src={item.product.item.thumbnail.small} className="img-fluid" alt="..." />
                                            </div>
                                            <div className="pl-lg-4 pt-3 pt-lg-0">
                                                <p className="mb-3"><b>{item.product.item.name}</b></p>
                                                <table className="table-sm">
                                                    <tbody>
                                                        <tr>
                                                            <td className="title-td">SKU</td>
                                                            <td>: {item.product.sku}</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="title-td">Brand</td>
                                                            <td>: {item.product.brand ? item.product.brand : 'N/A'}</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="title-td">Discount type</td>
                                                            <td>: {item.product.discountType ? item.product.discountType : 'N/A'}</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="title-td">Discount amount</td>
                                                            <td>: {item.product.discountAmount ? item.product.discountAmount : 'N/A'}</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="title-td">Sale price</td>
                                                            <td>: {item.product.salePrice}</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="title-td">Stock status</td>
                                                            <td>: <span
                                                                className={item.product.item.stockStatus === 'In Stock' ? "text-success" : "text-danger"}>
                                                                {item.product.item.stockStatus}</span>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td className="title-td">Stock amount</td>
                                                            <td>: {item.product.item.stockAmount}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Show;