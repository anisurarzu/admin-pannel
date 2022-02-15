import React, { useState } from 'react'
import Icon from 'react-icons-kit'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { chevronLeft } from 'react-icons-kit/feather'
import { Container } from '../../../components/container'
import { Card } from '../../../components/card/Index'
import { CustomButton } from '../../../components/button'
import { SingleFileUploader } from '../../../components/fileUploader/Index'

import Requests from '../../../utils/Requests/Index'


const Create = () => {
    const { register, handleSubmit, errors } = useForm()
    const [isLoading, setLoading] = useState(false)
    const [image, setImage] = useState({ value: null, error: null })
    const [header] = useState({
        headers: { Authorization: "Bearer " + localStorage.getItem('token') }
    })

    // Submit Form
    const onSubmit = async (data) => {
        if (!image.value) return setImage({ ...image, error: "Image is required" })

        setLoading(true)
        let formData = new FormData()
        formData.append('name', data.name)
        formData.append('image', image.value)

        await Requests.University.CategoryStore(formData, header)
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
                                    <div><h6 className="mb-0">Create Eazybest University Category</h6></div>
                                    <div className="ml-auto">
                                        <Link to="/dashboard/university/category">
                                            <CustomButton className="btn-primary border-0 rounded-circle circle__padding">
                                                <Icon icon={chevronLeft} size={22} />
                                            </CustomButton>
                                        </Link>
                                    </div>
                                </div>
                            </Card.Header>

                            <Card.Body className="px-4 pt-0">
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

                                    {/* File upload */}
                                    <div className="form-group mb-4">
                                        {image.error ? <p className="text-danger">{image.error}</p> : <p>Image</p>}
                                        <SingleFileUploader
                                            width={200}
                                            height={100}
                                            limit={100}
                                            dataHandeller={data => setImage({ value: data.image, error: data.error || null })}
                                        />
                                    </div>

                                    <div className="text-right">
                                        <CustomButton
                                            type="submit"
                                            className="btn btn-success border-0 shadow-none"
                                            disabled={isLoading}
                                        >{isLoading ? 'Submitting...' : 'Submit'}</CustomButton>
                                    </div>
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