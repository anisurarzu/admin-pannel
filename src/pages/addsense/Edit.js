import React, { useCallback, useEffect, useState } from 'react'
import './style.scss'
import Icon from 'react-icons-kit'
import { Link, useParams } from 'react-router-dom'
import { chevronLeft } from 'react-icons-kit/feather'
import { Text } from '../../components/text'
import { Card } from '../../components/card/Index'
import { Container } from '../../components/container'
import { CustomButton } from '../../components/button'
import { FormGroup } from '../../components/formGroup'
import { SearchableSelect } from '../../components/select'
import { PreLoader } from '../../components/loading/Index'
import { SingleFileUploader } from '../../components/fileUploader/Index'

import Requests from '../../utils/Requests/Index'

const Edit = () => {
    const { id } = useParams()
    const [data, setData] = useState({})
    const [isLoading, setLoading] = useState(true)
    const [changing, setChanging] = useState(false)
    const [item, setItem] = useState({ type: null, value: null, error: null })
    const [link, setLink] = useState({ value: null, error: null })
    const [image, setImage] = useState({ value: null, error: null })

    const [header] = useState({
        headers: { Authorization: "Bearer " + localStorage.getItem('token') }
    })

    // Fetch data
    const fetchData = useCallback(async () => {
        const response = await Requests.Addsense.Show(id, header)
        if (response) {
            setData(response.data)
            setItem({ type: response.data.type })
            setLink({ value: response.data.link })
            setImage({...image, value: response.data.image})
        }
        setLoading(false)
    }, [id, header])

    useEffect(() => {
        fetchData()
    }, [id, fetchData])

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
        if (!image.value) return setImage({ ...image, error: "Image is required." })

        let formData = new FormData()
        formData.append('id',id)
        formData.append('type', item.type)
        formData.append('item', item.value ? item.value : null)
        formData.append('link', link.value)
        formData.append('image', image.value)

        setChanging(true)
        await Requests.Addsense.Update(formData, header)
        setChanging(false)
    }

    if (isLoading) return <PreLoader />

    return (
        <div className="mb-4">
            <Container.Fluid>
                <Container.Row>
                    <Container.Column className="col-padding">
                        <Card.Simple className="border-0 shadow-sm">
                            <Card.Header className="p-3 p-lg-4 bg-white">
                                <div className="d-flex">
                                    <div><h6 className="mt-2 mb-0">Edit Addsense</h6></div>
                                    <div className="ml-auto">
                                        <Link to="/dashboard/addsense">
                                            <CustomButton className="btn-primary border-0 rounded-circle circle__padding">
                                                <Icon icon={chevronLeft} size={22} />
                                            </CustomButton>
                                        </Link>
                                    </div>
                                </div>
                            </Card.Header>
                            <Card.Body>
                                <form onSubmit={onSubmit}>

                                    {/* Type */}
                                    <FormGroup>
                                        <Text><i>Select the type which you want to added.</i></Text>

                                        <select
                                            name="type"
                                            className="form-control shadow-none"
                                            defaultValue={data.type}
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
                                    </FormGroup>

                                    {/* Item */}
                                    <FormGroup>
                                        {item.error ? <p className="text-danger"><i>{item.error}</i></p> : <p><i>Select the {item.type} which you want to add.</i></p>}

                                        <SearchableSelect
                                            borderRadius={4}
                                            placeholder={item.type ? "Select " + item.type : "Select item"}
                                            search={inputValue => handleSearch({ inputValue, field: item.type })}
                                            values={data => {
                                                if (item.type === "brand" || item.type === "vendor") {
                                                    setItem({ ...item, value: data.value, error: null })
                                                } else {
                                                    setItem({ ...item, value: data.slug, error: null })
                                                }
                                            }}
                                        />
                                    </FormGroup>

                                    {/* Link */}
                                    <FormGroup>
                                        {link.error ? <p className="text-danger"><i>{link.error}</i></p> : <p><i>Add other links</i></p>}

                                        <input
                                            type="text"
                                            className="form-control shadow-none"
                                            placeholder="www.example.com"
                                            defaultValue={data.link || null}
                                            onChange={event => setLink({ value: event.target.value, error: null })}
                                        />
                                    </FormGroup>


                                    {/* Image uploader */}
                                    <FormGroup>
                                        {image.error ? <p className="text-danger">{image.error}</p> : <p>Image</p>}
                                        <SingleFileUploader
                                            width={200}
                                            height={100}
                                            limit={100}
                                            default={data.image||null}
                                            dataHandeller={data => setImage({ value: data.image, error: data.error || null })}
                                        />
                                    </FormGroup>


                                    {/* Submit button */}
                                    <div className="text-right">
                                        <button type="submit" className="btn shadow-none" disabled={changing}>
                                            {changing ? 'Saving ...' : 'Save Changes'}
                                        </button>
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

export default Edit;