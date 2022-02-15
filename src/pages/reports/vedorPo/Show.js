import React, { useEffect, useState, useCallback } from 'react'
import commaNumber from 'comma-number'
import converter from 'number-to-words'
import randomNumber from 'random-number'
import { useQuery } from '../../../components/query/Index'
import { PreLoader } from '../../../components/loading/Index'
import { CustomButton } from '../../../components/button'
import { formatDateWithAMPM } from '../../../utils/Helpers'
import { Images } from '../../../utils/Images'

import Requests from '../../../utils/Requests/Index'


const Show = () => {
    const dateNow = new Date()
    const queryParams = useQuery()
    const [data, setData] = useState({})
    const [isLoading, setLoading] = useState(true)
    const [randCode, setRandCode] = useState(null)
    const [header] = useState({
        headers: { Authorization: "Bearer " + localStorage.getItem('token') }
    })

    // Fetch data
    const fetchData = useCallback(async (query) => {
        try {
            const response = await Requests.VendorPurchase.Filter(query, header)
            if (response) setData(response.data.data)
            setLoading(false)
        } catch (error) {
            if (error) {
                setLoading(false)
            }
        }
    }, [header])


    useEffect(() => {
        if (queryParams) {
            let params = { ...queryParams }
            const queryString = Object.keys(params).map(key => `${key}=${params[key]}`).join('&')
            fetchData(queryString)
        }
        setRandCode(randomNumber({ min: 10000, max: 1000000, integer: true }))
    }, [header, fetchData])


    // Print invoice
    const print = event => {
        event.preventDefault()
        window.print()
    }

    if (isLoading) return <PreLoader />

    return (
        <div className="order-show-container pb-4">

            {!isLoading && data.products && !data.products.length ?
                <div className="text-center mt-4 mt-lg-5">
                    <p>No results found!!!</p>
                </div>
                : null
            }

            {!isLoading && data.products && data.products.length ?
                <div className="container-fluid">
                    <div className="row print-hidden">
                        <div className="col-12 text-right py-2 px-4">
                            <CustomButton
                                className="btn-primary border-0 px-4"
                                style={{ position: 'fixed', top: '80px', right: '20px', zIndex: '10' }}
                                onClick={print}
                            >Print</CustomButton>
                        </div>
                    </div>
                    <div id="printable">
                        {/* Customer copy */}
                        <div className="row page-break">
                            <div className="col-12 col-padding">
                                <div className="card border-0">
                                    <img src={Images.Logo} width="250" style={{ paddingTop: '40px' }} className="m-auto" alt="..." />
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
                                                    <p>Name: {data.vendor.name}</p>
                                                    <p>Address: {data.vendor.address}</p>
                                                    <p>Contact Person: {data.vendor.contactPersonOneName}</p>
                                                    <p>Contact No: {data.vendor.contactPersonOnePhone}</p>
                                                </td>
                                                <td>
                                                    <p>Purchase Order: EB-{randCode}</p>
                                                    <p>Issue Date: {formatDateWithAMPM(dateNow.toString())}</p>
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

                                        {/* Ordered products */}
                                        {data.products.length ?
                                            <tbody>
                                                {data.products && data.products.map((product, i) =>
                                                    <tr key={i}>
                                                        <td className="text-center" style={{ width: 20 }}><p>{i + 1}</p></td>
                                                        <td className="text-center" style={{ width: 140 }}>
                                                            <img src={product.thumbnail} className="img-fluid" style={{ width: 60, height: 'auto' }} alt="..." />
                                                        </td>
                                                        <td>
                                                            <p>{product.name}</p>
                                                            <VariantsComponent items={product.variants} />
                                                        </td>
                                                        <td className="text-center"><p>{product.quantity}</p></td>
                                                        <td><p>{product.purchasePrice} TK</p></td>
                                                        <td><p>{parseInt(product.purchasePrice) * parseInt(product.quantity)} TK</p></td>
                                                    </tr>
                                                )}
                                            </tbody>
                                            : null}

                                        <tbody>
                                            <tr>
                                                <td colSpan="5" style={{ textAlign: 'right' }}>
                                                    <b>Grand Total</b>
                                                </td>
                                                <td>TK. {commaNumber(data.grandTotal)}.00</td>
                                            </tr>
                                            <tr>
                                                <td className="text-capitalize" colSpan="6">
                                                    Amount In Words: BDT {converter.toWords(data.grandTotal)} Only
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
                                                    <p>Key Account Manager: {data.vendor.keyAccountManager}</p>
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
                                    <h1 className="text-center" id="bellowHeading" style={{ marginBottom: '15px', fontSize: '25px' }} >Purchase Order</h1>
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
                                                    <p>Name: {data.vendor.name}</p>
                                                    <p>Contact Person: {data.vendor.contactPersonOnePhone}</p>
                                                    <p>Address: {data.deliveryAddress}</p>
                                                    <p>Vendor In-charge: Iftekher Ahmed (01324245074)</p>
                                                </td>
                                                <td>
                                                    <p>Purchase Order: EB-{randCode}</p>
                                                    <p>Issue Date: {formatDateWithAMPM(dateNow.toString())}</p>
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


                                        {/* Ordered products */}
                                        {data.products.length ?
                                            <tbody>
                                                {data.products && data.products.map((product, i) =>
                                                    <tr key={i}>
                                                        <td className="text-center" style={{ width: 20 }}><p>{1}</p></td>
                                                        <td className="text-center" style={{ width: 140 }}>
                                                            <img src={product.thumbnail} className="img-fluid" style={{ width: 60, height: 'auto' }} alt="..." />
                                                        </td>
                                                        <td>
                                                            <p>{product.name}</p>
                                                            <VariantsComponent items={product.variants} />
                                                        </td>
                                                        <td className="text-center"><p>{product.quantity}</p></td>
                                                        <td><p>{product.purchasePrice} TK</p></td>
                                                        <td><p>{parseInt(product.purchasePrice) * parseInt(product.quantity)} TK</p></td>
                                                    </tr>
                                                )}
                                            </tbody>
                                            : null}

                                        <tbody>
                                            <tr>
                                                <td colSpan="5" style={{ textAlign: 'right' }}>
                                                    <b>Grand Total</b>
                                                </td>
                                                <td>TK. {commaNumber(data.grandTotal)}.00</td>
                                            </tr>
                                            <tr>
                                                <td className="text-capitalize" colSpan="6">
                                                    Amount In Words: BDT {converter.toWords(data.grandTotal)} Only
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
                : null}
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