import React, { useCallback, useState, useEffect } from 'react'
import Icon from 'react-icons-kit'
import { Form } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { useParams } from 'react-router'
import { Link } from 'react-router-dom'
import { chevronLeft } from 'react-icons-kit/feather'

import { Container } from '../../components/container'
import { Card } from '../../components/card/Index'
import { CustomButton } from '../../components/button'
import { PreLoader } from '../../components/loading/Index'
import { NoContent } from '../../components/204/NoContent'
import { NetworkError } from '../../components/501/NetworkError'
import Requests from '../../utils/Requests/Index'


const EditSlug = () => {
    const { id } = useParams()
    const { register, handleSubmit, errors } = useForm()
    const [data, setData] = useState({})
    const [show, setShow] = useState(false)
    const [isUpdate, setUpdate] = useState(false)
    const [isLoading, setLoading] = useState(true)
    const [serverErr, setServerErr] = useState(false)
    const [header] = useState({
        headers: { Authorization: "Bearer " + localStorage.getItem('token') }
    })

    // Fetch Data 
    const fetchData = useCallback(async () => {
        try {
            const response = await Requests.Product.Show(id, header)
            if (response && response.status === 200) {
                setData(response.data.product)
            }
            setLoading(false)
        } catch (error) {
            if (error) {
                setLoading(false)
                setServerErr(true)
            }
        }
    }, [id, header])

    useEffect(() => {
        fetchData()
    }, [id, header, fetchData])


    // handle submit
    const onSubmit = async (data) => {
        try {
            setUpdate(true)
            await Requests.Product.ChangeSlug(id, data, header)
            setUpdate(false)
        } catch (error) {
            if (error) setUpdate(false)
        }
    }

    return (
        <Container.Fluid>
            <Container.Row>

                {isLoading && !serverErr && !Object.keys(data).length ? <PreLoader /> : null}
                {!isLoading && !serverErr && !Object.keys(data).length ? <NoContent message="No content availavle!" /> : null}
                {!isLoading && serverErr && !Object.keys(data).length ? <NetworkError message="Network Error!" /> : null}

                {!isLoading && !serverErr && Object.keys(data).length ?
                    <Container.Column className="col-padding">
                        <Card.Simple className="border-0 shadow-sm rounded">
                            <Card.Header className="bg-white rounded border-0 p-4">
                                <div className="d-flex">
                                    <div><h6 className="mb-0">Edit product slug</h6></div>
                                    <div className="ml-auto">
                                        <Link to="/dashboard/product">
                                            <CustomButton className="btn-primary rounded-circle circle__padding border-0">
                                                <Icon icon={chevronLeft} size={22} />
                                            </CustomButton>
                                        </Link>
                                    </div>
                                </div>
                            </Card.Header>
                            <Card.Body className="px-4 pb-4">
                                <form onSubmit={handleSubmit(onSubmit)}>

                                    {/* slug */}
                                    <div className="form-group mb-4">
                                        {errors.slug && errors.slug.message ?
                                            <p className="text-danger">{errors.slug && errors.slug.message}</p> :
                                            <p>Slug</p>
                                        }

                                        <input
                                            type="text"
                                            name="slug"
                                            defaultValue={data.slug || null}
                                            className="form-control shadow-none"
                                            placeholder="Enter custom slug"
                                            ref={register({ required: "Slug is required" })}
                                        />
                                    </div>

                                    {/* Slug change hints */}
                                    <ol className="pl-3">
                                        <li className="font-13 text-muted"><p className="mb-0">Don't remove number from slug.</p></li>
                                        <li className="font-13 text-muted"><p className="mb-0">Don't remove ( - ) from slug.</p></li>
                                        <li className="font-13 text-muted"><p className="mb-0">Don't use white space in slug.</p></li>
                                        <li className="font-13 text-muted"><p className="mb-0">Don't use ( /, #, &, *, %, !, ~, (,) @ ) in slug.</p></li>
                                    </ol>

                                    {/* Confirmation checkbox */}
                                    <div className="form-group mb-4">
                                        <Form.Check
                                            type="checkbox"
                                            id="slug-change-checkbox"
                                            label="Are you sure? Want to change this slug."
                                            className="font-14"
                                            onClick={() => setShow(!show)}
                                        />
                                    </div>

                                    {/* Submit button */}
                                    {show ?
                                        <div className="text-right">
                                            <CustomButton
                                                type="submit"
                                                disabled={isUpdate}
                                            >{isUpdate ? "Loading..." : "Submit Changes"}</CustomButton>
                                        </div>
                                        : null
                                    }
                                </form>
                            </Card.Body>
                        </Card.Simple>
                    </Container.Column>
                    : null
                }
            </Container.Row>
        </Container.Fluid>
    )
}

export default EditSlug