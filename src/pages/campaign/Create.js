import React, { useState } from 'react'
import './style.scss'
import Icon from 'react-icons-kit'
import { Link } from 'react-router-dom'
import { chevronLeft } from 'react-icons-kit/feather'

import { Toastify } from '../../components/toastify'
import { CampaignForm } from '../../components/form/campaign'
import Requests from '../../utils/Requests/Index'

const Create = () => {
    const [isLoading, setLoading] = useState(false)

    const handleSubmit = async (data) => {
        try {
            setLoading(true)
            const response = await Requests.Services.Campaign.Store(data)
            if (response && response.status === 201) {
                Toastify.Success(response.data.message)
            }

            setLoading(false)
        } catch (error) {
            if (error) {
                setLoading(false)
                console.log(error.response)
                if (error.response && error.response.data && error.response.data.message) {
                    Toastify.Error(error.response.data.message)
                }
            }
        }
    }

    return (
        <div className="store-campaign pb-4">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12 col-padding">
                        <div className="card border-0 shadow-sm">
                            <div className="card-header p-3 p-lg-4 bg-white">
                                <div className="d-flex">
                                    <div>
                                        <h6 className="mb-0">Create Campaign</h6>
                                        <small className="text-muted">
                                            <i>Select item/options if you want to apply unless no need to select.</i>
                                        </small>
                                    </div>
                                    <div className="ml-auto pt-2">
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
                            <div className="card-body p-4">
                                <CampaignForm
                                    formType="create"
                                    data={null}
                                    loading={isLoading}
                                    onSubmit={value => handleSubmit(value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Create;
