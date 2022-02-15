import React, { useState } from 'react'
import 'react-quill/dist/quill.snow.css'
import Icon from 'react-icons-kit'
import ReactQuill from 'react-quill'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { chevronLeft } from 'react-icons-kit/feather'
import { Container } from '../../../components/container'
import { Card } from '../../../components/card/Index'
import { CustomButton } from '../../../components/button'
import { SearchableSelect } from '../../../components/select'
import { SingleFileUploader } from '../../../components/fileUploader/Index'

import Requests from '../../../utils/Requests/Index'

const Create = () => {
    const { register, handleSubmit, errors } = useForm()
    const [isLoading, setLoading] = useState(false)
    const [text, setText] = useState('Deafult description text')
    const [category, setCategory] = useState({ value: null, error: null })
    const [image, setImage] = useState(null)
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

    // Submit Form
    const onSubmit = async (data) => {
        try {
            if (!category.value) return setCategory({ ...category, error: 'Category is required.' })

            let formData = new FormData()
            formData.append('title', data.title)
            formData.append('category', category.value)
            formData.append('video', data.video)
            formData.append('text', text)
            formData.append('image', image)

            setLoading(true)
            await Requests.University.PostStore(formData, header)
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
                                    <div><h6 className="mb-0">Create Eazybest University Post</h6></div>
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
                                            ref={register({ required: "Title is required" })}
                                        />
                                    </div>

                                    {/* Category */}
                                    <div className="form-group mb-4">
                                        {category.error ? <p className="text-danger">{category.error}</p> : <p>Category</p>}

                                        <SearchableSelect
                                            borderRadius={4}
                                            placeholder="Select category"
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
                                            ref={register()}
                                        />
                                    </div>

                                    {/* File upload */}
                                    <div className="form-group mb-4">
                                        <p>Image</p>
                                        <SingleFileUploader
                                            width={250}
                                            height={100}
                                            limit={500}
                                            dataHandeller={data => setImage(data.image)}
                                        />
                                    </div>

                                    {/* Description */}
                                    <div className="form-group mb-4">
                                        <p>Description</p>
                                        <ReactQuill
                                            theme="snow"
                                            value={text}
                                            onChange={value => setText(value)}
                                            modules={modules}
                                            formats={formats}
                                        />
                                    </div>

                                    <div className="text-right">
                                        <CustomButton
                                            type="submit"
                                            className="btn btn-success border-0 shadow-none"
                                            disabled={isLoading}
                                        >{isLoading ? 'Creating ...' : 'Create'}</CustomButton>
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
