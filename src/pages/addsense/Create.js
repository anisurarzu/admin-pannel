import React, { useState } from 'react'
import './style.scss'
import Icon from 'react-icons-kit'
import { Link } from 'react-router-dom'
import { chevronLeft } from 'react-icons-kit/feather'
import { SearchableSelect } from '../../components/select'
import { SingleFileUploader } from '../../components/fileUploader/Index'

import Requests from '../../utils/Requests/Index'

const Create = () => {
    const [isLoading, setLoading] = useState(false)
    const [item, setItem] = useState({ type: null, value: null, error: null })
    const [link, setLink] = useState({ value: null, error: null })
    const [image, setImage] = useState({ value: null, error: null })
    const [header] = useState({
        headers: { Authorization: "Bearer " + localStorage.getItem('token') }
    })

    // Handle search
    const handleSearch = async ({ inputValue, field }) => {
        let response

        if (!field) response = { data: [] }

        if (field === "brand") {
            response = await Requests.Options.Brand(inputValue, header)
        }

        if (field === "vendor") {
            response = await Requests.Options.Vendor(inputValue, header)
        }

        if (field === "product") {
            response = await Requests.Options.Product(inputValue, header)
        }

        if (field === "category") {
            response = await Requests.Options.Category(inputValue, header)
        }

        if (field === "sub-category") {
            response = await Requests.Options.SubCategory(inputValue, header)
        }

        if (field === "leaf-category") {
            response = await Requests.Options.LeafCategory(inputValue, header)
        }

        if (response.data && response.data.length) return response.data
        return []
    }

    // Submit Form
    const onSubmit = async (event) => {
        event.preventDefault()
        if (item.type && !item.value) return setItem({ ...item, error: item.type + " is required." })
        if (!link.value && !item.value) return setLink({ ...link, error: "Link is required." })
        if (!image.value) return setImage({ value: null, error: "Image is required." })

        let formData = new FormData()
        formData.append('type', item.type)
        formData.append('item', item.value ? item.value : null)
        formData.append('link', link.value)
        formData.append('image', image.value)

        setLoading(true)
        await Requests.Addsense.Store(formData, header)
        setLoading(false)
    }

    return (
        <div className="store-addsense pb-4">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12 col-padding">
                        <div className="card border-0 shadow-sm">
                            <div className="card-header p-3 p-lg-4 bg-white">
                                <div className="d-flex">
                                    <div><h6 className="mb-0">Store Addsense</h6></div>
                                    <div className="ml-auto">
                                        <Link
                                            to="/dashboard/addsense"
                                            type="button"
                                            className="btn shadow-none rounded-circle"
                                        >
                                            <Icon icon={chevronLeft} size={22} />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body p-4">
                                <form onSubmit={onSubmit}>

                                    {/* Type */}
                                    <div className="form-group mb-4">
                                        <p><i>Select the type which you want to added.</i></p>

                                        <select
                                            name="type"
                                            className="form-control shadow-none"
                                            onChange={event => {
                                                setItem({ ...item, value: null, type: event.target.value, error: null })
                                                setLink({ ...link, error: null })
                                            }}
                                        >
                                            <option value="">-- Select Option --</option>
                                            <option value="brand">Brand</option>
                                            <option value="vendor">Vendor</option>
                                            <option value="product">Product</option>
                                            <option value="category">Category</option>
                                            <option value="sub-category">Sub Category</option>
                                            <option value="leaf-category">Leaf Category</option>
                                        </select>
                                    </div>

                                    {/* Item */}
                                    <div className="form-group mb-4">
                                        {item.error ? <p className="text-danger"><i>{item.error}</i></p> : <p><i>Select the {item.type} which you want to add.</i></p>}

                                        <SearchableSelect
                                            borderRadius={4}
                                            placeholder={item.type ? "Select " + item.type : "Select item"}
                                            search={inputValue => handleSearch({ inputValue, field: item.type })}
                                            values={data => {
                                                if (item.type === "brand" || item.type === "vendor") {
                                                    setItem({ ...item, value: data.value, error: null })
                                                } else {
                                                    setItem({ ...item, value: data.slug ? data.slug : data.value, error: null })
                                                }
                                            }}
                                        />
                                    </div>

                                    {/* Link */}
                                    <div className="form-group mb-4">
                                        {link.error ? <p className="text-danger"><i>{link.error}</i></p> : <p><i>Add other links</i></p>}

                                        <input
                                            type="text"
                                            className="form-control shadow-none"
                                            placeholder="www.example.com"
                                            onChange={event => setLink({ value: event.target.value, error: null })}
                                        />
                                    </div>

                                    <div className="d-sm-flex">

                                        {/* Image uploader */}
                                        <div className="form-group mb-4 mr-sm-2">
                                            {image.error ? <p className="text-danger">{image.error}</p> : <p>Image</p>}
                                            <SingleFileUploader
                                                width={200}
                                                height={100}
                                                limit={100}
                                                dataHandeller={data => setImage({ value: data.image, error: data.error || null })}
                                            />
                                        </div>
                                    </div>

                                    {/* Submit button */}
                                    <div className="text-right">
                                        <button type="submit" className="btn shadow-none" disabled={isLoading}>
                                            {isLoading ? 'Creating ...' : 'Create'}
                                        </button>
                                    </div>

                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Create;
