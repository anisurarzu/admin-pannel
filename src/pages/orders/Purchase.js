import React, { useEffect, useState, useCallback } from 'react'
import converter from 'number-to-words'
import commaNumber from 'comma-number'
import _ from 'lodash'
import { useParams } from 'react-router'
import { formatDateWithAMPM } from '../../utils/Helpers'
import { Images } from '../../utils/Images'

import Requests from '../../utils/Requests/Index'
import { PreLoader } from '../../components/loading/Index'

const Show = () => {
    const { id, product_id } = useParams()
    const [order, setOrder] = useState({})
    const [vendor, setVendor] = useState({})
    const [product, setProduct] = useState({})
    const [isLoading, setLoading] = useState(true)
    const [header] = useState({
        headers: { Authorization: "Bearer " + localStorage.getItem('token') }
    })

    // Fetch data
    const fetchData = useCallback(async () => {
        const response = await Requests.Order.Show(id, header)
        if (response && response.data) {
            setOrder(response.data)

            if (response.data.products && response.data.products.length) {
                const foundProduct = _.find(response.data.products, { "product": product_id })
                if (foundProduct) {
                    setVendor({
                        address: foundProduct.vendor?.address,
                        contactPersonName: foundProduct.vendor?.contact?.personOne?.name,
                        contactPersonPhone: foundProduct.vendor?.contact?.personOne?.phone,
                        keyAccountManager: foundProduct.vendor?.keyAccountManager,
                        phone: foundProduct.vendor?.phone,
                        name: foundProduct.vendor?.name
                    })
                    setProduct(foundProduct)
                    console.log(foundProduct);
                }
            }
        }
        setLoading(false)
    }, [id, product_id, header])

    useEffect(() => {
        fetchData()
    }, [id, header, fetchData])

    const print = event => {
        event.preventDefault()
        window.print()
    }

    if (isLoading) return <PreLoader />

    return (
        <div className="order-show-container pb-4">
            {/* Order & purchase container */}
            {order ?
                <div className="container-fluid">
                    <div className="row print-hidden">
                        <div className="col-12 text-right py-2 px-4">
                            <button
                                type="button"
                                className="btn shadow-none btn-primary px-4"
                                style={{ position: 'fixed', top: '80px', right: '20px', zIndex: '10' }}
                                onClick={print}>
                                Print
                            </button>
                        </div>
                    </div>
                    <div id="printable">

                        {/* Customer copy */}
                        <div className="row page-break">
                            <div className="col-12 col-padding">
                                <div className="card border-0">
                                    <img src={Images.Logo} width="250" style={{ paddingTop: '50px' }} className="m-auto" alt="..." />
                                    <h1 className="text-center" style={{ marginBottom: '15px', fontSize: '25px' }} >Purchase Order</h1>
                                    <p className="text-center" style={{ marginBottom: '20px', fontSize: '14px' }}>(Vendor Copy)</p>

                                    <div className="pl-5 ml-4">
                                        <p style={{ marginBottom: 5, fontSize: 14 }}><b>TIN : 623765963510, <span className="ml-1">BIN : 004296225-0101</span></b></p>
                                    </div>
                                    <table className="custom-table">
                                        <tbody>
                                            <tr>
                                                <th style={{ textAlign: 'left', fontSize: '14px', width: '50%' }}>Vendor Reference</th>
                                                <th style={{ textAlign: 'left', fontSize: '14px', width: '50%' }}>Order Reference</th>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <p>Name: {vendor.name}</p>
                                                    <p>Address: {vendor.address}</p>
                                                    <p>Contact No: {vendor.phone}</p>

                                                    <p>Contact Person: {vendor.contactPersonName}</p>
                                                    <p>Contact Person Phone: {vendor.contactPersonPhone}</p>
                                                </td>
                                                <td>
                                                    <p>Purchase Order: EB-{order.orderCode}</p>
                                                    <p>Issue Date: {formatDateWithAMPM(order.createdAt)}</p>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <table className="custom-table">
                                        <thead>
                                            <tr>
                                                <th>SL</th>
                                                <th>Product Photo</th>
                                                <th>Product Name</th>
                                                <th className="text-center">Unit</th>
                                                <th>Price</th>
                                                <th>Total Price</th>
                                            </tr>
                                        </thead>

                                        {/* Ordered product */}
                                        {product && Object.keys(product).length ?
                                            <tbody>
                                                <tr>
                                                    <td className="text-center" style={{ width: 20 }}><p>{1}</p></td>
                                                    <td className="text-center" style={{ width: 140 }}>
                                                        <img src={product.thumbnail} className="img-fluid" style={{ width: 60, height: 'auto' }} alt="..." />
                                                    </td>
                                                    <td>
                                                        <p>{product.name}</p>
                                                        <VariantsComponent items={product.variants} />
                                                    </td>
                                                    <td className="text-center"><p>{product.quantity}</p></td>
                                                    <td><p>{product.purchasePrice ? commaNumber(product.purchasePrice) : 0} TK</p></td>
                                                    <td><p>{commaNumber(parseInt(product.purchasePrice) * parseInt(product.quantity))} TK</p></td>
                                                </tr>
                                            </tbody>
                                            : null
                                        }

                                        <tbody>
                                            <tr>
                                                <td colSpan="5" style={{ textAlign: 'right' }}>
                                                    <b>Grand Total</b>
                                                </td>
                                                <td>TK. {commaNumber(parseInt(product.purchasePrice) * parseInt(product.quantity))}.00</td>
                                            </tr>
                                            <tr>
                                                <td className="text-capitalize" colSpan="6">
                                                    Amount In Words: BDT {converter.toWords(parseInt(product.purchasePrice) * parseInt(product.quantity))} Taka Only
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <table className="custom-table">
                                        <tbody>
                                            <tr>
                                                <th style={{ textAlign: 'left', fontSize: '14px', width: '50%' }}>Purchaser</th>
                                                <th style={{ textAlign: 'left', fontSize: '14px', width: '50%' }}>Point of Deliver</th>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <p>Eazybest LTD</p>
                                                    <p>#House 18, #Road 1, #Sector 5, Uttara, Dhaka</p>
                                                    <p>Key Account Manager: {vendor.keyAccountManager}</p>
                                                </td>
                                                <td>
                                                    <p>#House 18, #Road 1, #Sector 5, Uttara, Dhaka</p>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <table className="custom-table">
                                        <tbody>
                                            <tr>
                                                <th style={{ textAlign: 'left', fontSize: '14px', width: '100%' }}>Order Terms and Conditions</th>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <ol style={{ paddingLeft: '15px' }}>
                                                        <li style={{ fontSize: '14px' }}>Delivery should be completed within ………….. days from the date of receipt work order.</li>
                                                        <li style={{ fontSize: '14px' }}>Before final printing/delivery sample should be approved by respective department.</li>
                                                        <li style={{ fontSize: '14px' }}>Product should be delivered in good condition and according to the specification and sample.</li>
                                                        <li style={{ fontSize: '14px' }}>Payment will be made ………………………………………………. after successful delivery.</li>
                                                        <li style={{ fontSize: '14px' }}>Partial delivery is not acceptable</li>
                                                        <li style={{ fontSize: '14px' }}>VAT & TAX will be deducted from the bill as per govt. rules if applicable</li>
                                                        <li style={{ fontSize: '14px' }}>Eazybest reserves the right of acceptance and cancellation of the order.</li>
                                                    </ol>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <div className="authorizedSign">
                                        <p style={{ marginTop: '120px' }}>.....................................</p>
                                        <p>Authorized Signature</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Eazybest copy */}
                        <div className="row page-break">
                            <div className="col-12 col-padding">
                                <div className="card border-0">
                                    <img src={Images.Logo} width="250" style={{ paddingTop: '50px' }} className="m-auto" alt="..." />
                                    <h1 className="text-center" style={{ marginBottom: '15px', fontSize: '25px' }} >Purchase Order</h1>
                                    <p className="text-center" style={{ marginBottom: '20px', fontSize: '14px' }}>(Eazybest Copy)</p>

                                    <div className="pl-5 ml-4">
                                        <p style={{ marginBottom: 5, fontSize: 14 }}><b>TIN : 623765963510, <span className="ml-1">BIN : 004296225-0101</span></b></p>
                                    </div>
                                    <table className="custom-table">
                                        <tbody>
                                            <tr>
                                                <th style={{ textAlign: 'left', fontSize: '14px', width: '50%' }}>Vendor Reference</th>
                                                <th style={{ textAlign: 'left', fontSize: '14px', width: '50%' }}>Order Reference</th>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <p>Name: {vendor.name}</p>
                                                    <p>Address: {vendor.address}</p>
                                                    <p>Contact No: {vendor.phone}</p>

                                                    <p>Contact Person: {vendor.contactPersonName}</p>
                                                    <p>Contact Person Phone: {vendor.contactPersonPhone}</p>
                                                </td>
                                                <td>
                                                    <p>Purchase Order: EB-{order.orderCode}</p>
                                                    <p>Issue Date: {formatDateWithAMPM(order.createdAt)}</p>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <table className="custom-table">
                                        <thead>
                                            <tr>
                                                <th>SL</th>
                                                <th>Product Photo</th>
                                                <th>Product Name</th>
                                                <th className="text-center">Unit</th>
                                                <th>Price</th>
                                                <th>Total Price</th>
                                            </tr>
                                        </thead>

                                        {/* Ordered product */}
                                        {product && Object.keys(product).length ?
                                            <tbody>
                                                <tr>
                                                    <td className="text-center" style={{ width: 20 }}><p>{1}</p></td>
                                                    <td className="text-center" style={{ width: 140 }}>
                                                        <img src={product.thumbnail} className="img-fluid" style={{ width: 60, height: 'auto' }} alt="..." />
                                                    </td>
                                                    <td>
                                                        <p>{product.name}</p>
                                                        <VariantsComponent items={product.variants} />
                                                    </td>
                                                    <td className="text-center"><p>{product.quantity}</p></td>
                                                    <td><p>{product.purchasePrice ? commaNumber(product.purchasePrice) : 0} TK</p></td>
                                                    <td><p>{commaNumber(parseInt(product.purchasePrice) * parseInt(product.quantity))} TK</p></td>
                                                </tr>
                                            </tbody>
                                            : null
                                        }

                                        <tbody>
                                            <tr>
                                                <td colSpan="5" style={{ textAlign: 'right' }}>
                                                    <b>Grand Total</b>
                                                </td>
                                                <td>TK. {parseInt(product.purchasePrice) * parseInt(product.quantity)}.00</td>
                                            </tr>
                                            <tr>
                                                <td className="text-capitalize" colSpan="6">
                                                    Amount In Words: BDT {converter.toWords(parseInt(product.purchasePrice) * parseInt(product.quantity))} Taka Only
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <table className="custom-table">
                                        <tbody>
                                            <tr>
                                                <th style={{ textAlign: 'left', fontSize: '14px', width: '50%' }}>Purchaser</th>
                                                <th style={{ textAlign: 'left', fontSize: '14px', width: '50%' }}>Point of Deliver</th>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <p>Eazybest LTD</p>
                                                    <p>#House 18, #Road 1, #Sector 5, Uttara, Dhaka</p>
                                                    <p>Key Account Manager: {vendor.keyAccountManager}</p>
                                                </td>
                                                <td>
                                                    <p>#House 18, #Road 1, #Sector 5, Uttara, Dhaka</p>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <table className="custom-table">
                                        <tbody>
                                            <tr>
                                                <th style={{ textAlign: 'left', fontSize: '14px', width: '100%' }}>Order Terms and Conditions</th>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <ol style={{ paddingLeft: '15px' }}>
                                                        <li style={{ fontSize: '14px' }}>Delivery should be completed within ………….. days from the date of receipt work order.</li>
                                                        <li style={{ fontSize: '14px' }}>Before final printing/delivery sample should be approved by respective department.</li>
                                                        <li style={{ fontSize: '14px' }}>Product should be delivered in good condition and according to the specification and sample.</li>
                                                        <li style={{ fontSize: '14px' }}>Payment will be made ………………………………………………. after successful delivery.</li>
                                                        <li style={{ fontSize: '14px' }}>Partial delivery is not acceptable</li>
                                                        <li style={{ fontSize: '14px' }}>VAT & TAX will be deducted from the bill as per govt. rules if applicable</li>
                                                        <li style={{ fontSize: '14px' }}>Eazybest reserves the right of acceptance and cancellation of the order.</li>
                                                    </ol>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <div className="authorizedSign">
                                        <p style={{ marginTop: '120px' }}>.....................................</p>
                                        <p>Authorized Signature</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                </div>
                : null
            }
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
