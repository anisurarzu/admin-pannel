import React, { useState } from 'react'
import Icon from 'react-icons-kit'
import { Form } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { chevronLeft } from 'react-icons-kit/feather'
import { Container } from '../../components/container'
import { Card } from '../../components/card/Index'
import { CustomButton } from '../../components/button'
import { SingleFileUploader } from '../../components/fileUploader/Index'
import { SearchableSelect } from '../../components/select'
import Requests from '../../utils/Requests/Index'

const Create = () => {
    const { register, handleSubmit, errors } = useForm()
    const [isLoading, setLoading] = useState(false)
    const [image, setImage] = useState({ value: null, error: null })
    const [categoryError, setCategoryError] = useState({ type: null, message: null })

    const [selector, setSelector] = useState({ label: "Category", value: null })
    const [selected, setSelected] = useState(null)

    const [header] = useState({
        headers: { Authorization: "Bearer " + localStorage.getItem('token') }
    })

    // Handle search from main category
    const handleSearchFromMainCategory = async (inputValue) => {
        const response = await Requests.Options.Category(inputValue, header)
        if (response.data && response.data.length) {
            return response.data
        }
        return []
    }

    // Handle search from sub category
    const handleSearchFromSubCategory = async (inputValue) => {
        const response = await Requests.Options.SubCategory(inputValue, header)
        if (response.data && response.data.length) {
            return response.data
        }
        return []
    }

    // Submit Form
    const onSubmit = async (data) => {
        if (!image.value) return setImage({ ...image, error: 'Icon/Logo is required' })
        if (selector.value && !selected) {
            return setCategoryError({ type: selector.value, message: selector.value + " is required*" })
        }

        setLoading(true)
        let formData = new FormData()
        formData.append('name', data.name)
        formData.append('type', selector.label)
        formData.append('category', selected)
        formData.append('image', image.value)

        await Requests.Category.Store(formData, header)
        setLoading(false)
    }

    return (
        <div className="pb-4">

            <Container.Fluid>
                <Container.Row>
                    <Container.Column className="col-padding">
                        <Card.Simple className="border-0">
                            <Card.Header className="bg-white border-0 p-3 p-lg-4">
                                <div className="d-flex">
                                    <div><h6 className="mb-0">Create Category</h6></div>
                                    <div className="ml-auto">
                                        <Link to="/dashboard/category">
                                            <CustomButton className="btn-primary border-0 rounded-circle circle__padding">
                                                <Icon icon={chevronLeft} size={22} />
                                            </CustomButton>
                                        </Link>
                                    </div>
                                </div>
                            </Card.Header>
                            <Card.Body className="px-4 pb-4 pt-0">
                                <form onSubmit={handleSubmit(onSubmit)}>

                                    {/* Name */}
                                    <div className="form-group mb-4">
                                        {errors.name && errors.name.message ? (
                                            <p className="text-danger">{errors.name && errors.name.message}</p>
                                        ) : <p>Name</p>}

                                        <input
                                            type="text"
                                            name="name"
                                            className="form-control shadow-none"
                                            placeholder="Enter category name"
                                            ref={register({ required: "Name is required" })}
                                        />
                                    </div>

                                    {/* Image uploader */}
                                    <div className="form-group mb-4">
                                        {image.error ? <p className="text-danger">{image.error}</p> : <p>Banner</p>}
                                        <SingleFileUploader
                                            width={400}
                                            height={120}
                                            limit={300}
                                            dataHandeller={data => setImage({
                                                value: data.image,
                                                error: data.error || null
                                            })}
                                        />
                                    </div>


                                    <Container.Row>

                                        {/* Main category */}
                                        <Container.Column className="col-lg-4">
                                            <Form.Group className="text-capitalize font__size__md mb-0" controlId="category-control">
                                                <Form.Check
                                                    type="checkbox"
                                                    label="Category"
                                                    checked={selector.label === "Category"}
                                                    onChange={() => {
                                                        setSelected(null)
                                                        setSelector({ label: "Category", value: null })
                                                        setCategoryError({ type: null, message: null })
                                                    }}
                                                />
                                            </Form.Group>
                                        </Container.Column>

                                        {/* Sub category */}
                                        <Container.Column className="col-lg-4">
                                            <Form.Group className="text-capitalize font__size__md mb-3" controlId="sub-category-control">
                                                <Form.Check
                                                    type="checkbox"
                                                    label="Sub Category"
                                                    checked={selector.label === "Sub Category"}
                                                    onChange={() => {
                                                        setSelected(null)
                                                        setSelector({ label: "Sub Category", value: "Category" })
                                                        setCategoryError({ type: null, message: null })
                                                    }}
                                                />
                                            </Form.Group>

                                            {/* Select Main category */}
                                            {selector.value && selector.value === "Category" &&
                                                <div>
                                                    {categoryError.type && categoryError.type === "Category" ?
                                                        <small className="font-14 text-danger mb-0">{categoryError.message}</small> :
                                                        <small className="font-14 text-muted mb-0">Category</small>
                                                    }

                                                    <SearchableSelect
                                                        borderRadius={4}
                                                        placeholder="Select category"
                                                        search={inputValue => handleSearchFromMainCategory(inputValue)}
                                                        values={(event) => {
                                                            setSelected(event.value)
                                                            setCategoryError({ type: null, message: null })
                                                        }}
                                                    />
                                                </div>
                                            }
                                        </Container.Column>

                                        {/* Leaf category */}
                                        <Container.Column className="col-lg-4">
                                            <Form.Group className="text-capitalize font__size__md mb-3" controlId="leaf-category-control">
                                                <Form.Check
                                                    type="checkbox"
                                                    label="Leaf Category"
                                                    checked={selector.label === "Leaf Category"}
                                                    onChange={() => {
                                                        setSelected(null)
                                                        setSelector({ label: "Leaf Category", value: "Sub Category" })
                                                        setCategoryError({ type: null, message: null })
                                                    }}
                                                />
                                            </Form.Group>

                                            {/* Select Sub category */}
                                            {selector.value && selector.value === "Sub Category" &&
                                                <div>
                                                    {categoryError.type && categoryError.type === "Sub Category" ?
                                                        <small className="font-14 text-danger mb-0">{categoryError.message}</small> :
                                                        <small className="font-14 text-muted mb-0">Sub Category</small>
                                                    }

                                                    <SearchableSelect
                                                        borderRadius={4}
                                                        placeholder="Select sub category"
                                                        search={inputValue => handleSearchFromSubCategory(inputValue)}
                                                        values={(event) => {
                                                            setSelected(event.value)
                                                            setCategoryError({ type: null, message: null })
                                                        }}
                                                    />
                                                </div>
                                            }
                                        </Container.Column>
                                    </Container.Row>


                                    {/* Submit button */}
                                    <Container.Row>
                                        <Container.Column className="text-center py-4">
                                           {/*  <CustomButton
                                                type="submit"
                                                className="btn-primary border-0 px-5 font-14"
                                                disabled={isLoading}
                                            >{isLoading ? "Creating ..." : "Create"}</CustomButton> */}
                                        </Container.Column>
                                    </Container.Row>

                                </form>
                            </Card.Body>
                        </Card.Simple>
                    </Container.Column>
                </Container.Row>
            </Container.Fluid>
        </div>
    );
}

export default Create;
