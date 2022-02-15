import React, { useState, useEffect, useCallback } from 'react'
import './style.scss'
import Icon from 'react-icons-kit'
import { toast } from 'react-toastify'
import { useForm } from 'react-hook-form'
import 'react-toastify/dist/ReactToastify.css'
import { Link, useParams } from 'react-router-dom'
import { chevronLeft, plus } from 'react-icons-kit/feather'
import { PreLoader } from '../../components/loading/Index'
import Requests from '../../utils/Requests/Index'

const Edit = () => {
    const { id } = useParams()
    const { register, handleSubmit, errors } = useForm()
    const [error, setError] = useState(null)
    const [isLoading, setLoading] = useState(true)
    const [update, setUpdate] = useState(false)
    const [brand, setBrand] = useState(null)
    const [selectedFile, setSelectedFile] = useState(null)
    const [header] = useState({
        headers: { Authorization: "Bearer " + localStorage.getItem('token') }
    })

    // Fetch data
    const fetchData = useCallback(async () => {
        const data = await Requests.Brand.Show(id, header)
        if (data) {
            setBrand(data.brand)
            setLoading(false)
        }
        setLoading(false)
    }, [id, header])


    useEffect(() => {
        fetchData()
    }, [id, header, fetchData])


    // Handle image
    const handleImage = async (event) => {
        const file = event.target.files[0]
        if (file) {
            const size = parseInt(file.size) / 1000
            if (size > 100) {
                setError({ ...error, image: 'Select less than 100KB file.' })
                return
            }
            setSelectedFile({ image: file, preview: URL.createObjectURL(file) })
            let formData = new FormData()
            formData.append('image', file)
            setBrand({ ...brand, image: null })
            const response = await Requests.Brand.UpdateImage(id, formData, header)

            if (response.status === true) {
                toast.success(response.message)
            }
        }
    }


    // Submit Form
    const onSubmit = async (data) => {
        setUpdate(true)
        await Requests.Brand.Update(id, data, header)
        return setUpdate(false)
    }

    if (isLoading) return <PreLoader />

    return (
        <div className="store-brand pb-4">

            <div className="container-fluid">
                <div className="row">
                    <div className="col-12 col-padding">
                        <div className="card border-0 shadow-sm">
                            <div className="card-header p-3 p-lg-4 bg-white">
                                <div className="d-flex">
                                    <div><h6 className="mb-0">Edit Brand</h6></div>
                                    <div className="ml-auto">
                                        <Link
                                            to="/dashboard/brand"
                                            type="button"
                                            className="btn shadow-none rounded-circle"
                                        >
                                            <Icon icon={chevronLeft} size={22} />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body p-4">
                                <form onSubmit={handleSubmit(onSubmit)}>

                                    {/* Name */}
                                    <div className="form-group mb-4">
                                        {errors.name && errors.name.message ? (
                                            <p className="text-danger">{errors.name && errors.name.message}</p>
                                        ) : <p>Name</p>}

                                        <input
                                            type="text"
                                            name="name"
                                            defaultValue={brand ? brand.name : null}
                                            className="form-control shadow-none"
                                            placeholder="Enter brand name"
                                            ref={register({
                                                required: "Name is required"
                                            })}
                                        />
                                    </div>

                                    {/* Image upload Container */}
                                    <div className="form-group mb-4">
                                        {error && error.image ? <p className="text-danger">{error.image}</p> : <p>Logo/Image (100x100)</p>}
                                        <div className="d-flex">
                                            {brand && brand.image ?
                                                <div className="img-container text-center mr-2">
                                                    <div className="image border">
                                                        <img src={brand.image} className="img-fluid" alt="..." />
                                                    </div>
                                                </div>
                                                : selectedFile ?
                                                    <div className="img-container text-center mr-2">
                                                        <div className="image border">
                                                            <img src={selectedFile.preview} className="img-fluid" alt="..." />
                                                        </div>
                                                    </div>
                                                    : null}

                                            <div className="img-container text-center">
                                                <div className="image border">
                                                    <input type="file" className="upload" onChange={handleImage} />
                                                    <div className="flex-center flex-column">
                                                        <Icon icon={plus} size={22} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <button type="submit" className="btn shadow-none" disabled={update}>
                                            {update ? 'Updating...' : 'Update'}
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

export default Edit;
