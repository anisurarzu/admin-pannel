import React, { useState } from 'react'
import Icon from 'react-icons-kit'
import { Link } from 'react-router-dom'
import { chevronLeft } from 'react-icons-kit/feather'
import { CustomButton } from '../../components/button'
import { Container } from '../../components/container'
import { Card } from '../../components/card/Index'
import { Text } from '../../components/text'
import { DistrictForm } from '../../components/form/district'

import Requests from '../../utils/Requests/Index'

const Create = () => {
    const [isLoading, setLoading] = useState(false)

    // handle submission
    const handleSubmit = async (data) => {
        try {
            console.log(data);
        } catch (error) {
            if (error) console.log(error);
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
                                    <div><Text className="fs-16 mt-2 mb-0">Create district</Text></div>
                                    <div className="ml-auto">
                                        <Link to="/dashboard/district">
                                            <CustomButton className="btn-primary rounded-circle border-0 circle__padding">
                                                <Icon icon={chevronLeft} size={20} />
                                            </CustomButton>
                                        </Link>
                                    </div>
                                </div>
                            </Card.Header>
                            <Card.Body className="p-3 p-lg-4">
                                <DistrictForm
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