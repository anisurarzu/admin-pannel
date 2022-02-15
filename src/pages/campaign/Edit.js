import React, { useState, useEffect, useCallback, useRef } from 'react'
import './style.scss'
import Icon from 'react-icons-kit'
import { Link, useParams } from 'react-router-dom'
import { chevronLeft } from 'react-icons-kit/feather'

import { Toastify } from '../../components/toastify'
import { PreLoader } from '../../components/loading/Index'
import { CampaignForm } from '../../components/form/campaign'
import Requests from '../../utils/Requests/Index'



const Edit = () => {
    const { id } = useParams()
    const [data, setData] = useState({})
    const [isLoading, setLoading] = useState(true)
    const [isUpdate, setUpdate] = useState(false)
    const [isImgLoading, setImgLoading] = useState(false)

    // Fetch data
    const fetchData = useCallback(async () => {
        try {
            const response = await Requests.Services.Campaign.Show(id)
            if (response && response.status === 200) {
                setData(response.data.data)

                console.log(response.data.data);
            }
            setLoading(false)
        } catch (error) {
            if (error) {
                setLoading(false)
                console.log(error.response);
            }
        }
    }, [id])

    useEffect(() => {
        fetchData()
    }, [id, fetchData])


    /* handle data form */
    const handleSubmit = async (data) => {
        try {
            setUpdate(true)
            const response = await Requests.Services.Campaign.Update(id, data)
            if (response && response.status === 201) {
                Toastify.Success(response.data.message)
            }

            setUpdate(false)
        } catch (error) {
            if (error) {
                setUpdate(false)
                console.log(error.response)
                if (error.response && error.response.data && error.response.data.message) {
                    Toastify.Error(error.response.data.message)
                }
            }
        }
    }

    /* handle image update */
    const handleImgSubmit = async (data) => {
        try {
            setImgLoading(true)
            const response = await Requests.Services.Campaign.EditBanner(id, data)
            if (response && response.status === 201) {
                Toastify.Success(response.data.message)
            }

            setImgLoading(false)
        } catch (error) {
            if (error) {
                setImgLoading(false)
                console.log(error.response)
                if (error.response && error.response.data && error.response.data.message) {
                    Toastify.Error(error.response.data.message)
                }
            }
        }
    }

    if (isLoading) return <PreLoader />

    return (
        <div className="edit-campaign pb-4">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12 col-padding">
                        <div className="card border-0 shadow-sm">
                            <div className="card-header p-3 p-lg-4 bg-white">
                                <div className="d-flex">
                                    <div>
                                        <h6 className="mb-0">Edit campaign</h6>
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
                                    formType="edit"
                                    data={data}
                                    loading={isUpdate}
                                    imgLoading={isImgLoading}
                                    onSubmit={data => handleSubmit(data)}
                                    onImgSubmit={data => handleImgSubmit(data)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Edit;
