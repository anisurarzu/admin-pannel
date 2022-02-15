import React, { useCallback, useEffect, useState } from 'react'
import Icon from 'react-icons-kit'
import ReactPlayer from 'react-player/youtube'
import HtmlParser from 'react-html-parser'
import { useParams } from 'react-router'
import { Link } from 'react-router-dom'
import { chevronLeft } from 'react-icons-kit/feather'
import { Container } from '../../../components/container'
import { Card } from '../../../components/card/Index'
import { CustomButton } from '../../../components/button'
import { PreLoader } from '../../../components/loading/Index'
import { useWindowSize } from '../../../components/window/windowSize'

import Requests from '../../../utils/Requests/Index'

const Show = () => {
    const { id } = useParams()
    const size = useWindowSize()
    const [data, setData] = useState(null)
    const [isLoading, setLoading] = useState(true)

    const [header] = useState({
        headers: { Authorization: "Bearer " + localStorage.getItem('token') }
    })

    // fetch data
    const fetchData = useCallback(async () => {
        try {
            const response = await Requests.University.PostShow(id, header)
            if (response) setData(response.data)
            setLoading(false)
        } catch (error) {
            if (error) console.log(error)
        }
    }, [id, header])

    useEffect(() => {
        fetchData()
    }, [id, header, fetchData])


    if (isLoading) return <PreLoader />

    return (
        <div className="pb-4">
            <Container.Fluid>
                <Container.Row>
                    <Container.Column className="col-padding">
                        <Card.Simple className="bg-white border-0">
                            <Card.Header className="bg-white border-0 p-3 p-lg-4">
                                <div className="d-flex">
                                    <div><h6 className="mb-0">Show Post</h6></div>
                                    <div className="ml-auto">
                                        <Link to="/dashboard/university/post">
                                            <CustomButton className="btn-primary border-0 rounded-circle circle__padding">
                                                <Icon icon={chevronLeft} size={22} />
                                            </CustomButton>
                                        </Link>
                                    </div>
                                </div>
                            </Card.Header>
                            <Card.Body className="px-3 px-lg-4 pt-0">
                                <h5 className="mb-3">{data.title}</h5>
                                {data.description ? HtmlParser(data.description) : null}
                                {data.image ? <img src={data.image} className="img-fluid" alt="..." /> : null}
                                <br />
                                <br />
                                {data.video ?
                                    <ReactPlayer
                                        url={data.video}
                                        controls={true}
                                        width={size.width >= 768 ? 650 : 360}
                                    />
                                    : null
                                }
                            </Card.Body>
                        </Card.Simple>
                    </Container.Column>
                </Container.Row>
            </Container.Fluid>
        </div>
    );
}

export default Show;