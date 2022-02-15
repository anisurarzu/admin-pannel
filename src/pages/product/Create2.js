import React from 'react'
import Icon from 'react-icons-kit'
import StepWizard from 'react-step-wizard'
import { Link } from 'react-router-dom'
import { chevronLeft } from 'react-icons-kit/feather'
import { Container } from '../../components/container'
import { Card } from '../../components/card/Index'
import { Steps } from '../../components/form/product2/step/Index'
import { CustomButton } from '../../components/button'

const Create2 = () => {
    return (
        <Container.Fluid>
            <Container.Row>
                <Container.Column className="col-padding">
                    <Card.Simple className="border-0 shadow-sm overflow__hidden">
                        <Card.Header className="bg-white p-3 p-lg-4">
                            <div className="d-flex">
                                <div><h6 className="mb-0">Store Product V2</h6></div>
                                <div className="ml-auto">
                                    <Link to="/dashboard/product">
                                        <CustomButton
                                            className="btn-primary rounded-circle border-0 circle__padding">
                                            <Icon icon={chevronLeft} size={22} />
                                        </CustomButton>
                                    </Link>
                                </div>
                            </div>
                        </Card.Header>
                        <Card.Body className="p-lg-4">
                            <StepWizard initialStep={2}>

                                <Steps.Step1 title="Product Initial"/>
                                <Steps.Step2 title="Product Category" />
                                
                            </StepWizard>
                        </Card.Body>
                    </Card.Simple>
                </Container.Column>
            </Container.Row>
        </Container.Fluid>
    );
}

export default Create2;