import React, { useState, useEffect, useCallback } from 'react'
import 'react-quill/dist/quill.snow.css'
import Icon from 'react-icons-kit'
import ReactQuill from 'react-quill'
import { useForm } from 'react-hook-form'
import { Link, useParams } from 'react-router-dom'
import { chevronLeft, edit2 } from 'react-icons-kit/feather'
import { Container } from '../../../components/container'
import { Card } from '../../../components/card/Index'
import { CustomButton } from '../../../components/button'
import { ImageCard } from '../../../components/image/imageCard'
import { FileUploaderModal } from '../../../components/fileUploader/Index'
import { SearchableSelect } from '../../../components/select'
import { PreLoader } from '../../../components/loading/Index'
import Requests from '../../../utils/Requests/Index'



const CategoryEdit = () => {
    const { register, handleSubmit, errors } = useForm()
    const { id } = useParams()
    const [post, setPost] = useState(null)
    const [text, setText] = useState(null)
    const [category, setCategory] = useState({ value: null, error: false })
    const [image, setImage] = useState({ value: null, show: false })

    const [isLoading, setLoading] = useState(true)
    const [isUpdate, setUpdate] = useState({ form: false, image: false })
    const [header] = useState({
        headers: { Authorization: "Bearer " + localStorage.getItem('token') }
    })

    const modules = {
        toolbar: [
            [{ 'header': [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
            ['link'],
            ['clean']
        ],
    }

    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link'
    ]

    // Fetch data
    const fetchData = useCallback(async () => {
        const response = await Requests.University.PostShow(id, header)
        if (response) {
            setPost(response.data)
            setText(response.data.description)
            setCategory(exCat => ({ ...exCat, value: response.data.category }))
        }
        setLoading(false)
    }, [id, header])

    useEffect(() => {
        fetchData()
    }, [id, header, fetchData])

    // Handle search category
    const handleSearchCategory = async (inputValue) => {
        let results = []
        const response = await Requests.University.CategorySearch(inputValue, header)

        if (response.data && response.data.length) {
            for (let i = 0; i < response.data.length; i++) {
                const element = response.data[i]
                results.push({
                    value: element._id,
                    label: element.name
                })
            }
        }

        return results
    }

    // handle image update
    const handleImageUpdate = async (file) => {
        let formData = new FormData()
        formData.append("image", file)
        setUpdate({ ...isUpdate, image: true })

        await Requests.University.UpdatePostImage(id, formData, header)
        setImage({ ...image, value: URL.createObjectURL(file) })
        setUpdate({ ...isUpdate, image: false })
    }

    // Submit Form
    const onSubmit = async (data) => {
        try {
            if (!category.value) return setCategory({ ...category, error: "Category is required." })

            setUpdate({ form: true, image: false })
            const formData = {
                ...data,
                category: post.category._id,
                text: text
            }

            await Requests.University.PostUpdate(id, formData, header)
            setUpdate({ form: false, image: false })
        } catch (error) {
            if (error) console.log(error)
        }
    }

    if (isLoading) return <PreLoader />

    return (
        <div className="pb-4">
            <Container.Fluid>
                <Container.Row>
                    <Container.Column className="col-padding">
                        <Card.Simple className="bg-white border-0">
                            <Card.Header className="bg-white border-0 p-3 p-lg-4">
                                <div className="d-flex">
                                    <div><h6 className="mb-0">Edit Post</h6></div>
                                    <div className="ml-auto">
                                        <Link to="/dashboard/university/post">
                                            <CustomButton className="btn-primary border-0 rounded-circle circle__padding">
                                                <Icon icon={chevronLeft} size={22} />
                                            </CustomButton>
                                        </Link>
                                    </div>
                                </div>
                            </Card.Header>
                            <Card.Body className="px-4 pt-0">
                                <form onSubmit={handleSubmit(onSubmit)}>

                                    {/* Title */}
                                    <div className="form-group mb-4">
                                        {errors.title && errors.title.message ? (
                                            <p className="text-danger">{errors.title && errors.title.message}</p>
                                        ) : <p>Title</p>}

                                        <input
                                            type="text"
                                            name="title"
                                            className="form-control shadow-none"
                                            placeholder="Enter post title"
                                            defaultValue={post.title}
                                            ref={register({ required: "Title is required" })}
                                        />
                                    </div>

                                    {/* Category */}
                                    <div className="form-group mb-4">
                                        {category.error ? <p className="text-danger">{category.error}</p> : <p>Category</p>}

                                        <SearchableSelect
                                            borderRadius={4}
                                            placeholder="Select category"
                                            defaultValue={{ label: post.category.name, value: post.category._id }}
                                            search={inputValue => handleSearchCategory(inputValue)}
                                            values={(event) => setCategory({ ...category, value: event.value, error: false })}
                                        />
                                    </div>

                                    {/* Video */}
                                    <div className="form-group mb-4">
                                        <p>Video</p>

                                        <input
                                            type="text"
                                            name="video"
                                            className="form-control shadow-none"
                                            placeholder="Enter video link"
                                            defaultValue={post.video}
                                            ref={register()}
                                        />
                                    </div>

                                    {/* File upload */}
                                    <div className="form-group mb-4">
                                        <ImageCard
                                            width={200}
                                            height={100}
                                            imgSrc={image.value || post.image}
                                            imgAlt={"..."}
                                            actionBtn
                                            btnType="edit-btn"
                                            btnIcon={<Icon icon={edit2} size={20} />}
                                            onClick={() => setImage({ ...image, show: true })}
                                        />
                                    </div>

                                    {/* Description */}
                                    <div className="form-group mb-4">
                                        <p>Description</p>
                                        <ReactQuill
                                            theme="snow"
                                            value={text}
                                            modules={modules}
                                            formats={formats}
                                            onChange={value => setText(value)}
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
                show={image.show}
                loading={isUpdate.image}
                title="Change Post Image"
                onHide={() => setImage({ ...image, show: false })}
                upload={file => handleImageUpdate(file)}
            />
        </div>
    );
}

export default CategoryEdit;
