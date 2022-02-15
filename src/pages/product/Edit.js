import React, { useState, useCallback, useEffect, useRef } from 'react'
import './style.scss'
import 'react-toastify/dist/ReactToastify.css'
import Select from 'react-select'
import { Form } from 'react-bootstrap'
import { Icon } from 'react-icons-kit'
import { useForm } from 'react-hook-form'
import { Link, useParams } from 'react-router-dom'
import { chevronLeft, plus, trash2 } from 'react-icons-kit/feather'
import { DeleteModal } from '../../components/modal/Delete'
import { SingleFileUploader } from '../../components/fileUploader/Index'
import { PreLoader } from '../../components/loading/Index'

import CreatableSelect from 'react-select/creatable'
import Requests from '../../utils/Requests/Index'
import ProductMaterialEditInput from '../../components/form/product/MaterialEdit'
import ProductAdditionalEditInput from '../../components/form/product/AdditionalEdit'
import ReturnPolicy from '../../components/form/product/ReturnPolicy'
import Warranty from '../../components/form/product/Warranty'
import Emi from '../../components/form/product/Emi'
import DescriptionEditInput from '../../components/form/product/DescriptionEdit'

const Edit = () => {
    const { register, handleSubmit, setError, clearErrors, errors } = useForm()
    const { id } = useParams()
    const subCatRefs = useRef()
    const leafCatRefs = useRef()
    const [error, setErrors] = useState({})
    const [isUpdate, setUpdate] = useState(false)
    const [isLoading, setLoading] = useState(true)
    const [isDelete, setDelete] = useState({ file: null, show: false, loading: false })

    const [product, setProduct] = useState({})
    const [vendors, setVendors] = useState([])
    const [brands, setBrands] = useState([])

    const [categories, setCategories] = useState({ options: [] })
    const [subCategories, setSubCategories] = useState({ options: [] })
    const [leafCategories, setLeafCategories] = useState({ options: [] })

    const [thumbnail, setThumbnail] = useState({ preview: null, isUpload: false })
    const [additinalImages, setAdditionalImages] = useState([])
    const [additionalUpload, setAdditionalUpload] = useState(false)
    const [descriptionImage, setDescriptionImage] = useState({ value: null, loading: false, error: null })
    const [header] = useState({
        headers: { Authorization: "Bearer " + localStorage.getItem('token') }
    })

    // Get Data 
    const getData = useCallback(async () => {
        const response = await Requests.Options.Index(header)
        if (response) {
            setCategories(exCategory => ({ ...exCategory, options: response.mainCategories }))
            setBrands(response.brands)
            setVendors(response.vendors)
        }

        const productResponse = await Requests.Product.Show(id, header)
        if (productResponse && productResponse.status === 200) {
            setProduct(productResponse.data.product)
            setAdditionalImages(productResponse.data.product.thumbnail.additional)
        }
        setLoading(false)
    }, [id, header])

    useEffect(() => {
        getData()
    }, [id, header, getData])

    // Handle main category
    const handleMainCategory = event => {
        const value = event.value
        const children = event.child
        subCatRefs.current.select.clearValue()
        leafCatRefs.current.select.clearValue()
        setProduct({ ...product, mainCategory: value, subCategory: null, leafCategory: null })

        if (children && children.length) {
            setSubCategories(exChildren => ({ ...exChildren, options: children }))
        } else {
            setSubCategories(exChildren => ({
                ...exChildren,
                options: []
            }))
        }
    }

    // Handle sub category
    const handleSubCategory = event => {
        if (event) {
            const value = event.value
            const children = event.child
            leafCatRefs.current.select.clearValue()
            setProduct({ ...product, subCategory: value, leafCategory: null })

            if (children && children.length) {
                setLeafCategories(exChildren => ({ ...exChildren, options: children }))
            } else {
                setLeafCategories(exChildren => ({
                    ...exChildren,
                    options: []
                }))
            }
        }
    }

    // Handle leaf category
    const handleLeafCategory = event => {
        if (event) setProduct({ ...product, leafCategory: event.value })
    }

    // Thumbnail handeller
    const thumbnailHandeller = async (event) => {
        let file = event.target.files[0]
        if (file) {
            setThumbnail({ preview: URL.createObjectURL(file), isUpload: true })

            let formData = new FormData()
            formData.append('image', file)

            await Requests.Product.UpdateThumb(id, formData, header)
            setThumbnail({ preview: URL.createObjectURL(file), isUpload: false })
        }
    }

    // Additinal Image handeller
    const additionalImageHandeller = async (event) => {
        const file = event.target.files[0]
        const fileURl = URL.createObjectURL(file)
        if (file) {
            setAdditionalImages([...additinalImages, fileURl])
            setAdditionalUpload(true)

            let formData = new FormData()
            formData.append('image', file)

            await Requests.Product.AddThumb(id, formData, header)
            setAdditionalUpload(false)
        }
    }

    // get additional info data
    const getAdditional = data => setProduct({ ...product, additionalInfo: data })

    // get material info data
    const getMaterial = data => setProduct({ ...product, materials: data })

    // get description data
    const getDescription = data => setProduct({ ...product, description: data })

    // Handle return & replacement
    const handleReturnReplacement = data => {
        if (data.status) {
            setProduct({ ...product, returnReplacement: { ...product.returnReplacement, status: data.status } })
        } else {
            setProduct({ ...product, returnReplacement: { ...product.returnReplacement, status: false, limit: null, description: null, limitError: null } })
        }
        if (data.limit) setProduct({ ...product, returnReplacement: { ...product.returnReplacement, limit: data.limit, limitError: null } })
        if (data.description) setProduct({ ...product, returnReplacement: { ...product.returnReplacement, description: data.description } })
    }

    // Handle warranty
    const handleWarranty = data => {
        if (data.status) {
            setProduct({ ...product, warranty: { ...product.warranty, status: data.status } })
        } else {
            setProduct({ ...product, warranty: { ...product.warranty, status: null, day: null, month: null, year: null, description: null, error: null } })
        }

        if (data.day) setProduct({ ...product, warranty: { ...product.warranty, day: data.day, error: null } })
        if (data.month) setProduct({ ...product, warranty: { ...product.warranty, month: data.month, error: null } })
        if (data.year) setProduct({ ...product, warranty: { ...product.warranty, year: data.year, error: null } })
        if (data.description) setProduct({ ...product, warranty: { ...product.warranty, description: data.description } })
    }

    // Handle EMI
    const handleEMI = data => {
        if (data.amount) setProduct({ ...product, emi: { ...product.emi, amount: parseInt(data.amount) } })
        if (data.duration) setProduct({ ...product, emi: { ...product.emi, duration: data.duration } })
    }

    // Upload description images
    const uploadDescriptionImages = async (data) => {
        setDescriptionImage({
            ...descriptionImage,
            loading: true,
            value: data.image || null,
            error: data.error || null
        })

        const formData = new FormData()
        formData.append('image', data.image)

        await Requests.Product.UploadDescImage(id, formData, header)
        setDescriptionImage({
            ...descriptionImage,
            loading: false
        })
    }

    // Submit form
    const onSubmit = async (data) => {

        if (!product.vendor) return setErrors({ ...error, vendor: 'Vendor is required.' })
        if (!product.mainCategory) return setErrors({ ...error, mainCategory: 'Main category is required.' })
        if (!product.tags.length) return setErrors({ ...error, tags: 'Tags is required.' })
        if (product.returnReplacement.status && !product.returnReplacement.limit) {
            return setProduct({ ...product, warranty: { ...product.warranty, limitError: true } })
        }
        // if (product.warranty.status && !product.warranty.day) {
        //     return setProduct({ ...product, warranty: { ...product.warranty, error: true } })
        // }

        if (parseInt(data.salePrice) <= parseInt(data.purchasePrice)) {
            setError("salePrice", {
                type: "manual",
                message: "Sale price must be greater than purchase price"
            })
            return
        } else {
            clearErrors("salePrice")
        }

        const newProduct = {
            ...data,
            vendor: product.vendor._id || product.vendor,
            brand: product.brand && product.brand._id ? product.brand._id : product.brand,

            mainCategory: product.mainCategory._id || product.mainCategory,
            subCategory: product.subCategory ? product.subCategory._id || product.subCategory : null,
            leafCategory: product.leafCategory ? product.leafCategory._id || product.leafCategory : null,

            isTrending: product.isTrending,
            newArrivals: product.newArrivals,
            bestSale: product.bestSale,
            tags: product.tags,
            materials: JSON.stringify(product.materials),
            additionalInfo: product.additionalInfo,
            description: product.description,
            returnReplacement: {
                status: product.returnReplacement.status,
                limit: product.returnReplacement.limit,
                description: product.returnReplacement.description
            },
            warranty: {
                status: product.warranty.status,
                day: product.warranty.day,
                month: product.warranty.month,
                year: product.warranty.year,
                description: product.warranty.description
            },
            emi: {
                amount: product.emi.amount,
                duration: product.emi.duration
            }
        }

        setUpdate(true)
        await Requests.Product.Update(id, newProduct, header)
        setUpdate(false)
    }

    // Submit to delete thumb
    const deleteThumb = async () => {
        setDelete({ ...isDelete, loading: true })
        const fileArr = isDelete.file.split('/')
        const file = fileArr.pop()

        const nonDeleteFiles = await additinalImages.filter(item => item !== isDelete.file)
        setAdditionalImages(nonDeleteFiles)

        await Requests.Product.RemoveAdditionalThumb(id, file, header)
        setDelete({ file: null, show: false, loading: false })
    }

    if (isLoading) return <PreLoader />

    return (
        <div className="edit-product">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12 col-padding">
                        <div className="card border-0 shadow-sm">
                            <div className="card-header p-3 p-lg-4 bg-white">
                                <div className="d-flex">
                                    <div><h6 className="mb-0">Edit product</h6></div>
                                    <div className="ml-auto">
                                        <Link
                                            to="/dashboard/product"
                                            type="button"
                                            className="btn shadow-none rounded-circle"
                                        >
                                            <Icon icon={chevronLeft} size={22} />
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {/* Update form */}
                            <div className="card-body p-4">
                                <form onSubmit={handleSubmit(onSubmit)}>

                                    <div className="row">

                                        {/* Name */}
                                        <div className="col-12">
                                            <div className="form-group mb-4">
                                                {errors.name && errors.name.message ? (
                                                    <p className="text-danger">{errors.name && errors.name.message}</p>
                                                ) : <p>Product name</p>}

                                                <input
                                                    type="text"
                                                    name="name"
                                                    defaultValue={product.name || null}
                                                    className="form-control shadow-none"
                                                    placeholder="Enter product name"
                                                    ref={register({
                                                        required: "Product name is required"
                                                    })}
                                                />
                                            </div>
                                        </div>

                                        {/* Product bengali name */}
                                        {/* <div className="col-12">
                                            <div className="form-group mb-4">
                                                {errors.bn_name && errors.bn_name.message ? (
                                                    <p className="text-danger">{errors.bn_name && errors.bn_name.message}</p>
                                                ) : <p>Product name (EN)</p>}

                                                <input
                                                    type="text"
                                                    name="bn_name"
                                                    defaultValue={product.bn_name || null}
                                                    className="form-control shadow-none"
                                                    placeholder="Enter product bengali name"
                                                    // ref={register({
                                                    //     required: "Product name is required"
                                                    // })}
                                                />
                                            </div>
                                        </div> */}

                                        {/* Vendor */}
                                        <div className="col-12">
                                            <div className="form-group mb-4">
                                                {error.vendor ?
                                                    <p className="text-danger">{error.vendor}</p>
                                                    : <p>Vendor / Publisher</p>}

                                                <Select
                                                    defaultValue={{ value: product.vendor._id, label: product.vendor.name }}
                                                    classNamePrefix="custom-select"
                                                    styles={customStyles}
                                                    placeholder={'Select vendor'}
                                                    components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
                                                    options={vendors}
                                                    onChange={(event) => setProduct({ ...product, vendor: event.value })}
                                                />
                                            </div>
                                        </div>

                                        {/* Brand */}
                                        <div className="col-12">
                                            <div className="form-group mb-4">
                                                <p>Brand / Author</p>

                                                <Select
                                                    defaultValue={product.brand ? { value: product.brand._id, label: product.brand.name } : null}
                                                    classNamePrefix="custom-select"
                                                    styles={customStyles}
                                                    placeholder={'Select brand'}
                                                    components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
                                                    options={brands}
                                                    onChange={(event) => setProduct({ ...product, brand: event.value })}
                                                />
                                            </div>
                                        </div>

                                        {/* Main Category */}
                                        <div className="col-12 col-lg-4">
                                            <div className="form-group mb-4">
                                                {error.mainCategory ?
                                                    <p className="text-danger">{error.mainCategory}</p>
                                                    : <p>Main category</p>}

                                                <Select
                                                    defaultValue={product.mainCategory ? { value: product.mainCategory._id, label: product.mainCategory.name } : null}
                                                    classNamePrefix="custom-select"
                                                    styles={customStyles}
                                                    placeholder={'Select main category'}
                                                    components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
                                                    options={categories.options}
                                                    onChange={handleMainCategory}
                                                />
                                            </div>
                                        </div>

                                        {/* Sub Category */}
                                        <div className="col-12 col-lg-4">
                                            <div className="form-group mb-4">
                                                <p>Sub category</p>

                                                <Select
                                                    ref={subCatRefs}
                                                    defaultValue={product.subCategory ? { value: product.subCategory._id, label: product.subCategory.name } : null}
                                                    classNamePrefix="custom-select"
                                                    styles={customStyles}
                                                    placeholder={'Select sub category'}
                                                    components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
                                                    options={subCategories.options}
                                                    onChange={handleSubCategory}
                                                />
                                            </div>
                                        </div>

                                        {/* Leaf Category */}
                                        <div className="col-12 col-lg-4">
                                            <div className="form-group mb-4">
                                                <p>Leaf category</p>

                                                <Select
                                                    ref={leafCatRefs}
                                                    defaultValue={product.leafCategory ? { value: product.leafCategory._id, label: product.leafCategory.name } : null}
                                                    classNamePrefix="custom-select"
                                                    styles={customStyles}
                                                    placeholder={'Select leaf category'}
                                                    components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
                                                    options={leafCategories.options}
                                                    onChange={handleLeafCategory}
                                                />
                                            </div>
                                        </div>

                                        {/* Trending item */}
                                        <div className="col-12 col-lg-4">
                                            <div className="input-group mb-3">
                                                <Form.Group controlId="trendingItem">
                                                    <Form.Check
                                                        type="checkbox"
                                                        label="Tranding Item"
                                                        checked={product.isTrending}
                                                        onChange={() => setProduct({ ...product, isTrending: !product.isTrending })}
                                                    />
                                                </Form.Group>
                                            </div>
                                        </div>

                                        {/* New Arrivals */}
                                        <div className="col-12 col-lg-4">
                                            <div className="input-group mb-3">
                                                <Form.Group controlId="newArrival">
                                                    <Form.Check
                                                        type="checkbox"
                                                        label="New Arrivals"
                                                        checked={product.newArrivals}
                                                        onChange={() => setProduct({ ...product, newArrivals: !product.newArrivals })}
                                                    />
                                                </Form.Group>
                                            </div>
                                        </div>

                                        {/* Best Sale */}
                                        <div className="col-12 col-lg-4">
                                            <div className="input-group mb-3">
                                                <Form.Group controlId="bestSale">
                                                    <Form.Check
                                                        type="checkbox"
                                                        label="Best Sale"
                                                        checked={product.bestSale}
                                                        onChange={() => setProduct({ ...product, bestSale: !product.bestSale })}
                                                    />
                                                </Form.Group>
                                            </div>
                                        </div>

                                        {/* Tags */}
                                        <div className="col-12 col-lg-4">
                                            <div className="form-group mb-4">
                                                {error.tags ?
                                                    <p className="text-danger">{error.tags}</p>
                                                    : <p>Tags</p>}

                                                <CreatableSelect
                                                    defaultValue={product.tags ? product.tags.map(item => ({ value: item, label: item })) : null}
                                                    classNamePrefix="custom-select"
                                                    isMulti
                                                    styles={customStyles}
                                                    placeholder={'Enter tags'}
                                                    components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
                                                    onChange={(event) => setProduct({ ...product, tags: event.map(item => item.value) })}
                                                />
                                            </div>
                                        </div>

                                        {/* SKU */}
                                        <div className="col-12 col-lg-4">
                                            <div className="form-group mb-4">
                                                {errors.sku && errors.sku.message ? (
                                                    <p className="text-danger">{errors.sku && errors.sku.message}</p>
                                                ) : <p>Product SKU</p>}

                                                <input
                                                    type="text"
                                                    name="sku"
                                                    defaultValue={product.sku}
                                                    className="form-control shadow-none"
                                                    placeholder="Enter SKU"
                                                    ref={register({
                                                        required: "SKU is required"
                                                    })}
                                                />
                                            </div>
                                        </div>

                                        {/* Stock amount */}
                                        <div className="col-12 col-lg-4">
                                            <div className="form-group mb-4">
                                                {errors.stockAmount && errors.stockAmount.message ? (
                                                    <p className="text-danger">{errors.stockAmount && errors.stockAmount.message}</p>
                                                ) : <p>Stock amount</p>}

                                                <input
                                                    type="number"
                                                    name="stockAmount"
                                                    defaultValue={product.stockAmount}
                                                    className="form-control shadow-none"
                                                    placeholder="Enter stock name"
                                                    ref={register({
                                                        required: "Stock amount is required",
                                                        pattern: {
                                                            value: /^\d+$/,
                                                            message: "The amount must be in number."
                                                        }
                                                    })}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Pricing */}
                                    <div className="container-fluid pricing-container mb-4">
                                        <div className="row">
                                            <div className="col-12 py-3 mb-3 border-bottom">
                                                <h6 className="mb-0">Pricing</h6>
                                            </div>

                                            {/* Purchase price */}
                                            <div className="col-12 col-lg-6">
                                                <div className="form-group mb-4">
                                                    {errors.purchasePrice && errors.purchasePrice.message ? (
                                                        <p className="text-danger">{errors.purchasePrice && errors.purchasePrice.message}</p>
                                                    ) : <p>Purchase price</p>}

                                                    <input
                                                        type="number"
                                                        name="purchasePrice"
                                                        defaultValue={product.purchasePrice}
                                                        className="form-control shadow-none"
                                                        placeholder="Enter purchase price"
                                                        ref={register({
                                                            required: "Purchase price is required",
                                                            pattern: {
                                                                value: /^\d+$/,
                                                                message: "Price must be in number."
                                                            }
                                                        })}
                                                    />
                                                </div>
                                            </div>

                                            {/* Sale Price */}
                                            <div className="col-12 col-lg-6">
                                                <div className="form-group mb-4">
                                                    {errors.salePrice && errors.salePrice.message ? (
                                                        <p className="text-danger">{errors.salePrice && errors.salePrice.message}</p>
                                                    ) : <p>Sale price</p>}

                                                    <input
                                                        type="number"
                                                        name="salePrice"
                                                        defaultValue={product.salePrice}
                                                        className="form-control shadow-none"
                                                        placeholder="Enter sale price"
                                                        ref={register({
                                                            required: "Sale price is required",
                                                            pattern: {
                                                                value: /^\d+$/,
                                                                message: "Price must be in number."
                                                            }
                                                        })}
                                                    />
                                                </div>
                                            </div>

                                            {/* Discount type */}
                                            <div className="col-12 col-lg-6">
                                                <div className="form-group mb-4">
                                                    <p>Discount Type</p>

                                                    <select
                                                        name="discountType"
                                                        className="form-control shadow-none"
                                                        ref={register()}
                                                        defaultValue={product.discountType}
                                                    >
                                                        <option value="">Select type</option>
                                                        <option value="Flat">Flat</option>
                                                        <option value="Percentage">Percentage</option>
                                                    </select>
                                                </div>
                                            </div>

                                            {/* Discount Amount */}
                                            <div className="col-12 col-lg-6">
                                                <div className="form-group mb-4">
                                                    <p>Discount Amount</p>

                                                    <input
                                                        type="number"
                                                        name="discountAmount"
                                                        placeholder="Enter amount"
                                                        className="form-control shadow-none"
                                                        defaultValue={product.discountAmount}
                                                        ref={register()}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* <ProductMaterialEditInput
                                        value={product.materials}
                                        update={getMaterial}
                                    /> */}

                                    <ProductAdditionalEditInput
                                        value={product.additionalInfo}
                                        update={getAdditional}
                                    />

                                    {/* <ReturnPolicy
                                        data={handleReturnReplacement}
                                        deafult={product.returnReplacement}
                                        error={product.returnReplacement && product.returnReplacement.limitError ? product.returnReplacement.limitError : null}
                                    /> */}

                                    {/* <Warranty
                                        data={handleWarranty}
                                        deafult={product.warranty}
                                        error={product.warranty && product.warranty.error ? product.warranty.error : null}
                                    /> */}

                                    {/* <Emi
                                        deafult={product.emi}
                                        data={handleEMI}
                                    /> */}

                                    <DescriptionEditInput
                                        value={product.description}
                                        update={getDescription}
                                    />
                                    {/* <div className="form-group">
                                        <label>Example textarea</label>
                                        <textarea
                                            name="description"
                                            className="form-control"
                                            // id="exampleFormControlTextarea1"
                                            defaultValue={product.description}
                                            rows="3"
                                            ref={register()}
                                        />
                                    </div> */}

                                    {/* Description file upload */}
                                    {/* <div className="d-flex flex-wrap">
                                        {product.descriptionImages && product.descriptionImages.length ?
                                            product.descriptionImages.map((item, i) =>
                                                <div
                                                    key={i}
                                                    className="border mr-1 mb-1"
                                                    style={{ width: 150, height: 150 }}
                                                >
                                                    <img src={item} className="img-fluid" alt="..." />
                                                </div>
                                            ) : null
                                        }

                                        <div>
                                            <SingleFileUploader
                                                width={150}
                                                height={150}
                                                limit={8192}
                                                error={descriptionImage.error}
                                                loading={descriptionImage.loading}
                                                dataHandeller={uploadDescriptionImages}
                                            />
                                        </div>
                                    </div> */}

                                    {/* Video */}
                                    <div className="row mb-2 mb-lg-3">
                                        <div className="col-12">
                                            <div className="form-group mb-4">
                                                <p>Video Link</p>

                                                <input
                                                    type="text"
                                                    name="video"
                                                    className="form-control shadow-none"
                                                    defaultValue={product.video || null}
                                                    placeholder="https://www.youtube.com/embed/Fm2TH7e93ug"
                                                    ref={register()}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Thumbnail upload & preview Container */}
                                    <div className="row mb-3 mb-lg-4">
                                        <div className="col-12">
                                            <div className="d-flex">
                                                {/* image preview */}
                                                {product.thumbnail || thumbnail.preview ?
                                                    <div className="thumbnail-container text-center">
                                                        <div className="image border">
                                                            <img src={thumbnail.preview || product.thumbnail.small} className="img-fluid" alt="..." />

                                                            {/* Loading overlay */}
                                                            {thumbnail.isUpload ?
                                                                <div className="thumbnail-overlay flex-center flex-column">
                                                                    <div className="loader"></div>
                                                                </div>
                                                                : null}
                                                        </div>
                                                    </div>
                                                    : null}

                                                {!thumbnail.isUpload ?
                                                    <div className="thumbnail-container">
                                                        <div className="image border">
                                                            <input
                                                                type="file"
                                                                accept=".jpg, .png, .jpeg"
                                                                className="upload"
                                                                onChange={thumbnailHandeller}
                                                            />
                                                            <div className="flex-center flex-column">
                                                                <Icon icon={plus} size={22} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    : null}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Additional images upload & preview Container */}
                                    <div className="row mb-3 mb-lg-4">
                                        <div className="col-12">
                                            <div className="d-flex flex-wrap">

                                                {/* image preview */}
                                                {additinalImages && additinalImages.map((file, i) =>
                                                    <div className="thumbnail-container text-center" key={i}>
                                                        <div className="image border">
                                                            <img src={file} className="img-fluid" alt="..." />
                                                        </div>
                                                        {additionalUpload ?
                                                            <div className="thumbnail-overlay flex-center flex-column">
                                                                <div className="loader"></div>
                                                            </div>
                                                            : null}

                                                        {/* File delete button */}
                                                        <button
                                                            type="button"
                                                            className="btn shadow-sm rounded-circle"
                                                            onClick={() => setDelete({ file: file, show: true, loading: false })}
                                                        >
                                                            <Icon icon={trash2} size={23} />
                                                        </button>
                                                    </div>
                                                )}

                                                {!additionalUpload ?
                                                    <div className="thumbnail-container">
                                                        <div className="image border">
                                                            <input
                                                                type="file"
                                                                accept=".jpg, .png, .jpeg"
                                                                className="upload"
                                                                onChange={additionalImageHandeller}
                                                            />
                                                            <div className="flex-center flex-column">
                                                                <Icon icon={plus} size={22} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    : null}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Submit button */}
                                    <div className="row">
                                        <div className="col-12 text-right">
                                            <button type="submit" className="btn shadow-none" disabled={isUpdate}>
                                                {isUpdate ? 'Updating...' : 'Update Product'}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete confirmation */}
            <DeleteModal
                show={isDelete.show}
                loading={isDelete.loading}
                message={
                    <div>
                        <h6>Want to delete this image ?</h6>
                        <img src={isDelete.file ? isDelete.file : null} className="img-fluid" height={150} alt="product" />
                    </div>
                }
                onHide={() => setDelete({ file: null, show: false, loading: false })}
                doDelete={deleteThumb}
            />
        </div>
    );
};

export default Edit;

const customStyles = {
    control: (provided, state) => ({
        ...provided,
        minHeight: 42,
        fontSize: 14,
        color: '#000',
        boxShadow: 'none', '&:hover': { borderColor: '1px solid #ced4da' },
        border: state.isFocused ? '1px solid #dfdfdf' : '1px solid #ced4da',
        borderRadius: 4
    })
}