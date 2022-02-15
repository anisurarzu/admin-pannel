import React, { useEffect, useState, useCallback } from 'react'
import QRCode from 'react-qr-code'
import CommaNumber from 'comma-number'
import { useParams } from 'react-router'
import { formatDateWithAMPM } from '../../utils/Helpers'
import { PreLoader } from '../../components/loading/Index'
import Requests from '../../utils/Requests/Index'

const Show = () => {
    const { id } = useParams()
    const [data, setData] = useState({})
    const [isLoading, setLoading] = useState(true)
    const [header] = useState({
        headers: { Authorization: "Bearer " + localStorage.getItem('token') }
    })

    // Fetch data
    const fetchData = useCallback(async () => {
        const response = await Requests.Order.Show(id, header)
        if (response && response.data) setData(response.data)
        setLoading(false)
    }, [id, header])

    useEffect(() => {
        fetchData()
    }, [id, header, fetchData])

    const adminURL = "https://admin.eazybest.com/dashboard/order/" + data._id + "/show"
    const clientURL = "https://www.eazybest.com/account/order/" + data._id

    if (isLoading) return <PreLoader />

    return (
        <div className="order-show-container pb-4">
            {/* Order & purchase container */}
            <div className="container-fluid">
                <div className="row print-hidden">
                    <div className="col-12 text-right py-2 px-4">
                        <button
                            type="button"
                            className="btn shadow-none btn-primary px-4"
                            style={{ position: 'fixed', top: '80px', right: '20px', zIndex: '10' }}
                            onClick={() => window.print()}>
                            Print
                        </button>
                    </div>
                </div>
                <div id="printable">

                    {/* Eazybest copy */}
                    <div className="row page-break">
                        <div className="col-12 col-padding">
                            <div className="card border-0 pt-2">
                                <div style={{ backgroundColor: '#5B9BD5' }} className="py-1 header">
                                    <h3 className="text-center border-0" style={{ fontSize: '18px' }}>Eazybest Copy</h3>
                                </div>
                                <div className="row px-2">
                                    <div className="col-2 col-md-2" style={{ borderRight: '2px solid #808080' }}>
                                        <img src={'/logo.png'} alt="" className="logo" style={{ height: 'auto', width: '140px' }} />
                                    </div>
                                    <div className="col-6 col-md-7" style={{ borderRight: '2px solid #808080' }}>
                                        <p className="fs-16" style={{ marginBottom: '0', fontSize: '18px' }}>Eazybest.com, #House 18, #Road 1, #Sector 5, Uttara, Dhaka</p>
                                        <p className="fs-16" style={{ marginBottom: '0', fontSize: '18px' }}>Phone: +8801324245070 , Email: support@eazybest.com</p>
                                    </div>
                                    <div className="col-4 col-md-3 text-right">
                                        <p className="fs-16" style={{ marginBottom: '0', fontSize: '18px' }}>Invoice ID: <strong>{data.orderCode}</strong></p>
                                        <p className="fs-16" style={{ marginBottom: '0', fontSize: '18px' }}>{formatDateWithAMPM(data.createdAt)} (Admin)</p>
                                    </div>
                                </div>
                                <div className="row mx-1" style={{ borderTop: '4px solid #808080', marginTop: '20px' }}>
                                    <div className="col-4 text-center py-2" style={{ border: '4px solid #808080', borderTop: 0, marginBottom: '20px' }}>
                                        <QRCode value={adminURL} />
                                    </div>
                                    <div className="col-4 pt-3 pb-4 pl-5">
                                        <p className="fs-16 mb-2" style={{ marginBottom: '0', fontSize: '18px' }}>Order ID: <strong>EB-{data.orderCode}</strong></p>
                                        <p className="fs-16" style={{ marginBottom: '0', fontSize: '18px' }}>Order Placed: <strong>{formatDateWithAMPM(data.createdAt)}</strong></p>
                                        <p className="fs-16" style={{ marginBottom: '0', fontSize: '18px' }}>Payment Method: <strong>{data.paymentMethod}</strong></p>
                                        <p className="fs-16" style={{ marginBottom: '0', fontSize: '18px' }}>Payment Status: <strong>{data.paymentStatus}</strong></p>
                                        <p className="fs-16" style={{ marginBottom: '0', fontSize: '18px' }}>Total Products: <strong>{data.products && data.products.length ? data.products.length : 0}</strong></p>
                                        {/* <p className="fs-16" style={{ marginBottom: '0', fontSize: '18px' }}>Delivery: <strong>Eazybest Express</strong></p> */}
                                        <p className="fs-16" style={{ marginBottom: '0', fontSize: '18px' }}>Payment Medium: <strong>{data.transaction ? data.transaction.card_type : "N/A"}</strong></p>
                                        {/* <p className="fs-16" style={{ marginBottom: '0', fontSize: '18px' }}>Card no: <strong>{data.transaction ? data.transaction.card_no : "N/A"}</strong></p> */}
                                        {/* <p className="fs-16" style={{ marginBottom: '0', fontSize: '18px' }}>Currency: <strong>{data.transaction ? data.transaction.currency : "N/A"}</strong></p> */}
                                        {/* <p className="fs-16" style={{ marginBottom: '0', fontSize: '18px' }}>Transaction ID: <strong>{data.transaction ? data.transaction.bank_tran_id : "N/A"}</strong></p> */}
                                    </div>
                                    <div className="col-4 pt-3">
                                        <p className="fs-16 mb-2" style={{ marginBottom: '0', fontSize: '18px' }}>Name: <strong>{data.name}</strong></p>
                                        <p className="fs-16" style={{ marginBottom: '0', fontSize: '18px' }}>Shipping Area: <strong>{data.shippingArea}</strong></p>
                                        {/* <p className="fs-16" style={{ marginBottom: '0', fontSize: '18px' }}>Post Code: <strong>{data.postCode}</strong></p> */}
                                        <p className="fs-16" style={{ marginBottom: '0', fontSize: '18px' }}>Post Office: <strong>{data.postOffice}, {data.postCode}.</strong></p>
                                        <p className="fs-16" style={{ marginBottom: '0', fontSize: '18px' }}>Upazila: <strong>{data.upazila} </strong></p>
                                        <p className="fs-16" style={{ marginBottom: '0', fontSize: '18px' }}>Delivery Address: <strong>{data.deliveryAddress}</strong></p>
                                        <p className="fs-16" style={{ marginBottom: '0', fontSize: '18px' }}>Phone: <strong>{data.phone}</strong></p>
                                        <br />
                                        {/* <p className="fs-16" style={{ marginBottom: '0', fontSize: '18px' }}>Email: <strong>{data.email}</strong></p> */}
                                        <p className="fs-20" style={{ marginBottom: '0', fontSize: '18px' }}>Customer Payable: <strong>৳ {data.customerPayable}</strong></p>
                                    </div>
                                </div>
                                <div className="row px-4">
                                    <div className="col-12">
                                        <table className="table table-bordered">
                                            <thead>
                                                <tr>
                                                    <th>SN</th>
                                                    <th>Product Title</th>
                                                    <th>Quantity</th>
                                                    <th>Unit Price</th>
                                                    <th>Discount</th>
                                                    <th>Total Price</th>
                                                </tr>
                                            </thead>
                                            {data.products && data.products.length ?
                                                <tbody>
                                                    {data.products && data.products.map((product, i) =>
                                                        <tr key={i}>
                                                            <td>{i + 1}</td>
                                                            <td>
                                                                {product.name} <br />
                                                                <VariantsComponent items={product.variants} />
                                                            </td>
                                                            <td className="text-center">{product.quantity ? CommaNumber(product.quantity) : null}</td>
                                                            <td style={{ minWidth: 120 }}>৳ {product.salePrice ? CommaNumber(product.salePrice) : null}</td>
                                                            <td>
                                                                {product.discountType && product.discountType === 'Flat' ?
                                                                    <p>৳ {CommaNumber(product.discountAmount)}</p>
                                                                    : product.discountType && product.discountType === 'Percentage' ?
                                                                        <p>{product.discountAmount}%</p>
                                                                        : null}
                                                            </td>
                                                            <td><span className='pr-3' /> ৳ {product.salePrice && product.quantity ? CommaNumber(product.salePrice * product.quantity) : null}</td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                                : null
                                            }

                                            <tbody>
                                                <tr>
                                                    {data.couponDiscount ?
                                                        <td colSpan={4} rowSpan={5}>
                                                            <p style={{ marginTop: '180px' }}>Customer's Sign</p>
                                                        </td>
                                                        : <td colSpan={4} rowSpan={4}>
                                                            <p style={{ marginTop: '130px' }}>Customer's Sign</p>
                                                        </td>
                                                    }
                                                    <td>Subtotal</td>
                                                    <td style={{ minWidth: 150 }}><span className='pr-3' /> ৳ {data.totalWithOutTotal ? CommaNumber(data.totalWithOutTotal) : null}</td>
                                                </tr>
                                                <tr>
                                                    <td>Shipping</td>
                                                    <td style={{ minWidth: 150 }}><span className='pr-3' /> ৳ {data.deliveryCharge ? CommaNumber(data.deliveryCharge) : null}</td>
                                                </tr>
                                                {data.couponDiscount ?
                                                    <tr>
                                                        <td>Coupon Discount</td>
                                                        <td style={{ minWidth: 150 }}><span>(-)</span>৳ {data.couponDiscount ? CommaNumber(data.couponDiscount) : null}</td>
                                                    </tr>
                                                    : null}
                                                {data.campaign ?
                                                    <tr>
                                                        <td>Campaign Discount</td>
                                                        <td style={{ minWidth: 150 }}><span>(-)</span>৳ {data.campaign ? CommaNumber(data.campaign) : null}</td>
                                                    </tr>
                                                    : null}

                                                <tr>
                                                    <td>Total</td>
                                                    <td style={{ minWidth: 150 }}><span className='pr-3' /> ৳ {data.totalPrice ? CommaNumber(data.totalPrice) : null}</td>
                                                </tr>
                                                <tr>
                                                    <td>Customer Payable</td>
                                                    <td style={{ minWidth: 150 }}><span className='pr-3' /> ৳ {data.customerPayable ? CommaNumber(data.customerPayable) : 0}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div style={{ backgroundColor: '#5B9BD5' }} className="py-1 header mb-3">
                                    <h3 className="border-0" style={{ fontSize: '18px', float: 'left', width: '30%' }}>"Making Life Easiest"</h3>
                                    <h3 className="border-0" style={{ fontSize: '18px', float: 'left', width: '70%' }}>"Happy Online Shopping"</h3>
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* Customer copy */}
                    <div className="row page-break" style={{ marginTop: '50px' }}>
                        <div className="col-12 col-padding">
                            <div className="card border-0 pt-2">
                                <div style={{ backgroundColor: '#5B9BD5' }} className="py-1 header">
                                    <h3 className="text-center border-0" style={{ fontSize: '18px' }}>Customer Copy</h3>
                                </div>
                                <div className="row px-2">
                                    <div className="col-2 col-md-2" style={{ borderRight: '2px solid #808080' }}>
                                        <img src={'/logo.png'} alt="" className="logo" style={{ height: 'auto', width: '140px' }} />
                                    </div>
                                    <div className="col-6 col-md-7" style={{ borderRight: '2px solid #808080' }}>
                                        <p className="fs-16" style={{ marginBottom: '0', fontSize: '18px' }}>Eazybest.com, #House 18, #Road 1, #Sector 5, Uttara, Dhaka</p>
                                        <p className="fs-16" style={{ marginBottom: '0', fontSize: '18px' }}>Phone: +8801324245070, Email: support@eazybest.com</p>
                                    </div>
                                    <div className="col-4 col-md-3 text-right">
                                        <p className="fs-16" style={{ marginBottom: '0', fontSize: '18px' }}>Invoice ID: <strong>{data.orderCode}</strong></p>
                                        <p className="fs-16" style={{ marginBottom: '0', fontSize: '18px' }}>{formatDateWithAMPM(data.createdAt)} (Admin)</p>
                                    </div>
                                </div>
                                <div className="row mx-1" style={{ borderTop: '4px solid #808080', marginTop: '20px' }}>
                                    <div className="col-4 text-center py-2" style={{ border: '4px solid #808080', borderTop: 0, marginBottom: '20px' }}>
                                        <QRCode value={adminURL} />
                                    </div>
                                    <div className="col-4 pt-3 pb-4 pl-5">
                                        <p className="fs-16 mb-2" style={{ marginBottom: '0', fontSize: '18px' }}>Order ID: <strong>EB-{data.orderCode}</strong></p>
                                        <p className="fs-16" style={{ marginBottom: '0', fontSize: '18px' }}>Order Placed: <strong>{formatDateWithAMPM(data.createdAt)}</strong></p>
                                        <p className="fs-16" style={{ marginBottom: '0', fontSize: '18px' }}>Payment Method: <strong>{data.paymentMethod}</strong></p>
                                        <p className="fs-16" style={{ marginBottom: '0', fontSize: '18px' }}>Payment Status: <strong>{data.paymentStatus}</strong></p>
                                        <p className="fs-16" style={{ marginBottom: '0', fontSize: '18px' }}>Total Products: <strong>{data.products && data.products.length ? data.products.length : 0}</strong></p>
                                        {/* <p className="fs-16" style={{ marginBottom: '0', fontSize: '18px' }}>Delivery: <strong>Eazybest Express</strong></p> */}
                                        <p className="fs-16" style={{ marginBottom: '0', fontSize: '18px' }}>Payment Medium: <strong>{data.transaction ? data.transaction.card_type : "N/A"}</strong></p>
                                        {/* <p className="fs-16" style={{ marginBottom: '0', fontSize: '18px' }}>Card no: <strong>{data.transaction ? data.transaction.card_no : "N/A"}</strong></p> */}
                                        {/* <p className="fs-16" style={{ marginBottom: '0', fontSize: '18px' }}>Currency: <strong>{data.transaction ? data.transaction.currency : "N/A"}</strong></p> */}
                                        {/* <p className="fs-16" style={{ marginBottom: '0', fontSize: '18px' }}>Transaction ID: <strong>{data.transaction ? data.transaction.bank_tran_id : "N/A"}</strong></p> */}
                                    </div>
                                    <div className="col-4 pt-3">
                                        <p className="fs-16 mb-2" style={{ marginBottom: '0', fontSize: '18px' }}>Name: <strong>{data.name}</strong></p>
                                        <p className="fs-16" style={{ marginBottom: '0', fontSize: '18px' }}>Shipping Area: <strong>{data.shippingArea}</strong></p>
                                        {/* <p className="fs-16" style={{ marginBottom: '0', fontSize: '18px' }}>Post Code: <strong>{data.postCode}</strong></p> */}
                                        <p className="fs-16" style={{ marginBottom: '0', fontSize: '18px' }}>Post Office: <strong>{data.postOffice}, {data.postCode}.</strong></p>
                                        <p className="fs-16" style={{ marginBottom: '0', fontSize: '18px' }}>Upazila: <strong>{data.upazila} </strong></p>
                                        <p className="fs-16" style={{ marginBottom: '0', fontSize: '18px' }}>Delivery Address: <strong>{data.deliveryAddress}</strong></p>
                                        <p className="fs-16" style={{ marginBottom: '0', fontSize: '18px' }}>Phone: <strong>{data.phone}</strong></p>
                                        <br />
                                        {/* <p className="fs-16" style={{ marginBottom: '0', fontSize: '18px' }}>Email: <strong>{data.email}</strong></p> */}
                                        <p className="fs-20" style={{ marginBottom: '0', fontSize: '18px' }}>Customer Payable: <strong>৳ {data.customerPayable}</strong></p>
                                    </div>
                                </div>
                                <div className="row px-4">
                                    <div className="col-12">
                                        <table className="table table-bordered">
                                            <thead>
                                                <tr>
                                                    <th>SN</th>
                                                    <th>Product Title</th>
                                                    <th>Quantity</th>
                                                    <th>Unit Price</th>
                                                    <th>Discount</th>
                                                    <th>Total Price</th>
                                                </tr>
                                            </thead>
                                            {data.products && data.products.length ?
                                                <tbody>
                                                    {data.products && data.products.map((product, i) =>
                                                        <tr key={i}>
                                                            <td>{i + 1}</td>
                                                            <td>
                                                                {product.name} <br />
                                                                <VariantsComponent items={product.variants} />
                                                            </td>
                                                            <td className="text-center">{product.quantity ? CommaNumber(product.quantity) : null}</td>
                                                            <td style={{ minWidth: 120 }}>৳ {product.salePrice ? CommaNumber(product.salePrice) : null}</td>
                                                            <td>
                                                                {product.discountType && product.discountType === 'Flat' ?
                                                                    <p>৳ {CommaNumber(product.discountAmount)}</p>
                                                                    : product.discountType && product.discountType === 'Percentage' ?
                                                                        <p>{product.discountAmount}%</p>
                                                                        : null}
                                                            </td>
                                                            <td><span className='pr-3' /> ৳ {product.salePrice && product.quantity ? CommaNumber(product.salePrice * product.quantity) : null}</td>
                                                            {/* <td style={{ minWidth: 150 }}><span className='pr-3' /> ৳ {product.subTotal ? CommaNumber(product.subTotal) : null}</td> */}
                                                        </tr>
                                                    )}
                                                </tbody>
                                                : null
                                            }

                                            <tbody>
                                                <tr>
                                                    {data.couponDiscount ?
                                                        <td colSpan={4} rowSpan={5}>
                                                            <p style={{ marginTop: '180px' }}>Customer's Sign</p>
                                                        </td>
                                                        : <td colSpan={4} rowSpan={4}>
                                                            <p style={{ marginTop: '130px' }}>Customer's Sign</p>
                                                        </td>
                                                    }
                                                    <td>Subtotal</td>
                                                    <td style={{ minWidth: 150 }}><span className='pr-3' /> ৳ {data.totalWithOutTotal ? CommaNumber(data.totalWithOutTotal) : null}</td>
                                                </tr>
                                                <tr>
                                                    <td>Shipping</td>
                                                    <td style={{ minWidth: 150 }}><span className='pr-3' /> ৳ {data.deliveryCharge ? CommaNumber(data.deliveryCharge) : null}</td>
                                                </tr>
                                                {data.couponDiscount ?
                                                    <tr>
                                                        <td>Coupon Discount</td>
                                                        <td style={{ minWidth: 150 }}><span>(-)</span>৳ {data.couponDiscount ? CommaNumber(data.couponDiscount) : null}</td>
                                                    </tr>
                                                    : null}
                                                {data.campaign ?
                                                    <tr>
                                                        <td>Campaign Discount</td>
                                                        <td style={{ minWidth: 150 }}><span>(-)</span>৳ {data.campaign ? CommaNumber(data.campaign) : null}</td>
                                                    </tr>
                                                    : null}

                                                <tr>
                                                    <td>Total</td>
                                                    <td style={{ minWidth: 150 }}><span className='pr-3' /> ৳ {data.totalPrice ? CommaNumber(data.totalPrice) : null}</td>
                                                </tr>
                                                <tr>
                                                    <td>Customer Payable</td>
                                                    <td style={{ minWidth: 150 }}><span className='pr-3' /> ৳ {data.customerPayable ? CommaNumber(data.customerPayable) : 0}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div style={{ backgroundColor: '#5B9BD5' }} className="py-1 header mb-3">
                                    <h3 className="border-0" style={{ fontSize: '18px', float: 'left', width: '30%' }}>"Making Life Easiest"</h3>
                                    <h3 className="border-0" style={{ fontSize: '18px', float: 'left', width: '70%' }}>"Happy Online Shopping"</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


            </div>
        </div>
    );
}

export default Show;

const VariantsComponent = ({ items }) => {
    return (
        <div className="materials-container mt-2">
            {items && items.map((item, i) =>
                <div className="d-flex" key={i}>
                    <div className="flex-fill" style={{ width: 100 }}><p className="text-capitalize text-info mb-0"><span className="text-dark font-weight-bolder">{item.title}:</span> {item.value}</p></div>
                    <div className="flex-fill" style={{ width: 100 }}><p className="mb-0"><span className="font-weight-bolder">SKU:</span> {item.sku}</p></div>
                </div>
            )}
        </div>
    )
}
