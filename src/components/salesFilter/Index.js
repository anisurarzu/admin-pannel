import React, { useEffect, useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { SingleSelect } from '../select'
import Requests from '../../utils/Requests/Index'

const Index = ({ updateItems }) => {
    const { register, handleSubmit, errors } = useForm()
    const [isLoading, setLoading] = useState(false)
    const [options, setOptions] = useState({ vendors: [], categories: [] })
    const [vendor, setVendor] = useState({ value: null, error: false })
    const [category, setCategory] = useState({ value: null, error: false })
    const [paymentStatus, setPaymentStatus] = useState({ value: null, error: false })
    const [header] = useState({
        headers: { Authorization: "Bearer " + localStorage.getItem('token') }
    })

    // Fetch data
    const fetchData = useCallback(async () => {
        const response = await Requests.Sales.FilterOptions(header)
        if (response) setOptions({ vendors: response.vendors, categories: response.categories })
    }, [header])

    useEffect(() => {
        fetchData()
    }, [fetchData])


    // Submit Form
    const onSubmit = async (data) => {
        setLoading(true)
        const formData = {
            ...data,
            vendor: vendor.value,
            category: category.value,
            paymentStatus: paymentStatus.value
        }

        const response = await Requests.Sales.SalesReport(formData, header)
        if (response?.status) updateItems(response.data)
        setLoading(false)
    }

    return (
        <div className="p-4">

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row">

                    {/* Vendor */}
                    <div className="col-12 col-lg-6">
                        <div className="form-group mb-4">
                            <p>Vendor</p>
                            <SingleSelect
                                error={vendor.error}
                                placeholder="vendor"
                                options={options.vendors}
                                value={event => setVendor({ value: event.value, error: false })}
                            />
                        </div>
                    </div>

                    {/* Category */}
                    <div className="col-12 col-lg-6">
                        <div className="form-group mb-4">
                            <p>Category</p>
                            <SingleSelect
                                error={category.error}
                                placeholder="category"
                                options={options.categories}
                                value={event => setCategory({ value: event.value, error: false })}
                            />
                        </div>
                    </div>

                    {/* Payment Status */}
                    <div className="col-12">
                        <div className="form-group mb-4">
                            <p>Payment Status</p>
                            <SingleSelect
                                error={category.error}
                                placeholder="Payment status"
                                options={[{ value: 'Paid', label: 'Paid' }, { value: 'Pending', label: 'Pending' }]}
                                value={event => setPaymentStatus({ value: event.value, error: false })}
                            />
                        </div>
                    </div>

                    {/* From Date */}
                    <div className="col-12 col-lg-6">
                        <div className="form-group mb-4">
                            <p>From</p>
                            <input
                                type="date"
                                name="from"
                                className={errors.from ? "form-control shadow-none error" : "form-control shadow-none"}
                                ref={register({ required: false })}
                            />
                        </div>
                    </div>

                    {/* End To */}
                    <div className="col-12 col-lg-6">
                        <div className="form-group mb-4">
                            <p>End To</p>
                            <input
                                type="date"
                                name="to"
                                className={errors.to ? "form-control shadow-none error" : "form-control shadow-none"}
                                ref={register({ required: false })}
                            />
                        </div>
                    </div>

                    <div className="col-12 text-right">
                        <button
                            type="submit"
                            className="btn shadow-none px-5"
                            disabled={isLoading}
                        >{isLoading ? 'Filtering...' : 'Filter'}</button>
                    </div>

                </div>
            </form>



        </div>
    );
};

export default Index;
