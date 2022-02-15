import React, { useEffect, useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { useHistory } from 'react-router'
import { SingleSelect } from '../../../components/select'
import { Container } from '../../../components/container'
import { Card } from '../../../components/card/Index'
import { CustomButton } from '../../../components/button'
import Requests from '../../../utils/Requests/Index'

const Index = () => {
    const { register, handleSubmit, errors } = useForm()
    const history = useHistory()
    const [items, setItems] = useState([])
    const [isLoading, setLoading] = useState(false)
    const [vendor, setVendor] = useState({ value: null, error: false })
    const [header] = useState({
        headers: { Authorization: "Bearer " + localStorage.getItem('token') }
    })

    // Fetch data
    const fetchData = useCallback(async () => {
        const data = await Requests.Vendor.IndexAll(header)
        if (data) setItems(data.vendors)
    }, [header])

    useEffect(() => {
        fetchData()
    }, [header, fetchData])

    // Submit Form
    const onSubmit = async data => {
        try {
            if (!vendor.value) return setVendor({ value: null, error: true })
            
            const formData = { ...data, vendor: vendor.value }

            const queryString = Object.keys(formData).map(key => `${key}=${formData[key]}`).join('&')
            history.replace(`/dashboard/report/vendor-po/show?${queryString}`)
        } catch (error) {
            if (error) setLoading(false)
        }
    }

    return (
        <div className="vendor-po-container">
            <Container.Fluid>
                <Container.Row>
                    <Container.Column className="col-padding">
                        <Card.Simple className="shadow-sm border-0">
                            <Card.Header className="bg-white border-0 rounded py-3">
                                <h6 className="mb-0">Find PO for vendor</h6>
                            </Card.Header>
                            <Card.Body>
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <Container.Row>

                                        {/* Vendor */}
                                        <Container.Column>
                                            <div className="form-group mb-4">
                                                <SingleSelect
                                                    error={vendor.error}
                                                    placeholder={'vendor'}
                                                    options={items}
                                                    value={(event) => setVendor({ value: event.value, error: false })}
                                                />
                                            </div>
                                        </Container.Column>

                                        {/* Start Date */}
                                        <Container.Column className="col-lg-6">
                                            <div className="form-group mb-4">
                                                <p>Start date</p>
                                                <input
                                                    type="date"
                                                    name="startFrom"
                                                    className={errors.startFrom ? "form-control shadow-none error" : "form-control shadow-none"}
                                                    ref={register({ required: true })}
                                                />
                                            </div>
                                        </Container.Column>

                                        {/* End Date */}
                                        <Container.Column className="col-lg-6">
                                            <div className="form-group mb-4">
                                                <p>End date</p>
                                                <input
                                                    type="date"
                                                    name="endTo"
                                                    className={errors.endTo ? "form-control shadow-none error" : "form-control shadow-none"}
                                                    ref={register({ required: true })}
                                                />
                                            </div>
                                        </Container.Column>

                                        {/* Submit button */}
                                        <Container.Column className="col-12 text-right">
                                            <CustomButton
                                                type="submit"
                                                className="btn-primary border-0 font-14 fw-normal px-4"
                                                disabled={isLoading}
                                            >SUBMIT</CustomButton>
                                        </Container.Column>

                                    </Container.Row>
                                </form>
                            </Card.Body>
                        </Card.Simple>
                    </Container.Column>
                </Container.Row>
            </Container.Fluid>
        </div>
    )
}

export default Index;