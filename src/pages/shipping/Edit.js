import React, { useState, useCallback, useEffect } from 'react'
import "./style.scss"
import Icon from 'react-icons-kit'
import { Link, useParams } from 'react-router-dom'
import { chevronLeft } from 'react-icons-kit/feather'
import { Text } from '../../components/text'
import { Card } from '../../components/card/Index'
import { CustomButton } from '../../components/button'
import { Container } from '../../components/container'
import { ShippingForm } from '../../components/form/shipping'
import Requests from '../../utils/Requests/Index'

const Edit = () => {
    const { id } = useParams()
    const [data, setData] = useState({})
    const [isLoading, setLoading] = useState(true)
    const [isUpdate, setUpdate] = useState(false)

    const [header] = useState({
        headers: { Authorization: "Bearer " + localStorage.getItem('token') }
    })

    // Fetch data
    const fetchData = useCallback(async () => {
        try {
            setLoading(true)
            const response = await Requests.Services.Shipping.MainShipping.Show(id, header)
            setData(response)

            setTimeout(() => {
                setLoading(false)
            }, 1000);
        } catch (error) {
            if (error) {
                setLoading(false)
            }
        }
    }, [id, header])


    //Fetch data
    useEffect(() => {
        fetchData()
    }, [id, header, fetchData])

    // Submit Form
    const handleSubmit = async (data) => {
        setUpdate(true)
        await Requests.Services.Shipping.MainShipping.Update(id, data, header)
        setUpdate(false)
    }

    return (
        <div className="edit-shipping pb-4">
            <Container.Fluid>
                <Container.Row>
                    <Container.Column className="col-padding">
                        <Card.Simple className="border-0 shadow-sm">
                            <Card.Header className="p-3 p-lg-4 bg-white">
                                <div className="d-flex">
                                    <div>
                                        <Text className="fs-16 mt-2 mb-0">Update Shipping</Text>
                                    </div>
                                    <div className="ml-auto pt-2">
                                        <Link to="/dashboard/shipping">
                                            <CustomButton className="btn-primary rounded-circle border-0 circle__padding">
                                                <Icon icon={chevronLeft} size={20} />
                                            </CustomButton>
                                        </Link>
                                    </div>
                                </div>
                            </Card.Header>
                            <Card.Body className="p-4">
                                {isLoading ?
                                    <p>Loading...</p> :
                                    <ShippingForm
                                        formType="edit"
                                        data={data}
                                        loading={isUpdate}
                                        onSubmit={data => handleSubmit(data)}
                                    />
                                }
                            </Card.Body>
                        </Card.Simple>
                    </Container.Column>
                </Container.Row>
            </Container.Fluid>
        </div >
    );
}

export default Edit;