import React, { useCallback, useEffect, useRef, useState } from 'react'
import './style.scss'
import Icon from 'react-icons-kit'
import CommaNumber from 'comma-number'
import { minus, plus } from 'react-icons-kit/feather'
import { SearchableSelect, SingleSelect } from '../../components/select'
import { districts } from '../../utils/location/districts'
import { Customer } from '../../components/form/order/Customer'
import { CouponApply } from '../../components/form/order/CouponApply'
import { toast, Slide } from 'react-toastify'
import Requests from '../../utils/Requests/Index'
import { useForm } from 'react-hook-form'
import { useHistory } from 'react-router-dom'
import { PaymentMethodForm } from '../../components/form/order/PaymentMethodForm'

toast.configure({
    autoClose: 1500,
    transition: Slide,
    position: "top-right",
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
})

const Create = () => {
    const selectedField = useRef()
    const history = useHistory()
    const { register, handleSubmit, clearErrors, setError, errors } = useForm()
    const [placed, setPlaced] = useState(false)
    const [loading, setLoading] = useState(false)
    const [paymentMethod, setPaymentMethod] = useState("COD")
    const [selectedItems, setSelectedItems] = useState([])
    const [process, setProcess] = useState({ data: null, loading: false })
    const [coupon, setCoupon] = useState({ loading: false, message: {} })
    const [selectedCustomer, setSelectedCustomer] = useState(null)
    const [selectedDivision, setSelectedDivision] = useState(null)
    const [selectedDistrict, setSelectedDistrict] = useState(null)
    const [selectedArea, setSelectedArea] = useState(null)
    const [divisions, setDivisions] = useState([])
    const [districts, setDistricts] = useState([])
    const [areas, setAreas] = useState([])
    const [isCouponApplied, setIsCouponApplied] = useState(false)
    const [subTotal, setSubTotal] = useState(null)
    const [deliveryCharge, setDeliveryCharge] = useState(null)
    const [total, setTotal] = useState(null)
    const [header] = useState({
        headers: { Authorization: "Bearer " + localStorage.getItem("token") }
    })

    // Count total amount
    const TotalAmount = (subTotal, dCharge) => {
        return subTotal + dCharge
    }

    // Handle product search from API
    const handleProductSearch = async (inputValue) => {
        let results = []
        const response = await Requests.Product.Search(inputValue, header)

        if (response && response.data && response.data.length) {
            for (let i = 0; i < response.data.length; i++) {
                const element = response.data[i]
                results.push({
                    ...element,
                    label: element.sku + ' - ' + element.name.slice(0, 40) + ' ...',
                    name: element.name.slice(0, 10) + ' ...',
                    quantity: 1,
                    value: element._id,
                    image: element.thumbnail
                })
            }
        }
        return results
    }

    // Handle Selected products values
    const handleSelectedProductsValues = data => setSelectedItems(data)

    // Increment Quantity
    const incrementQuantity = key => {
        let items = [...selectedItems]
        let item = { ...items[key] }
        item.quantity += 1

        items[key] = item
        setSelectedItems(items)
        setProcess({ ...process, data: null })
        setCoupon({ loading: false, message: {} })
    }

    // Decrement Quantity
    const decrementQuantity = key => {
        let items = [...selectedItems]
        let item = { ...items[key] }
        item.quantity -= 1

        items[key] = item
        setSelectedItems(items)
        setProcess({ ...process, data: null })
        setCoupon({ loading: false, message: {} })
    }

    /* fetch division */
    const fetchDivision = useCallback(async () => {
        const response = await Requests.Services.Shipping.MainShipping.DivisionList(header)
        let items = []
        if (response && response.data) {
            for (let i = 0; i < response.data.length; i++) {
                const element = response.data[i]
                items.push({
                    label: element.name,
                    value: element._id,
                })
            }
        }
        setDivisions(items)
    }, [])

    /* fetch district */
    const fetchDistrict = async (id) => {
        const response = await Requests.Services.Shipping.MainShipping.DistrictList(id, header)
        let items = []
        if (response && response.data) {
            for (let i = 0; i < response.data.length; i++) {
                const element = response.data[i]
                items.push({
                    label: element.name,
                    value: element._id,
                })
            }
        }
        setDistricts(items)
    }

    /* fetch area */
    const fetchArea = async (id) => {
        const response = await Requests.Services.Shipping.MainShipping.AreaList(id, header)
        let items = []
        if (response && response.data) {
            for (let i = 0; i < response.data.length; i++) {
                const element = response.data[i]
                items.push({
                    label: `${element.post_office} - ${element.post_code}`,
                    value: element._id,
                })
            }
        }
        setAreas(items)
    }

    // Division
    useEffect(() => {
        fetchDivision()
    }, [fetchDivision])

    // Process Order
    const processOrder = async (data) => {

        let is_error = false

        if (!selectedDivision) {
            setError("division", {
                type: "manual",
                message: "Division is required."
            })
            is_error = true
        }
        if (!selectedDistrict) {
            setError("district", {
                type: "manual",
                message: "District is required."
            })
            is_error = true
        }
        if (!selectedArea) {
            setError("area", {
                type: "manual",
                message: "Area is required."
            })
            is_error = true
        }

        if (is_error) return

        let products = []

        if (selectedItems && selectedItems.length) {
            for (let i = 0; i < selectedItems.length; i++) {
                const element = selectedItems[i]
                products.push({
                    quantity: element.quantity,
                    _id: element.value
                })
            }
        }

        const formData = {
            products: [...products],
            division: selectedDivision.value,
            district: selectedDistrict.value,
            area: selectedArea.value
        }

        setProcess({ ...process, loading: true })
        const response = await Requests.Order.ProcessOrder(formData, header)
        setProcess({ data: response, loading: false })
        setSubTotal(response && response.subTotal ? response.subTotal : 0)
        setDeliveryCharge(response && response.shippingCharge ? response.shippingCharge : 0)
        setTotal(response && response.totalPrice ? response.totalPrice : 0)

    }

    // Handle coupon
    const handleCoupon = async (data) => {

        let products = []

        if (selectedItems && selectedItems.length) {
            for (let i = 0; i < selectedItems.length; i++) {
                const element = selectedItems[i]
                products.push({
                    ...element,
                    quantity: element.quantity,
                    _id: element.value
                })
            }
        }
        const formData = {
            ...data,
            products: products,
            // shippingLocation: area.value,
            processId: process.data.processId
        }

        setCoupon({ ...coupon, loading: true })
        const response = await Requests.Order.ApplyCoupon(formData, header)

        if (response && response.sucess) {
            toast.success(response.message)
            setIsCouponApplied(true)
            setProcess({
                ...process, data: {
                    ...process.data,
                    coupon: response.data && response.data.available_coupon ? response.data.available_coupon : null,
                    subTotal: response.data && response.data.subTotal ? response.data.subTotal : null,
                    shippingCharge: response.data && response.data.shippingCharge ? response.data.shippingCharge : null,
                    totalPrice: response.data && response.data.totalPrice ? response.data.totalPrice : null
                }
            })
            setCoupon({ ...coupon, loading: false, message: { type: "success", value: response.message } })

        } else {
            setCoupon({ ...coupon, loading: false })
        }

    }

    // Handle customer search from API
    const handleCustomerSearch = async (inputValue) => {
        let results = []
        const response = await Requests.Order.SearchCustomer(inputValue, header)

        if (response && response.data && response.data.length) {
            for (let i = 0; i < response.data.length; i++) {
                const element = response.data[i]
                results.push({
                    value: element._id,
                    label: element.name + "-" + element.phone,
                    name: element.name,
                    email: element.email,
                    phone: element.phone,
                    shippingArea: element.shippingAddress,
                    deliveryAddress: element.deliveryAddress,
                    postCode: element.postCode,
                    postOffice: element.postOffice,
                    upazila: element.upazila
                })
            }
        }

        return results
    }

    const payment = async data => {

        console.log("payment", data);



    }

    // Place order
    const placeOrder = async data => {

        const formData = {
            ...data,
            // shippingArea: area && area.value ? area.value : null,
            // postCode: postCode && postCode.value ? postCode.value : null,
            // postOffice: postOffice || null,
            coupon: process.data && process.data.coupon && process.data.coupon._id ? process.data.coupon._id : null,
            subTotal: subTotal || 0,
            shippingCharge: deliveryCharge || 0,
            totalPrice: total || 0,
            // upazila: upzila || null,
            isCouponApplied: isCouponApplied,
            couponInfo: process.data && process.data.coupon ? process.data.coupon : null,
            products: JSON.stringify(process.data && process.data.products ? process.data.products : null)
        }

        setPlaced(true)
        const response = await Requests.Order.PlaceOrder(formData, header)
        if (response) {
            setSelectedItems([])
            history.push("/dashboard/order")
        }
        setPlaced(false)
    }


    return (
        <div className="order-create-container">
            <div className="container-fluid">
                <div className="row">

                    {/* Header & search container */}
                    <div className="col-12 col-padding">
                        <SearchableSelect
                            isMulti={true}
                            placeholder="Search product by SKU"
                            search={handleProductSearch}
                            values={handleSelectedProductsValues}
                        />
                    </div>

                    {/* Selected items container */}
                    <div className="col-12 col-padding selected-products-container">
                        {selectedItems && selectedItems.map((item, i) =>
                            <div className="card border-0 p-2" key={i}>
                                <div className="card-body shadow-sm bg-white rounded text-center">
                                    <div className="img-container">
                                        <img src={item.image} className="img-fluid" alt="..." />
                                    </div>
                                    <p>{item.name}</p>

                                    <div className="d-flex mt-2">
                                        <div><p>Quantity: {item.quantity}</p></div>
                                        <div className="ml-auto pt-2">
                                            <button className="btn btn-sm shadow-none rounded-circle btn-desc"
                                                disabled={item.quantity <= 1}
                                                onClick={() => decrementQuantity(i)}
                                            >
                                                <Icon icon={minus} size={15} />
                                            </button>
                                            <button className="btn btn-sm shadow-none rounded-circle btn-inc ml-1"
                                                onClick={() => incrementQuantity(i)}
                                            >
                                                <Icon icon={plus} size={15} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Process Order Button */}
                    {selectedItems && selectedItems.length ?
                        <div className='col-12'>
                            <form onSubmit={handleSubmit(processOrder)}>
                                <div className='row'>
                                    {/* Division */}
                                    <div className="col-12 col-lg-6">
                                        <div className="form-group mb-4">
                                            {errors.division && errors.division.message ?
                                                <small className="text-danger">{errors.division && errors.division.message}</small> :
                                                <small>Select division<span className="text-danger">*</span></small>
                                            }

                                            <SingleSelect
                                                options={divisions}
                                                placeholder={'division'}
                                                borderRadius={4}
                                                error={errors.division && errors.division.message}
                                                value={(event) => {
                                                    setSelectedDivision(event)
                                                    fetchDistrict(event.value)
                                                    clearErrors("division")
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* District */}
                                    {selectedDivision ?
                                        <div className="col-12 col-lg-6">
                                            <div className="form-group mb-4">
                                                {errors.district && errors.district.message ?
                                                    <small className="text-danger">{errors.district && errors.district.message}</small> :
                                                    <small>Select district<span className="text-danger">*</span></small>
                                                }

                                                <SingleSelect
                                                    options={districts}
                                                    placeholder={'district'}
                                                    borderRadius={4}
                                                    error={errors.district && errors.district.message}
                                                    value={(event) => {
                                                        setSelectedDistrict(event)
                                                        fetchArea(event.value)
                                                        clearErrors("district")
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        : null}


                                    {/* Area */}
                                    {selectedDistrict ?
                                        <div className="col-12 col-lg-6">
                                            <div className="form-group mb-4">
                                                {errors.area && errors.area.message ?
                                                    <small className="text-danger">{errors.area && errors.area.message}</small> :
                                                    <small>Select Area<span className="text-danger">*</span></small>
                                                }

                                                <SingleSelect
                                                    options={areas}
                                                    placeholder={'area'}
                                                    borderRadius={4}
                                                    error={errors.area && errors.area.message}
                                                    value={(event) => {
                                                        setSelectedArea(event)
                                                        clearErrors("area")
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        : null}

                                    <div className="col-12 text-center py-3">
                                        <button className="btn shadow-none success-btn px-4 py-2"
                                            disabled={process.loading}
                                        // onClick={processOrder}
                                        >{process.loading ? "Processing ..." : "Process Order"}</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                        : null
                    }

                    {/* Processing price */}
                    {selectedItems && selectedItems.length && process.data ?
                        <div className="col-12 py-3">
                            <div className="card border-0 shadow-sm">
                                <div className="card-body p-4">
                                    <div>
                                        {/* Payment method */}
                                        <div>
                                            <div className="form-group mb-4">
                                                <p>Payment method</p>

                                                <select
                                                    name="paymentMethod"
                                                    className="form-control shadow-none"
                                                    defaultValue="COD"
                                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                                >
                                                    <option value="">--- Select Option ---</option>
                                                    <option value="COD">COD</option>
                                                    <option value="Paid">Paid</option>
                                                    <option value="Partial Paid">Partial Paid</option>
                                                </select>
                                            </div>
                                        </div>
                                        <PaymentMethodForm
                                            loading={loading}
                                            paymentMethod={paymentMethod}
                                            value={data => payment(data)}
                                        />
                                    </div>
                                    <div className="d-flex">
                                        <div>
                                            <p className="text-muted mb-1">Sub-Total</p>
                                            <p className="text-muted mb-1">Delivery charge </p>

                                        </div>
                                        <div className="ml-auto">
                                            <p className="text-muted mb-1">: ৳. {CommaNumber(subTotal)}</p>
                                            <p className="text-muted mb-1">: ৳. {CommaNumber(deliveryCharge)}</p>
                                        </div>
                                    </div>
                                    <hr className="my-2" />
                                    <div className="d-flex">
                                        <div>
                                            <p className="mb-1">Total</p>
                                        </div>
                                        <div className="ml-auto">

                                            <p className="mb-1">: ৳. {CommaNumber(total)}</p>
                                        </div>
                                    </div>
                                    <br />

                                    <CouponApply
                                        loading={coupon.loading}
                                        message={coupon.message}
                                        value={handleCoupon}
                                    />
                                </div>
                            </div>
                        </div>
                        : null
                    }

                    {/* Customer selection */}
                    {selectedItems && selectedItems.length && process.data ?
                        <div className="col-12 py-3">
                            <div className="card border-0 shadow-sm">
                                <div className="card-header rounded border-0 bg-white p-3 p-lg-4">
                                    <div className="d-md-flex">
                                        <div><h5 className="mb-0">Customer Information</h5></div>
                                        <div className="ml-md-auto pt-3 pt-md-0" style={{ width: 250 }}>
                                            <SearchableSelect
                                                placeholder="Search customer"
                                                search={handleCustomerSearch}
                                                values={data => setSelectedCustomer(data)}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="card-body border-top p-3 p-lg-4">
                                    <Customer
                                        loading={placed}
                                        data={selectedCustomer}
                                        value={data => placeOrder(data)}
                                    />
                                </div>
                            </div>
                        </div>
                        : null
                    }
                </div>
            </div>
        </div>
    );
}

export default Create;
