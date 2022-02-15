import React, { useState } from 'react'
import Icon from 'react-icons-kit'
import { Link } from 'react-router-dom'
import { chevronLeft } from 'react-icons-kit/feather'
import { SearchableSelect } from '../../components/select'
import { Container } from '../../components/container'
import { Card } from '../../components/card/Index'
import { CustomButton } from '../../components/button'
import Requests from '../../utils/Requests/Index'

const Create = () => {
    const [isLoading, setLoading] = useState(false)
    const [type, setType] = useState('Brand')
    const [item, setItem] = useState({ value: null, error: null })
    const [header] = useState({
        headers: { Authorization: "Bearer " + localStorage.getItem('token') }
    })

    // Handle type
    const handleType = event => {
        setType(event.target.value)
        setItem({ value: null, error: null })
    }

    // Handle search
    const handleSearch = async ({ inputValue, field }) => {
        let response

        if (!field) response = { data: [] }

        if (field === "Brand") {
            response = await Requests.Options.Brand(inputValue, header)
        }

        if (field === "Vendor") {
            response = await Requests.Options.Vendor(inputValue, header)
        }

        if (field === "Category") {
            response = await Requests.Options.Category(inputValue, header)
        }

        if (field === "Sub-category") {
            response = await Requests.Options.SubCategory(inputValue, header)
        }

        if (field === "Leaf-category") {
            response = await Requests.Options.LeafCategory(inputValue, header)
        }


        if (response.data && response.data.length) return response.data
        return []
    }

    // Submit Form
    const onSubmit = async (event) => {
        try {
            event.preventDefault()
            if (!item.value) return setItem({ value: null, error: `Select ${type} first.` })

            setLoading(true)
            const formData = {
                type,
                item: item.value
            }

            await Requests.Deactivated.Store(formData, header)
            setLoading(false)

        } catch (error) {
            if (error) console.log(error)
        }
    }

    return (
        <div className="pb-4">
            <Container.Fluid>
                <Container.Row>
                    <Container.Column className="col-padding">
                        <Card.Simple className="border-0">
                            <Card.Header className="bg-white border-0 p-3 p-lg-4">
                                <div className="d-flex">
                                    <div><h6 className="mb-0">Create new deactive</h6></div>
                                    <div className="ml-auto">
                                        <Link to="/dashboard/deactivated">
                                            <CustomButton className="btn-primary border-0 rounded-circle circle__padding">
                                                <Icon icon={chevronLeft} size={22} />
                                            </CustomButton>
                                        </Link>
                                    </div>
                                </div>
                            </Card.Header>
                            <Card.Body className="p-lg-4">
                                <form onSubmit={onSubmit}>

                                    {/* Type */}
                                    <div className="form-group mb-4">
                                        <p><i>Select the type which you want to deactivate.</i></p>

                                        <select
                                            name="type"
                                            className="form-control shadow-none"
                                            onChange={handleType}
                                        >
                                            <option value="Brand">Brand</option>
                                            <option value="Vendor">Vendor</option>
                                            <option value="Category">Category</option>
                                            <option value="Sub-category">Sub Category</option>
                                            <option value="Leaf-category">Leaf Category</option>
                                        </select>
                                    </div>

                                    {/* Item */}
                                    <div className="form-group mb-4">
                                        {item.error ? <p className="text-danger"><i>{item.error}</i></p> : <p><i>Select the {type} which you want to deactivate.</i></p>}

                                        <SearchableSelect
                                            borderRadius={4}
                                            placeholder={type}
                                            search={inputValue => handleSearch({ inputValue, field: type })}
                                            values={event => setItem({ ...item, value: event.value, error: null })}
                                        />
                                    </div>

                                    <div className="text-right">
                                        <CustomButton
                                            type="submit"
                                            className="btn-primary border-0"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? 'Submitting...' : 'Submit'}
                                        </CustomButton>
                                    </div>
                                </form>
                            </Card.Body>
                        </Card.Simple>
                    </Container.Column>
                </Container.Row>
            </Container.Fluid>
        </div>
    );
};

export default Create;