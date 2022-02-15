import React, { useState, useEffect, useCallback } from 'react'
import './style.scss'
import HtmlParser from 'react-html-parser'
import { useParams } from 'react-router'
import { Container } from '../../components/container'
import { Card } from '../../components/card/Index'
import { PreLoader } from '../../components/loading/Index'
import { NoContent } from '../../components/204/NoContent'
import { NetworkError } from '../../components/501/NetworkError'
import Requests from '../../utils/Requests/Index'
import ProductMaterial from '../../components/table/ProductMaterial'

const Show = () => {
    const { id } = useParams()
    const [isLoading, setLoading] = useState(true)
    const [isUpdate, setUpdate] = useState(false)
    const [serverError, setServerError] = useState(false)
    const [product, setProduct] = useState({})
    const [header] = useState({
        headers: { Authorization: "Bearer " + localStorage.getItem('token') }
    })

    // Fetch data
    const fetchData = useCallback(async () => {
        try {
            const response = await Requests.Product.Show(id, header)
            if (response && response.status === 200) {
                setProduct(response.data.product)
            }
            setLoading(false)
        } catch (error) {
            if (error) {
                setLoading(false)
                setServerError(true)
            }
        }
    }, [id, header])

    useEffect(() => {
        fetchData()
    }, [id, header, fetchData])


    // Update request status
    const UpdateStatus = async () => {
        try {
            setUpdate(true)
            await Requests.PendingProduct.Update(id, header)
            fetchData()
            setUpdate(false)
        } catch (error) {
            if (error) console.log(error)
        }
    }

    return (
        <div>
            {isLoading && !Object.keys(product).length && !serverError ? <PreLoader /> : null}
            {!isLoading && !Object.keys(product).length && serverError ? <NetworkError message={"Internal Server Error !!!"} /> : null}
            {!isLoading && !Object.keys(product).length && !serverError ? <NoContent /> : null}


            {/* Product container */}
            {!isLoading && !serverError && Object.keys(product).length ?
                <Container.Fluid className="container-fluid specific-product-container">

                    {/* Images section */}
                    <Container.Row>

                        {/* Large image */}
                        <Container.Column className="col-lg-6 col-padding">
                            <Card.Simple className="border-0 shadow-sm">
                                <Card.Body>
                                    <div className="large-image-container">
                                        {product.thumbnail ?
                                            <img src={product.thumbnail.large} className="img-fluid" alt="..." />
                                            : null
                                        }
                                    </div>
                                </Card.Body>
                            </Card.Simple>
                        </Container.Column>

                        {/* Small image */}
                        <Container.Column className="col-lg-6 col-padding pl-lg-0">
                            <Card.Simple className="border-0 shadow-sm">
                                <Card.Body>
                                    <div className="small-image-container p-3 border-bottom">
                                        {product.thumbnail ?
                                            <img src={product.thumbnail.small} className="img-fluid" alt="..." />
                                            : null}
                                    </div>

                                    {/* Additional images */}
                                    <div className="additional-images-container d-flex">

                                        {product.thumbnail && product.thumbnail.additional.map((image, i) =>
                                            <div className="additional-image" key={i}>
                                                <img src={image} className="img-fluid" alt="..." />
                                            </div>
                                        )}

                                    </div>
                                </Card.Body>
                            </Card.Simple>
                        </Container.Column>
                    </Container.Row>

                    {/* Product Info */}
                    <Container.Row className="product-info-section">
                        <Container.Column className="col-padding">
                            <Card.Simple className="border-0 shadow-sm">
                                <Card.Body>
                                    <h5>{product.name || null}</h5>
                                    <div className="d-md-flex">
                                        <div className="flex-fill mb-4 mb-md-0">

                                            {product.vendor ?
                                                <div className="d-flex">
                                                    <div className="pt-1">
                                                        <p className="mb-0">Request status</p>
                                                    </div>
                                                    <div className={product.vendorRequest === "Pending" ? "text-danger px-2 pt-1" : "text-success px-2 pt-1"}>
                                                        <p className="mb-0"><b>{product.vendorRequest}</b></p>
                                                    </div>
                                                    <div className="ml-auto">
                                                        {product.vendorRequest === "Pending" ?
                                                            <button
                                                                type="button"
                                                                className="btn shadow-none btn-success"
                                                                style={{ fontSize: 13, fontWeight: 500, padding: "5px 20px" }}
                                                                disabled={isUpdate}
                                                                onClick={UpdateStatus}
                                                            >{isUpdate ? "Loading..." : "Approve"}</button>
                                                            :
                                                            <button
                                                                type="button"
                                                                className="btn shadow-none btn-danger"
                                                                style={{ fontSize: 13, fontWeight: 500, padding: "5px 20px" }}
                                                                disabled={isUpdate}
                                                                onClick={UpdateStatus}
                                                            >{isUpdate ? "Loading..." : "Cancel"}</button>
                                                        }
                                                    </div>
                                                </div>
                                                : null}

                                            <hr className="my-4" />

                                            <p>Brand <span className="badge-item">{product.brand ? product.brand.name : 'N/A'}</span></p>
                                            <p>Main category <span className="badge-item">{product.mainCategory ? product.mainCategory.name : 'N/A'}</span></p>
                                            <p>Sub category <span className="badge-item">{product.subCategory ? product.subCategory.name : 'N/A'}</span></p>
                                            <p>Leaf category <span className="badge-item">{product.leafCategory ? product.leafCategory.name : 'N/A'}</span></p>

                                            <ul>
                                                <li className={product.isTrending ? "active" : ""}>Trending</li>
                                                <li className={product.newArrivals ? "active" : ""}>New Arrivals</li>
                                                <li className={product.bestSale ? "active" : ""}>Best Sale</li>
                                            </ul>

                                            <ul>
                                                <li className="border-0">Tags</li>
                                                {product.tags && product.tags.map((item, i) =>
                                                    <li key={i} className="active">{item}</li>
                                                )}
                                            </ul>

                                            <ul>
                                                <li className="border-0">Status</li>
                                                <li className={product.isActive ? "active" : "deactive"}>{product.isActive ? 'Activated' : 'Deactivated'}</li>
                                            </ul>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card.Simple>
                        </Container.Column>
                    </Container.Row>

                    {/* Vendor info */}
                    <Container.Row className="vendor-info-section">
                        <Container.Column className="col-padding">
                            <Card.Simple className="border-0 shadow-sm">
                                <Card.Header className="border-0 bg-white pt-4 pb-0">
                                    <h6 className="mb-0">Vendor Info.</h6>
                                </Card.Header>
                                <Card.Body>
                                    {product.vendor ?
                                        <div className="d-sm-flex">
                                            <div className="flex-fill">
                                                <p className="mb-2">Name: <span className="ml-3">{product.vendor.name}</span></p>
                                                <p className="mb-2">E-mail: <span className="text-lowercase ml-3">{product.vendor.email}</span></p>
                                            </div>
                                            <div className="flex-fill">
                                                <p className="mb-2">Phone: <span className="ml-3">{product.vendor.phone}</span></p>
                                                <p className="mb-2">Address: <span className="ml-3">{product.vendor.address}</span></p>
                                            </div>
                                        </div>
                                        : null}
                                </Card.Body>
                            </Card.Simple>
                        </Container.Column>
                    </Container.Row>

                    {/* Product pricing */}
                    <Container.Row className="product-pricing-section">
                        <Container.Column className="col-padding">
                            <Card.Simple className="border-0 shadow-sm">
                                <Card.Body>
                                    <div className="d-md-flex">
                                        <div className="flex-fill mb-4 mb-md-0">
                                            <p>SKU <span className="badge-item">{product.sku ? product.sku : 'N/A'}</span></p>
                                            <p>Stock Amount <span className="badge-item">{product.stockAmount ? product.stockAmount : 'N/A'}</span></p>
                                            <p>Stock Status <span className="badge-item">{product.stockStatus ? product.stockStatus : 'N/A'}</span></p>
                                        </div>
                                        <div className="flex-fill">
                                            <p>Purchase Price <span className="badge-item">{product.purchasePrice ? product.purchasePrice : null} Tk</span></p>
                                            <p>Sale Price <span className="badge-item">{product.salePrice ? product.salePrice : null} Tk</span></p>
                                            <p>Discount type <span className="badge-item">{product.discountType ? product.discountType : 'N/A'}</span></p>
                                            <p>Discount amount <span className="badge-item">
                                                {product.discountAmount ? product.discountAmount : 'N/A'}
                                                {product.discountType && product.discountType === 'Flat' ? 'Tk' :
                                                    product.discountType && product.discountType === 'Percentage' ? '%' : null}
                                            </span></p>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card.Simple>
                        </Container.Column>
                    </Container.Row>


                    {/* Materials section */}
                    {product.materials && product.materials.length ?
                        <Container.Row className="additional-info-section">
                            <Container.Column className="col-padding">
                                <Card.Simple className="border-0 shadow-sm">
                                    <Card.Header className="bg-white border-0">
                                        <h6 className="mb-0">Materials</h6>
                                    </Card.Header>
                                    <Card.Body>
                                        <ProductMaterial data={product.materials} />
                                    </Card.Body>
                                </Card.Simple>
                            </Container.Column>
                        </Container.Row>
                        : null
                    }

                    <Container.Row className="additional-info-section">

                        {/* Additional info */}
                        {product.additionalInfo ?
                            <Container.Column className="col-xl-6 col-padding pr-xl-2">
                                <Card.Simple className="border-0 shadow-sm">
                                    <Card.Header className="bg-white border-0">
                                        <h6 className="mb-0">Additional Info.</h6>
                                    </Card.Header>
                                    <Card.Body className="p-0">
                                        <table className="table table-sm table-borderless">
                                            <thead>
                                                <tr>
                                                    <td>Title</td>
                                                    <td>Value</td>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {product.additionalInfo && product.additionalInfo.map((item, i) =>
                                                    <tr key={i}>
                                                        <td>{item.title}</td>
                                                        <td>{item.value}</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </Card.Body>
                                </Card.Simple>
                            </Container.Column>
                            : null
                        }

                        {/* Video section */}
                        {product.video ?
                            <div className="col-12 col-xl-6 col-padding video-section pl-xl-2">
                                <div className="card border-0 shadow-sm">
                                    <div className="card-body p-0">
                                        <h6 className="p-3 mb-0">Product video</h6>
                                        <div style={{ width: 660, height: 'auto' }}>
                                            <div className="embed-responsive embed-responsive-21by9">
                                                <iframe className="embed-responsive-item" title={product.video} src={product.video} allowFullScreen></iframe>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            : null}
                    </Container.Row>


                    {/* Return replacement warranty & EMI section */}
                    <Container.Row className="return-replacement-warranty-container">

                        {product.returnReplacement && product.returnReplacement.status ?
                            <Container.Column className="col-lg-6 col-padding pr-xl-2">
                                <Card.Simple className="border-0 shadow-sm">
                                    <Card.Header className="bg-white border-0">
                                        <h6 className="mb-0">Return & Replacement Info.</h6>
                                    </Card.Header>
                                    <Card.Body className="pt-2">
                                        <p className="mb-1"><span>Available for:</span> {product.returnReplacement.limit + ' Days'}</p>
                                        <p className="mb-1"><span>Description:</span> {product.returnReplacement.description ? product.returnReplacement.description : 'N/A'}</p>
                                    </Card.Body>
                                </Card.Simple>
                            </Container.Column>
                            : null
                        }

                        {product.warranty && product.warranty.status ?
                            <Container.Column className="col-lg-6 col-padding pr-xl-2">
                                <Card.Simple className="border-0 shadow-sm">
                                    <Card.Header className="bg-white border-0">
                                        <h6 className="mb-0">Warranty Info.</h6>
                                    </Card.Header>
                                    <Card.Body className="pt-2">
                                        <p className="mb-1"><span>Available for:</span>
                                            {product.warranty.day ? product.warranty.day + ' Day' : ''} {product.warranty.month ? product.warranty.month + ' Month' : ''} {product.warranty.year ? product.warranty.year + ' Year' : ''}</p>
                                        <p className="mb-1"><span>Description:</span> {product.warranty.description ? product.warranty.description : 'N/A'}</p>
                                    </Card.Body>
                                </Card.Simple>
                            </Container.Column>
                            : null
                        }

                        {product.emi && product.emi.amount && product.emi.duration ?
                            <Container.Column className="col-padding pr-xl-2">
                                <Card.Simple className="border-0 shadow-sm">
                                    <Card.Header className="bg-white border-0">
                                        <h6 className="mb-0">EMI Info.</h6>
                                    </Card.Header>
                                    <Card.Body className="pt-2">
                                        <p className="mb-1"><span>Amount:</span> {product.emi.amount ? product.emi.amount + ' tk.' : 'N/A'}</p>
                                        <p className="mb-1"><span>Duration:</span> {product.emi.duration ? product.emi.duration + ' Month' : 'N/A'}</p>
                                    </Card.Body>
                                </Card.Simple>
                            </Container.Column>
                            : null
                        }

                    </Container.Row>


                    {/* Description section */}
                    {product.description ?
                        <Container.Row className="description-section">
                            <Container.Column className="col-padding">
                                <Card.Simple className="border-0 shadow-sm">
                                    <Card.Body>
                                        <h6>Description</h6>
                                        {HtmlParser(product.description)}
                                        {product.descriptionImages && product.descriptionImages.length ?
                                            product.descriptionImages.map((item, i) =>
                                                <img src={item} key={i} className="img-fluid" alt="..." />
                                            ) : null
                                        }
                                    </Card.Body>
                                </Card.Simple>
                            </Container.Column>
                        </Container.Row>
                        : null
                    }

                </Container.Fluid>
                : null
            }
        </div>
    );
};

export default Show;
