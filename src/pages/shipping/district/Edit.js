import React, { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Icon from 'react-icons-kit'
import { Container } from '../../../components/container';
import { Card } from '../../../components/card/Index';
import { Text } from '../../../components/text';
import { CustomButton } from '../../../components/button';
import { chevronLeft } from 'react-icons-kit/feather';
import { DistrictForm } from '../../../components/form/DistrictForm';
import Requests from '../../../utils/Requests/Index';
import { PreLoader } from '../../../components/loading/Index';


const Edit = () => {
    const { id } = useParams()
    const [isLoading, setIsLoading] = useState(false)
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([])
    const [header] = useState({
        headers: { Authorization: "Bearer " + localStorage.getItem('token') }
    })

    // Fetch data
    const fetchData = useCallback(async () => {
        setIsLoading(true)
        const response = await Requests.Services.Shipping.District.Show(id, header)
        if (response) setData(response.data)
        setIsLoading(false)
    }, [id, header])

    useEffect(() => {
        fetchData()
    }, [id, fetchData])

    // handle district update
    const handleDistrictUpdate = async (data) => {
        setLoading(true)
        await Requests.Services.Shipping.District.Update(id, data, header);
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
                                        <Text className="fs-16 mt-2 mb-0">Update District</Text>
                                    </div>
                                    <div className="ml-auto pt-2">
                                        <Link to="/dashboard/shipping/district">
                                            <CustomButton className="btn-primary rounded-circle border-0 circle__padding">
                                                <Icon icon={chevronLeft} size={20} />
                                            </CustomButton>
                                        </Link>
                                    </div>
                                </div>
                            </Card.Header>

                            {isLoading ? <PreLoader /> : null}

                            <Card.Body className="p-4">
                                {/* District Form */}
                                {!isLoading && data ?
                                    <DistrictForm
                                        loading={loading}
                                        districtData={data}
                                        update={true}
                                        submit={handleDistrictUpdate}
                                    />
                                    : null}

                            </Card.Body>
                        </Card.Simple>
                    </Container.Column>
                </Container.Row>
            </Container.Fluid>
        </div>
    );
}

export default Edit;