import React, { useState, useEffect, useCallback } from 'react'
import './style.scss'
import Icon from 'react-icons-kit'
import { Link, useParams } from 'react-router-dom'
import { chevronLeft } from 'react-icons-kit/feather'
import { StringShort } from '../../utils/Helpers'
import { PreLoader } from '../../components/loading/Index'
import ExportCSV from "../../components/exportCSV/Index"
import Requests from '../../utils/Requests/Index'

const Show = () => {
    const { id } = useParams()
    const [isLoading, setLoading] = useState(true)
    const [vendor, setVendor] = useState({})
    const [isUpload, setUpload] = useState(false)
    const [sheetData, setSheetData] = useState([])
    const [header] = useState({
        headers: { Authorization: "Bearer " + localStorage.getItem('token') }
    })


    // Fetch data
    const fetchData = useCallback(async () => {
        const data = await Requests.Vendor.Show(id, header)
        if (data) {
            setVendor(data.vendor)
            setLoading(false)

            if (data.products && data.products.length) {
                let sheetArr = []
                for (let i = 0; i < data.products.length; i++) {
                    const element = data.products[i]
                    sheetArr.push({
                        SL: (i + 1),
                        Name: element.name,
                        SKU: element.sku,
                        "Vendor Name": data.name,
                        "Stock Amount": element.stockAmount,
                        "Purchase Price": element.purchasePrice,
                        "Sale Price": element.salePrice
                    })
                }
                setSheetData(sheetArr)
            }
        }
        setLoading(false)
    }, [id, header])

    useEffect(() => {
        fetchData()
    }, [id, header, fetchData])


    // Upload XLSX file
    const xlsxUpload = async (event) => {
        try {
            const file = event.target.files[0]
            if (file) {
                setUpload(true)
                let formData = new FormData()
                formData.append('xlfile', file)

                const response = await Requests.Vendor.UploadXlsx(formData, header)
                if (response) setUpload(false)
            }
        } catch (error) {
            if (error) {
                setUpload(false)
                console.log(error)
            }
        }
    }

    if (isLoading) return <PreLoader />

    return (
        <div className="show-vendor pb-4">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12 col-padding">
                        <div className="card border-0 shadow-sm">
                            <div className="card-header p-3 p-lg-4 bg-white">
                                <div className="d-flex">
                                    <div><h6 className="mb-0">{vendor.name}</h6></div>
                                    <div className="ml-auto">
                                        <Link
                                            to="/dashboard/vendor"
                                            type="button"
                                            className="btn shadow-none rounded-circle"
                                        >
                                            <Icon icon={chevronLeft} size={22} />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body p-4">
                                <div className="d-sm-flex vendor-profile-container">
                                    {/* Name circle */}
                                    {vendor.image ?
                                        <img height={80} width={80} alt={"Vendor"} src={vendor.image} />
                                        : <div className="name-circle rounded-circle flex-center flex-column">
                                            <h1>{StringShort(vendor.name)}</h1>
                                        </div>}

                                    {/* Content container */}
                                    <div className="flex-fill content-container pl-sm-4">
                                        <table className="table-sm">
                                            <tbody>
                                                <tr>
                                                    <td className="title-td">Name</td>
                                                    <td>: {vendor.name}</td>
                                                </tr>
                                                <tr>
                                                    <td className="title-td">E-mail</td>
                                                    <td className="text-lowercase">: {vendor.email}</td>
                                                </tr>
                                                <tr>
                                                    <td className="title-td">Phone</td>
                                                    <td>: {vendor.phone}</td>
                                                </tr>
                                                <tr>
                                                    <td className="title-td">Address</td>
                                                    <td>: {vendor.address}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row bank-info">
                    <div className="col-12 col-padding">
                        <div className="card border-0 shadow-sm">
                            <div className="card-body">

                                {/* Bank info */}
                                <h6 className="mb-0 pl-1">Bank info</h6>
                                <hr className="my-3" />
                                <div className="row mb-4">
                                    <div className="col-12 col-sm-6">
                                        <table className="table-sm">
                                            <tbody>
                                                <tr>
                                                    <td className="title-td">Account name</td>
                                                    <td>: {vendor.bank.accountName}</td>
                                                </tr>
                                                <tr>
                                                    <td className="title-td">Account number</td>
                                                    <td>: {vendor.bank.accountNumber}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="col-12 col-sm-6">
                                        <table className="table-sm">
                                            <tbody>
                                                <tr>
                                                    <td className="title-td">Branch</td>
                                                    <td>: {vendor.bank.branchName}</td>
                                                </tr>
                                                <tr>
                                                    <td className="title-td">Routing number</td>
                                                    <td>: {vendor.bank.routingNumber}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>



                                {/* Business & payment info */}
                                <h6 className="mb-0 pl-1">Business & payment info</h6>
                                <hr className="my-3" />
                                <div className="row mb-4">
                                    <div className="col-12 col-sm-6">
                                        <table className="table-sm">
                                            <tbody>
                                                <tr>
                                                    <td className="title-td">Trade licence</td>
                                                    <td>: {vendor.tradeLicence}</td>
                                                </tr>
                                                <tr>
                                                    <td className="title-td">Pick Up location</td>
                                                    <td>: {vendor.pickupLocation}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="col-12 col-sm-6">
                                        <table className="table-sm">
                                            <tbody>
                                                <tr>
                                                    <td className="title-td">Payment system</td>
                                                    <td>: {vendor.paymentSystem}</td>
                                                </tr>
                                                {vendor.payPeriod ?
                                                    <tr>
                                                        <td className="title-td">Payment period</td>
                                                        <td>: {vendor.payPeriod}</td>
                                                    </tr>
                                                    : null}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Contact */}
                                <div className="row mb-4">
                                    <div className="col-12 col-sm-6">
                                        <h6 className="mb-0 pl-1">Contact person 1</h6>
                                        <hr className="my-3" />
                                        <table className="table-sm">
                                            <tbody>
                                                <tr>
                                                    <td className="title-td">Name</td>
                                                    <td>: {vendor.contact.personOne ? vendor.contact.personOne.name : null}</td>
                                                </tr>
                                                <tr>
                                                    <td className="title-td">Phone</td>
                                                    <td>: {vendor.contact.personOne ? vendor.contact.personOne.phone : null}</td>
                                                </tr>
                                                <tr>
                                                    <td className="title-td">E-mail</td>
                                                    <td>: <span className="text-lowercase">{vendor.contact.personOne ? vendor.contact.personOne.email : null}</span></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="col-12 col-sm-6">
                                        <h6 className="mb-0 pl-1">Contact person 2</h6>
                                        <hr className="my-3" />
                                        <table className="table-sm">
                                            <tbody>
                                                <tr>
                                                    <td className="title-td">Name</td>
                                                    <td>: {vendor.contact.personTwo ? vendor.contact.personTwo.name : null}</td>
                                                </tr>
                                                <tr>
                                                    <td className="title-td">Phone</td>
                                                    <td>: {vendor.contact.personTwo ? vendor.contact.personTwo.phone : null}</td>
                                                </tr>
                                                <tr>
                                                    <td className="title-td">E-mail</td>
                                                    <td>: <span className="text-lowercase">{vendor.contact.personTwo ? vendor.contact.personTwo.email : null}</span></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Management */}
                                <div className="row mb-4">
                                    <div className="col-12 col-sm-6">
                                        <h6 className="mb-0 pl-1">Key account manager</h6>
                                        <hr className="my-3" />
                                        <p>{vendor.keyAccountManager}</p>
                                    </div>
                                    <div className="col-12 col-sm-6">
                                        <h6 className="mb-0 pl-1">Secondary key account manager</h6>
                                        <hr className="my-3" />
                                        <p>{vendor.secondaryKeyAccountManager}</p>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>

                {/* Product */}
                <div className="row vendor-products-container">
                    <div className="col-12 col-padding">
                        <div className="card border-0 shadow-sm">
                            <div className="card-header p-3 p-lg-4 bg-white border-0 d-flex justify-content-between">
                                <div className="d-flex w-100">
                                    <div><h6 className="mb-0">Products</h6></div>
                                    <div className="ml-auto pr-2">
                                        <div className="file-upload-container text-center">

                                            <input
                                                type="file"
                                                className="upload"
                                                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                                                onChange={xlsxUpload}
                                            />
                                            <button
                                                type="button"
                                                className="btn shadow-none xlsx-upload-btn"
                                                disabled={isUpload}
                                            >{isUpload ? 'Uploading...' : 'Upload XLSX'}</button>

                                        </div>
                                    </div>
                                    <div><ExportCSV csvData={sheetData} fileName={vendor.name + '\'s stock list'} /></div>
                                </div>
                            </div>
                            <div className="card-body">
                                {vendor.products && vendor.products.length ?
                                    vendor.products.map((product, i) =>
                                        <Link to={`/dashboard/product/${product._id}/show`} key={i}>
                                            <div className="product-container">
                                                <img src={product.thumbnail} className="img-fluid" alt="..." />
                                                <p><strong>SKU:</strong> {product.sku}</p>
                                                <p><strong>Stock Amount:</strong> {product.stockAmount}</p>
                                                <p className="mb-0 mt-2">{product.name}</p>
                                            </div>
                                        </Link>
                                    ) : null}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Show;
