import React, { useCallback, useEffect, useState } from 'react';
import Icon from 'react-icons-kit'
import { Link, useParams } from 'react-router-dom';
import { chevronLeft } from 'react-icons-kit/feather';
import { DivisionForm } from '../../../components/form/DivisionForm';
import { Container } from '../../../components/container';
import { CustomButton } from '../../../components/button';
import { Card } from '../../../components/card/Index';
import Requests from '../../../utils/Requests/Index';
import { Text } from '../../../components/text';

const Edit = () => {
    const { id } = useParams()
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([])
    const [header] = useState({
        headers: { Authorization: "Bearer " + localStorage.getItem('token') }
    })

    // Fetch data
    const fetchData = useCallback(async () => {
        setLoading(true)
        const response = await Requests.Services.Shipping.Division.Show(id, header)
        if (response) setData(response.data)
        setLoading(false)
    }, [id, header])

    useEffect(() => {
        fetchData()
    }, [id, fetchData])

    // handle division update
    const handleDivisionUpdate = async (data) => {
        setLoading(true)
        await Requests.Services.Shipping.Division.Update(id,data, header);
        setLoading(false)

    }
    return (
        <div className='pb-4'>
            <Container.Fluid>
                <Container.Row>
                    <Container.Column className="col-padding">
                        <Card.Simple className="border-0 shadow-sm">
                            <Card.Header className="p-3 p-lg-4 bg-white">
                                <div className="d-flex">
                                    <div>
                                        <Text className="fs-16 mt-2 mb-0">Update Division</Text>
                                    </div>
                                    <div className="ml-auto pt-2">
                                        <Link to="/dashboard/shipping/division">
                                            <CustomButton className="btn-primary rounded-circle border-0 circle__padding">
                                                <Icon icon={chevronLeft} size={20} />
                                            </CustomButton>
                                        </Link>
                                    </div>
                                </div>
                            </Card.Header>

                            <Card.Body className="p-4">
                                {/* division Form */}
                                <DivisionForm
                                    loading={loading}
                                    divisionData={data}
                                    update={true}
                                    submit={handleDivisionUpdate}
                                />
                            </Card.Body>
                        </Card.Simple>
                    </Container.Column>
                </Container.Row>
            </Container.Fluid>
        </div>
    );
}

export default Edit;