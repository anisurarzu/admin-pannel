import React, { useState, useEffect, useCallback } from 'react'
import Icon from 'react-icons-kit'
import { useForm } from 'react-hook-form'
import { Link, useParams } from 'react-router-dom'
import { chevronLeft, edit2 } from 'react-icons-kit/feather'
import { Container } from '../../components/container'
import { Card } from '../../components/card/Index'
import { CustomButton } from '../../components/button'
import { FileUploaderModal } from '../../components/fileUploader/Index'
import { ImageCard } from '../../components/image/imageCard'
import { PreLoader } from '../../components/loading/Index'
import { useWindowSize } from '../../components/window/windowSize'
import Requests from '../../utils/Requests/Index'

const Edit = () => {
    const { register, handleSubmit, errors } = useForm()
    const size = useWindowSize()
    const { id, type } = useParams()
    const [show, setShow] = useState(false)
    const [isLoading, setLoading] = useState(true)
    const [data, setData] = useState(null)
    const [image, setImage] = useState(null)
    const [isUpdate, setUpdate] = useState({ form: false, image: false })
    const [header] = useState({
        headers: { Authorization: "Bearer " + localStorage.getItem('token') }
    })

    // Fetch data
    const fetchData = useCallback(async () => {
        const response = await Requests.Category.Show(id, type, header)
        if (response) {
            setData(response.data)
            setLoading(false)
        }
        setLoading(false)
    }, [id, type, header])

    useEffect(() => {
        fetchData()
    }, [id, type, header, fetchData])

    // handle banner update
    const handleBannerUpdate = async (file) => {
        let formData = new FormData()
        formData.append("image", file)
        setUpdate({ ...isUpdate, image: true })

        await Requests.Category.UpdateImage(id, type, formData, header)
        setImage(URL.createObjectURL(file))
        setUpdate({ ...isUpdate, image: false })
        setShow(false)
    }

    // Submit Form
    const onSubmit = async (data) => {
        setUpdate({ ...isUpdate, form: true })
        await Requests.Category.Update(id, type, data, header)
        setUpdate({ ...isUpdate, form: false })
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
                                            defaultValue={data.name}
                                            ref={register({ required: "Name is required" })}
                                        />
                                    </div>

                                    {/* Image show card */}
                                    <ImageCard
                                        width={size.width >= 576 ? 300 : "100%"}
                                        height={150}
                                        imgSrc={image || data.image}
                                        imgAlt={"..."}
                                        actionBtn
                                        btnType="edit-btn"
                                        btnIcon={<Icon icon={edit2} size={20} />}
                                        onClick={() => setShow(true)}
                                    />

                                    {/* Submit button */}
                                    <Container.Row>
                                        <Container.Column className="text-right pt-4">
                                            <CustomButton
                                                type="submit"
                                                className="btn-primary border-0"
                                                disabled={isUpdate.form}
                                            >{isUpdate.form ? "Updating ..." : "Update"}</CustomButton>
                                        </Container.Column>
                                    </Container.Row>
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
                title="Change Category Banner"
                onHide={() => setShow(false)}
                upload={file => handleBannerUpdate(file)}
            />
        </div>
    );
}

export default Edit;
