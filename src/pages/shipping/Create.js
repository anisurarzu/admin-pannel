import React, { useState } from 'react'
import "./style.scss"
import Icon from 'react-icons-kit'
import { Link } from 'react-router-dom'
import { chevronLeft } from 'react-icons-kit/feather'
import { ShippingForm } from '../../components/form/shipping'
import { CustomButton } from '../../components/button'
import { Container } from '../../components/container'
import { Card } from '../../components/card/Index'
import Requests from '../../utils/Requests/Index'
import { Text } from '../../components/text'

const Create = () => {
    const [isLoading, setLoading] = useState(false)

    const [header] = useState({
        headers: { Authorization: "Bearer " + localStorage.getItem('token') }
    })

    // Submit Form
    const handleSubmit = async (data) => {
        setLoading(true)
        await Requests.Services.Shipping.MainShipping.Store(data, header)
        setLoading(false)
    }

    return (
        <div className="store-shipping pb-4">
            <Container.Fluid>
                <Container.Row>
                    <Container.Column className="col-padding">
                        <Card.Simple className="border-0 shadow-sm">
                            <Card.Header className="p-3 p-lg-4 bg-white">
                                <div className="d-flex">
                                    <div>
                                        <Text className="fs-16 mt-2 mb-0">Create Shipping</Text>
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
                                <ShippingForm
                                    formType="create"
                                    loading={isLoading}
                                    onSubmit={data => handleSubmit(data)}
                                />
                            </Card.Body>
                        </Card.Simple>
                    </Container.Column>
                </Container.Row>
            </Container.Fluid>
        </div >
    );
}

export default Create;