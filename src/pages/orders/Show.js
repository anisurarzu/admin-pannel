import React, { useEffect, useState, useCallback } from 'react'
import Icon from 'react-icons-kit'
import { Link } from 'react-router-dom'
import { useParams } from 'react-router'
import { messageCircle, info } from 'react-icons-kit/feather'
import { androidNotifications, androidNotificationsOff } from 'react-icons-kit/ionicons'
import { Images } from '../../utils/Images'
import { dateFormate } from '../../utils/Helpers'
import { PreLoader } from '../../components/loading/Index'
import { ConfirmationModal } from '../../components/modal/Confirmation'
import { OrderStatusModal } from '../../components/modal/OrderStatus'
import { CommentsModal } from '../../components/modal/Comments'
import { CustomButton } from '../../components/button'
import { Container } from '../../components/container'
import { Card } from '../../components/card/Index'
import { DataTable } from '../../components/table/Index'
import { DeleteModal } from '../../components/modal/Delete'

import Requests from '../../utils/Requests/Index'
import DeliveryInfoModal from '../../components/modal/deliveryInfo/Index'


const Show = () => {
    const { id } = useParams()
    const [show, setShow] = useState(false)
    const [showComment, setShowComment] = useState(false)
    const [isLoading, setLoading] = useState(true)
    const [item, setItem] = useState({})
    const [orderStatus, setOrderStatus] = useState({ show: false, value: null, loading: false })
    const [paymentStatus, setPaymentStatus] = useState({ show: false, value: null, loading: false })
    const [isCancelation, setCancelation] = useState({ value: null, show: false, loading: false })
    const [isFollowUp, setFollowUp] = useState(false)

    const [header] = useState({
        headers: { Authorization: "Bearer " + localStorage.getItem('token') }
    })

    // Fetch data
    const fetchData = useCallback(async () => {
        const response = await Requests.Order.Show(id, header)
        if (response && response.data){
            // console.log("error",response.data);
            setItem(response.data)
        } 
        setLoading(false)
    }, [id, header])

    useEffect(() => {
        fetchData()
    }, [id, header, fetchData])

    // Handle status action
    const handleStatusAction = async (data) => {
        const formData = {
            ...data,
            order: id,
            status: orderStatus.value
        }

        setOrderStatus({ ...orderStatus, loading: true })
        await Requests.Order.StoreComment(formData, header)
        await Requests.Order.Update(id, orderStatus.value, header)

        fetchData()
        setOrderStatus({ loading: false, value: null, show: false })
    }

    // Handle payment status action
    const handlePaymentAction = async () => {
        setPaymentStatus({ ...paymentStatus, loading: true })
        await Requests.Order.UpdatePaymentStatus(id, paymentStatus.value, header)
        fetchData()
        setPaymentStatus({ loading: false, value: null, show: false })
    }

    // Handle follow up
    const handleFollowUp = async () => {
        setFollowUp(true)
        await Requests.Order.UpdateFollowUp(id, header)
        fetchData()
        setFollowUp(false)
    }

    // cancel specific item from order 
    const onCancelItem = async () => {
        setCancelation({ ...isCancelation, loading: true })

        const formData = {
            orderId: id,
            productId: isCancelation.value.product
        }

        await Requests.Order.ItemCancelation(formData, header)
        fetchData()
        setCancelation({ value: null, show: false, loading: false })
    }

    // Styles for data column
    const customStyles = {
        rows: {
            style: {
                minHeight: '70px auto',
            }
        }
    }

    // Data columns for ordered products 
    const columns = [
        {
            name: "Image",
            width: "70px",
            cell: row => <img height={40} alt={"Product"} src={row.thumbnail} />,
        },
        {
            name: "Name",
            sortable: true,
            minWidth: "250px",
            selector: row =>
                <div className="py-2">
                    <p className="font-13 mb-2">{row.name || "N/A"}</p>
                    <p className="font-13 mb-1"><strong>SKU: </strong>{row.sku || "N/A"}</p>
                    <p className="font-13 mb-2"><strong>Brand: </strong>{row.brand || "N/A"}</p>

                    {item.status !== "Delivered" ?
                        <CustomButton
                            style={{ padding: "5px 10px", fontSize: 13 }}
                            className="btn-danger border-0"
                            onClick={() => setCancelation({ ...isCancelation, value: row, show: true })}
                        ><b>Cancel Item</b></CustomButton>
                        : null}
                </div>
        },
        // {
        //     name: "Campaign",
        //     // selector: row => row.phone,
        //     sortable: true,
        //     minWidth: "130px"
        // },
        {
            name: "Variants",
            grow: 2,
            cell: row => row.variants && row.variants.length ?
                <div>
                    {row.variants.map((item, i) =>
                        <div className="mb-2">
                            <p className="font-13 mb-0"><strong>{item.title}: </strong>{item.value}</p>
                            <p className="font-13 mb-0"><strong>SKU: </strong>{item.sku}</p>
                        </div>
                    )}

                </div>
                : "N/A"
        },
        {
            name: <span>Purchase <br /> Price</span>,
            sortable: true,
            minWidth: "100px",
            cell: row => <p className="font-13 mb-0">{row.purchasePrice} tk.</p>
        },
        {
            name: "Sale Price",
            sortable: true,
            minWidth: "100px",
            cell: row => <p className="font-13 mb-0">{row.salePrice} tk.</p>
        },
        {
            name: "Quantity",
            sortable: true,
            cell: row => <p className="font-13 mb-0">{row.quantity}</p>
        },
        // {
        //     name: "Discount",
        //     cell: row => row.discountAmount && row.discountType ?
        //         <div>
        //             <p className="font-13 mb-0">{row.discountAmount}{row.discountType === 'Flat' ? "tk." : "%"}</p>
        //         </div>
        //         : "N/A"
        // },
        // {
        //     name: "Sub-Total",
        //     cell: row => <p className="font-13 mb-0">{row.subTotal} tk.</p>
        // },
        // {
        //     name: "PO",
        //     cell: row =>
        //         item.status === 'Confirmed' ?
        //             <Link to={`/dashboard/order/${item._id}/purchase/${row.product}`}>
        //                 <CustomButton
        //                     style={{ padding: "5px 10px" }}
        //                     className="btn-primary border-0"
        //                 >
        //                     <Icon icon={info} size={18} />
        //                 </CustomButton>
        //             </Link>
        //             : null
        // }
    ]

    // Data columns for canceled products
    const canceledProductsColumns = [
        {
            name: "Image",
            width: "70px",
            cell: row => <img height={40} alt={"Product"} src={row.thumbnail} />,
        },
        {
            name: "Name",
            sortable: true,
            minWidth: "250px",
            selector: row =>
                <div className="py-2">
                    <p className="font-13 mb-2">{row.name || "N/A"}</p>
                    <p className="font-13 mb-1"><strong>SKU: </strong>{row.sku || "N/A"}</p>
                    <p className="font-13 mb-2"><strong>Brand: </strong>{row.brand || "N/A"}</p>
                </div>
        },
        // {
        //     name: "Campaign",
        //     // selector: row => row.phone,
        //     sortable: true,
        //     minWidth: "130px"
        // },
        {
            name: "Variants",
            grow: 2,
            cell: row => row.variants && row.variants.length ?
                <div>
                    {row.variants.map((item, i) =>
                        <div className="mb-2">
                            <p className="font-13 mb-0"><strong>{item.title}: </strong>{item.value}</p>
                            <p className="font-13 mb-0"><strong>SKU: </strong>{item.sku}</p>
                        </div>
                    )}

                </div>
                : "N/A"
        },
        {
            name: <span>Purchase <br /> Price</span>,
            sortable: true,
            minWidth: "100px",
            cell: row => <p className="font-13 mb-0">{row.purchasePrice} tk.</p>
        },
        {
            name: "Sale Price",
            sortable: true,
            minWidth: "100px",
            cell: row => <p className="font-13 mb-0">{row.salePrice} tk.</p>
        },
        {
            name: "Quantity",
            sortable: true,
            cell: row => <p className="font-13 mb-0">{row.quantity}</p>
        },
        {
            name: "Discount",
            cell: row => row.discountAmount && row.discountType ?
                <div>
                    <p className="font-13 mb-0">{row.discountAmount}{row.discountType === 'Flat' ? "tk." : "%"}</p>
                </div>
                : "N/A"
        },
        {
            name: "Sub-Total",
            cell: row => <p className="font-13 mb-0">{row.subTotal} tk.</p>
        }
    ]

    if (isLoading) return <PreLoader />

    return (
        <div className="pb-4">
            <Container.Fluid>

                {/* Order Creator Info Container */}
                <Container.Row>

                    {/* Order Info Container */}
                    <Container.Column className="col-padding">
                        <Card.Simple className="shadow-sm border-0">
                            <Card.Body>
                                <Container.Row>

                                    {/* Order Information */}
                                    <Container.Column className="col-md-6 col-xl-4">
                                        <table className="table table-sm table-borderless">
                                            <tbody>
                                                <tr>
                                                    <td style={styles.tdMd}><h6 className="font__size__md mb-0">Date</h6></td>
                                                    <td><p className="font__size__sm mb-0">: {item.createdAt ? dateFormate(item.createdAt) : "N/A"}</p></td>
                                                </tr>
                                                <tr>
                                                    <td style={styles.tdMd}><h6 className="font__size__md mb-0">Order code</h6></td>
                                                    <td><p className="font__size__sm mb-0">: {item.orderCode || "N/A"}</p></td>
                                                </tr>
                                                <tr>
                                                    <td style={styles.tdMd}><h6 className="font__size__md mb-0">Order status</h6></td>
                                                    <td><p className="font__size__sm mb-0">: {item.status || "N/A"}</p></td>
                                                </tr>
                                                <tr>
                                                    <td style={styles.tdMd}><h6 className="font__size__md mb-0">Payment method</h6></td>
                                                    <td><p className="font__size__sm mb-0">: {item.paymentMethod || "N/A"}</p></td>
                                                </tr>
                                                <tr>
                                                    <td style={styles.tdMd}><h6 className="font__size__md mb-0">Payment Medium</h6></td>
                                                    <td><p className="font__size__sm mb-0">: {item.transaction ? item.transaction.card_type : "N/A"}</p></td>
                                                </tr>
                                                <tr>
                                                    <td style={styles.tdMd}><h6 className="font__size__md mb-0">Card no</h6></td>
                                                    <td><p className="font__size__sm mb-0">: {item.transaction ? item.transaction.card_no : "N/A"}</p></td>
                                                </tr>
                                                <tr>
                                                    <td style={styles.tdMd}><h6 className="font__size__md mb-0">Currency</h6></td>
                                                    <td><p className="font__size__sm mb-0">: {item.transaction ? item.transaction.currency : "N/A"}</p></td>
                                                </tr>
                                                <tr>
                                                    <td style={styles.tdMd}><h6 className="font__size__md mb-0">Transaction ID</h6></td>
                                                    <td><p className="font__size__sm mb-0">: {item.transaction ? item.transaction.bank_tran_id : "N/A"}</p></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </Container.Column>

                                    {/* Customer & Address */}
                                    <Container.Column className="col-md-6 col-xl-5">
                                        <table className="table table-sm table-borderless">
                                            <tbody>
                                                <tr>
                                                    <td style={styles.tdMd}><h6 className="font__size__md mb-0">Shipping area</h6></td>
                                                    <td><p className="font__size__sm mb-0">: {item.shippingArea || "N/A"}</p></td>
                                                </tr>
                                                <tr>
                                                    <td style={styles.tdMd}><h6 className="font__size__md mb-0">Post Code</h6></td>
                                                    <td><p className="font__size__sm mb-0">: {item.postCode || "N/A"}</p></td>
                                                </tr>
                                                <tr>
                                                    <td style={styles.tdMd}><h6 className="font__size__md mb-0">Post Office</h6></td>
                                                    <td><p className="font__size__sm mb-0">: {item.postOffice || "N/A"}</p></td>
                                                </tr>
                                                <tr>
                                                    <td style={styles.tdMd}><h6 className="font__size__md mb-0">Upazila</h6></td>
                                                    <td><p className="font__size__sm mb-0">: {item.upazila || "N/A"}</p></td>
                                                </tr>
                                                <tr>
                                                    <td style={styles.tdMd}><h6 className="font__size__md mb-0">Delivery address</h6></td>
                                                    <td><p className="font__size__sm mb-0">: {item.deliveryAddress || "N/A"}</p></td>
                                                </tr>
                                                <tr>
                                                    <td style={styles.tdMd}><h6 className="font__size__md mb-0">Delivery charge</h6></td>
                                                    <td><p className="font__size__sm mb-0">: {item.deliveryCharge ? item.deliveryCharge + " Tk." : "N/A"}</p></td>
                                                </tr>
                                                <tr>
                                                    <td style={styles.tdMd}><h6 className="font__size__md mb-0">Customer</h6></td>
                                                    <td><p className="font__size__sm mb-0">: {item.name || "N/A"}</p></td>
                                                </tr>
                                                <tr>
                                                    <td style={styles.tdMd}><h6 className="font__size__md mb-0">Phone</h6></td>
                                                    <td><p className="font__size__sm mb-0">: {item.phone || "N/A"}</p></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </Container.Column>

                                    {/* Order Actions */}
                                    <Container.Column className="col-md-6 col-xl-3">

                                        {/* Order Status */}
                                        <div className="form-group change-status mb-2">
                                            <h6 className="font__size__md mb-1"><i>Order Status</i></h6>
                                            <select
                                                style={{ width: 165, fontSize: 13, height: 42 }}
                                                className="form-control shadow-none"
                                                defaultValue={item.status}
                                                onChange={event => setOrderStatus({ ...orderStatus, show: true, value: event.target.value })}
                                            >
                                                <option value="Created">Created</option>
                                                <option value="Pending">Pending</option>
                                                <option value="Confirmed">Confirmed</option>
                                                <option value="Picked">Picked</option>
                                                <option value="Received in Warehouse">Received in Warehouse</option>
                                                <option value="Packed">Packed</option>
                                                <option value="Handed Over to Courier">Handed Over to Courier</option>
                                                <option value="Delivered">Delivered</option>
                                                <option value="Cancelled">Cancelled</option>
                                                <option value="Ready to Refund">Ready to Refund</option>
                                                <option value="Refunded">Refunded</option>
                                            </select>
                                        </div>

                                        {/* Payment Status */}
                                        <div className="form-group change-status mb-2">
                                            <h6 className="font__size__md mb-1"><i>Payment Status</i></h6>
                                            <select
                                                style={{ width: 165, fontSize: 13, height: 42 }}
                                                className="form-control shadow-none"
                                                defaultValue={item.paymentStatus}
                                                onChange={event => setPaymentStatus({ ...orderStatus, show: true, value: event.target.value })}
                                            >
                                                <option value="Paid">Paid</option>
                                                <option value="Pending">Pending</option>
                                                <option value="Partially Paid">Partially Paid</option>
                                            </select>
                                        </div>

                                        {/* Comments View */}
                                        <div className="mb-2">
                                            <CustomButton
                                                className="btn-success border-0"
                                                style={{ padding: "10px 22px", fontSize: 13, width: 165 }}
                                                onClick={() => setShowComment(true)}
                                            ><Icon icon={messageCircle} size={20} /> View Comments</CustomButton>
                                        </div>

                                        {/* Delivery Info */}
                                        {item.status === "Handed Over to Courier" ?
                                            <CustomButton
                                                className="btn-primary border-0"
                                                style={{ padding: "11px 28px", fontSize: 13, width: 165 }}
                                                onClick={() => setShow(true)}
                                            >Send Delivery Info</CustomButton>
                                            : null
                                        }
                                    </Container.Column>
                                </Container.Row>
                            </Card.Body>
                        </Card.Simple>
                    </Container.Column>
                </Container.Row>

                {/* Coupon Info */}
                {item.isCouponApplied && item.couponInfo && Object.keys(item.couponInfo).length > 0 &&
                    <Container.Row>
                        <Container.Column className="col-padding">
                            <Card.Simple className="bg-white border-0 shadow-sm">
                                <Card.Body>
                                    <h6 className="text-muted fw-bolder font-14 mb-2">Uses coupon</h6>
                                    <p className="font-13 mb-1"><span className="text-muted">Coupon code:</span> {item.couponInfo.code}</p>
                                    <p className="font-13 mb-1"><span className="text-muted">Discount in price:</span> {item.couponInfo.amount}{item.couponInfo.type === "Flat" ? "tk." : "%"}</p>
                                    {/* <p className="font-13 mb-2"><span className="text-muted">Discount in shipping (Dhaka):</span> {item.couponInfo.insideDhaka} tk.</p>
                                    <p className="font-13 mb-0"><span className="text-muted">Discount in shipping (Outside Dhaka):</span> {item.couponInfo.outsideDhaka} tk.</p> */}
                                </Card.Body>
                            </Card.Simple>
                        </Container.Column>
                    </Container.Row>
                }

                {/* Created By & Calculations Container */}
                <Container.Row>

                    {/* Created By */}
                    <Container.Column className="col-md-6 col-padding pr-md-2">
                        <Card.Simple className="border-0">
                            <Card.Header className="bg-white border-0 p-4">
                                <h6 className="mb-0">Created By</h6>
                            </Card.Header>
                            <Card.Body className="pt-2">
                                <table className="table table-sm table-borderless mb-0">
                                    <tbody>
                                        <tr>
                                            <td style={styles.tdSm}><h6 className="font__size__md mb-0">Name</h6></td>
                                            <td><p className="font__size__sm mb-0">: {item.createdBy ? item.createdBy.name : "N/A"}</p></td>
                                        </tr>
                                        <tr>
                                            <td style={styles.tdSm}><h6 className="font__size__md mb-0">E-mail</h6></td>
                                            <td><p className="font__size__sm mb-0">: {item.createdBy ? item.createdBy.email : "N/A"}</p></td>
                                        </tr>
                                        <tr>
                                            <td style={styles.tdSm}><h6 className="font__size__md mb-0">Phone</h6></td>
                                            <td><p className="font__size__sm mb-0">: {item.createdBy ? item.createdBy.phone : "N/A"}</p></td>
                                        </tr>
                                        <tr>
                                            <td style={styles.tdSm}><h6 className="font__size__md mb-0">Role</h6></td>
                                            <td><p className="font__size__sm mb-0">: {item.createdBy ? item.createdBy.role : "Customer"}</p></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </Card.Body>
                        </Card.Simple>
                    </Container.Column>

                    {/* Calculations */}
                    <Container.Column className="col-md-6 pl-md-0">
                        <Container.Row>
                            <div className="col-6 pr-0">
                                <Card.Simple className="border-0 p-2" style={{ background: "none" }}>
                                    <Card.Body className="text-center bg-white py-4">
                                        <h5 className="mb-1">{item.subTotalPrice || 0} tk.</h5>
                                        <p className="font__size__md text-muted mb-0">Sub-Total</p>
                                    </Card.Body>
                                </Card.Simple>
                            </div>
                            <div className="col-6 pl-0">
                                <Card.Simple className="border-0 p-2" style={{ background: "none" }}>
                                    <Card.Body className="text-center bg-white py-4">
                                        <h5 className="mb-1">{item.deliveryCharge || 0} tk.</h5>
                                        <p className="font__size__md mb-0">Delivery Charge</p>
                                    </Card.Body>
                                </Card.Simple>
                            </div>
                            <div className="col-6 pr-0">
                                <Card.Simple className="border-0 p-2" style={{ background: "none" }}>
                                    <Card.Body className="text-center bg-white py-4">
                                        <h5 className="mb-1">{item.totalPrice || 0} tk.</h5>
                                        <p className="font__size__md mb-0">Total Price</p>
                                    </Card.Body>
                                </Card.Simple>
                            </div>
                            <div className="col-6 pl-0">
                                <Card.Simple className="border-0 p-2" style={{ background: "none" }}>
                                    <Card.Body className="text-center bg-white overflow-hidden p-0" style={{ height: 97 }}>
                                        <img src={Images.PaymentCard} style={{ height: 97, maxWidth: "100%" }} alt="Payment card" />
                                    </Card.Body>
                                </Card.Simple>
                            </div>
                        </Container.Row>
                    </Container.Column>
                </Container.Row>

                {/* Ordered & Canceled Products */}
                <Container.Row>

                    {/* Ordered Products */}
                    <Container.Column className="col-padding">
                        <Card.Simple className="border-0">
                            <Card.Header className="bg-white border-0 pl-3 pt-3 pb-0">
                                <h6 className="mb-0">Ordered Products</h6>
                            </Card.Header>
                            <Card.Body className="p-0">
                                <DataTable
                                    fixedHeader
                                    fixedHeaderScrollHeight="580px"
                                    customStyles={customStyles}
                                    columns={columns}
                                    data={item.products}
                                    loading={isLoading}
                                />
                            </Card.Body>
                        </Card.Simple>
                    </Container.Column>

                    {/* Canceled Products */}
                    <Container.Column className="col-padding">
                        <Card.Simple className="border-0">
                            <Card.Header className="bg-white border-0 pl-3 pt-3 pb-0">
                                <h6 className="mb-0">Canceled Products</h6>
                            </Card.Header>
                            <Card.Body className="p-0">
                                <DataTable
                                    fixedHeader
                                    fixedHeaderScrollHeight="580px"
                                    customStyles={customStyles}
                                    columns={canceledProductsColumns}
                                    data={item.canceledProducts}
                                    loading={isLoading}
                                />
                            </Card.Body>
                        </Card.Simple>
                    </Container.Column>
                </Container.Row>

                {/* Follow-Up float button */}
                <CustomButton
                    className="btn-float"
                    disabled={isFollowUp}
                    onClick={handleFollowUp}
                >
                    {item.followUp ? <Icon icon={androidNotifications} size={25} /> : <Icon icon={androidNotificationsOff} size={25} />}
                </CustomButton>

                {/* Send delivery info modal */}
                {show &&
                    <DeliveryInfoModal
                        show={show}
                        reciver={item.phone}
                        onHide={() => setShow(false)}
                    />
                }

                {/* Order status modal */}
                {orderStatus.show &&
                    <OrderStatusModal
                        show={orderStatus.show}
                        loading={orderStatus.loading}
                        status={orderStatus.value}
                        onHide={() => setOrderStatus({ ...orderStatus, show: false, value: null })}
                        handleAction={data => handleStatusAction(data)}
                    />
                }

                {/* Payment status modal */}
                {paymentStatus.show &&
                    <ConfirmationModal
                        show={paymentStatus.show}
                        loading={paymentStatus.loading}
                        message={<h6 className="mb-0">You want to change payment status.</h6>}
                        onHide={() => setPaymentStatus({ ...paymentStatus, show: false, value: null })}
                        doDelete={handlePaymentAction}
                    />
                }

                {/* Comments preview modal */}
                {showComment &&
                    <CommentsModal
                        orderId={id}
                        header={header}
                        show={showComment}
                        onHide={() => setShowComment(false)}
                    />
                }

                {/* Cancel item confirmation modal */}
                {isCancelation.value && isCancelation.show ?
                    <DeleteModal
                        show={isCancelation.show}
                        loading={isCancelation.loading}
                        message={
                            <div>
                                <h6 className="mb-2">Want to cancel this item from order?</h6>
                                <img src={isCancelation.value.thumbnail} className="img-fluid" alt="..." />
                            </div>
                        }
                        doDelete={onCancelItem}
                        onHide={() => setCancelation({ value: null, show: false, loading: false })}
                    />
                    : null
                }
            </Container.Fluid>
        </div>
    );
}

