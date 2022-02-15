import React, { useState } from 'react'
import Icon from 'react-icons-kit'
import { Link } from 'react-router-dom'
import { chevronLeft } from 'react-icons-kit/feather'
import { Text } from '../../components/text'
import { Card } from '../../components/card/Index'
import { Toastify } from '../../components/toastify'
import { AreaForm } from '../../components/form/area'
import { CustomButton } from '../../components/button'
import { Container } from '../../components/container'

import { CustomError } from '../../utils/error'
import Requests from '../../utils/Requests/Index'

const Create = () => {
    const [isLoading, setLoading] = useState(false)

    // handle submission
    const handleSubmit = async (data) => {
        try {
            setLoading(true)
            const response = await Requests.Services.Shipping.Area.Store(data)
            if (response && response.status === 201) {
                Toastify.Success(response.data.message)
            }

            setLoading(false)
        } catch (error) {
            if (error) {
                setLoading(false)
                if (error.response) {
                    await CustomError(error.response)
                } else {
                    Toastify.Error("Something going wrong.")
                }
            }
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
                                    <div><Text className="fs-16 mt-2 mb-0">Create area</Text></div>
                                    <div className="ml-auto">
                                        <Link to="/dashboard/area">
                                            <CustomButton className="btn-primary rounded-circle border-0 circle__padding">
                                                <Icon icon={chevronLeft} size={20} />
                                            </CustomButton>
                                        </Link>
                                    </div>
                                </div>
                            </Card.Header>
                            <Card.Body className="p-3 p-lg-4">
                                <AreaForm
                                    loading={isLoading}
                                    onSubmit={data => handleSubmit(data)}
                                />
                            </Card.Body>
                        </Card.Simple>
                    </Container.Column>
                </Container.Row>
            </Container.Fluid>
        </div>
    );
}

export default Create;