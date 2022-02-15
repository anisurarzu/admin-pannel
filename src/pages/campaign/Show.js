import React, { useState, useEffect, useCallback } from 'react'
import './style.scss'
import Icon from 'react-icons-kit'
import { Link, useParams } from 'react-router-dom'
import { chevronLeft } from 'react-icons-kit/feather'
import { dateFormate } from '../../utils/Helpers'
import { PreLoader } from '../../components/loading/Index'

import Requests from '../../utils/Requests/Index'

const BASE_URL_SM = "https://campaign.api.eazybest.com/uploads/campaign/sm/"
const BASE_URL_LG = "https://campaign.api.eazybest.com/uploads/campaign/lg/"

const Show = () => {
    const { id } = useParams()
    const [isLoading, setLoading] = useState(true)
    const [campaign, setCampaign] = useState({})
    const [items, setItems] = useState([])

    // Fetch data
    const fetchData = useCallback(async () => {
        const response = await Requests.Services.Campaign.Show(id)
        if (response && response.status === 200) {
            setCampaign(response.data.data)
            console.log(response.data)
        }
        setLoading(false)
    }, [id])

    useEffect(() => {
        fetchData()
    }, [id, fetchData])

    if (isLoading) return <PreLoader />

    return (
        <div className="show-campaign">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12 col-padding">

                        {/* Campaign into card */}
                        <div className="card border-0 shadow-sm intro-card mb-4">
                            <div className="card-header p-3 p-lg-4 bg-white">
                                <div className="d-flex">
                                    <div><h6 className="mb-0">{campaign.title}</h6></div>
                                    <div className="ml-auto">
                                        <Link
                                            to="/dashboard/campaign"
                                            type="button"
                                            className="btn shadow-none rounded-circle"
                                        >
                                            <Icon icon={chevronLeft} size={22} />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body p-3 p-lg-4">
                                <img src={BASE_URL_LG + campaign.banner_lg} className="img-fluid mb-3" alt="..." />

                                <div className='row'>
                                    <div className='col-12 col-lg-6'>
                                        <p className='mb-0'><b>Description</b></p>
                                        <p>{campaign.description}</p>

                                        <p className='mb-0'><b>Start from</b></p>
                                        <p>{campaign.start_from_date}</p>

                                        <p className='mb-0'><b>End to</b></p>
                                        <p>{campaign.end_to_date}</p>

                                        <p className='mb-0'><b>Start time</b></p>
                                        <p>{campaign.start_time}</p>

                                        <p className='mb-0'><b>End time</b></p>
                                        <p>{campaign.end_time}</p>

                                        <p className='mb-0'><b>Discount type</b></p>
                                        <p>{campaign.discount_type}</p>
                                    </div>
                                    <div className='col-12 col-lg-6'>
                                        <p className='mb-0'><b>Discount amount</b></p>
                                        <p>{campaign.discount_amount}</p>

                                        <p className='mb-0'><b>Min order amount</b></p>
                                        <p>{campaign.min_order_amount}</p>

                                        <p className='mb-0'><b>Max order amount</b></p>
                                        <p>{campaign.max_order_amount}</p>

                                        <p className='mb-0'><b>Min quantity</b></p>
                                        <p>{campaign.min_quantity}</p>

                                        <p className='mb-0'><b>Max quantity</b></p>
                                        <p>{campaign.max_quantity}</p>

                                        <p className='mb-0'><b>Status</b></p>
                                        <p>{campaign.is_active ? "Published" : "Unpublished"}</p>
                                    </div>


                                    <div className='col-12 my-4'>
                                        <p>{campaign.assign_to}</p>

                                        <table>
                                            <tbody>
                                                {campaign.assign_items && campaign.assign_items.map((item, i) =>
                                                    <tr key={i}><td>
                                                        <p className='mb-1'>{item.name}</p>
                                                    </td></tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>



                    </div>
                </div>
            </div>
        </div>
    );
};

export default Show;