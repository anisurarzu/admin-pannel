import React, { useState, useEffect, useCallback } from 'react'
import Icon from 'react-icons-kit'
import { useForm } from 'react-hook-form'
import { Link, useParams } from 'react-router-dom'
import { chevronLeft, edit2 } from 'react-icons-kit/feather'
import { Container } from '../../../components/container'
import { Card } from '../../../components/card/Index'
import { CustomButton } from '../../../components/button'
import { PreLoader } from '../../../components/loading/Index'
import { ImageCard } from '../../../components/image/imageCard'
import { FileUploaderModal } from '../../../components/fileUploader/Index'
import Requests from '../../../utils/Requests/Index'


const CategoryEdit = () => {
    const { register, handleSubmit, errors } = useForm()
    const { id } = useParams()
    const [category, setCategory] = useState(null)
    const [isLoading, setLoading] = useState(true)
    const [isUpdate, setUpdate] = useState({ form: false, image: false })

    const [show, setShow] = useState(false)
    const [image, setImage] = useState(null)
    const [header] = useState({
        headers: { Authorization: "Bearer " + localStorage.getItem('token') }
    })

    // Fetch data
    const fetchData = useCallback(async () => {
        const response = await Requests.University.CategoryShow(id, header)
        if (response) setCategory(response.data)
        setLoading(false)
    }, [id, header])

    useEffect(() => {
        fetchData()
    }, [id, header, fetchData])

    // handle image update
    const handleImageUpdate = async (file) => {
        let formData = new FormData()
        formData.append("image", file)
        setUpdate({ ...isUpdate, image: true })

        await Requests.University.UpdateCategoryImage(id, formData, header)
        setImage(URL.createObjectURL(file))
        setUpdate({ ...isUpdate, image: false })
        setShow(false)
    }

    // Submit Form
    const onSubmit = async (data) => {
        setUpdate({ form: true, image: false })
        await Requests.University.CategoryUpdate(id, data, header)
        setUpdate({ form: false, image: false })
    }

    if (isLoading) return <PreLoader />

    return (
        <div className="pb-4">
            <Container.Fluid>
                <Container.Row>
                    <Container.Column className="col-padding">
                        <Card.Simple className="border-0">
                            <Card.Header className="bg-white border-0 p-3 p-lg-4">
                                <div className="d-flex">
                                    <div><h6 className="mb-0">Edit Category</h6></div>
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
                                            defaultValue={category ? category.name : null}
                                            className="form-control shadow-none"
                                            placeholder="Enter category name"
                                            ref={register({ required: "Name is required" })}
                                        />
                                    </div>

                                    {/* Image show card */}
                                    <div className="form-group mb-4">
                                        <ImageCard
                                            width={200}
                                            height={100}
                                            imgSrc={image || category.image}
                                            imgAlt={"..."}
                                            actionBtn
                                            btnType="edit-btn"
                                            btnIcon={<Icon icon={edit2} size={20} />}
                                            onClick={() => setShow(true)}
                                        />
                                    </div>

                                    <div className="text-right">
                                        <CustomButton
                                            type="submit"
                                            className="btn btn-success border-0 shadow-none"
                                            disabled={isUpdate.form}
                                        >{isUpdate.form ? 'Updating ...' : 'Update'}</CustomButton>
                                    </div>
                                </form>
                            </Card.Body>
                        </Card.Simple>
                    </Container.Column>
                </Container.Row>
            </Container.Fluid>

            {/* Image uploader modal*/}
            <FileUploaderModal
                show={show}
                loading={isUpdate.image}
                title="Change Category Image"
                onHide={() => setShow(false)}
                upload={file => handleImageUpdate(file)}
            />
        </div>
    );
}

export default CategoryEdit;