export default Show;

const styles = {
    tdSm: { width: 60 },
    tdMd: { width: 130 }
}

{/* <div className="container-fluid">


<div className="row">
    <div className="col-12 col-padding">
        <div className="card shadow-sm border-0">
            <div className="card-body p-4">
                <div className="d-xxl-flex">
                    <div className="flex-fill">
                        <table className="table table-sm table-borderless">
                            <tbody>
                                <tr>
                                    <td style={styles.tdMd}><h6>Date</h6></td>
                                    <td><p>{dateFormate(item.createdAt)}</p></td>
                                </tr>
                                <tr>
                                    <td style={styles.tdMd}><h6>Order code</h6></td>
                                    <td><p>{item.orderCode}</p></td>
                                </tr>
                                <tr>
                                    <td style={styles.tdMd}><h6>Order status</h6></td>
                                    <td><p>{item.status}</p></td>
                                </tr>
                                <tr>
                                    <td style={styles.tdMd}><h6>Payment status</h6></td>
                                    <td>
                                        <div className="form-group change-status mb-1">
                                            <select
                                                style={{ width: 140 }}
                                                className="form-control shadow-none"
                                                defaultValue={item.paymentStatus}
                                                onChange={event => setPaymentStatus({ ...orderStatus, show: true, value: event.target.value })}
                                            >
                                                <option value="Paid">Paid</option>
                                                <option value="Pending">Pending</option>
                                            </select>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td style={styles.tdMd}><h6>Payment method</h6></td>
                                    <td><p>{item.paymentMethod}</p></td>
                                </tr>
                                <tr>
                                    <td style={styles.tdMd}><h6>Payment Medium</h6></td>
                                    <td><p> {item.transaction ? item.transaction.card_type : "N/A"}</p></td>
                                </tr>
                                <tr>
                                    <td style={styles.tdMd}><h6>Card no</h6></td>
                                    <td><p> {item.transaction ? item.transaction.card_no : "N/A"}</p></td>
                                </tr>
                                <tr>
                                    <td style={styles.tdMd}><h6>Currency</h6></td>
                                    <td><p> {item.transaction ? item.transaction.currency : "N/A"}</p></td>
                                </tr>
                                <tr>
                                    <td colSpan={2} style={styles.tdMd}><h6>Transaction ID <br /> <span style={{ fontSize: '16px', fontWeight: 'bold' }}>{item.transaction ? item.transaction.bank_tran_id : "N/A"}</span></h6></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="flex-fill">
                        <table className="table table-sm table-borderless">
                            <tbody>
                                <tr>
                                    <td style={styles.tdMd}><h6>Shipping area</h6></td>
                                    <td><p>{item.shippingArea}</p></td>
                                </tr>
                                <tr>
                                    <td style={styles.tdMd}><h6>Post Code</h6></td>
                                    <td><p>{item.postCode || "N/A"}</p></td>
                                </tr>
                                <tr>
                                    <td style={styles.tdMd}><h6>Post Office</h6></td>
                                    <td><p>{item.postOffice || "N/A"}</p></td>
                                </tr>
                                <tr>
                                    <td style={styles.tdMd}><h6>Upazila</h6></td>
                                    <td><p>{item.upazila || "N/A"}</p></td>
                                </tr>
                                <tr>
                                    <td style={styles.tdMd}><h6>Delivery address</h6></td>
                                    <td><p>{item.deliveryAddress}</p></td>
                                </tr>
                                <tr>
                                    <td style={styles.tdMd}><h6>Delivery charge</h6></td>
                                    <td><p className="text-success">{item.deliveryCharge} tk</p></td>
                                </tr>

                            </tbody>
                        </table>
                    </div>

                    <div className="flex-fill">
                        <table className="table table-sm table-borderless">
                            <tbody>
                                <tr>
                                    <td style={styles.tdMd}><h6>Customer name</h6></td>
                                    <td><p>{item.name}</p></td>
                                </tr>
                                <tr>
                                    <td style={styles.tdMd}><h6>Phone</h6></td>
                                    <td><p>{item.phone}</p></td>
                                </tr>
                            </tbody>
                        </table>

                     
                        <div className="form-group change-status mt-3 mb-0">
                            <select
                                style={{ width: 140 }}
                                className="form-control shadow-none"
                                defaultValue={item.status}
                                onChange={event => setOrderStatus({ ...orderStatus, show: true, value: event.target.value })}
                            >
                                <option value="Created">Created</option>
                                <option value="Pending">Pending</option>
                                <option value="Confirmed">Confirmed</option>
                                <option value="Picked">Picked</option>
                                <option value="Received in Warehouse">Received in Warehouse</option>
                                <option value="Packed">Packed</option>
                                <option value="Handed Over to Courier">Handed Over to Courier</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                                <option value="Ready to Refund">Ready to Refund</option>
                                <option value="Refunded">Refunded</option>
                            </select>
                        </div>

                        <div>
                            <CustomButton
                                style={{ padding: "7px 10px" }}
                                onClick={() => setShowComment(true)}
                            ><Icon icon={messageCircle} size={20} /> View Comments</CustomButton>
                        </div>

                        {item.status === "Handed Over to Courier" ?
                            <button
                                type="button"
                                className="btn shadow-none"
                                onClick={() => setShow(true)}
                            >Send Delivery Info</button>
                            : null}
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>


<div className="row">
    <div className="col-12 col-padding">
        <div className="card shadow-sm border-0">
            <div className="card-header bg-white border-0 px-4 pt-3 pb-0">
                <h6 className="mb-0 ml-1">Order created by.</h6>
            </div>
            <div className="card-body p-4">
                <div className="d-xxl-flex">
                    <div className="flex-fill">
                        <table className="table table-sm table-borderless">
                            <tbody>
                                <tr>
                                    <td style={styles.tdMd}><p>Name</p></td>
                                    <td><p>: {item.createdBy.name}</p></td>
                                </tr>
                                <tr>
                                    <td style={styles.tdMd}><p>E-mail</p></td>
                                    <td><p>: {item.createdBy.email || null}</p></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="flex-fill">
                        <table className="table table-sm table-borderless">
                            <tbody>
                                <tr>
                                    <td style={styles.tdMd}><p>Phone</p></td>
                                    <td><p>: {item.createdBy.phone}</p></td>
                                </tr>
                                <tr>
                                    <td style={styles.tdMd}><p>Role</p></td>
                                    <td><p>: {item.createdBy.role || 'Customer'}</p></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>


<div className="row subtotal-comission-total-container">
    <div className="col-12 col-padding">

      
        <div className="card">
            <div className="card-body shadow-sm">
                <h6>{item.subTotalPrice}<small>TK</small></h6>
                <p>Sub-total</p>
            </div>
        </div>

       
        <div className="card">
            <div className="card-body shadow-sm">
                <h6>{item.deliveryCharge}<small>TK</small></h6>
                <p>Delivery Charge</p>
            </div>
        </div>

        
        <div className="card">
            <div className="card-body shadow-sm">
                <h6>{item.totalPrice}<small>TK</small></h6>
                <p>total</p>
            </div>
        </div>

    </div>
</div>


{item.products && item.products.length &&
    <OrderedProducts
        item={item}
        orderId={id}
        title={'Ordered'}
        success={fetchData}
        products={item.products}
    />
}


{item.canceledProducts && item.canceledProducts.length &&
    <OrderedProducts
        item={item}
        orderId={id}
        title={'Cancelled'}
        products={item.canceledProducts}
    />
}


{show &&
    <DeliveryInfoModal
        show={show}
        reciver={item.phone}
        onHide={() => setShow(false)}
    />
}


{orderStatus.show &&
    <OrderStatusModal
        show={orderStatus.show}
        loading={orderStatus.loading}
        status={orderStatus.value}
        onHide={() => setOrderStatus({ ...orderStatus, show: false, value: null })}
        handleAction={data => handleStatusAction(data)}
    />
}


{paymentStatus.show &&
    <ConfirmationModal
        show={paymentStatus.show}
        loading={paymentStatus.loading}
        onHide={() => setPaymentStatus({ ...paymentStatus, show: false, value: null })}
        doDelete={handlePaymentAction}
    />
}


{showComment &&
    <CommentsModal
        orderId={id}
        header={header}
        show={showComment}
        onHide={() => setShowComment(false)}
    />
}


<CustomButton
    className="btn-float"
    disabled={isFollowUp}
    onClick={handleFollowUp}
>
    {item.followUp ?
        <Icon icon={androidNotifications} size={25} />
        :
        <Icon icon={androidNotificationsOff} size={25} />
    }
</CustomButton>

</div> */}

